import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Icons } from '@mezon/mobile-components';
import { baseColor, Block, size } from '@mezon/mobile-ui';
import { useNavigation } from '@react-navigation/native';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IMezonMenuItemProps, IMezonMenuSectionProps, MezonBottomSheet, MezonMenu } from '../../componentUI';
import { APP_SCREEN } from '../../navigation/ScreenTypes';

export const SendTokenUser = forwardRef((props, ref: Ref<BottomSheetModalMethods>) => {
	const { t } = useTranslation(['screenStack']);
	const { dismiss } = useBottomSheetModal();
	const navigation = useNavigation<any>();
	const sendTokenOptions: IMezonMenuItemProps[] = useMemo(
		() => [
			{
				onPress: () => {
					navigation.navigate(APP_SCREEN.SETTINGS.STACK, { screen: APP_SCREEN.SETTINGS.SEND_TOKEN });
					dismiss();
				},
				title: t('settingStack.sendToken'),
				isShow: true,
				icon: <Icons.SendMoney height={size.s_24} width={size.s_24} color={baseColor.gray} />
			},
			{
				onPress: () => dismiss(),
				title: t('settingStack.withdrawToken'),
				isShow: true,
				icon: <Icons.SendMoney height={size.s_24} width={size.s_24} rotate={-1} color={baseColor.gray} />
			},
			{
				onPress: () => dismiss(),
				title: t('settingStack.historyTransaction'),
				isShow: true,
				icon: <Icons.History height={size.s_24} width={size.s_24} color={baseColor.gray} />
			}
		],
		[]
	);

	const menu: IMezonMenuSectionProps[] = [
		{
			items: sendTokenOptions
		}
	];

	return (
		<MezonBottomSheet ref={ref} heightFitContent>
			<Block paddingHorizontal={size.s_20}>
				<MezonMenu menu={menu} />
			</Block>
		</MezonBottomSheet>
	);
});
