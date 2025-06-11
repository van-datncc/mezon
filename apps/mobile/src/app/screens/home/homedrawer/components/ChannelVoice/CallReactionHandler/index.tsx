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

	useEffect(() => {
		if (!socketRef.current) return;

		const currentSocket = socketRef.current;
		currentSocket.onvoicereactionmessage = (message: VoiceReactionSend) => {
			if (channel?.channel_id === message?.channel_id) {
				try {
					const emojis = message.emojis || [];
					emojis.forEach((emojiId, index) => {
						if (emojiId) {
							const startX = Math.random() * (width - size.s_100 * 2);
							const translateY = new Animated.Value(0);
							const opacity = new Animated.Value(1);

							const newEmoji = {
								id: `${Date.now()}-${index}`,
								emoji: '',
								emojiId: emojiId,
								startX,
								translateY,
								opacity
							};

							setDisplayedEmojis((prev) => [...prev, newEmoji]);

							Animated.parallel([
								Animated.timing(translateY, {
									toValue: -height * 0.6,
									duration: 5000,
									easing: Easing.out(Easing.quad),
									useNativeDriver: true
								}),
								Animated.timing(opacity, {
									toValue: 0,
									duration: 5000,
									easing: Easing.linear,
									useNativeDriver: true
								})
							]).start(() => {
								setDisplayedEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
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
						left: item.startX,
						transform: [{ translateY: item.translateY }],
						opacity: item.opacity,
						alignItems: 'center'
					}}
				>
					<FastImage source={{ uri: getSrcEmoji(item.emojiId) }} style={styles.animatedEmoji} />
				</Animated.View>
			))}
		</View>
	);
});
