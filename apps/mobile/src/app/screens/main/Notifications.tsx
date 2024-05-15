import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MemberListStatus from '../../components/MemberStatus'
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN } from '../../navigation/ScreenTypes';

const Notifications = () => {
    const navigation = useNavigation();

    function handlePress() {
        // @ts-ignore
        navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, { screen: APP_SCREEN.MENU_CLAN.CREATE_CATEGORY });
    }

    return (
        <>
            <View>
                <TouchableOpacity onPress={handlePress}>
                    <Text>Hello</Text>
                </TouchableOpacity>
            </View>

            <MemberListStatus />
        </>
    )
}

export default Notifications

const styles = StyleSheet.create({})
