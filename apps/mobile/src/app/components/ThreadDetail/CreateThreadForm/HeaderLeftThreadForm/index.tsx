import { Icons } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { selectOpenThreadMessageState } from '@mezon/store-mobile';
import { ChannelStatusEnum, ChannelThreads } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { ChannelType } from 'mezon-js';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from './HeaderLeftThreadForm.style';

const HeaderLeftThreadForm = ({ currentChannel }: { currentChannel: ChannelThreads }) => {
	const { themeValue } = useTheme();
	const navigation = useNavigation();
	const styles = style(themeValue);
	const openThreadMessageState = useSelector(selectOpenThreadMessageState);
	const { t } = useTranslation(['createThread']);

	return (
		<View style={styles.headerLeft}>
			<TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
				<Icons.ChevronSmallLeftIcon color={themeValue.textStrong} />
			</TouchableOpacity>
			<View>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					{!openThreadMessageState && (
						<View style={{ marginRight: size.s_10 }}>
							{currentChannel?.channel_private === ChannelStatusEnum.isPrivate &&
							currentChannel?.type === ChannelType.CHANNEL_TYPE_CHANNEL ? (
								<Icons.TextLockIcon width={18} height={18} color={themeValue.textStrong} />
							) : (
								<Icons.TextIcon width={18} height={18} color={themeValue.textStrong} />
							)}
						</View>
					)}
					<Text style={{ color: themeValue.textStrong, fontSize: size.h6, fontWeight: '700' }}>
						{openThreadMessageState ? t('newThread', { ns: 'createThread' }) : currentChannel?.channel_label}
					</Text>
					<Icons.ChevronSmallRightIcon width={14} height={14} style={{ marginLeft: 5 }} color={themeValue.text} />
				</View>
				{openThreadMessageState && (
					<Text numberOfLines={1} style={{ color: themeValue.text, fontSize: size.medium, fontWeight: '400', maxWidth: '90%' }}>
						{currentChannel?.channel_label}
					</Text>
				)}
			</View>
		</View>
	);
};

export default HeaderLeftThreadForm;
