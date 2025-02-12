import { Icons } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_SCREEN } from '../../../../../navigation/ScreenTypes';
import { style } from './styles';

type MessageSendTokenLogProps = {
	messageContent: string;
};

const MessageSendTokenLog = memo(({ messageContent }: MessageSendTokenLogProps) => {
	const { themeValue } = useTheme();
	const navigation = useNavigation<any>();
	const styles = style(themeValue);

	const [title, ...descriptionData] = messageContent.split(' | ');
	const description = descriptionData.join(' | ');

	const handleTransaction = () => {
		navigation.navigate(APP_SCREEN.SETTINGS.STACK, { screen: APP_SCREEN.SETTINGS.HISTORY_TRANSACTION });
	};

	return (
		<View style={{ flexDirection: 'row' }}>
			<View style={styles.container}>
				<View style={styles.info}>
					<Icons.Transaction height={size.s_50} width={size.s_50} color={baseColor.bgSuccess} />
					<View>
						<Text style={styles.title}>{title}</Text>
						<Text style={styles.transactionTitle}>
							{'Detail: '}
							<Text style={styles.lightTitle}>{description}</Text>
						</Text>
					</View>
				</View>
				<View style={styles.seperatedItem} />
				<TouchableOpacity style={styles.transaction} onPress={handleTransaction}>
					<Text style={styles.buttonTitle}>Mezon transfer</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
});

export default MessageSendTokenLog;
