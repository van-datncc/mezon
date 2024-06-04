import { useReference } from '@mezon/core';
import { AngleRight, SearchIcon } from '@mezon/mobile-components';
import { Colors, size } from '@mezon/mobile-ui';
import { selectCurrentChannel } from '@mezon/store-mobile';
import { CardStyleInterpolators, TransitionSpecs, createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MuteThreadDetailModal from '../../../components/MuteThreadDetailModal';
import CreateThreadModal from '../../../components/ThreadDetail';
import CreateThreadForm from '../../../components/ThreadDetail/CreateThreadForm';
import MenuThreadDetail from '../../../components/ThreadDetail/MenuThreadDetail';
import ThreadAddButton from '../../../components/ThreadDetail/ThreadAddButton';
import { APP_SCREEN } from '../../ScreenTypes';

export const MenuThreadDetailStacks = ({}: any) => {
	const Stack = createStackNavigator();
	const { t } = useTranslation(['notificationSetting']);
	const { openThreadMessageState } = useReference();
	const currentChannel = useSelector(selectCurrentChannel);
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				headerShadowVisible: false,
				gestureEnabled: true,
				gestureDirection: 'horizontal',
				transitionSpec: {
					open: TransitionSpecs.TransitionIOSSpec,
					close: TransitionSpecs.TransitionIOSSpec,
				},
				cardStyle: { backgroundColor: Colors.secondary },
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}
		>
			<Stack.Screen
				name={APP_SCREEN.MENU_THREAD.BOTTOM_SHEET}
				component={MenuThreadDetail}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name={APP_SCREEN.MENU_THREAD.CREATE_THREAD}
				component={CreateThreadModal}
				options={{
					headerShown: true,
					headerTitle: 'Threads',
					headerTitleStyle: {
						color: Colors.white,
					},
					headerStyle: {
						backgroundColor: Colors.secondary,
					},
					headerLeftLabelVisible: false,
					headerTintColor: Colors.white,
					headerRight: () => <ThreadAddButton />,
				}}
			/>
			<Stack.Screen
				name={APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL}
				component={CreateThreadForm}
				options={{
					headerShown: true,
					headerTitle: () =>
						openThreadMessageState ? (
							<View>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text style={{ color: Colors.white, fontSize: size.h6 }}>New Thread</Text>
									<AngleRight width={14} height={14} style={{marginLeft: size.s_10}}></AngleRight>
								</View>
								<Text style={{ color: Colors.textGray, fontSize: size.medium, fontWeight: '400' }}>
									{currentChannel?.channel_label}
								</Text>
							</View>
						) : (
							<Text style={{ color: Colors.white, fontSize: size.h5 }}>{currentChannel?.channel_label}</Text>
						),
					headerTitleStyle: {
						color: Colors.white,
					},
					headerStyle: {
						backgroundColor: Colors.secondary,
					},
					headerLeftLabelVisible: false,
					headerTintColor: Colors.white,
					headerRight: () => (
						<View style={{ padding: size.s_10 }}>
							<SearchIcon width={22} height={22} />
						</View>
					),
				}}
			/>
			<Stack.Screen
				name={APP_SCREEN.MENU_THREAD.MUTE_THREAD_DETAIL_CHANNEL}
				component={MuteThreadDetailModal}
				options={{
					headerShown: true,
					headerTitle: () => (
						<View>
							<Text style={{ color: Colors.white, fontSize: size.label, fontWeight: '700' }}>
								{t('notifySettingThreadModal.headerTitle')}
							</Text>
							<Text style={{ color: Colors.textGray, fontSize: size.medium, fontWeight: '400' }}>
								"{currentChannel?.channel_label}""
							</Text>
						</View>
					),
					headerTitleStyle: {
						color: Colors.white,
					},
					headerStyle: {
						backgroundColor: Colors.secondary,
					},
					headerTintColor: Colors.white,
				}}
			/>
		</Stack.Navigator>
	);
};
