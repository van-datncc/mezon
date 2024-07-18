import { Block, size } from '@mezon/mobile-ui';
import { Image, Text, TouchableOpacity } from 'react-native';
import Images from '../../../../../../assets/Images';
import { styles } from './UserEmptyMessage.styles';
import { useTranslation } from 'react-i18next';

const UserEmptyMessage = ({ onPress }: { onPress: () => void }) => {
  const { t } = useTranslation(['userEmptyClan']);
	return (
		<Block style={styles.wrapper}>
			<Image style={styles.imageBg} source={Images.CHAT_ADD_FRIENDS} />
			<Block marginTop={size.s_20}>
				<Text style={styles.title}>{t('emptyMessage.dMsWith')}</Text>
				<Text style={styles.description}>{t('emptyMessage.inviteYourFriends')}</Text>
			</Block>
			<Block marginTop={size.s_40}>
				<TouchableOpacity
					style={styles.addFriendsBtn}
					onPress={() => {
						onPress();
					}}
				>
					<Text style={styles.textAddFriends}>{t('emptyMessage.addFriend')}</Text>
				</TouchableOpacity>
			</Block>
		</Block>
	);
};

export default UserEmptyMessage;
