import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RBSheet from 'react-native-raw-bottom-sheet'
import { darkColor } from '../constants/Colors'
const BottomSheet = ({ bottomSheetRef, children }) => {
    return (
        <RBSheet
            ref={bottomSheetRef}
            height={300}
            openDuration={250}
            closeOnPressBack={true}

            closeOnPressMask={true}
            customStyles={{
                wrapper: {
                    backgroundColor: 'rgba(0,0,0,0.2)'
                },
                draggableIcon: { backgroundColor: darkColor.Backgound_Subtle, width: 100 },
                container: {
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30
                }
            }}>
            <View>{children}</View>
        </RBSheet>
    )
}

export default BottomSheet

const styles = StyleSheet.create({})