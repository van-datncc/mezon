import React, { useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from './styles';
import { useFriends } from '@mezon/core';
import { SeparatorWithLine, UserItem } from '../UserItem';
import { useTranslation } from 'react-i18next';
import { EAddFriendWays } from '../enum';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { AddFriendModal } from './components/AddFriendModal';

export const AddFriendScreen = () => {
    const { friends } = useFriends();
    const { t } = useTranslation('friends');
    const [currentAddFriendType, setCurrentAddFriendType] = useState<EAddFriendWays | null>(null);
    const receivedFriendRequestList = useMemo(() => {
        return friends.filter((friend) => friend.state === 2)
    }, [friends])

    const waysToAddFriendList = [
        {
            title: t('addFriend.findYourFriend'),
            type: EAddFriendWays.FindFriend
        },
        {
            title: t('addFriend.addByUserName'),
            type: EAddFriendWays.UserName
        }
    ];

    return (
        <View style={styles.addFriendContainer}>
            <View style={styles.groupWrapper}>
                <FlatList
                    data={waysToAddFriendList}
                    keyExtractor={(item) => item.type.toString()}
                    ItemSeparatorComponent={SeparatorWithLine}
                    renderItem={({ item }) => (
                        <TouchableHighlight
                            onPress={() => setCurrentAddFriendType(item.type)}
                            style={styles.addFriendItem}
                            key={item.type}
                        >
                            <Text style={styles.addFriendText}>{item.title}</Text>
                        </TouchableHighlight>
                    )}
                />
            </View>
            <Text style={styles.whiteText}>{t('addFriend.incomingFriendRequest')}</Text>
            <View style={styles.groupWrapper}>
                <FlatList
                    data={receivedFriendRequestList}
                    ItemSeparatorComponent={SeparatorWithLine}
                    keyExtractor={(friend) => friend.id.toString()}
                    renderItem={({ item }) => <UserItem friend={item} />}
                />
            </View>

            <AddFriendModal type={currentAddFriendType} onClose={() => setCurrentAddFriendType(null)} />
        </View>
    )
}