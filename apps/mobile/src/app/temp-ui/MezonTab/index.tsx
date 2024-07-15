import { ReactNode, useState } from 'react';
import { View } from 'react-native';
import MezonTabHeader from '../MezonTabHeader';
import MezonTabView from '../MezonTabView';
import styles from './styles';

interface IMezonTabProps {
	views: ReactNode[];
	titles: string[];
}

export default function MezonTab({ views, titles }: IMezonTabProps) {
	const [tab, setTab] = useState<number>(0);

	function handleTabChange(index: number) {
		setTab(index);
	}

	return (
		<View style={styles.container}>
			<MezonTabHeader tabIndex={tab} onChange={handleTabChange} tabs={titles} />

			<MezonTabView pageIndex={tab} onChange={handleTabChange} views={views} />
		</View>
	);
}
