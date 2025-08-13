import { Attributes, Fonts, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
    StyleSheet.create({
        description: {
            color: colors.text,
            fontSize: size.s_14,
            textAlign: 'left',
        },
        dropdownContainer: {
            marginTop: size.s_12,
        },
        label: {
            color: colors.textStrong,
            fontSize: size.s_14,
            fontWeight: '600',
            marginBottom: size.s_8,
        },
        dropdownButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.primary,
            borderRadius: size.s_8,
            padding: size.s_10,
            borderWidth: 1,
            borderColor: colors.border,
        },
        dropdownText: {
            color: colors.text,
            fontSize: Fonts.size.h7,
            flex: 1,
        },
    }); 