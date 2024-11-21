import { backgroundColor, useTheme } from '@mezon/mobile-ui';
import { messagesActions, selectCurrentUserId, useAppDispatch } from '@mezon/store-mobile';
import { EButtonMessageStyle, IButtonMessage } from '@mezon/utils';
import { memo, useMemo } from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from './styles';

type MessageButtonProps = {
	messageId: string;
	button: IButtonMessage;
	senderId: string;
	buttonId: string;
	channelId: string;
};

export const EmbedComponentItem = memo(({ messageId, button, senderId, buttonId, channelId }: MessageButtonProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const currentUserId = useSelector(selectCurrentUserId);
	const dispatch = useAppDispatch();

	const handleClickOptions = async () => {
		if (button?.url) {
			try {
				await Linking.openURL(button.url);
			} catch (err) {
				throw new Error(err);
			}
		} else {
			dispatch(
				messagesActions.clickButtonMessage({
					message_id: messageId,
					channel_id: channelId as string,
					button_id: buttonId,
					sender_id: senderId,
					user_id: currentUserId
				})
			);
		}
	};

	const buttonColor = useMemo(() => {
		switch (button.style) {
			case EButtonMessageStyle.PRIMARY:
				return backgroundColor.bgButtonPrimary;
			case EButtonMessageStyle.SECONDARY:
				return backgroundColor.bgButtonSecondary;
			case EButtonMessageStyle.SUCCESS:
				return backgroundColor.bgSuccess;
			case EButtonMessageStyle.DANGER:
				return backgroundColor.bgDanger;
			case EButtonMessageStyle.LINK:
				return backgroundColor.bgButtonSecondary;
			default:
				return backgroundColor.bgButtonPrimary;
		}
	}, [button.style]);

	return (
		<TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]} onPress={handleClickOptions}>
			<Text style={[styles.buttonLabel, !!button?.url && { textDecorationLine: 'underline' }]}>{button.label}</Text>
		</TouchableOpacity>
	);
});
