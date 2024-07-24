import { Icons } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity, PinMessageEntity } from '@mezon/store-mobile';
import { IEmoji } from '@mezon/utils';
import { Text, TouchableOpacity, View } from 'react-native';
import { renderTextContent } from '../../../screens/home/homedrawer/constants/markdown';
import MezonAvatar from '../../../temp-ui/MezonAvatar';
import { style } from './PinMessageItem.styles';

interface IPinMessageItemProps {
	pinMessageItem: PinMessageEntity;
	handleUnpinMessage: (pinMessageItem: PinMessageEntity) => void;
	contentMessage: string;
	channelsEntities: Record<string, ChannelsEntity>;
	emojiListPNG: IEmoji[];
}

const PinMessageItem = ({ pinMessageItem, handleUnpinMessage, contentMessage, channelsEntities, emojiListPNG }: IPinMessageItemProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<View style={styles.pinMessageItemWrapper}>
			<MezonAvatar avatarUrl={pinMessageItem?.avatar} username={pinMessageItem?.username}></MezonAvatar>
			<View style={styles.pinMessageItemBox}>
				<Text style={styles.pinMessageItemName}>{pinMessageItem?.username}</Text>
				{renderTextContent({ lines: contentMessage, isEdited: false, channelsEntities, emojiListPNG })}
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
};

export default PinMessageItem;
