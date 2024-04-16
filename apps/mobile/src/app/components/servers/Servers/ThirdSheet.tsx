import { StyleSheet, Text, View } from 'react-native';
import React from 'react'
import { darkColor } from '../../../constants/Colors';
const ThirdSheet = () => {
    return (
        <View style={styles.thirdSheetContainer}>
            <View style={styles.thirdSheetStyle}>
                <Text>ThirdSheet</Text>

            </View>
        </View>
    )
}

export default ThirdSheet

const styles = StyleSheet.create({
    thirdSheetContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thirdSheetStyle: {
        width: '80%',
        borderRadius: 8,
        height: '98%',
        alignSelf: 'flex-end',
        backgroundColor: darkColor.Border_Focus,
    },
})