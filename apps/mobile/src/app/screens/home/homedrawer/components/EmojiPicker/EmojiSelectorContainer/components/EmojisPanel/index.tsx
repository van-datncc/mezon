import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { emojiRecentActions, useAppDispatch } from '@mezon/store-mobile';
import { IEmoji, getSrcEmoji } from '@mezon/utils';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import MezonConfirm from '../../../../../../../../componentUI/MezonConfirm';
import MezonIconCDN from '../../../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../../../constants/icon_cdn';
import useTabletLandscape from '../../../../../../../../hooks/useTabletLandscape';
import { style } from '../../styles';

type EmojisPanelProps = {
	emojisData: IEmoji[];
	onEmojiSelect: (emoji: IEmoji) => void;
};

const EmojisPanel: FC<EmojisPanelProps> = ({ emojisData, onEmojiSelect }) => {
	const isTabletLandscape = useTabletLandscape();
	const { themeValue } = useTheme();
	const { t } = useTranslation(['token']);
	const styles = style(themeValue, isTabletLandscape);
	const dispatch = useAppDispatch();
	const onBuyEmoji = async (emoji: any) => {
		try {
			if (emoji.id) {
				const resp = await dispatch(emojiRecentActions.buyItemForSale({ id: emoji?.id, type: 0 }));
				if (!resp?.type?.includes('rejected')) {
					Toast.show({ type: 'success', text1: 'Buy item successfully!' });
					DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
				} else {
					Toast.show({ type: 'error', text1: 'Failed to buy item.' });
				}
			}
		} catch (error) {
			console.error('Error buying emoji:', emoji);
			Toast.show({ type: 'error', text1: 'Failed to buy item.' });
		}
	};

	const onPress = (emoji: any) => {
		if (emoji?.is_for_sale && !emoji.src) {
			const data = {
				children: (
					<MezonConfirm
						onConfirm={() => onBuyEmoji(emoji)}
						title={t('unlockItemTitle')}
						content={t('unlockItemDes')}
						confirmText={t('confirmUnlock')}
					/>
				)
			};
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
		} else {
			onEmojiSelect(emoji);
		}
	};
	const renderEmoji = ({ item }: { item: IEmoji }) => (
		<TouchableOpacity style={styles.wrapperIconEmoji} key={`${item.id}_EmojisPanel`} onPress={() => onPress(item)}>
			<FastImage source={{ uri: !item.src ? getSrcEmoji(item?.id) : item.src }} style={styles.iconEmoji} resizeMode={'contain'} />
			{item.is_for_sale && !item.src && (
				<View style={styles.wrapperIconEmojiLocked}>
					<MezonIconCDN icon={IconCDN.lockIcon} color={'#e1e1e1'} width={size.s_20} height={size.s_20} />
				</View>
			)}
		</TouchableOpacity>
	);

	return <View style={styles.emojisPanel}>{emojisData?.length > 0 && emojisData.map((item) => renderEmoji({ item }))}</View>;
};

export default memo(EmojisPanel);
