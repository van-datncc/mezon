import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { useFriends } from '@mezon/core';
import { SeparatorWithLine, UserItem } from '../UserItem';

enum EFriendRequest {
    Received,
    Sent
}

export const RequestFriendScreen = () => {
    const [selectedTab, setSelectedTab] = useState(EFriendRequest.Received);
    const { friends } = useFriends();
    const { t } = useTranslation('friends');
    const friendRequestTabs = [
        {
            title: t('friendRequest.received'),
            type: EFriendRequest.Received
        },
        {
            title: t('friendRequest.sent'),
            type: EFriendRequest.Sent
        }
    ]

    const receivedFriendRequestList = useMemo(() => {
        return friends.filter((friend) => friend.state === 2)
    }, [friends])

    const sentFriendRequestList = useMemo(() => {
        return friends.filter((friend) => friend.state === 1)
    }, [friends])

    return (
        <View style={styles.requestFriendContainer}>
            <View style={styles.toggleWrapper}>
                {friendRequestTabs.map((tab) => {
                    return (
                        <Pressable
                            key={tab.type}
                            onPress={() => setSelectedTab(tab.type)}
                            style={[styles.tab, selectedTab === tab.type && styles.activeTab]}
                        >
                            <Text style={[styles.tabTitle, selectedTab === tab.type && styles.activeTabTitle]}>{tab.title}</Text>
                        </Pressable>
                    )
                })}
            </View>

            <View>
                <View style={styles.groupWrapper}>
                    <FlatList
                        data={selectedTab === EFriendRequest.Received ? receivedFriendRequestList : sentFriendRequestList}
                        ItemSeparatorComponent={SeparatorWithLine}
                        keyExtractor={(friend) => friend.id.toString()}
                        renderItem={({ item }) => <UserItem friend={item} />}
                    />
                </View>
            </View>
        </View>
    )
}