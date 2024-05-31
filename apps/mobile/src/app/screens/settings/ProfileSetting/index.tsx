import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Pressable } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import UserProfile from './UserProfile';
import ServerProfile from './ServerProfile';

import MezonTabView from '../../../temp-ui/MezonTabView';
import MezonTabHeader from '../../../temp-ui/MezonTabHeader';

export const ProfileSetting = ({ navigation }: { navigation: any }) => {
    const { t } = useTranslation(['profileSetting']);
    navigation.setOptions({
        headerRight: () => (
            <Pressable onPress={handleSave}>
                <Text style={{ color: "green", paddingHorizontal: 10 }}>
                    {t("header.save")}
                </Text>
            </Pressable>
        )
    });

    const [tab, setTab] = useState<number>(0);

    function handleTabChange(index: number) {
        setTab(index);
    }

    function handleSave() {

    }

    return (
        <View style={styles.container}>
            <MezonTabHeader
                tabIndex={tab}
                onChange={handleTabChange}
                tabs={[
                    t('switch.userProfile'),
                    t('switch.serverProfile')
                ]}
            />

            <MezonTabView
                pageIndex={tab}
                onChange={handleTabChange}
                views={[
                    <UserProfile />,
                    <UserProfile />,
                    // <ServerProfile />,
                ]}
            />
        </View>
    )
}