import { Text, useTheme } from '@mezon/mobile-ui';
import { selectMemberByUserId } from '@mezon/store';
import { convertTimeString } from '@mezon/utils';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from './styles';

export const InfoUserMessage = React.memo(({ message, showUserInformation, onPress, senderDisplayName }: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const user = useSelector(selectMemberByUserId(message?.sender_id));

	const isCombine = !message?.isStartedMessageGroup;
	const isShowInfoUser = !isCombine || !!(!!message?.references?.length && !!user);

	if (isShowInfoUser || showUserInformation) {
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.messageBoxTop}>
				<Text style={styles.userNameMessageBox}>{senderDisplayName}</Text>
				<Text style={styles.dateMessageBox}>{message?.create_time ? convertTimeString(message?.create_time) : ''}</Text>
			</TouchableOpacity>
		);
	}

	return <View style={styles.wrapperAvatarCombine} />;
});
