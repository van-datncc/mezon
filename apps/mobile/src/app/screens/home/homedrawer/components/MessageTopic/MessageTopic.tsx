import { size, useTheme } from '@mezon/mobile-ui';
import { MessagesEntity, topicsActions, useAppDispatch } from '@mezon/store-mobile';
import { convertTimeString } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MezonAvatar } from '../../../../../componentUI';
import { APP_SCREEN } from '../../../../../navigation/ScreenTypes';
import { style } from './styles';

const MessageTopic = ({ message, avatar }: { message: MessagesEntity; avatar: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();
	const handleOpenTopic = () => {
		dispatch(topicsActions.setValueTopic(message));
		dispatch(topicsActions.setCurrentTopicId(message?.content?.tp || ''));
		dispatch(topicsActions.setIsShowCreateTopic({ channelId: message?.channel_id as string, isShowCreateTopic: true }));
		navigation.navigate(APP_SCREEN.MESSAGES.STACK, {
			screen: APP_SCREEN.MESSAGES.TOPIC_DISCUSSION
		});
	};
	return (
		<TouchableOpacity onPress={handleOpenTopic} style={styles.container}>
			<MezonAvatar avatarUrl={avatar} username={message?.username} width={size.s_20} height={size.s_20}></MezonAvatar>
			<Text style={styles.repliesText}>view topic</Text>
			<Text style={styles.dateMessageBox}>{message?.create_time ? convertTimeString(message?.create_time) : ''}</Text>
		</TouchableOpacity>
	);
};

export default React.memo(MessageTopic);
