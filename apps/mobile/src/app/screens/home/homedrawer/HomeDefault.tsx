import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { ActionEmitEvent, UnMuteIcon } from '@mezon/mobile-components';
import { Colors } from '@mezon/mobile-ui';
import { selectCurrentChannel } from '@mezon/store-mobile';
import { ChannelStreamMode } from 'mezon-js';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter, Keyboard, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import BarsLogo from '../../../../assets/svg/bars-white.svg';
import HashSignIcon from '../../../../assets/svg/channelText-white.svg';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import ChannelMessages from './ChannelMessages';
import ChatBox from './ChatBox';
import AttachmentPicker from './components/AttachmentPicker';
import BottomKeyboardPicker, { IModeKeyboardPicker } from './components/BottomKeyboardPicker';
import EmojiPicker from './components/EmojiPicker';
import { styles } from './styles';
import Toast from "react-native-toast-message";
import ForwardMessageModal from './components/ForwardMessage';
import { useEffect } from 'react';
import { IMessageWithUser } from '@mezon/utils';
import { useFocusEffect } from '@react-navigation/native';
import NotificationSetting from '../../../components/NotificationSetting';

const HomeDefault = React.memo((props: any) => {
	const currentChannel = useSelector(selectCurrentChannel);
	const [heightKeyboardShow, setHeightKeyboardShow] = useState<number>(0);
	const [typeKeyboardBottomSheet, setTypeKeyboardBottomSheet] = useState<IModeKeyboardPicker>('text');
	const bottomPickerRef = useRef<BottomSheet>(null);
	const [showForwardModal, setShowForwardModal] = useState(false);
	const [isFocusChannelView, setIsFocusChannelView] = useState(false);
	const [messageForward, setMessageForward] = useState<IMessageWithUser>(null);

	const onShowKeyboardBottomSheet = (isShow: boolean, height: number, type?: IModeKeyboardPicker) => {
		setHeightKeyboardShow(height);
		if (isShow) {
			setTypeKeyboardBottomSheet(type);
			bottomPickerRef && bottomPickerRef.current && bottomPickerRef.current.collapse();
		} else {
			setTypeKeyboardBottomSheet('text');
			bottomPickerRef && bottomPickerRef.current && bottomPickerRef.current.close();
		}
	};

	useEffect(() => {
		const showKeyboard = DeviceEventEmitter.addListener(
			ActionEmitEvent.SHOW_FORWARD_MODAL, (payload) => {
				setMessageForward(payload.targetMessage);
				setShowForwardModal(true);
			},
		);
		return () => {
			showKeyboard.remove();
		};
	}, [])
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["15%", "40%"], []);
  const [isShow, setIsShow] = useState<boolean>(false);

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
    setIsShow(!isShow)
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setIsShow(false)
  };

  const renderBackdrop = useCallback((props) => (
    <BottomSheetBackdrop
      {...props}
      opacity={0.5}
      onPress={closeBottomSheet}
      appearsOnIndex={1}
    />
  ), []);

	useFocusEffect(
		useCallback(() => {
		  	setIsFocusChannelView(true);
		  	return () => {
				setIsFocusChannelView(false);
		  	};
		}, [])
	  );

	return (
		<View style={[styles.homeDefault]}>
			<HomeDefaultHeader openBottomSheet={openBottomSheet} navigation={props.navigation} channelTitle={currentChannel?.channel_label} />
			{currentChannel && isFocusChannelView && (
				<View style={{ flex: 1, backgroundColor: Colors.tertiaryWeight }}>
					<ChannelMessages
						channelId={currentChannel.channel_id}
						type="CHANNEL"
						channelLabel={currentChannel?.channel_label}
						mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
					/>
					<ChatBox
						channelId={currentChannel.channel_id}
						channelLabel={currentChannel?.channel_label || ''}
						mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
						onShowKeyboardBottomSheet={onShowKeyboardBottomSheet}
					/>
					<View
						style={{
							height: Platform.OS === 'ios' || typeKeyboardBottomSheet !== 'text' ? heightKeyboardShow : 0,
							backgroundColor: Colors.secondary,
						}}
					/>
					{heightKeyboardShow !== 0 && typeKeyboardBottomSheet !== 'text' && (
						<BottomKeyboardPicker height={heightKeyboardShow} ref={bottomPickerRef}>
							{typeKeyboardBottomSheet === 'emoji' ? (
								<EmojiPicker
									onDone={() => onShowKeyboardBottomSheet(false, heightKeyboardShow, typeKeyboardBottomSheet)}
									bottomSheetRef={bottomPickerRef}
								/>
							) : typeKeyboardBottomSheet === 'attachment' ? (
								<AttachmentPicker currentChannelId={currentChannel.channel_id} currentClanId={currentChannel.clan_id} />
							) : (
								<View />
							)}
						</BottomKeyboardPicker>
					)}

					<ForwardMessageModal
						show={showForwardModal}
						onClose={() => setShowForwardModal(false)}
						message={messageForward}
					/>
				</View>
			)}
      <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle ={{backgroundColor:  Colors.secondary}}
    >
      <BottomSheetView >
        {isShow && <NotificationSetting /> }
      </BottomSheetView>
    </BottomSheet>
		</View>
	);
});

const HomeDefaultHeader = React.memo(({ navigation, channelTitle, openBottomSheet }:
  { navigation: any; channelTitle: string ,openBottomSheet: () => void }) => {
	const navigateMenuThreadDetail = () => {
		navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.BOTTOM_SHEET });
	};
	return (
		<View style={styles.homeDefaultHeader}>
			<TouchableOpacity style={{ flex: 1 }} onPress={navigateMenuThreadDetail}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						activeOpacity={0.8}
						style={styles.iconBar}
						onPress={() => {
							navigation.openDrawer();
							Keyboard.dismiss();
						}}
					>
						<BarsLogo width={20} height={20} />
					</TouchableOpacity>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						{!!channelTitle && <HashSignIcon width={18} height={18} />}
						<Text style={{ color: '#FFFFFF', fontFamily: 'bold', marginLeft: 10, fontSize: 16 }}>{channelTitle}</Text>
					</View>
				</View>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => openBottomSheet()}>
				{/* <SearchIcon width={22} height={22} style={{ marginRight: 20 }} /> */}
				<UnMuteIcon width={20} height={20} style={{ marginRight: 20 }} />
			</TouchableOpacity>
		</View>
	);
});

export default HomeDefault;
