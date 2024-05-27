import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './styles';
import { EAddFriendBy, EAddFriendWays } from '../../../enum';
import { MezonButton, MezonModal } from 'apps/mobile/src/app/temp-ui';
import { useAuth, useFriends } from '@mezon/core';
import { useTranslation } from 'react-i18next';
import { Colors } from '@mezon/mobile-ui';
import { requestAddFriendParam } from '@mezon/store-mobile';

interface IAddFriendModal {
    type: EAddFriendWays;
    onClose: () => void
}

export const AddFriendModal = React.memo((props: IAddFriendModal) => {
    const { type, onClose } = props;
    const { userProfile } = useAuth();
    const { addFriend } = useFriends();
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [searchUsername, setSearchUsername] = useState<string>('');
    const [requestAddFriend, setRequestAddFriend] = useState<requestAddFriendParam>({
		usernames: [],
		ids: [],
	});
    const { t } = useTranslation('friends');
    const inputRef = useRef(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        setVisibleModal(type !== null);

        // if (type === EAddFriendWays.UserName) {
        //     timeoutId = setTimeout(() => {
        //         if (inputRef?.current) {
        //             inputRef.current.focus();
        //         }
        //     }, 300)
        // }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }, [type])

    const handleTextChange = (type: EAddFriendBy, text: string) => {
        switch (type) {
            case EAddFriendBy.Username:
                if ((text || '').trim().length) {
                    setRequestAddFriend({...requestAddFriend, usernames: [text]});
                } else {
                    setRequestAddFriend({...requestAddFriend, usernames: []});
                }
                break;
            case EAddFriendBy.Id:
                setRequestAddFriend({...requestAddFriend, ids: [text]})
            break;
            default:
                break;
        }
    }

    const onVisibleChange = (visible: boolean) => {
        if (!visible) {
            onClose();
        }
    }

    const resetField = () => {
		setRequestAddFriend({
			usernames: [],
			ids: [],
		});
	};

    const sentFriendRequest = async () => {
        const res = await addFriend(requestAddFriend);
        resetField();
    }

    const addFriendByUsernameContent = () => {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.addByUsernameContainer}
            >
                <View style={styles.fill}>
                    <Text>{t('addFriend.addByUserName')}</Text>
                    <Text>{t('addFriend.whoYouWantToAddFriend')}</Text>
                    <Text>{searchUsername}</Text>
                    <View style={styles.searchUsernameWrapper}>
                        <TextInput
                            ref={inputRef}
                            placeholder={t('addFriend.searchUsernamePlaceholder')}
                            placeholderTextColor={Colors.tertiary}
                            style={styles.searchInput}
                            onChangeText={(text) => handleTextChange(EAddFriendBy.Username, text)}
                        />
                    </View>
                    <Text>{t('addFriend.byTheWay')} {userProfile?.user?.username}</Text>
                </View>
                <View style={{paddingBottom: 50}}>
                    <MezonButton onPress={() => sentFriendRequest()} viewContainerStyle={{padding: 40}}>{t('addFriend.sendRequestButton')}</MezonButton>
                </View>
            </KeyboardAvoidingView>
        )
    }

    const findYourFriendContent = () => {
        return (
            <View>
                {/* TODO: update later */}
                <Text style={styles.whiteText}>Find Your Friend</Text>
                <Text style={styles.whiteText}>Let's see which of your contacts are already on Mezon</Text>
            </View>
        )
    }

    const content = useMemo(() => {
        switch (type) {
            case EAddFriendWays.FindFriend:
                return findYourFriendContent();
            case EAddFriendWays.UserName:
                return addFriendByUsernameContent();
            default:
                return <View />
        }
    }, [type])

    return (
        <MezonModal
            visible={visibleModal}
            visibleChange={onVisibleChange}
        >
            <View style={styles.addFriendModalContainer}>
                {content}
            </View>
        </MezonModal>
    )
})