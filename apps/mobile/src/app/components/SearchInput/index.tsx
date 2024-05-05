import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { darkColor } from '../../constants/Colors'
interface SearchInputProps {
    placeholder: string
}
const SearchInput: React.FC<SearchInputProps> = ({ placeholder }) => {
    return (
        <View style={styles.container}>
            <Feather name="search" size={20} />
            <TextInput placeholder={placeholder} />
        </View>
    )
}

export default SearchInput

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        height: 80,
        backgroundColor: darkColor.Backgound_Primary,
        paddingLeft: 10,
        paddingRight: 10,
        gap: 10

    }
})