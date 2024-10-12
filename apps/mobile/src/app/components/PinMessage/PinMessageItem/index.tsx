import { Icons } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { PinMessageEntity, selectMessageByMessageId, useAppSelector } from '@mezon/store-mobile';
import { IExtendedMessage, IMessageWithUser } from '@mezon/utils';
import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MezonAvatar from '../../../componentUI/MezonAvatar';
import { MessageAttachment } from '../../../screens/home/homedrawer/components/MessageAttachment';
import { RenderTextMarkdownContent } from '../../../screens/home/homedrawer/components/RenderTextMarkdown';
import { style } from './PinMessageItem.styles';

interface IPinMessageItemProps {
	pinMessageItem: PinMessageEntity;
	handleUnpinMessage: (pinMessageItem: PinMessageEntity) => void;
	contentMessage: IExtendedMessage;
}

const PinMessageItem = memo(({ pinMessageItem, handleUnpinMessage, contentMessage }: IPinMessageItemProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const message = useAppSelector((state) => selectMessageByMessageId(state, pinMessageItem?.channel_id, pinMessageItem?.message_id)) || {};
	return (
		<View style={styles.pinMessageItemWrapper}>
			<MezonAvatar avatarUrl={pinMessageItem?.avatar} username={pinMessageItem?.username}></MezonAvatar>
			<View style={styles.pinMessageItemBox}>
				<Text style={styles.pinMessageItemName}>{pinMessageItem?.username}</Text>
				<RenderTextMarkdownContent content={contentMessage} isEdited={false} />
				<MessageAttachment message={message as IMessageWithUser} />
			</View>
			<View>
				<TouchableOpacity
					style={styles.pinMessageItemClose}
					onPress={() => {
						handleUnpinMessage(pinMessageItem);
					}}
				>
					<Icons.CircleXIcon color={themeValue.text} />
				</TouchableOpacity>
			</View>
		</View>
	);
});

export default PinMessageItem;
