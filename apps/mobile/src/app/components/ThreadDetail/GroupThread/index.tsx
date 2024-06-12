import { Text, View } from 'react-native';
import { styles } from './GroupThread.style';

type GroupThreadsProps = {
	title: string;
	children: React.ReactNode;
};
const GroupThread = ({ title, children }: GroupThreadsProps) => {
	return (
		<View>
			<Text style={styles.title}>{title}</Text>
			<View style={styles.groupThread}>{children}</View>
		</View>
	);
};

export default GroupThread;
