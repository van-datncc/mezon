import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

function useBackHardWare() {
	const navigation = useNavigation<any>();

	useEffect(() => {
		const backAction = () => {
			navigation.goBack();
			return true;
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		return () => {
			backHandler.remove();
		};
	}, [navigation]);
}

export default useBackHardWare;
