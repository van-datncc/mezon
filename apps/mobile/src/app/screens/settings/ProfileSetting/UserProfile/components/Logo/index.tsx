import { useAuth } from '@mezon/core';
import { size, useTheme } from '@mezon/mobile-ui';
import { appActions, clansActions, selectLogoCustom, useAppDispatch } from '@mezon/store-mobile';
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import MezonImagePicker from '../../../../../../componentUI/MezonImagePicker';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import { style } from './styles';

export const DirectMessageLogo = memo(() => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const logoCustom = useSelector(selectLogoCustom);
	const dispatch = useAppDispatch();
	const { userProfile } = useAuth();

	const handleOnLoad = async (url) => {
		if (url) {
			dispatch(appActions.setLoadingMainMobile(true));
			await dispatch(
				clansActions.updateUser({
					user_name: userProfile.user.username,
					avatar_url: userProfile.user.avatar_url,
					display_name: userProfile.user.display_name,
					about_me: userProfile.user.about_me,
					dob: userProfile.user.dob,
					logo: url
				})
			);
			dispatch(appActions.setLoadingMainMobile(false));
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Direct Message Icon</Text>
			<MezonImagePicker
				defaultValue={logoCustom}
				height={size.s_50}
				width={size.s_50}
				localValue={!logoCustom && <MezonIconCDN icon={IconCDN.logoMezon} width={size.s_50} height={size.s_50} useOriginalColor={true} />}
				onLoad={handleOnLoad}
				autoUpload
			/>
		</View>
	);
});
