import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (themeValue: Attributes) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: size.s_20,
            paddingVertical: size.s_12,
            marginHorizontal: size.s_8,
            marginVertical: size.s_6,
            borderRadius: size.s_6,
            backgroundColor: themeValue.bgBrown,
            borderLeftWidth: size.s_4,
            borderLeftColor: themeValue.borderWarning,
        },
        text: {
            fontSize: size.s_14,
            fontWeight: '500',
            color: themeValue.textWarning
        }
    });