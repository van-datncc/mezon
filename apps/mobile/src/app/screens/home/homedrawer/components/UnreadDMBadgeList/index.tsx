import { UserGroupIcon } from '@mezon/mobile-components';
import { DirectEntity, selectDirectsOpenlist, selectDirectsUnreadlist } from '@mezon/store-mobile';
import { ChannelType } from 'mezon-js';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN } from '../../../../../../app/navigation/ScreenTypes';

export const UnreadDMBadgeList = React.memo(() => {
    const unReadDirectMessageList = useSelector(selectDirectsUnreadlist);
    const listDM = useSelector(selectDirectsOpenlist);
    const navigation = useNavigation<any>();
    console.log('listDM', listDM);
    console.log('listDirectMessage', unReadDirectMessageList);

    const getBadge = (dm: DirectEntity) => {
        switch (dm.type) {
            case ChannelType.CHANNEL_TYPE_DM:
                return (
                    <Image source={{uri: dm?.channel_avatar[0]}} resizeMode='cover' style={styles.groupAvatar} />
                )
            case ChannelType.CHANNEL_TYPE_GROUP:
                return (
                    <View style={styles.groupAvatar}>
                        <UserGroupIcon />
                    </View>
                )
            default:
                return <View />
        }
    }

    const navigateToDirectMessageMDetail = (channel_id) => {
        navigation.navigate(APP_SCREEN.MESSAGES.STACK, { screen: APP_SCREEN.MESSAGES.MESSAGE_DETAIL, params: { directMessageId: channel_id } })
    }

    return (
        <View style={styles.container}>
            {unReadDirectMessageList.map((dm: DirectEntity) => {
                return (
                    <TouchableOpacity key={dm.id} onPress={() => navigateToDirectMessageMDetail(dm?.channel_id)}>
                        {getBadge(dm)}
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{dm?.count_mess_unread}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
})