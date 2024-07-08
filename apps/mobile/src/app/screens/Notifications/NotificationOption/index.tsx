import { Icons } from '@mezon/mobile-components';
import { Colors, useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity } from '@mezon/store-mobile';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import MezonToggleButton from '../../../temp-ui/MezonToggleButton';
import { EActionDataNotify } from '../types';
import { style } from './NotificationOption.styles';
import { IMezonMenuItemProps, IMezonMenuSectionProps, MezonMenu, reserve } from '../../../temp-ui';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { memo } from 'react';
interface INotificationOptionProps {
	onChange: (value: EActionDataNotify) => void;
	channels: ChannelsEntity[];
}
const NotificationOption = memo(({ onChange, channels }: INotificationOptionProps) => {
	const { t } = useTranslation(['notification']);
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const [selectedTabs, setSelectedTabs] = useState({ individual: true, mention: true });

	const handleTabChange = (value, isSelected) => {
		setSelectedTabs((prevState) => ({
			...prevState,
			[value]: isSelected,
		}));
	};

	useEffect(() => {
		setSelectedTabs({ individual: true, mention: true });
	}, [channels]);

	const calculateValue = () => {
		return selectedTabs.individual && selectedTabs.mention
			? EActionDataNotify.All
			: selectedTabs.individual
				? EActionDataNotify.Individual
				: selectedTabs.mention
					? EActionDataNotify.Mention
					: null;
	};

	useEffect(() => {
		const value = calculateValue();
		onChange(value);
	}, [selectedTabs]);

	const Btn = useCallback(({ val }: { val: "individual" | "mention" }) => (
		<MezonToggleButton
			onChange={(isSelected) => handleTabChange(val, isSelected)}
			height={30}
			width={60}
			toggleOnColor={Colors.white}
			value={selectedTabs[val]}
			toggleBgOffColor={Colors.gray48}
			toggleBgOnColor={Colors.bgButton}
			toggleOffColor={Colors.gray72}
		></MezonToggleButton>
	), []);

	const notificationMenu = useMemo(() => ([
		{
			title: t('tabNotify.forYou'),
			icon: <Icons.AtIcon color={themeValue.textStrong} />,
			component: <Btn val="individual" />
		},
		{
			title: t('tabNotify.mention'),
			icon: <Icons.BellIcon color={themeValue.textStrong} />,
			component: <Btn val="mention" />
		},
	]) satisfies IMezonMenuItemProps[], [])

	const settingMenu = useMemo(() => ([
		{
			title: t('tabNotify.notificationSettings'),
			icon: <Icons.SettingsIcon color={themeValue.textStrong} />,
			expandable: true,
			onPress: () => reserve()
		}
	]) satisfies IMezonMenuItemProps[], [])

	const menu = useMemo(() => ([
		{ items: notificationMenu },
		{ items: settingMenu },
	]) satisfies IMezonMenuSectionProps[], [notificationMenu, settingMenu]);

	return (
		<View style={styles.wrapperOption}>
			<MezonMenu menu={menu} />
		</View>
	);
});

export default NotificationOption;
