import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { PanGestureHandler } from 'react-native-gesture-handler'
import { darkColor } from '../../../constants/Colors'
import ServerNavbar from '../firstSheets/ServerNavbar'
import ServerDetail from '../firstSheets/ServerDetail'
import Animated, { useAnimatedGestureHandler, withTiming } from 'react-native-reanimated'
import { START_WIDTH } from '../../../constants/config'
import { PanGestureHandler } from 'react-native-gesture-handler'
const FirstSheet = ({ sheetAnimVal, activeSheet }) => {
    const handleGesture = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.x = sheetAnimVal.value;
        },
        onActive: (event, ctx) => {
            if (event.translationX < 0) {
                sheetAnimVal.value = event.translationX + ctx.x;
            }
        },
        onEnd: (event, ctx) => {
            if (event.translationX < START_WIDTH / 2) {
                sheetAnimVal.value = withTiming(1);
                activeSheet.value = 2;
            } else {
                sheetAnimVal.value = withTiming(ctx.x);
                activeSheet.value = 1;
            }
        },
    });
    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
            <Animated.View style={[styles.firstSheetContainer]}>
                <ServerNavbar />
                <ServerDetail />
            </Animated.View>
        </PanGestureHandler>
    )
}

export default FirstSheet

const styles = StyleSheet.create({
    firstSheetContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        backgroundColor: darkColor.Background_Secondary
    }
})