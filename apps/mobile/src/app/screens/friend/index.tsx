import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { styles } from './styles';
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from '@mezon/mobile-ui';
import { useTranslation } from 'react-i18next';
import { useThrottledCallback } from 'use-debounce';
import { useFriends } from '@mezon/core';
import { normalizeString } from '../../utils/helpers';
import { SeparatorWithLine, SeparatorWithSpace, UserItem } from './UserItem';
import { ChevronIcon, PaperPlaneIcon } from '@mezon/mobile-components';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import { IFriendGroupByCharacter } from './types';

export const FriendScreen = React.memo(({ navigation }: { navigation: any }) => {
    const [searchText, setSearchText] = useState<string>('');
    const { t } = useTranslation(['common', 'friends']);
    const { friends: allUser } = useFriends();
    const friendList = allUser.filter((user) => user.state === 0);

    const navigateToRequestFriendScreen = () => {
        navigation.navigate(APP_SCREEN.FRIENDS.STACK, { screen: APP_SCREEN.FRIENDS.REQUEST_FRIEND })
    }

    const filteredFriendList = useMemo(() => {
        return friendList.filter(friend => normalizeString(friend.user.username).includes(normalizeString(searchText)));
    }, [friendList]);

    const allFriendGroupByAlphabet = useMemo(() => {
        const groupedByCharacter = friendList.reduce((acc, friend) => {
            const firstUserNameCharacter = friend.user.username.charAt(0).toUpperCase();
            if (!acc[firstUserNameCharacter]) {
                acc[firstUserNameCharacter] = [];
            }
            acc[firstUserNameCharacter].push(friend);
            return acc;
        }, {})

        return Object.keys(groupedByCharacter).map((character) => ({
            character,
            friendList: groupedByCharacter[character]
        }));
    }, [friendList]);

    const friendRequestCount = useMemo(() => {
        return {
            sent: allUser.filter(user => user.state === 1).length,
            received: allUser.filter(user => user.state === 2).length,
        }
    }, [allUser])

    const renderListFriendGroupByAlphabet = ({ item }: { item: IFriendGroupByCharacter }) => {
        return (
            <View>
                <Text style={styles.groupFriendTitle}>{item.character}</Text>
                <View style={styles.groupWrapper}>
                    <FlatList
                        data={item.friendList}
                        style={styles.groupByAlphabetWrapper}
                        ItemSeparatorComponent={SeparatorWithLine}
                        keyExtractor={(friend) => friend.id.toString()}
                        renderItem={({ item }) => <UserItem friend={item} />}
                    />
                </View>
            </View>
        )
    }

    const typingSearchDebounce = useThrottledCallback((text) => setSearchText(text), 500)

    return (
        <View style={styles.friendContainer}>
            <View style={styles.searchFriend}>
				<Feather size={18} name="search" style={{ color: Colors.tertiary }} />
				<TextInput
					placeholder={t('common:searchPlaceHolder')}
					placeholderTextColor={Colors.tertiary}
					style={styles.searchInput}
					onChangeText={(text) => typingSearchDebounce(text)}
				/>
			</View>

            {filteredFriendList.length === 0 ? (
                <View>
                    <Text style={styles.defaultText}>{t('friends:noFriendsResultsFound')}</Text>
                </View>
            ): null}

            {!searchText.trim().length || filteredFriendList.length === 0 ? (
                <Pressable style={styles.requestFriendWrapper} onPress={() => navigateToRequestFriendScreen()}>
                    <PaperPlaneIcon width={25} color={Colors.textGray} />
                    <View style={styles.fill}>
                        <Text style={styles.defaultText}>{t('friends:friendRequest.title')}</Text>
                        <View style={styles.requestContentWrapper}>
                            <Text style={styles.defaultText}>{friendRequestCount.received} {t('friends:friendRequest.received')}</Text>
                            <Text style={styles.defaultText}>•</Text>
                            <Text style={styles.defaultText}>{friendRequestCount.sent} {t('friends:friendRequest.sent')}</Text>
                        </View>
                    </View>
                    <ChevronIcon width={25} color={Colors.textGray} />
                </Pressable>
            ): null}

            {searchText.trim().length ? (
                <View>
                    {filteredFriendList.length ? (
                        <Text style={styles.friendText}>{t('friends:friends')}</Text>
                    ): null}
                    <View style={styles.groupWrapper}>
                        <FlatList
                            data={filteredFriendList}
                            keyExtractor={(friend) => friend.id.toString()}
                            ItemSeparatorComponent={SeparatorWithLine}
                            renderItem={({ item }) => <UserItem friend={item} />}
                        />
                    </View>
                </View>
            ): (
                <FlatList
                    data={allFriendGroupByAlphabet}
                    keyExtractor={(item) => item.character}
                    ItemSeparatorComponent={SeparatorWithSpace}
                    renderItem={renderListFriendGroupByAlphabet}
			    />
            )}
        </View>
    )
})