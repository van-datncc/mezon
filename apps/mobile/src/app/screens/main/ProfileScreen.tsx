import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { darkColor } from '../../constants/Colors'
import { HEIGHT, WIDTH } from '../../constants/config'
import Images from 'apps/mobile/src/assets/Images'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
const ProfileScreen = () => {
    return (
        <View style={{ backgroundColor: darkColor.Background_Secondary, width: WIDTH, height: HEIGHT, alignItems: 'center' }}>
            <View style={{ width: '100%', height: "15%", backgroundColor: darkColor.Content_Secondary }}>
                <View style={{ flexDirection: 'row', gap: 10, paddingTop: 15, justifyContent: 'flex-end', paddingRight: 15 }}>
                    <View style={{ backgroundColor: darkColor.Backgound_Disabled, width: 80, height: 30, borderRadius: 30, alignItems: 'center', justifyContent: 'center', gap: 5, flexDirection: 'row' }}>
                        <Entypo name='rdio' size={20} />
                        <Text>Nitro</Text>
                    </View>
                    <View style={{ backgroundColor: darkColor.Backgound_Disabled, width: 30, height: 30, borderRadius: 50, alignItems: 'center', justifyContent: 'center', gap: 5, flexDirection: 'row' }}>
                        <Feather name='settings' size={20} />
                    </View>
                </View>

                <View style={{ position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'gray', bottom: -50, left: 30, borderWidth: 5, borderColor: darkColor.Background_Secondary, }}>
                    <Image source={Images.ANH} style={{ width: '100%', height: '100%', borderRadius: 50 }} />
                    <View style={{ position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: 'green', bottom: 2, right: 0, borderWidth: 2, borderColor: darkColor.Background_Secondary }}></View>
                </View>
            </View>
            <View style={{ marginTop: 60, width: '90%', height: '20%', backgroundColor: darkColor.Backgound_Tertiary, justifyContent: 'center', borderRadius: 20, paddingLeft: 20, paddingRight: 20 }}>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 600 }}>son.NguyenHoai1</Text>
                    <Feather name="chevron-down" />
                </Pressable>
                <Text>son1522001</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <Pressable style={{ width: "48%", height: 40, flexDirection: 'row', backgroundColor: darkColor.Border_Selector, alignItems: 'center', justifyContent: 'center', borderRadius: 20, gap: 5 }}>
                        <Feather name="message-circle" size={20} />
                        <Text style={{ fontWeight: 'bold' }}>Add status</Text>
                    </Pressable>
                    <Pressable style={{ width: "48%", height: 40, flexDirection: 'row', backgroundColor: darkColor.Border_Selector, alignItems: 'center', justifyContent: 'center', borderRadius: 20, gap: 5 }}>
                        <MaterialIcons name="edit" size={20} />
                        <Text style={{ fontWeight: 'bold' }}>Edit Profile</Text>
                    </Pressable>
                </View>

            </View>
            <View style={{ marginTop: 20, width: '90%', height: '10%', backgroundColor: darkColor.Backgound_Tertiary, justifyContent: 'center', borderRadius: 20, paddingLeft: 20, paddingRight: 20 }}>
                <Text>Discord Member Since</Text>
                <Text>Jan 26, 2024</Text>
            </View>
            <Pressable style={{ marginTop: 20, width: '90%', height: '8%', backgroundColor: darkColor.Backgound_Tertiary, justifyContent: 'space-between', borderRadius: 20, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Text>Your friends</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={Images.ANH} style={{ width: 30, height: 30, borderRadius: 50, borderWidth: 2, borderColor: darkColor.Backgound_Tertiary }} />
                    <Image source={Images.ANH} style={{ width: 30, height: 30, borderRadius: 50, borderWidth: 3, borderColor: darkColor.Backgound_Tertiary, marginLeft: -6 }} />
                    <Image source={Images.ANH} style={{ width: 30, height: 30, borderRadius: 50, borderWidth: 3, borderColor: darkColor.Backgound_Tertiary, marginLeft: -6 }} />
                    <Feather name="chevron-right" size={20} />
                </View>
            </Pressable>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})