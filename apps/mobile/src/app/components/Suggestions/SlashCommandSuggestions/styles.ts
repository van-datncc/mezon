import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.secondary,
            borderRadius: size.s_8,
            maxHeight: size.s_220,
        },
        listContainer: {
            flex: 1,
        },
        headerTitle: {
            fontSize: size.small,
            fontWeight: 'bold',
            color: colors.textStrong,
            textTransform: 'uppercase'
        },
        commandItem: {
            padding: size.s_8,
            borderBottomWidth: 1,
            borderBottomColor: colors.border
        },
        commandDisplay: {
            fontSize: size.medium,
            fontWeight: 'bold',
            color: colors.textStrong
        },
        commandDescription: {
            fontSize: size.small,
            color: colors.text,
            marginTop: size.s_4
        }
    });