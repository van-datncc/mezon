import { load, STORAGE_MY_USER_ID } from '@mezon/mobile-components';
import { size, ThemeModeBase, useTheme } from '@mezon/mobile-ui';
import { groupCallActions, selectIsInCall, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { safeJSONParse, WebrtcSignalingFwd, WebrtcSignalingType } from 'mezon-js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Text, TouchableOpacity, Vibration, View } from 'react-native';
import Sound from 'react-native-sound';
import { useSelector } from 'react-redux';
import { TYPING_DARK_MODE, TYPING_LIGHT_MODE } from '../../../assets/lottie';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import { style } from './styles';

type ICallingGroupProps = {
	dataCall: WebrtcSignalingFwd;
};

interface CallSignalingData {
	is_video: boolean;
	group_id: string;
	group_name: string;
	group_avatar?: string;
	caller_id: string;
	caller_name: string;
	caller_avatar?: string;
	meeting_code?: string;
	clan_id?: string;
	timestamp: number;
	participants: string[];
	action?: string;
	reason?: string;
}

const parseSignalingData = (jsonData?: string): CallSignalingData | null => {
	if (!jsonData) return null;

	try {
		return safeJSONParse(jsonData);
	} catch {
		return null;
	}
};

const CallingGroupModal = ({ dataCall }: ICallingGroupProps) => {
	const { themeValue, themeBasic } = useTheme();
	const styles = style(themeValue);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const ringtoneRef = useRef<Sound | null>(null);
	const navigation = useNavigation<any>();
	const userId = useMemo(() => {
		return load(STORAGE_MY_USER_ID);
	}, []);
	const isInCall = useSelector(selectIsInCall);
	const mezon = useMezon();

	const callData = useMemo(() => {
		return parseSignalingData(dataCall?.json_data as string);
	}, [dataCall?.json_data]);

	const stopAndReleaseSound = () => {
		if (ringtoneRef.current) {
			ringtoneRef.current.pause();
			ringtoneRef.current.stop();
			ringtoneRef.current.release();
			ringtoneRef.current = null;
		}
	};

	useEffect(() => {
		if (!isInCall && dataCall?.caller_id && callData) {
			setIsVisible(true);
			Sound.setCategory('Playback');

			// Initialize ringtone
			const sound = new Sound('ringing.mp3', Sound.MAIN_BUNDLE, (error) => {
				if (error) {
					console.error('failed to load the sound', error);
					return;
				}
				sound.play((success) => {
					if (!success) {
						console.error('Sound playback failed');
					}
				});
				sound.setNumberOfLoops(-1);
				ringtoneRef.current = sound;
				playVibration();
			});
		} else {
			setIsVisible(false);
			stopAndReleaseSound();
			Vibration.cancel();
		}
	}, [callData, dataCall?.caller_id, isInCall]);

	const playVibration = () => {
		const pattern = Platform.select({
			ios: [0, 1000, 2000, 1000, 2000],
			android: [0, 1000, 1000, 1000, 1000]
		});
		Vibration.vibrate(pattern, true);
	};

	const onJoinCall = () => {
		stopAndReleaseSound();
		Vibration.cancel();
		setIsVisible(false);
		if (dataCall?.channel_id && callData) {
			dispatch(
				groupCallActions.setIncomingCallData({
					groupId: dataCall.channel_id,
					groupName: callData?.group_name || 'Group Call',
					groupAvatar: callData?.group_avatar,
					meetingCode: callData?.meeting_code,
					clanId: callData?.clan_id,
					participants: callData?.participants || [],
					callerInfo: {
						id: callData?.caller_id,
						name: callData?.caller_name,
						avatar: callData?.caller_avatar
					}
				})
			);
			dispatch(groupCallActions.autoJoinRoom({ shouldJoin: true, isAnswering: true }));
			dispatch(groupCallActions.hideIncomingGroupCall());
		}
	};

	const onDeniedCall = async () => {
		dispatch(groupCallActions.hideIncomingGroupCall());
		dispatch(groupCallActions.endGroupCall());
		setIsVisible(false);
		stopAndReleaseSound();
		Vibration.cancel();
		await mezon.socketRef.current?.forwardWebrtcSignaling(
			dataCall?.caller_id,
			WebrtcSignalingType.WEBRTC_SDP_QUIT,
			'{}',
			dataCall?.channel_id,
			userId
		);
	};

	if (!isVisible) {
		return <View />;
	}

	return (
		<View style={styles.centeredView}>
			<View style={{ flex: 1, paddingRight: size.s_10 }}>
				<View style={{ alignItems: 'center', flexDirection: 'row' }}>
					<Text numberOfLines={1} style={styles.headerTitle}>
						Mezon audio
					</Text>
					<LottieView
						source={themeBasic === ThemeModeBase.DARK ? TYPING_DARK_MODE : TYPING_LIGHT_MODE}
						autoPlay
						loop
						style={styles.threeDot}
					/>
				</View>

				<Text style={styles.username}>
					{callData.caller_name || ''}
					{' is inviting you to join '}
				</Text>
				<Text numberOfLines={1} style={styles.memberInGroup}>
					{`${callData?.participants.length} members in this group`}
				</Text>
			</View>
			<View style={{ gap: size.s_10, flexDirection: 'row' }}>
				<TouchableOpacity onPress={onDeniedCall} style={[styles.btnControl, styles.btnDenied]}>
					<MezonIconCDN icon={IconCDN.closeLargeIcon} width={size.s_20} height={size.s_20} />
				</TouchableOpacity>
				<TouchableOpacity onPress={onJoinCall} style={[styles.btnControl, styles.btnAccept]}>
					<MezonIconCDN icon={IconCDN.checkmarkLargeIcon} width={size.s_20} height={size.s_20} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default CallingGroupModal;
