import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import BottomNavigator from './BottomNavigator';

const Stack = createStackNavigator();

const ClanNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
        </Stack.Navigator>
    );
};

export default ClanNavigator;
