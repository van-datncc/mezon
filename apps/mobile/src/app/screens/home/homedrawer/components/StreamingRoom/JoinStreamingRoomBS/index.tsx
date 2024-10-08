import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { Icons } from '@mezon/mobile-components';
import { Block, baseColor, size, useTheme } from '@mezon/mobile-ui';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { APP_SCREEN } from '../../../../../../navigation/ScreenTypes';
import { InviteToChannel } from '../../InviteToChannel';
import { style } from './JoinStreamingRoomBS.styles';

function JoinStreamingRoomBS(props, refRBSheet: React.MutableRefObject<BottomSheetModal>) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const bottomSheetInviteRef = useRef(null);
	const [isMute, setIsMute] = useState<boolean>(true);
	const navigation = useNavigation<any>();
	const { dismiss } = useBottomSheetModal();
	const { t } = useTranslation(['streamingRoom']);

	const handleMuteSpeaker = () => {
		setIsMute(!isMute);
	};

	const handleJoinVoice = () => {
		navigation.navigate(APP_SCREEN.MENU_CHANNEL.STACK, {
			screen: APP_SCREEN.MENU_CHANNEL.STREAMING_ROOM
		});
		dismiss();
	};
	return (
		<Block width={'100%'} paddingVertical={size.s_10} paddingHorizontal={size.s_10}>
			<Block flexDirection="row" justifyContent="space-between">
				<TouchableOpacity
					onPress={() => {
						refRBSheet?.current.dismiss();
					}}
					style={styles.buttonCircle}
				>
					<Icons.ChevronSmallDownIcon />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						bottomSheetInviteRef.current.present();
					}}
					style={{
						backgroundColor: themeValue.tertiary,
						padding: size.s_8,
						borderRadius: size.s_22
					}}
				>
					<Icons.UserPlusIcon />
				</TouchableOpacity>
			</Block>
			<Block alignItems="center" gap={size.s_6}>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					colors={[baseColor.blurple, baseColor.purple, baseColor.blurple, baseColor.purple]} // Các màu cho gradient
					style={{
						width: size.s_100,
						height: size.s_100,
						borderRadius: size.s_50,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Icons.VoiceNormalIcon width={size.s_36} height={size.s_36} />
				</LinearGradient>
				<Text style={styles.text}>{t('joinStreamingRoomBS.voice')}</Text>
				<Text style={styles.textDisable}>{t('joinStreamingRoomBS.noOne')}</Text>
				<Text style={styles.textDisable}>{t('joinStreamingRoomBS.readyTalk')}</Text>
			</Block>
			<Block borderRadius={size.s_40} backgroundColor={themeValue.tertiary} marginTop={size.s_20}>
				<TouchableOpacity style={styles.lineBtn}>
					<Block width={size.s_50} height={size.s_6} borderRadius={size.s_4} backgroundColor={themeValue.badgeHighlight}></Block>
				</TouchableOpacity>
				<Block
					gap={size.s_20}
					flexDirection="row"
					alignItems="center"
					justifyContent="space-between"
					paddingHorizontal={size.s_20}
					paddingBottom={size.s_20}
				>
					<TouchableOpacity onPress={handleMuteSpeaker}>
						<Block
							justifyContent="center"
							alignItems="center"
							position="relative"
							width={size.s_60}
							height={size.s_60}
							backgroundColor={themeValue.badgeHighlight}
							borderRadius={size.s_30}
						>
							{isMute ? <Icons.SpeakerMuteIcon /> : <Icons.SpeakerUnMuteIcon />}
						</Block>
					</TouchableOpacity>
					<Block flexDirection="column" flex={1}>
						<TouchableOpacity style={styles.btnJoinVoice} onPress={handleJoinVoice}>
							<Text style={styles.textBtnJoinVoice}>{t('joinStreamingRoomBS.joinVoice')}</Text>
						</TouchableOpacity>
					</Block>
					<Block
						justifyContent="center"
						alignItems="center"
						position="relative"
						width={size.s_60}
						height={size.s_60}
						backgroundColor={themeValue.badgeHighlight}
						borderRadius={size.s_30}
					>
						<Icons.ChatIcon />
					</Block>
				</Block>
			</Block>

			<InviteToChannel isUnknownChannel={false} ref={bottomSheetInviteRef} />
		</Block>
	);
}

export default React.forwardRef(JoinStreamingRoomBS);
