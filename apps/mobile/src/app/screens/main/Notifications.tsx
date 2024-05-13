import { StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { APP_SCREEN } from "../../navigation/ScreenTypes";
import MemberListStatus from '../../components/member'

const Notifications = () => {
    const navigation = useNavigation();

    const onDetail = () => {
        // Example for navigation detail screen
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigation.push(APP_SCREEN.NOTIFICATION.STACK, {
            screen: APP_SCREEN.NOTIFICATION.DETAIL,
        });
    };

    return (
        <MemberListStatus />
    )
}

export default Notifications

const styles = StyleSheet.create({})
