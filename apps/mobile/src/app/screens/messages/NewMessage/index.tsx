import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { APP_SCREEN } from "../../../navigation/ScreenTypes";
import { FriendListByAlphabet } from "../../../components/FriendListByAlphabet";
import { useThrottledCallback } from "use-debounce";
import { EFriendItemAction } from "../../../components/FriendItem";
import { FriendsEntity, selectDmGroupCurrent } from "@mezon/store-mobile";
import { normalizeString } from "../../../utils/helpers";
import { useSelector } from "react-redux";
import { useDirect, useFriends } from "@mezon/core";
import { useTranslation } from "react-i18next";
import { Colors } from "@mezon/mobile-ui";
import { ChevronIcon, UserGroupIcon, UserIcon } from "@mezon/mobile-components";
import { SeparatorWithLine } from "../../../components/Common";

export const NewMessageScreen = ({ navigation }: { navigation: any }) => {
    const [searchText, setSearchText] = useState<string>('');
    const { t } = useTranslation(['']);
    const { friends: allUser } = useFriends();
    const { createDirectMessageWithUser, listDM } = useDirect();
    const friendList = allUser.filter((user) => user.state === 0);
    const [newChannelId, setNewChannelId] = useState<string>('');
    const newDirectMessage = useSelector(selectDmGroupCurrent(newChannelId));

    const inputRef = useRef(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (inputRef?.current) {
                inputRef.current.focus();
            }
        }, 300)

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }, [])

    const navigateToAddFriendScreen = () => {
        navigation.navigate(APP_SCREEN.FRIENDS.STACK, { screen: APP_SCREEN.FRIENDS.ADD_FRIEND })
    }

    const navigateToNewGroupScreen = () => {
		navigation.navigate(APP_SCREEN.MESSAGES.STACK, { screen: APP_SCREEN.MESSAGES.NEW_GROUP });
	}

    const filteredFriendList = useMemo(() => {
        return friendList.filter(friend =>
            normalizeString(friend.user.username).includes(normalizeString(searchText)) ||
            normalizeString(friend.user.display_name).includes(normalizeString(searchText))
        );
    }, [friendList, searchText]);

    const directMessageWithUser = useCallback(async (userId: string) => {
        const directMessage = listDM.find(dm => dm?.user_id?.length === 1 && dm?.user_id[0] === userId);
        if (directMessage?.id) {
            navigation.navigate(APP_SCREEN.MESSAGES.STACK, { screen: APP_SCREEN.MESSAGES.MESSAGE_DETAIL, params: { directMessage } });
            return;
        }
		const response = await createDirectMessageWithUser(userId);
		if (response?.channel_id) {
			setNewChannelId(response?.channel_id);
		}
	}, [createDirectMessageWithUser, listDM, navigation]);

    useEffect(() => {
        if (newDirectMessage?.channel_id) {
            navigation.navigate(APP_SCREEN.MESSAGES.STACK, { screen: APP_SCREEN.MESSAGES.MESSAGE_DETAIL, params: { directMessage: newDirectMessage } });
            setNewChannelId('');
        }
    }, [newDirectMessage, navigation])

    const handleFriendAction = useCallback((friend: FriendsEntity, action: EFriendItemAction) => {
        switch (action) {
            case EFriendItemAction.Call:
                console.log('handle phone call', friend);
                break;
            case EFriendItemAction.MessageDetail:
                directMessageWithUser(friend?.user?.id)
                break;
            default:
                break;
        }
    }, [directMessageWithUser])

    const typingSearchDebounce = useThrottledCallback((text) => setSearchText(text), 500)

    return (
        <View style={styles.newMessageContainer}>
            <View style={styles.searchFriend}>
				<Text style={styles.defaultText}>{t('message:newMessage.to')}: </Text>
				<TextInput
                    ref={inputRef}
					placeholder={t('common:searchPlaceHolder')}
					placeholderTextColor={Colors.tertiary}
					style={styles.searchInput}
					onChangeText={(text) => typingSearchDebounce(text)}
				/>
			</View>

            <View style={styles.actionsWrapper}>
                <TouchableOpacity
                    onPress={() => navigateToNewGroupScreen()}
                    style={styles.actionItem}
                >
                    <View style={[styles.actionIconWrapper, styles.bgNewGroupIcon]}>
                        <UserGroupIcon />
                    </View>
                    <Text style={styles.actionTitle}>{t('message:newMessage.newGroup')}</Text>
                    <ChevronIcon height={15} width={15} />
                </TouchableOpacity>
                <SeparatorWithLine />
                <TouchableOpacity
                    onPress={() => navigateToAddFriendScreen()}
                    style={styles.actionItem}
                >
                    <View style={[styles.actionIconWrapper, styles.bgAddFriendIcon]}>
                        <UserIcon />
                    </View>
                    <Text style={styles.actionTitle}>{t('message:newMessage.addFriend')}</Text>
                    <ChevronIcon height={15} width={15} />
                </TouchableOpacity>
            </View>

            <FriendListByAlphabet
                isSearching={Boolean(searchText.trim().length)}
                friendList={filteredFriendList}
                handleFriendAction={handleFriendAction}
                showAction={false}
            />
        </View>
    )
}