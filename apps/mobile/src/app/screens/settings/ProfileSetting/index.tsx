import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import UserProfile from './UserProfile';
import ServerProfile from './ServerProfile';

export const ProfileSetting = () => {
    const [tab, setTab] = useState<"user" | "server">("user");
    const { t } = useTranslation(['profileSetting']);

    return (
        <View style={styles.container}>
            <View style={styles.switchContainer}>
                <View style={styles.switchWrapper}>
                    <TouchableOpacity
                        style={[styles.switchButton, tab === "user" && styles.switchButtonActive]}
                        onPress={() => setTab("user")}
                    >
                        <Text style={styles.switchText}>
                            {t('switch.userProfile')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.switchWrapper}>
                    <TouchableOpacity
                        style={[styles.switchButton, tab === "server" && styles.switchButtonActive]}
                        onPress={() => setTab("server")}
                    >
                        <Text style={styles.switchText}>
                            {t('switch.serverProfile')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <UserProfile />
            {/* <ScrollView
                horizontal
                snapToAlignment='center'>
                <ServerProfile />
            </ScrollView> */}
        </View>
    )
}