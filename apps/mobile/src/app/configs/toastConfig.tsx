
import { BaseToast, ToastConfig } from 'react-native-toast-message';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@mezon/mobile-ui';

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '80%',
        backgroundColor: Colors.surface,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftColor: 'transparent',
        paddingHorizontal: 20,
    },
    iconWrapper: {
        width: 20,
        height: 20,
    }
});

const WrapperIcon = ({ children }) => {
    return (
        <View style={styles.iconWrapper}>
            {children}
        </View>
    );
}

export const toastConfig: ToastConfig = {
	/*
        Custom toast:
        They will be passed when calling the `show` method
    */

    success: (props) => {
        return (
            <BaseToast
                style={styles.container}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={[{
                    fontSize: 20,
                    fontWeight: '600',
                    color: 'white',
                }, props.text1Style]}
                text2Style={[{
                    fontSize: 15,
                    fontWeight: '400',
                    color: 'white',
                }, props.text2Style]}
                text1={props.props.text1}
                text2={props.props.text2}
                renderLeadingIcon={() => <WrapperIcon>{props.props?.leadingIcon}</WrapperIcon>}
                renderTrailingIcon={() => <WrapperIcon>{props.props?.trailingIcon}</WrapperIcon>}
            />
        )
    },
};