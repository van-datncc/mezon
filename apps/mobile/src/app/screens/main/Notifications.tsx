import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MemberListStatus from '../../components/MemberStatus'
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN } from '../../navigation/ScreenTypes';

const Notifications = () => {
    return (
        <>
            <MemberListStatus />
        </>
    )
}

export default Notifications

const styles = StyleSheet.create({})
