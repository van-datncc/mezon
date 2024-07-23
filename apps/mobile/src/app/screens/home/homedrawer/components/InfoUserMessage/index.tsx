import { Text, useTheme } from '@mezon/mobile-ui';
import { convertTimeString } from '@mezon/utils';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { style } from './styles';

interface IProps {
	onPress: () => void;
	senderDisplayName: string;
	createTime: string;
	isShow: boolean;
}
export const InfoUserMessage = React.memo(({ createTime, isShow, onPress, senderDisplayName }: IProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	if (isShow) {
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.messageBoxTop}>
				<Text style={styles.userNameMessageBox}>{senderDisplayName}</Text>
				<Text style={styles.dateMessageBox}>{createTime ? convertTimeString(createTime) : ''}</Text>
			</TouchableOpacity>
		);
	}

	return <View style={styles.wrapperAvatarCombine} />;
});
