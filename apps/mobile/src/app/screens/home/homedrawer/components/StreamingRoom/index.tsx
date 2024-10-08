import {
	ActionEmitEvent,
	changeClan,
	getUpdateOrAddClanChannelCache,
	Icons,
	jumpToChannel,
	load,
	remove,
	save,
	STORAGE_DATA_CLAN_CHANNEL_CACHE,
	STORAGE_PREVIOUS_CHANNEL
} from '@mezon/mobile-components';
import { baseColor, Block, size, useTheme } from '@mezon/mobile-ui';
import { selectCurrentClanId } from '@mezon/store-mobile';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, DeviceEventEmitter, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { InviteToChannel } from '..';
import { MezonBottomSheet } from '../../../../../componentUI';
import { APP_SCREEN } from '../../../../../navigation/ScreenTypes';
import SelectAudio from './SelectAudio';
import { style } from './StreamingRoom.styles';
import StreamingScreen from './StreamingScreen';
import UserStreamingRoom from './UserStreamingRoom';

export default function StreamingRoom() {
	const [menuVisible, setMenuVisible] = useState(true);
	const animatedValueMenuHeader = useRef(new Animated.Value(-200)).current;
	const animatedValueMenuFooter = useRef(new Animated.Value(200)).current;
	const hideMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [isMute, setIsMute] = useState<boolean>(false);
	const [isVideoCall, setIsVideoCall] = useState<boolean>(false);
	const navigation = useNavigation<any>();
	const bottomSheetInviteRef = useRef(null);
	const bottomSheetSelectAudioRef = useRef(null);
	const { t } = useTranslation(['streamingRoom']);
	const currentClanId = useSelector(selectCurrentClanId);

	useEffect(() => {
		showMenu();
	}, []);

	const showMenu = () => {
		setMenuVisible(true);
		Animated.timing(animatedValueMenuHeader, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true
		}).start();

		Animated.timing(animatedValueMenuFooter, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true
		}).start();

		if (hideMenuTimeout.current) {
			clearTimeout(hideMenuTimeout.current);
		}
		hideMenuTimeout.current = setTimeout(() => {
			hideMenu();
		}, 3000);
	};

	const hideMenu = () => {
		Animated.timing(animatedValueMenuHeader, {
			toValue: -400,
			duration: 300,
			useNativeDriver: true
		}).start(() => setMenuVisible(false));

		Animated.timing(animatedValueMenuFooter, {
			toValue: 400,
			duration: 300,
			useNativeDriver: true
		}).start();
	};

	const handlePress = () => {
		if (menuVisible) {
			hideMenu();
		} else {
			showMenu();
		}
	};

	const handleMuteOrUnMute = () => {
		setIsMute(!isMute);
	};

	const handleVideoCall = () => {
		setIsVideoCall(!isVideoCall);
	};

	const handleEndCall = () => {
		requestAnimationFrame(async () => {
			const previousChannel = load(STORAGE_PREVIOUS_CHANNEL) || [];
			navigation.navigate(APP_SCREEN.HOME);
			navigation.dispatch(DrawerActions.openDrawer());
			const { channel_id, clan_id } = previousChannel || {};
			if (currentClanId !== clan_id) {
				changeClan(clan_id);
			}
			DeviceEventEmitter.emit(ActionEmitEvent.FETCH_MEMBER_CHANNEL_DM, {
				isFetchMemberChannelDM: true
			});
			const dataSave = getUpdateOrAddClanChannelCache(clan_id, channel_id);
			save(STORAGE_DATA_CLAN_CHANNEL_CACHE, dataSave);
			jumpToChannel(channel_id, clan_id);
			remove(STORAGE_PREVIOUS_CHANNEL);
		});
	};

	const handleVoice = () => {
		bottomSheetSelectAudioRef.current.present();
	};
	const handleAddPeopleToVoice = () => {
		bottomSheetInviteRef.current.present();
	};

	return (
		<TouchableWithoutFeedback onPress={handlePress}>
			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				colors={[baseColor.blurple, baseColor.purple, baseColor.blurple, baseColor.purple]}
				style={styles.bgVoice}
			>
				<View style={styles.container}>
					<Animated.View style={[styles.menuHeader, { transform: [{ translateY: animatedValueMenuHeader }] }]}>
						<Block flexDirection="row" alignItems="center" gap={size.s_20}>
							<TouchableOpacity style={styles.buttonCircle}>
								<Icons.ChevronSmallDownIcon />
							</TouchableOpacity>

							<TouchableOpacity style={styles.btnVoice}>
								<Text style={styles.textMenuItem}>{t('streamingRoom.voice')}</Text>
								<Icons.ChevronSmallRightIcon />
							</TouchableOpacity>
						</Block>
						<Block flexDirection="row" alignItems="center" gap={size.s_20}>
							<TouchableOpacity onPress={handleVoice} style={styles.buttonCircle}>
								<Icons.VoiceNormalIcon />
							</TouchableOpacity>
							<TouchableOpacity onPress={handleAddPeopleToVoice} style={styles.buttonCircle}>
								<Icons.UserPlusIcon />
							</TouchableOpacity>
						</Block>
					</Animated.View>
					{/* user screen */}
					<Block style={styles.userStreamingRoomContainer}>
						<StreamingScreen />
						<UserStreamingRoom />
					</Block>
					{/* user screen */}
					<Animated.View style={[styles.menuFooter, { transform: [{ translateY: animatedValueMenuFooter }] }]}>
						<TouchableOpacity onPress={handleAddPeopleToVoice} style={styles.addPeopleBtn}>
							<Icons.UserPlusIcon />
							<Block>
								<Text style={styles.textMenuItem}>{t('streamingRoom.addPeople')}</Text>
								<Text style={styles.subTitle}>{t('streamingRoom.leftTheGroup')}</Text>
							</Block>
							<Icons.ChevronSmallRightIcon />
						</TouchableOpacity>
						<Block borderRadius={size.s_40} backgroundColor={themeValue.secondary}>
							<TouchableOpacity style={styles.lineBtn}>
								<Block
									width={size.s_50}
									height={size.s_6}
									borderRadius={size.s_4}
									backgroundColor={themeValue.badgeHighlight}
								></Block>
							</TouchableOpacity>
							<Block
								gap={size.s_10}
								flexDirection="row"
								alignItems="center"
								justifyContent="space-between"
								paddingHorizontal={size.s_14}
								paddingBottom={size.s_14}
							>
								<TouchableOpacity onPress={handleVideoCall} style={styles.menuIcon}>
									{isVideoCall ? <Icons.VideoIcon /> : <Icons.VideoSlashIcon />}
								</TouchableOpacity>
								<TouchableOpacity onPress={handleMuteOrUnMute} style={styles.menuIcon}>
									{isMute ? <Icons.SpeakerMuteIcon /> : <Icons.SpeakerUnMuteIcon />}
								</TouchableOpacity>

								<TouchableOpacity style={styles.menuIcon}>
									<Icons.ChatIcon />
								</TouchableOpacity>
								<TouchableOpacity style={styles.menuIcon}>
									<Icons.AppActivitiesIcon />
								</TouchableOpacity>
								<TouchableOpacity onPress={handleEndCall} style={{ ...styles.menuIcon, backgroundColor: baseColor.redStrong }}>
									<Icons.PhoneCallIcon />
								</TouchableOpacity>
							</Block>
						</Block>
					</Animated.View>
				</View>
				<InviteToChannel isUnknownChannel={false} ref={bottomSheetInviteRef} />
				<MezonBottomSheet snapPoints={['40%']} ref={bottomSheetSelectAudioRef}>
					<SelectAudio />
				</MezonBottomSheet>
			</LinearGradient>
		</TouchableWithoutFeedback>
	);
}
