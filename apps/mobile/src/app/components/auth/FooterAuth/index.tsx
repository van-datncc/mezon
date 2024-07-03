import { View } from 'react-native';
import { Text } from 'react-native';
import React from 'react'
import { useTheme } from '@mezon/mobile-ui';
import { style } from './styles';
interface FooterAuthProps {
    content: string;
    title: string;
    onPress?: () => void;

}
const FooterAuth: React.FC<FooterAuthProps> = ({ onPress, content, title }) => {
    const styles = style(useTheme().themeValue)
    return (
        <View style={styles.signupContainer}>
            <Text style={styles.accountText}>{content}   </Text>
            <Text
                style={styles.signupText}
                onPress={onPress}
            >
                {title}
            </Text>
        </View>
    )
}

export default FooterAuth
