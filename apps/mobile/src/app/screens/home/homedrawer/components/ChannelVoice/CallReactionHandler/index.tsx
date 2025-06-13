import { size, useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity } from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import { getSrcEmoji } from '@mezon/utils';
import { VoiceReactionSend } from 'mezon-js';
import { memo, useEffect, useState } from 'react';
import { Animated, Dimensions, Easing, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { style } from '../styles';

const { width, height } = Dimensions.get('window');

type reactProps = {
	channel: ChannelsEntity;
	isAnimatedCompleted: boolean;
};

export const CallReactionHandler = memo(({ channel, isAnimatedCompleted }: reactProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [displayedEmojis, setDisplayedEmojis] = useState<any[]>([]);
	const { socketRef } = useMezon();

	const startX = width / 2;
	const startY = height - 120;

	useEffect(() => {
		if (!socketRef.current) return;

		const currentSocket = socketRef.current;
		currentSocket.onvoicereactionmessage = (message: VoiceReactionSend) => {
			if (channel?.channel_id === message?.channel_id) {
				try {
					const emojis = message.emojis || [];
					emojis.forEach((emojiId) => {
						if (emojiId) {
							Array.from({ length: 3 }).forEach((_, index) => {
								const horizontalOffset = (Math.random() - 0.5) * 150;
								const delay = index * 300; // More random stagger
								const verticalOffset = Math.random() * 30; // Small random vertical start variation

								// Scale decreases with each emoji (first is largest, last is smallest)
								const baseScale = 1.0 - index * 0.15; // Decreases by 15% each time

								// Animation values
								const translateY = new Animated.Value(0);
								const translateX = new Animated.Value(0);
								const scale = new Animated.Value(0);
								const opacity = new Animated.Value(0);
								const rotation = new Animated.Value(0);

								// Random trajectory parameters
								const finalY = -(height * 0.7 + Math.random() * height * 0.2); // Random height
								const bezierControlX = horizontalOffset * (1.5 + Math.random()); // Curve control
								const rotationAmount = (Math.random() - 0.5) * 120; // More dramatic rotation

								const newEmoji = {
									id: `${Date.now()}-${emojiId}-${index}-${Math.random()}`,
									emojiId,
									translateY,
									translateX,
									scale,
									opacity,
									rotation,
									baseScale, // Store the base scale for this emoji
									startX: startX + horizontalOffset * 0.2, // Start near center
									startY: startY - verticalOffset
								};

								setDisplayedEmojis((prev) => [...prev, newEmoji]);

								// Facebook-style flying animation
								Animated.sequence([
									// Initial delay for staggered effect
									Animated.delay(delay),

									// All animations start together - no pause between appearance and movement
									Animated.parallel([
										// Appear with bounce
										Animated.sequence([
											Animated.spring(scale, {
												toValue: 1.1 * baseScale, // Apply base scale to bounce
												tension: 150,
												friction: 6,
												useNativeDriver: true
											}),
											Animated.timing(scale, {
												toValue: 0.9 * baseScale, // Apply base scale
												duration: 100,
												easing: Easing.inOut(Easing.quad),
												useNativeDriver: true
											}),
											// Continue scaling during flight
											Animated.sequence([
												Animated.timing(scale, {
													toValue: 1.3 * baseScale, // Apply base scale
													duration: 700, // Slower scaling
													easing: Easing.out(Easing.quad),
													useNativeDriver: true
												}),
												Animated.timing(scale, {
													toValue: 1.0 * baseScale, // Apply base scale
													duration: 1200, // Slower scaling
													easing: Easing.inOut(Easing.quad),
													useNativeDriver: true
												}),
												Animated.timing(scale, {
													toValue: 0.6 * baseScale, // Apply base scale
													duration: 2100, // Slower scaling
													easing: Easing.in(Easing.quad),
													useNativeDriver: true
												})
											])
										]),

										// Opacity animation
										Animated.sequence([
											Animated.timing(opacity, {
												toValue: 1,
												duration: 300, // Slightly slower fade in
												easing: Easing.out(Easing.quad),
												useNativeDriver: true
											}),
											Animated.delay(3200), // Adjust delay for longer animation
											Animated.timing(opacity, {
												toValue: 0,
												duration: 2000, // Slower fade out to match longer animation
												easing: Easing.in(Easing.quad),
												useNativeDriver: true
											})
										]),

										// Upward motion starts immediately
										Animated.timing(translateY, {
											toValue: finalY,
											duration: 6000, // Much slower upward movement
											easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // Ease-out-quad
											useNativeDriver: true
										}),

										// Curved horizontal motion starts immediately
										Animated.sequence([
											Animated.timing(translateX, {
												toValue: bezierControlX * 0.3,
												duration: 1000, // Slower horizontal movement
												easing: Easing.out(Easing.circle),
												useNativeDriver: true
											}),
											Animated.timing(translateX, {
												toValue: bezierControlX * 0.7,
												duration: 1400, // Slower horizontal movement
												easing: Easing.inOut(Easing.sin),
												useNativeDriver: true
											}),
											Animated.timing(translateX, {
												toValue: horizontalOffset,
												duration: 1600, // Slower horizontal movement
												easing: Easing.in(Easing.circle),
												useNativeDriver: true
											})
										]),

										// Smooth rotation starts immediately
										Animated.timing(rotation, {
											toValue: rotationAmount,
											duration: 6000, // Match the slower upward movement
											easing: Easing.inOut(Easing.circle),
											useNativeDriver: true
										})
									])
								]).start(() => {
									setDisplayedEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
								});
							});
						}
					});
				} catch (error) {
					console.error(error);
				}
			}
		};

		return () => {
			if (currentSocket) {
				currentSocket.onvoicereactionmessage = () => {};
			}
		};
	}, [channel?.channel_id, socketRef]);

	if (displayedEmojis.length === 0 || !isAnimatedCompleted) {
		return null;
	}

	return (
		<View style={styles.reactionContainer}>
			{displayedEmojis.map((item) => (
				<Animated.View
					key={item.id}
					style={{
						position: 'absolute',
						bottom: 0,
						left: '50%',
						width: size.s_36,
						height: size.s_36,
						transform: [
							{ translateY: item.translateY },
							{ translateX: item.translateX },
							{ scale: item.scale },
							{
								rotate: item.rotation.interpolate({
									inputRange: [-120, 120],
									outputRange: ['-120deg', '120deg']
								})
							}
						],
						opacity: item.opacity,
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 1000
					}}
				>
					<FastImage
						source={{ uri: getSrcEmoji(item.emojiId) }}
						style={[styles.animatedEmoji, { width: size.s_36, height: size.s_36 }]}
						resizeMode="contain"
					/>
				</Animated.View>
			))}
		</View>
	);
});
