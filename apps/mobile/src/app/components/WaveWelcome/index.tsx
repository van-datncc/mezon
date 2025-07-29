import { useChatSending } from '@mezon/core';
import { useTheme } from '@mezon/mobile-ui';
import { selectCurrentChannel } from '@mezon/store-mobile';
import { IMessage, IMessageSendPayload } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import ImageNative from '../ImageNative';
import { style } from './styles';

interface IWaveButtonProps {
	message: IMessage;
}

const STICKER_WELCOME_URL = 'https://cdn.mezon.ai/stickers/7355562928528545988.webp';
const STICKER_WELCOME_NAME = '24318127-fb1d-4ac4-a036-c3d59ffb033c.gif';
const MEZON_AVATAR_URL = 'https://cdn.mezon.ai/0/1840653409082937344/1782991817428439000/1748500199026_0logo_new.png';

const WaveButton = ({ message }: IWaveButtonProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation('dmMessage');
	const currenChannel = useSelector(selectCurrentChannel);

	const { sendMessage } = useChatSending({
		mode: ChannelStreamMode.STREAM_MODE_CHANNEL,
		channelOrDirect: currenChannel
	});

	const handleSendWaveSticker = async () => {
		try {
			const content: IMessageSendPayload = { t: '' };
			const ref = {
				message_id: '',
				message_ref_id: message.id,
				ref_type: 0,
				message_sender_id: message?.sender_id,
				message_sender_username: 'Mezon',
				mesages_sender_avatar: MEZON_AVATAR_URL,
				message_sender_clan_nick: 'Mezon',
				message_sender_display_name: 'Mezon',
				content: JSON.stringify(message.content),
				has_attachment: false,
				channel_id: message.channel_id ?? '',
				mode: message.mode ?? 0,
				channel_label: message.channel_label
			};
			const attachments = [
				{
					url: STICKER_WELCOME_URL,
					filetype: 'image/gif',
					filename: STICKER_WELCOME_NAME,
					size: 286037,
					width: 240,
					height: 240
				}
			];

			await sendMessage(content, [], attachments, [ref], false, false, true);
		} catch (error) {
			console.error('Error sending wave sticker:', error);
		}
	};

	return (
		<TouchableOpacity style={styles.waveButton} onPress={handleSendWaveSticker}>
			<ImageNative url={STICKER_WELCOME_URL} style={styles.waveIcon} resizeMode="contain" />
			<Text style={styles.waveButtonText}>{t('waveWelcome')}</Text>
		</TouchableOpacity>
	);
};

export default memo(WaveButton);
