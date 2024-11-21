import { useTheme } from '@mezon/mobile-ui';
import { messagesActions, selectCurrentUserId, useAppDispatch } from '@mezon/store-mobile';
import { EButtonMessageStyle, IButtonMessage } from '@mezon/utils';
import { memo, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
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

	const handleClickOptions = () => {
		if (!button.url) {
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
				return themeValue.bgViolet;
			case EButtonMessageStyle.SECONDARY:
				return themeValue.bgViolet;
			case EButtonMessageStyle.SUCCESS:
				return themeValue.bgViolet;
			case EButtonMessageStyle.DANGER:
				return themeValue.bgViolet;
			case EButtonMessageStyle.LINK:
				return themeValue.bgViolet;
			default:
				return themeValue.bgViolet;
		}
	}, [button.style, themeValue]);

	return (
		<TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]} onPress={handleClickOptions}>
			<Text style={styles.buttonLabel}>{button.label}</Text>
		</TouchableOpacity>
	);
});
