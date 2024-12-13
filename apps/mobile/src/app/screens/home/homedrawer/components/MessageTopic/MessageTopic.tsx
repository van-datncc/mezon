import { Block, size, useTheme } from '@mezon/mobile-ui';
import { MessagesEntity, topicsActions, useAppDispatch } from '@mezon/store-mobile';
import { TypeMessage, convertTimeString } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MezonAvatar } from '../../../../../componentUI';
import { APP_SCREEN } from '../../../../../navigation/ScreenTypes';
import { style } from './styles';

const MessageTopic = ({ message }: { message: MessagesEntity }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();
	const handleOpenTopic = () => {
		dispatch(topicsActions.setValueTopic(message));
		navigation.navigate(APP_SCREEN.MESSAGES.STACK, {
			screen: APP_SCREEN.MESSAGES.TOPIC_DISCUSSION
		});
	};
	if (message?.code !== TypeMessage.Topic) return null;
	return (
		<TouchableOpacity onPress={handleOpenTopic}>
			<Block marginTop={size.s_2} flexDirection="row" alignItems="center" gap={size.s_8}>
				<MezonAvatar avatarUrl={message?.avatar} username={message?.username} width={size.s_30} height={size.s_30}></MezonAvatar>
				<Text style={styles.repliesText}>2 replies</Text>
				<Text style={styles.dateMessageBox}>{message?.create_time ? convertTimeString(message?.create_time) : ''}</Text>
			</Block>
		</TouchableOpacity>
	);
};

export default React.memo(MessageTopic);
