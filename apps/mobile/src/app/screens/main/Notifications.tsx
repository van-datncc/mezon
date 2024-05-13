import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MemberListStatus from '../../components/member'
import CategoryDrawer from '../../components/category';
import { useRef } from 'react';

const Notifications = () => {
    const ref = useRef<{ open: () => {} }>();

    function handlePress() {
        console.log('Hello');
        ref && ref.current && ref.current.open()
        console.log(ref.current);
    }

    return (
        <>
            <View>
                <TouchableOpacity onPress={handlePress}>
                    <Text>Hello</Text>
                </TouchableOpacity>
                
                <CategoryDrawer ref={ref} />
            </View>

            <MemberListStatus />
        </>
    )
}

export default Notifications

const styles = StyleSheet.create({})
