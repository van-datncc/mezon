import { size } from '@mezon/mobile-ui';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import PlusIcon from '../../../../assets/svg/plus.svg';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
export default function ThreadAddButton() {
	const navigation = useNavigation<any>();
	return (
		<TouchableHighlight
			onPress={() => navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL })}
			style={{ padding: size.s_10 }}
		>
			<PlusIcon width={22} height={22} />
		</TouchableHighlight>
	);
}
