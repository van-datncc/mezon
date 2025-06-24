import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            top: -size.s_28,
            zIndex: 10
        },
        headerText: {
            fontSize: size.small,
            color: colors.textStrong,
            backgroundColor: colors.secondary,
            paddingHorizontal: size.s_4,
            paddingVertical: size.s_4,
            borderRadius: size.s_8,
            textAlign: 'center',
            borderWidth: 1,
            borderColor: colors.border
        },
        cancelButton: {
            position: 'absolute',
            right: -size.s_8,
            top: -size.s_10,
            width: size.s_20,
            height: size.s_20,
            borderRadius: size.s_12,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border
        },
    });