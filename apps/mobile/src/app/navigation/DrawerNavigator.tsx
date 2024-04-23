import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { HEIGHT } from '../constants/config';
import MessagesScreen from '../screens/main/MessagesScreen';
import Feather from 'react-native-vector-icons/Feather'
import ServersScreen from '../screens/main/ClanScreen';
import { darkColor } from '../constants/Colors';
import CustomDrawerContent from '../components/ClanScreen/CustomDrawerContent';
const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ navigation }) => {
    return (
        <>
            <Drawer.Navigator initialRouteName="Servers"
                drawerContent={props => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: darkColor.Backgound_Primary,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },

                    drawerStyle: {
                        backgroundColor: '#c6cbef',
                        width: "90%",
                        height: HEIGHT,

                    },
                    headerRight: () => (
                        <View
                            style={{
                                width: '100%',
                                height: 50,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Feather size={20} name="chevron-right" style={{ color: '#FFFFFF' }} />
                            </View>
                            <View style={{ flexDirection: 'row', marginRight: 10 }}>
                                <View style={{ borderRadius: 100, backgroundColor: '#323232', width: 35, height: 35, alignItems: 'center', justifyContent: 'center' }}>
                                    <Feather size={20} name="search" style={{ color: '#FFFFFF' }} />
                                </View>

                            </View>
                        </View>
                    ),
                }}>

                <Drawer.Screen name="Servers"
                    // options={{
                    //     drawerIcon: ({ focused, size }) => (
                    //         <Feather
                    //             name="arrow-left"
                    //             size={size}
                    //             color={focused ? '#f4511e' : '#333'}
                    //         />
                    //     ),
                    // }} 
                    component={ServersScreen} />
                <Drawer.Screen name="Messages" component={MessagesScreen} />


            </Drawer.Navigator>

        </>
    );
}

export default DrawerNavigator

const styles = StyleSheet.create({})