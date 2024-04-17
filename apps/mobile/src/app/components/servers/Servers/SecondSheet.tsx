import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { darkColor } from '../../../constants/Colors'
import Feather from 'react-native-vector-icons/Feather'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { END_WIDTH, START_WIDTH, WIDTH } from '../../../constants/config'
import { PanGestureHandler } from 'react-native-gesture-handler'

const SecondSheet = ({ sheetAnimVal, activeSheet }) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: sheetAnimVal.value }],
        };
    });

    const handleGesture = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.x = sheetAnimVal.value;
        },
        onActive: (event, ctx) => {
            sheetAnimVal.value = event.translationX + ctx.x;
        },
        onEnd: (event, ctx) => {
            console.log(event.translationX);

            if (
                (activeSheet.value === 1 && event.translationX > 0) ||
                (activeSheet.value === 3 && event.translationX < 0)
            ) {
                sheetAnimVal.value = ctx.x;
            } else if (event.absoluteX > WIDTH / 2 && activeSheet.value === 2) {
                sheetAnimVal.value = withTiming(START_WIDTH);
                activeSheet.value = 1;
            } else if (event.translationX < -WIDTH / 2 && activeSheet.value === 2) {
                sheetAnimVal.value = withTiming(END_WIDTH);
                activeSheet.value = 3;
            } else if (activeSheet !== 2) {
                sheetAnimVal.value = withTiming(0);
                activeSheet.value = 2;
            }
        },
    });
    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
            <Animated.View style={[styles.secondSheetContainer, animatedStyle]}>
                {/* you can seperate this in its own component */}
                <View style={styles.headerContainer}>
                    <View style={styles.innerContainer}>
                        <Feather size={20} name="user" />
                        <View style={{ flexDirection: 'row' }}>
                            <Feather size={20} name="user" />
                            <View style={{ marginLeft: 20 }}>
                                <Feather size={20} name="user" />
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={{ color: 'white' }}>Second Sheet</Text>
            </Animated.View>
        </PanGestureHandler>
    )
}

export default SecondSheet

const styles = StyleSheet.create({
    secondSheetContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: darkColor.Backgound_Primary,
    },
    headerContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darkColor.Backgound_Primary,
    },
    innerContainer: {
        width: '90%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})