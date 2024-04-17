import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import FirstSheet from '../../components/servers/Servers/FirstSheet';
import SecondSheet from '../../components/servers/Servers/SecondSheet';
import ThirdSheet from '../../components/servers/Servers/ThirdSheet';
import { darkColor } from '../../constants/Colors';
import { useSharedValue } from 'react-native-reanimated';
const ServersScreen = () => {
    // const signOutWithGoogle = async () => {
    //     try {
    //         await GoogleSignin.revokeAccess();
    //         await GoogleSignin.signOut();
    //         console.log('Successfully signed out');
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    const sheetAnimVal = useSharedValue(0);
    const activeSheet = useSharedValue(2);
    return (
        <>
            <StatusBar backgroundColor={darkColor.Border_Focus} />
            <View style={styles.container}>
                <FirstSheet sheetAnimVal={sheetAnimVal} activeSheet={activeSheet} />
                <ThirdSheet sheetAnimVal={sheetAnimVal} activeSheet={activeSheet} />
                <SecondSheet sheetAnimVal={sheetAnimVal} activeSheet={activeSheet} />
            </View></>

    )
}

export default ServersScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    }
})