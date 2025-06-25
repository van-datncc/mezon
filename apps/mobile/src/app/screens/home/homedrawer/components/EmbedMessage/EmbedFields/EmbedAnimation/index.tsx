import { size } from '@mezon/mobile-ui';
import { IMessageAnimation } from '@mezon/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, View, useWindowDimensions } from 'react-native';
import useTabletLandscape from '../../../../../../../hooks/useTabletLandscape';
import SpriteAnimation from './AnimationSprite';
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

export const EmbedAnimation = ({ animationOptions, themeValue }: EmbedAnimationProps) => {
	const isTabletLandscape = useTabletLandscape();
	const { width, height } = useWindowDimensions();

	const [frames, setFrames] = useState(null);
	const [frameWidth, setFrameWidth] = useState(0);
	const [frameHeight, setFrameHeight] = useState(0);
	const [spriteWidth, setSpriteWidth] = useState(0);
	const [spriteHeight, setSpriteHeight] = useState(0);
	const isPortrait = height > width;
	const duration = 500;
	const styles = style(isPortrait);
	const globalAnimation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(animationOptions.url_position);
				const data = await response.json();

				const frameArray = extractFrames(data, animationOptions?.repeat);
				if (frameArray) {
					setFrames(frameArray);
					setFrameHeight(frameArray?.[0]?.h || 0);
					setFrameWidth(frameArray?.[0]?.w || 0);
					setSpriteWidth(data?.meta?.size?.w || 0);
					setSpriteHeight(data?.meta?.size?.h || 0);
				}
			} catch (error) {
				console.error('Error fetching JSON data:', error);
			}
		};
		fetchData();
	}, []);

	const animationScale = useMemo(() => {
		if (animationOptions?.pool?.length > 0 && frameWidth > 0) {
			let horizontalPadding: number;
			const totalFrameWidth = animationOptions?.pool?.length * frameWidth;
			const scaleFactor = isTabletLandscape ? 0.36 : 1;

			if (isPortrait) {
				horizontalPadding = size.s_100;
			} else if (!isPortrait) {
				horizontalPadding = size.s_150;
			}

			const fitScale = (width - horizontalPadding) / totalFrameWidth;
			return fitScale * scaleFactor;
		}
		return 1;
	}, [animationOptions?.pool?.length, frameWidth, isTabletLandscape, isPortrait, width]);

	if (!frames) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator size="large" color={themeValue.text} />
			</View>
		);
	}

	return (
		<View
			style={[styles.pool, { transform: [{ scale: animationScale }], marginVertical: (isPortrait ? -size.s_30 : -size.s_50) / animationScale }]}
		>
			{animationOptions?.pool?.length &&
				animationOptions?.pool?.map((item, index) => {
					return (
						<SpriteAnimation
							key={`animation_${index}`}
							spriteUrl={animationOptions?.url_image}
							frameWidth={frameWidth}
							frameHeight={frameHeight}
							frames={frames}
							duration={duration}
							finalFrame={item?.at?.(item?.length - 1 || 0)}
							repeat={animationOptions?.repeat ? animationOptions?.repeat + index : 0}
							isActive={animationOptions?.isResult}
							spriteHeight={spriteHeight}
							spriteWidth={spriteWidth}
							sharedAnimation={globalAnimation}
						/>
					);
				})}
		</View>
	);
};
