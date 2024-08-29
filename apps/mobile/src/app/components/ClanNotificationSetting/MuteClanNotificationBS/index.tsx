import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Icons } from '@mezon/mobile-components';
import { Block, size, useTheme } from '@mezon/mobile-ui';
import { FOR_15_MINUTES, FOR_1_HOUR, FOR_24_HOURS, FOR_3_HOURS, FOR_8_HOURS } from '@mezon/utils';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import { IMezonMenuSectionProps, MezonMenu, reserve } from '../../../temp-ui';
import MezonBottomSheet from '../../../temp-ui/MezonBottomSheet';
import { style } from './MuteClanNotificationBS.styles';

type MuteClanNotificationBSProps = {
	onChangeScheduleMute?: (duration: number) => void;
	description?: string;
	currentChannel?: any;
};
const MuteClanNotificationBS = ({ onChangeScheduleMute, currentChannel, description = '' }: MuteClanNotificationBSProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const bottomSheetDetail = useRef<BottomSheetModal>(null);
	const { t } = useTranslation(['notificationSetting', 'clanNotificationsSetting']);
	const [isMute, setIsMute] = useState<boolean>(false);

	const menu = useMemo(
		() =>
			[
				{
					items: [
						{
							title: t('notifySettingThreadModal.muteDuration.forFifteenMinutes'),
							onPress: () => {
								onChangeScheduleMute(FOR_15_MINUTES);
							}
						},
						{
							title: t('notifySettingThreadModal.muteDuration.forOneHour'),
							onPress: () => {
								onChangeScheduleMute(FOR_1_HOUR);
							}
						},
						{
							title: t('notifySettingThreadModal.muteDuration.forThreeHours'),
							onPress: () => {
								onChangeScheduleMute(FOR_3_HOURS);
							}
						},
						{
							title: t('notifySettingThreadModal.muteDuration.forEightHours'),
							onPress: () => {
								onChangeScheduleMute(FOR_8_HOURS);
							}
						},
						{
							title: t('notifySettingThreadModal.muteDuration.forTwentyFourHours'),
							onPress: () => {
								onChangeScheduleMute(FOR_24_HOURS);
							}
						},
						{
							title: t('notifySettingThreadModal.muteDuration.untilTurnItBackOn'),
							onPress: () => {
								onChangeScheduleMute(Infinity);
							}
						}
					]
				}
			] as IMezonMenuSectionProps[],
		[]
	);

	const handleMuteChannel = () => {
		// bottomSheetDetail.current?.present();
		reserve();
	};

	return (
		<Block>
			<Block style={styles.optionsBox}>
				<TouchableOpacity onPress={handleMuteChannel} style={styles.wrapperUnmuteBox}>
					<Icons.BellSlashIcon width={20} height={20} style={{ marginRight: 20 }} color={themeValue.text} />
					<Text style={styles.option}>
						{`${isMute ? 'Mute' : 'Unmute'} #${currentChannel?.channel_category_label || currentChannel?.label || ''}`}
					</Text>
				</TouchableOpacity>
			</Block>
			<Text style={styles.subTitle}>{description}</Text>
			<MezonBottomSheet snapPoints={['55%']} ref={bottomSheetDetail}>
				<Block paddingHorizontal={size.s_20}>
					<Text style={styles.headerBS}>{t('clanNotificationBS.title', { ns: 'clanNotificationsSetting' })}</Text>
					<MezonMenu menu={menu} />
				</Block>
			</MezonBottomSheet>
		</Block>
	);
};

export default MuteClanNotificationBS;
