import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { styles } from './styles';
import { Colors, size } from '@mezon/mobile-ui';
import { useFriends, useMemberStatus } from '@mezon/core';
import { CallIcon, CheckIcon, CloseIcon, MessageIcon } from '@mezon/mobile-components';
import { IUserItem } from './types';
import { friendsActions, getStoreAsync } from '@mezon/store-mobile';

export const UserItem = React.memo(({ friend }: IUserItem) => {
	const userStatus = useMemberStatus(friend.id || '');
	const { acceptFriend, deleteFriend } = useFriends();
	const isFriend = friend.state === 0;
	const isSentRequestFriend = friend.state === 1;
	const isPendingFriendRequest = [1,2].includes(friend.state);

	const deleteFriendRequest = () => {
		deleteFriend(friend.user.username, friend.user.id);
		refetchUser();
	}

	const approveFriendRequest = () => {
		acceptFriend(friend.user.username, friend.user.id);
		refetchUser();
	}

    const handlePhoneCall = () => {
        //TODO: update later
        console.log('handlePhoneCall', friend);
    }

    const navigateToMessageDetail = () => {
        //TODO: update later
        console.log('navigateToMessageDetail', friend);
    }

	const showUserInformation = () => {
		//TODO: update later
		console.log('showUserInformation', friend);
	}

	const refetchUser = async () => {
		const store = await getStoreAsync();
		store.dispatch(friendsActions.fetchListFriends());
	}

	return (
		<TouchableOpacity style={styles.friendItem} onPress={() => showUserInformation()}>
			<View>
				<Image source={{ uri: friend.user.avatar_url }} style={styles.friendAvatar} />
				{!isPendingFriendRequest ? (
					<View style={[styles.statusCircle, userStatus ? styles.online : styles.offline]} />
				): null}
			</View>
			<View style={styles.fill}>
				<View style={styles.friendItemContent}>
					<View style={styles.textContent}>
						{isPendingFriendRequest ? (
							<Text style={[styles.defaultText, isPendingFriendRequest && styles.whiteText]}>{friend.user.display_name}</Text>
						): null}
						<Text style={styles.defaultText}>{friend.user.username}</Text>
					</View>
					{isFriend ? (
						<View style={styles.friendAction}>
							<Pressable onPress={() => handlePhoneCall()}>
								<CallIcon width={18} height={18} color={Colors.textGray} />
							</Pressable>
							<Pressable onPress={() => navigateToMessageDetail()}>
								<MessageIcon width={25} height={18} color={Colors.textGray} />
							</Pressable>
						</View>
					): null}
                    
					{isPendingFriendRequest ? (
						<View style={styles.friendAction}>
							<Pressable onPress={() => deleteFriendRequest()}>
								<CloseIcon width={18} height={18} color={Colors.textGray} />
							</Pressable>
							{!isSentRequestFriend ? (
								<Pressable onPress={() => approveFriendRequest()} style={styles.approveIcon}>
									<CheckIcon width={25} height={18} color={Colors.white} />
								</Pressable>
							): null}
						</View>
					): null}
				</View>
			</View>
		</TouchableOpacity>
	)
})

export const SeparatorWithSpace = () => {
	return (
		<View style={{height: size.s_8}} />
	)
}

export const SeparatorWithLine = () => {
	return (
		<View style={styles.line} />
	)
}