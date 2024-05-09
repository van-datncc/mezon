import { selectMemberByUserId } from '@mezon/store';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { FastImageRes } from './Reusables';
import { styles } from './styles';

const MessageBox = React.memo((props: { data: any }) => {
	const user = useSelector(selectMemberByUserId(props?.data?.sender_id));

	return (
		<View style={styles.wrapperMessageBox}>
			<View style={{ width: 40, height: 40, borderRadius: 50, overflow: 'hidden' }}>
				<FastImageRes uri={user?.user?.avatar_url} />
			</View>
			<View style={styles.rowMessageBox}>
				<View style={styles.messageBoxTop}>
					<Text style={styles.userNameMessageBox}>{user?.user?.username}</Text>
					<Text style={styles.dateMessageBox}>{props?.data?.date}</Text>
				</View>
				<View>
					<Text style={styles.contentMessageBox}>{props?.data?.content?.t}</Text>
				</View>
			</View>
		</View>
	);
});

export default MessageBox;
