import { size } from '@mezon/mobile-ui';
import { IMessageAnimation } from '@mezon/utils';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, View, useWindowDimensions } from 'react-native';
import useTabletLandscape from '../../../../../../../hooks/useTabletLandscape';
import { SpriteAnimation } from './AnimationSprite';
import { style } from './styles';

type EmbedAnimationProps = {
	animationOptions: IMessageAnimation;
	themeValue?: any;
};

const extractFrames = (data, repeat) => {
	if (!data?.frames) return [];

	const framesArray = Object.entries(data.frames).map(([key, frameData]) => {
		const { x, y, w, h } = (frameData as { frame: { x: number; y: number; w: number; h: number } }).frame;
		return { name: key, x, y, w, h };
	});

	if (repeat) {
		framesArray.sort((a, b) => {
			if (a.x !== b.x) return a.x - b.x;
			return a.y - b.y;
		});
	}
	return framesArray;
};

export const EmbedAnimation = memo(
	({ animationOptions, themeValue }: EmbedAnimationProps) => {
		const isTabletLandscape = useTabletLandscape();
		const { width, height } = useWindowDimensions();

		const isFetch = useRef(false);

		const [frames, setFrames] = useState(null);
		const [spriteMeta, setSpriteMeta] = useState({
			frameWidth: 0,
			frameHeight: 0,
			spriteWidth: 0,
			spriteHeight: 0
		});
		const isPortrait = height > width;
		const styles = style(isPortrait);
		const globalAnimation = useRef(new Animated.Value(0)).current;

		useEffect(() => {
			const fetchData = async () => {
				try {
					isFetch.current = true;
					const response = await fetch(animationOptions.url_position);
					const data = await response.json();

					const frameArray = extractFrames(data, animationOptions?.repeat);
					if (frameArray) {
						setFrames(frameArray);
						setSpriteMeta({
							frameWidth: frameArray?.[0]?.w || 0,
							frameHeight: frameArray?.[0]?.h || 0,
							spriteWidth: data?.meta?.size?.w || 0,
							spriteHeight: data?.meta?.size?.h || 0
						});
					}
					isFetch.current = false;
				} catch (error) {
					console.error('Error fetching JSON data:', error);
				}
			};
			fetchData();
		}, []);

		const animationScale = useMemo(() => {
			if (animationOptions?.pool?.length > 0 && spriteMeta.frameWidth > 0) {
				let horizontalPadding: number;
				const totalFrameWidth = animationOptions?.pool?.length * spriteMeta.frameWidth;
				const scaleFactor = isTabletLandscape ? 0.36 : 1;

				if (isPortrait) {
					horizontalPadding = size.s_100;
				} else {
					horizontalPadding = size.s_150;
				}

				const fitScale = (width - horizontalPadding) / totalFrameWidth;
				return fitScale * scaleFactor;
			}
			return 1;
		}, [spriteMeta?.frameWidth, width]);

		if (!frames || isFetch?.current) {
			return (
				<View style={styles.loading}>
					<ActivityIndicator size="large" color={themeValue.text} />
				</View>
			);
		}

		return (
			<View
				style={[
					styles.pool,
					{ transform: [{ scale: animationScale }], marginVertical: (isPortrait ? -size.s_40 : -size.s_70) / animationScale + size.s_50 }
				]}
			>
				{animationOptions?.pool?.length &&
					animationOptions?.pool?.map((item, index) => (
						<SpriteAnimation
							key={`animation_${new Date().getTime()}_${index}`}
							spriteUrl={animationOptions?.url_image}
							frameWidth={spriteMeta?.frameWidth}
							frameHeight={spriteMeta?.frameHeight}
							frames={frames}
							finalFrame={item?.at?.(item?.length - 1 || 0)}
							repeat={animationOptions?.repeat ? animationOptions?.repeat + index : 0}
							isActive={animationOptions?.isResult}
							spriteHeight={spriteMeta?.spriteHeight}
							spriteWidth={spriteMeta?.spriteWidth}
							sharedAnimation={globalAnimation}
						/>
					))}
			</View>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.animationOptions?.url_image === nextProps.animationOptions?.url_image &&
			prevProps.animationOptions?.url_position === nextProps.animationOptions?.url_position
		);
	}
);
