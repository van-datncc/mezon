import { useReference } from '@mezon/core';
import { AngleRight, ArrowLeftIcon, HashSignIcon, HashSignLockIcon } from '@mezon/mobile-components';
import { Colors, size } from '@mezon/mobile-ui';
import { selectCurrentChannel } from '@mezon/store-mobile';
import { ChannelStatusEnum } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { CardStyleInterpolators, TransitionSpecs, createStackNavigator } from '@react-navigation/stack';
import { ChannelType } from 'mezon-js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@mezon/mobile-ui';
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
	const navigation = useNavigation();
	const [isChannel, setIsChannel] = useState<boolean>();
	const currentChannel = useSelector(selectCurrentChannel);
	useEffect(() => {
		setIsChannel(!!currentChannel?.channel_label && !Number(currentChannel?.parrent_id));
	}, [currentChannel]);
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
					headerTitle: () => <Text></Text>,
					headerLeft: () => (
						<View style={styles.headerLeft}>
							<TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
								<ArrowLeftIcon />
							</TouchableOpacity>
							<View>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									{!openThreadMessageState && (
										<View style={{ marginRight: size.s_10 }}>
											{currentChannel?.channel_private === ChannelStatusEnum.isPrivate &&
											currentChannel?.type === ChannelType.CHANNEL_TYPE_TEXT ? (
												<HashSignLockIcon width={20} height={20} color={Colors.white} />
											) : (
												<HashSignIcon width={18} height={18} />
											)}
										</View>
									)}
									<Text style={{ color: Colors.white, fontSize: size.h6 , fontWeight: '700'}}>
										{openThreadMessageState ? 'New Thread' : currentChannel?.channel_label}
									</Text>
									<AngleRight width={14} height={14} style={{ marginLeft: size.s_10 }}></AngleRight>
								</View>
								{openThreadMessageState && (
									<Text style={{ color: Colors.textGray, fontSize: size.medium, fontWeight: '400' }}>
										{currentChannel?.channel_label}
									</Text>
								)}
							</View>
						</View>
					),
					headerTitleStyle: {
						color: Colors.white,
					},
					headerStyle: {
						backgroundColor: Colors.secondary,
					},
					headerLeftLabelVisible: false,
					headerTintColor: Colors.white,
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
								{isChannel
									? t('notifySettingThreadModal.headerTitleMuteChannel')
									: t('notifySettingThreadModal.headerTitleMuteThread')}
							</Text>
							<Text style={{ color: Colors.textGray, fontSize: size.medium, fontWeight: '400' }}>
								{isChannel ? `#${currentChannel?.channel_label}` : `"${currentChannel?.channel_label}"`}
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
					headerLeftLabelVisible: false,
				}}
			/>
		</Stack.Navigator>
	);
};

const styles = StyleSheet.create({
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	btnBack: {
		paddingLeft: size.s_16,
		paddingRight: size.s_14,
		height: '100%',
		justifyContent: 'center',
	},
});
