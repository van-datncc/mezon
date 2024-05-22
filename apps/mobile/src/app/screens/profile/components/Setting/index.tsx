import React from 'react';
import { View, Text, Alert } from 'react-native';
import { styles } from './styles';
import { MezonButton } from 'apps/mobile/src/app/temp-ui';
import { LogoutIcon } from '@mezon/mobile-components';
import { useTranslation } from 'react-i18next';
import { authActions, useAppDispatch } from '@mezon/store-mobile';

export const Setting = React.memo(() => {

    const { t } = useTranslation(['setting']);
    const dispatch = useAppDispatch();
    const logout = () => {
        dispatch(authActions.logOut());
    }

    const confirmLogout = () => {
        Alert.alert(
            t('logOut'),
            "Are you sure you want to log out?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Yes", onPress: () => logout() }
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={styles.settingContainer}>
            <MezonButton
                onPress={() => confirmLogout()}
                viewContainerStyle={styles.logoutButton}
            >
                <View style={styles.logoutIconWrapper}>
                    <LogoutIcon />
                </View>
                <Text style={styles.logoutText}>{t('logOut')}</Text>
            </MezonButton>
        </View>
    )
})