import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { STORAGE_AGREED_POLICY, load, save } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { channelMembersActions, selectCurrentChannel, useAppDispatch } from '@mezon/store-mobile';
import { checkIsThread, isPublicChannel } from '@mezon/utils';
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { setTimeout } from '@testing-library/react-native/build/helpers/timers';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonBottomSheet from '../../../componentUI/MezonBottomSheet';
import NotificationSetting from '../../../components/NotificationSetting';
import ShareLocationConfirmModal from '../../../components/ShareLocationConfirmModal';
import ChannelMessagesWrapper from './ChannelMessagesWrapper';
import { ChatBox } from './ChatBox';
import DrawerListener from './DrawerListener';
import HomeDefaultHeader from './HomeDefaultHeader';
import PanelKeyboard from './PanelKeyboard';
import { IModeKeyboardPicker } from './components';
import LicenseAgreement from './components/LicenseAgreement';
import { style } from './styles';

const HomeDefault = React.memo((props: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const currentChannel = useSelector(selectCurrentChannel);
	const timeoutRef = useRef<any>(null);
	const [isFocusChannelView, setIsFocusChannelView] = useState(false);
	const [isShowLicenseAgreement, setIsShowLicenseAgreement] = useState<boolean>(false);
	const navigation = useNavigation<any>();

	const dispatch = useAppDispatch();
	const panelKeyboardRef = useRef(null);
	const prevChannelIdRef = useRef<string>();

	const onShowKeyboardBottomSheet = useCallback((isShow: boolean, type?: IModeKeyboardPicker) => {
		if (panelKeyboardRef?.current) {
			panelKeyboardRef.current?.onShowKeyboardBottomSheet(isShow, type);
		}
	}, []);

	const isChannelApp = useMemo(() => currentChannel?.type === ChannelType?.CHANNEL_TYPE_APP, [currentChannel?.type]);

	const onOpenDrawer = useCallback(() => {
		requestAnimationFrame(async () => {
			navigation.dispatch(DrawerActions.openDrawer());
			onShowKeyboardBottomSheet(false, 'text');
			Keyboard.dismiss();
		});
	}, [navigation, onShowKeyboardBottomSheet]);

	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ['50%'], []);
	const [isShowSettingNotifyBottomSheet, setIsShowSettingNotifyBottomSheet] = useState<boolean>(false);

	const openBottomSheet = () => {
		Keyboard.dismiss();
		setIsShowSettingNotifyBottomSheet(!isShowSettingNotifyBottomSheet);
		timeoutRef.current = setTimeout(() => {
			bottomSheetRef.current?.present();
		}, 200);
	};

	const fetchMemberChannel = useCallback(async () => {
		if (!currentChannel) {
			return;
		}
		await dispatch(
			channelMembersActions.fetchChannelMembers({
				clanId: currentChannel?.clan_id || '',
				channelId: currentChannel?.channel_id || '',
				channelType: currentChannel?.type
			})
		);
	}, [currentChannel, dispatch]);

	useFocusEffect(
		useCallback(() => {
			setIsFocusChannelView(true);
			if (prevChannelIdRef.current !== currentChannel?.channel_id) {
				fetchMemberChannel();
			}
			prevChannelIdRef.current = currentChannel?.channel_id;
			return () => {
				setIsFocusChannelView(false);
			};
		}, [currentChannel?.channel_id])
	);

	useEffect(() => {
		const timeout = setTimeout(() => {
			checkShowLicenseAgreement();
		}, 500);
		return () => {
			timeoutRef?.current && clearTimeout(timeoutRef.current);
			clearTimeout(timeout);
		};
	}, []);

	const checkShowLicenseAgreement = async () => {
		const isAgreed = await load(STORAGE_AGREED_POLICY);

		setIsShowLicenseAgreement(Platform.OS === 'ios' && isAgreed?.toString() !== 'true');
	};

	return (
		<View style={[styles.homeDefault]}>
			<LicenseAgreement
				show={isShowLicenseAgreement}
				onClose={() => {
					setIsShowLicenseAgreement(false);
					save(STORAGE_AGREED_POLICY, 'true');
				}}
			/>
			<DrawerListener channelId={currentChannel?.channel_id} />
			<HomeDefaultHeader
				openBottomSheet={openBottomSheet}
				navigation={props.navigation}
				currentChannel={currentChannel}
				onOpenDrawer={onOpenDrawer}
			/>
			{currentChannel && isFocusChannelView && !isChannelApp && (
				<KeyboardAvoidingView style={styles.channelView} behavior={'padding'} keyboardVerticalOffset={Platform.OS === 'ios' ? 54 : 0}>
					<ChannelMessagesWrapper
						channelId={currentChannel?.channel_id}
						clanId={currentChannel?.clan_id}
						isPublic={isPublicChannel(currentChannel)}
						mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
					/>
					<ChatBox
						channelId={currentChannel?.channel_id}
						mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
						onShowKeyboardBottomSheet={onShowKeyboardBottomSheet}
					/>
					<PanelKeyboard ref={panelKeyboardRef} currentChannelId={currentChannel.channel_id} currentClanId={currentChannel?.clan_id} />
					<ShareLocationConfirmModal
						channelId={currentChannel?.channel_id}
						mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
					/>
				</KeyboardAvoidingView>
			)}

			<MezonBottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
				<NotificationSetting />
			</MezonBottomSheet>
		</View>
	);
});

export default HomeDefault;
