import { Dimensions, Image, StyleSheet, Text, View, ScrollView, Pressable, TextInput } from 'react-native'
import React from 'react'
import { darkColor } from '../../../constants/Colors'
import Feather from 'react-native-vector-icons/Feather'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { END_WIDTH, HEIGHT, START_WIDTH, WIDTH } from '../../../constants/config'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Images from 'apps/mobile/src/assets/Images'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

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
                        <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Feather name="arrow-left" size={25} style={{ color: '#FFFFFF' }} />
                            <View style={{ position: 'absolute', top: 25, left: 16, backgroundColor: 'red', borderRadius: 50, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#FFFFFF' }}>1</Text>
                            </View>
                            <Text style={{ color: '#FFFFFF', fontSize: 32 }}>#</Text>
                            <Text style={{ color: '#FFFFFF', fontSize: 20 }}>nhacuachung</Text>
                            <Feather size={20} name="chevron-right" style={{ color: '#FFFFFF' }} />
                        </View>
                        <View style={{ flexDirection: 'row', marginRight: 10 }}>
                            <View style={{ borderRadius: 100, backgroundColor: '#323232', width: 35, height: 35, alignItems: 'center', justifyContent: 'center' }}>
                                <Feather size={20} name="search" style={{ color: '#FFFFFF' }} />
                            </View>

                        </View>
                    </View>
                </View>
                {/* body */}
                <ScrollView style={{
                    flex: 1,
                    paddingLeft: 8,

                }} nestedScrollEnabled={true}>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>


                            </View>

                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View >
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>
                            </View>
                            <View style={{ width: 20, height: 20 }}>
                                <Pressable style={styles.iconBackgound}>
                                    <Text>😊</Text>
                                </Pressable>

                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View >
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>
                            </View>
                            <View style={{ width: 20, height: 20 }}>
                                <Pressable style={styles.iconBackgound}>
                                    <Text>😊</Text>
                                </Pressable>

                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View >
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>
                            </View>
                            <View style={{ width: 20, height: 20 }}>
                                <Pressable style={styles.iconBackgound}>
                                    <Text>😊</Text>
                                </Pressable>

                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View >
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>
                            </View>
                            <View style={{ width: 20, height: 20 }}>
                                <Pressable style={styles.iconBackgound}>
                                    <Text>😊</Text>
                                </Pressable>

                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>


                            </View>

                        </View>
                    </View><View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>


                            </View>

                        </View>
                    </View><View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>


                            </View>

                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>


                            </View>

                        </View>
                    </View><View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>


                            </View>

                        </View>
                    </View><View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.DISCORDROUNDED} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hoai Son</Text>
                                <Text style={{ color: '#535353', fontSize: 12 }}>Yesterday at 3.00 pm</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#FFFFFF' }}>* Report daily</Text>


                            </View>

                        </View>
                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 60, backgroundColor: darkColor.Background_Secondary, alignItems: 'center', flexDirection: 'row', gap: 12, paddingRight: 16 }}>
                    <Pressable style={{ backgroundColor: darkColor.Backgound_Disabled, width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                        <Feather name="plus" size={30} style={{ color: darkColor.Content_Secondary }} />
                    </Pressable>
                    <Pressable style={{ backgroundColor: darkColor.Backgound_Disabled, width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                        <Feather name="grid" size={30} style={{ color: darkColor.Content_Secondary }} />
                    </Pressable>
                    <Pressable style={{ backgroundColor: darkColor.Backgound_Disabled, width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                        <Feather name="gift" size={30} style={{ color: darkColor.Content_Secondary }} />
                    </Pressable>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', borderRadius: 50, backgroundColor: darkColor.Backgound_Disabled }}>
                        <TextInput style={{ flex: 1 }} />
                        <Pressable style={{ backgroundColor: darkColor.Backgound_Disabled, justifyContent: 'center', alignItems: 'center', borderRadius: 50, marginRight: 10 }}>
                            <MaterialIcons name="sentiment-satisfied-alt" size={30} style={{ color: darkColor.Content_Secondary }} />
                        </Pressable>
                    </View>

                    <Pressable style={{ backgroundColor: darkColor.Backgound_Disabled, width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                        <Feather name="mic" size={30} style={{ color: darkColor.Content_Secondary }} />
                    </Pressable>
                </View>
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
        marginLeft: 8,
        marginRight: 8,
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
        width: '100%',
        height: 60,
        backgroundColor: darkColor.Background_Secondary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 8,
        alignItems: 'center',
    },
    iconBackgound: {
        width: 30, height: 30, backgroundColor: '#535353', borderRadius: 8, justifyContent: 'center', alignItems: 'center'
    }
})