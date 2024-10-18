import { useAuth } from '@mezon/core';
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
import { baseColor, Block, Metrics, size, useTheme } from '@mezon/mobile-ui';
import { selectCurrentStreamInfo, selectStreamMembersByChannelId, useAppDispatch, usersStreamActions, videoStreamActions } from '@mezon/store';
import { selectCurrentClanId } from '@mezon/store-mobile';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { MezonBottomSheet } from 'apps/mobile/src/app/componentUI';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '../../../../../navigation/ScreenTypes';
import { InviteToChannel } from '../InviteToChannel';
import SelectAudio from './SelectAudio';
import { style } from './StreamingRoom.styles';
import { StreamingScreenComponent } from './StreamingScreen';
import UserStreamingRoom from './UserStreamingRoom';

function StreamingRoom({
	onPressMinimizeRoom,
	isAnimationComplete
}: {
	onPressMinimizeRoom: (isAnimationComplete: boolean) => void;
	isAnimationComplete: boolean;
}) {
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [isMute, setIsMute] = useState<boolean>(false);
	const [isVideoCall, setIsVideoCall] = useState<boolean>(false);
	const navigation = useNavigation<any>();
	const bottomSheetInviteRef = useRef(null);
	const bottomSheetSelectAudioRef = useRef(null);
	const { t } = useTranslation(['streamingRoom']);
	const currentClanId = useSelector(selectCurrentClanId);
	const currentStreamInfo = useSelector(selectCurrentStreamInfo);
	const streamChannelMember = useSelector(selectStreamMembersByChannelId(currentStreamInfo?.streamId || ''));
	const { userProfile } = useAuth();
	const dispatch = useAppDispatch();

	const handleMuteOrUnMute = () => {
		setIsMute(!isMute);
	};

	const handleVideoCall = () => {
		setIsVideoCall(!isVideoCall);
	};

	const handleLeaveChannel = async () => {
		if (currentStreamInfo) {
			dispatch(videoStreamActions.stopStream());
		}
		const idStreamByMe = streamChannelMember?.find((member) => member?.user_id === userProfile?.user?.id)?.id;
		dispatch(usersStreamActions.remove(idStreamByMe || ''));
	};

	const handleEndCall = useCallback(() => {
		console.log('handleEndCall');

		requestAnimationFrame(async () => {
			handleLeaveChannel();
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
	}, []);

	const handleVoice = () => {
		bottomSheetSelectAudioRef.current.present();
	};
	const handleAddPeopleToVoice = () => {
		bottomSheetInviteRef.current.present();
	};
	const handelFullScreenVideo = useCallback(() => {
		setIsFullScreen(!isFullScreen);
	}, [isFullScreen]);

	return (
		<SafeAreaView>
			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				colors={[baseColor.blurple, baseColor.purple, baseColor.blurple, baseColor.purple]}
				style={{
					width: isAnimationComplete ? (isFullScreen ? Metrics.screenHeight : Metrics.screenWidth) : 200,
					height: isAnimationComplete ? (isFullScreen ? Metrics.screenWidth : Metrics.screenHeight) : 100
				}}
			>
				<Block style={styles.container}>
					{!isFullScreen && isAnimationComplete && (
						<Block style={[styles.menuHeader]}>
							<Block flexDirection="row" alignItems="center" gap={size.s_20}>
								<TouchableOpacity
									onPress={() => {
										onPressMinimizeRoom(false);
									}}
									style={styles.buttonCircle}
								>
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
						</Block>
					)}

					<Block
						style={{
							...styles.userStreamingRoomContainer,
							width: isAnimationComplete ? (isFullScreen ? '100%' : '100%') : '100%',
							height: isAnimationComplete ? (isFullScreen ? '100%' : '60%') : '100%'
						}}
					>
						<StreamingScreenComponent
							streamID={currentStreamInfo?.streamId}
							isAnimationComplete={isAnimationComplete}
							onFullScreenVideo={handelFullScreenVideo}
						/>
					</Block>
					{!isFullScreen && isAnimationComplete && <UserStreamingRoom streamChannelMember={streamChannelMember} />}
					{!isFullScreen && isAnimationComplete && (
						<Block style={[styles.menuFooter]}>
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

									{/* <TouchableOpacity style={styles.menuIcon}>
										<Icons.ChatIcon />
									</TouchableOpacity> */}
									{/* <TouchableOpacity style={styles.menuIcon}>
										<Icons.AppActivitiesIcon />
									</TouchableOpacity> */}
									<TouchableOpacity onPress={handleEndCall} style={{ ...styles.menuIcon, backgroundColor: baseColor.redStrong }}>
										<Icons.PhoneCallIcon />
									</TouchableOpacity>
								</Block>
							</Block>
						</Block>
					)}
				</Block>
				<InviteToChannel isUnknownChannel={false} ref={bottomSheetInviteRef} />
				<MezonBottomSheet snapPoints={['40%']} ref={bottomSheetSelectAudioRef}>
					<SelectAudio />
				</MezonBottomSheet>
			</LinearGradient>
		</SafeAreaView>
	);
}

export default React.memo(StreamingRoom);
