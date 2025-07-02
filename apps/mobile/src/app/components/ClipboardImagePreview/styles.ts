import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, message: string) =>
    StyleSheet.create({
        content: {
            borderRadius: size.s_8,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.secondary,
            padding: size.s_4,
            width: size.s_100,
            height: size.s_100,
            gap: size.s_2
        },
        image: {
            width: '100%',
            height: message ? '80%' : '100%'
        },
        messageContainer: {
            flex: 1
        },
        message: {
            fontSize: size.s_12,
            color: colors.text,
            textAlign: 'center'
        },
        cancelButton: {
            position: 'absolute',
            top: -size.s_10,
            right: -size.s_8,
            borderRadius: size.s_12,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border
        }
    });
