import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { styles } from "./styles";
import { ArrowLeftIcon } from "@mezon/mobile-components";
import { Colors } from "@mezon/mobile-ui";
import { useTranslation } from "react-i18next";
import Feather from 'react-native-vector-icons/Feather';
import { useDirect, useFriends } from "@mezon/core";
import { useThrottledCallback } from "use-debounce";
import { normalizeString } from "../../../utils/helpers";
import { FriendListByAlphabet } from "../../../components/FriendListByAlphabet";
import { FriendsEntity, directActions, selectDmGroupCurrent, useAppDispatch } from "@mezon/store-mobile";
import { EFriendItemAction } from "../../../components/FriendItem";
import { ApiCreateChannelDescRequest } from "mezon-js/api.gen";
import { ChannelType } from "mezon-js";
import { APP_SCREEN } from "../../../navigation/ScreenTypes";
import { useSelector } from "react-redux";

export const NewGroupScreen = ({ navigation }: { navigation: any }) => {
    const [searchText, setSearchText] = useState<string>('');
    const { t } = useTranslation(['common', 'friends']);
    const [ friendIdSelectedList, setFriendIdSelectedList ] = useState<string[]>([]);
    const { friends: allUser } = useFriends();
    const { listDM } = useDirect();
    const dispatch = useAppDispatch();
    const [newChannelId, setNewChannelId] = useState<string>('');
    const newDirectMessage = useSelector(selectDmGroupCurrent(newChannelId));

    const friendList: FriendsEntity[] = useMemo(() => {
        return allUser.filter((user) => user.state === 0)
    }, [allUser]);

    const filteredFriendList = useMemo(() => {
        return friendList.filter(friend =>
            normalizeString(friend.user.username).includes(normalizeString(searchText)) ||
            normalizeString(friend.user.display_name).includes(normalizeString(searchText))
        );
    }, [friendList, searchText]);

    const handleFriendAction = useCallback((friend: FriendsEntity, action: EFriendItemAction) => {
        switch (action) {
            case EFriendItemAction.ShowInformation:
                console.log('handle Show Information', friend);
                break;
            default:
                break;
        }
    }, [])

    const onSelectedChange = useCallback((friendIdSelected: string[]) => {
        setFriendIdSelectedList(friendIdSelected);
    }, [])

    useEffect(() => {
        if (newDirectMessage?.channel_id) {
            navigation.navigate(APP_SCREEN.MESSAGES.STACK, { screen: APP_SCREEN.MESSAGES.MESSAGE_DETAIL, params: { directMessage: newDirectMessage, from: APP_SCREEN.MESSAGES.NEW_GROUP } });
            setNewChannelId('');
        }
    }, [newDirectMessage, navigation])

    const createNewGroup = async () => {
        const bodyCreateDmGroup: ApiCreateChannelDescRequest = {
			type: friendIdSelectedList.length > 1 ? ChannelType.CHANNEL_TYPE_GROUP : ChannelType.CHANNEL_TYPE_DM,
			channel_private: 1,
			user_ids: friendIdSelectedList,
		};

		const response = await dispatch(directActions.createNewDirectMessage(bodyCreateDmGroup));
		const resPayload = response.payload as ApiCreateChannelDescRequest;
        console.log(friendIdSelectedList);
        console.log(resPayload);
        console.log(listDM);
		if (resPayload.channel_id) {
            const directMessage = listDM.find(dm => dm.channel_id === resPayload.channel_id)
            if (directMessage) {
                console.log('1', directMessage);
                navigation.navigate(APP_SCREEN.MESSAGES.STACK, { screen: APP_SCREEN.MESSAGES.MESSAGE_DETAIL, params: { directMessage, from: APP_SCREEN.MESSAGES.NEW_GROUP } });
                return;
            }
            console.log('2', directMessage);
            //NOTE: handle navigate for new DM
            setNewChannelId(resPayload.channel_id);
		}

    }

    const typingSearchDebounce = useThrottledCallback((text) => setSearchText(text), 500)
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.newGroupContainer}>
                <View style={styles.headerWrapper}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon color={Colors.textGray} />
                    </Pressable>
                    <View style={styles.screenTitleWrapper}>
                        <Text style={styles.screenTitle}>{t('screen:headerTitle.newGroup')}</Text>
                    </View>
                    <View style={styles.actions}>
                        <Pressable onPress={() => createNewGroup()}>
                            <Text style={styles.actionText}>{t('message:newMessage.create')}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.contentWrapper}>
                    {/* TODO: update later - autocomplete input */}
                    <View style={styles.searchFriend}>
                        <Feather size={18} name="search" style={{ color: Colors.tertiary }} />
                        <TextInput
                            placeholder={t('common:searchPlaceHolder')}
                            placeholderTextColor={Colors.tertiary}
                            style={styles.searchInput}
                            onChangeText={(text) => typingSearchDebounce(text)}
                        />
                    </View>

                    <FriendListByAlphabet
                        isSearching={Boolean(searchText.trim().length)}
                        friendList={filteredFriendList}
                        handleFriendAction={handleFriendAction}
                        selectMode={true}
                        onSelectedChange={onSelectedChange}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}