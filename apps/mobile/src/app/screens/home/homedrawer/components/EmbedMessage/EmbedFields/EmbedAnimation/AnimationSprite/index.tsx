import { size } from '@mezon/mobile-ui';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

function computeInputOutputRanges(frames) {
	if (!frames || frames.length === 0) {
		return { base: 0, inputRangeX: [], outputRangeX: [] };
	}

	let base = 0;
	const inputRangeX = [];
	const outputRangeX = [];

	inputRangeX.push(base);
	outputRangeX.push(-frames[0].x);

	for (let i = 1; i < frames.length; i++) {
		if (frames[i].x !== frames[i - 1].x) {
			base += 0.5;
			inputRangeX.push(base);
			outputRangeX.push(-frames[i - 1].x);
			base += 0.5;
			inputRangeX.push(base);
			outputRangeX.push(-frames[i].x);
		} else {
			base += 1;
			inputRangeX.push(base);
			outputRangeX.push(-frames[i].x);
		}
	}

	return { base, inputRangeX, outputRangeX };
}

const SpriteAnimation = ({
	spriteUrl,
	frameWidth,
	frameHeight,
	frames,
	duration,
	finalFrame,
	repeat,
	spriteWidth,
	spriteHeight,
	isActive,
	sharedAnimation
}) => {
	const localAnimation = useRef(new Animated.Value(0)).current;
	const animation = !repeat ? sharedAnimation : localAnimation;

	const { base, inputRangeX, outputRangeX } = computeInputOutputRanges(frames);

	const desiredIndex = frames.findIndex((frame) => frame.name === finalFrame);
	const finalIndex = desiredIndex >= 0 ? desiredIndex : frames.length - 1;

	const translateX = animation.interpolate({
		inputRange: inputRangeX,
		outputRange: outputRangeX
	});

	const translateY = animation.interpolate({
		inputRange: frames.map((_, i) => i),
		outputRange: frames.map((frame) => -frame.y)
	});

	useEffect(() => {
		if (!isActive) {
			let currentLoop = 0;
			const runAnimation = () => {
				Animated.timing(animation, {
					toValue: base,
					duration: repeat ? duration : frames?.length * 30 || duration,
					useNativeDriver: true
				}).start(({ finished }) => {
					if (finished) {
						currentLoop += 1;
						if (currentLoop < repeat || !repeat) {
							animation.setValue(0);
							runAnimation();
						} else {
							animation.setValue(0);
							Animated.timing(animation, {
								toValue: finalIndex,
								duration: duration * (finalIndex / base),
								useNativeDriver: true
							}).start();
						}
					}
				});
			};

			runAnimation();
		} else {
			animation.setValue(finalIndex);
		}
	}, [animation, base, finalIndex]);

	if (!repeat) {
		return (
			<View
				style={{
					overflow: 'hidden',
					width: frameWidth,
					height: frameHeight,
					backgroundColor: 'transparent'
				}}
				removeClippedSubviews={true}
			>
				{frames.map((frame, i) => (
					<Animated.Image
						key={`frame-${i}`}
						source={{ uri: spriteUrl }}
						style={{
							position: 'absolute',
							width: spriteWidth,
							height: spriteHeight,
							transform: [{ translateX: -frame.x }, { translateY: -frame.y }],
							opacity: animation.interpolate({
								inputRange: [i - 0.8, i, i + 0.8],
								outputRange: [0, 2, 0],
								extrapolate: 'clamp'
							})
						}}
					/>
				))}
			</View>
		);
	}

	return (
		<View style={{ overflow: 'hidden', width: frameWidth, height: frameHeight, marginHorizontal: size.s_10 }}>
			<Animated.Image
				source={{ uri: spriteUrl }}
				style={{
					width: spriteWidth,
					height: spriteHeight,
					transform: [{ translateX: translateX }, { translateY: translateY }]
				}}
			/>
		</View>
	);
};

export default SpriteAnimation;
