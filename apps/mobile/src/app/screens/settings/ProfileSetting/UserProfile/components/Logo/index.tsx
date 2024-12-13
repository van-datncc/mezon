import { useAuth } from '@mezon/core';
import { Icons, QUALITY_IMAGE_UPLOAD } from '@mezon/mobile-components';
import { Colors, size, useTheme } from '@mezon/mobile-ui';
import { appActions, clansActions, selectCurrentChannel, selectLogoCustom, useAppDispatch } from '@mezon/store-mobile';
import { handleUploadFileMobile, useMezon } from '@mezon/transport';
import { memo, useRef, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { openCropper } from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { IFile, MezonClanAvatar, handleSelectImage } from '../../../../../../componentUI';
import { style } from './styles';

const SCALE = 2;

export const DirectMessageLogo = memo(() => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const currentChannel = useSelector(selectCurrentChannel);
	const logoCustom = useSelector(selectLogoCustom);
	const { sessionRef, clientRef } = useMezon();
	const dispatch = useAppDispatch();
	const { userProfile } = useAuth();
	const [image, setImage] = useState<string>(logoCustom);
	const timerRef = useRef<any>(null);

	const handleUploadImage = async (file: IFile) => {
		const session = sessionRef.current;
		const client = clientRef.current;

		if (!file || !client || !session) {
			throw new Error('Client is not initialized');
		}
		const res = await handleUploadFileMobile(client, session, currentChannel?.clan_id, currentChannel?.channel_id, file.name, file);
		return res.url;
	};

	const handleChangeLogo = async () => {
		const file = await handleSelectImage();
		const width = 60;
		try {
			if (file) {
				timerRef.current = setTimeout(
					async () => {
						const croppedFile = await openCropper({
							path: file.uri,
							mediaType: 'photo',
							includeBase64: true,
							compressImageQuality: QUALITY_IMAGE_UPLOAD,
							...(typeof width === 'number' && { width: width * SCALE }),
							...(typeof width === 'number' && { height: width * SCALE })
						});
						setImage(croppedFile.path);
						dispatch(appActions.setLoadingMainMobile(true));
						const uploadImagePayload = {
							fileData: croppedFile?.data,
							name: file.name,
							uri: croppedFile.path,
							size: croppedFile.size,
							type: croppedFile.mime
						} as IFile;
						const url = await handleUploadImage(uploadImagePayload);
						if (url) {
							dispatch(
								clansActions.updateUser({
									user_name: userProfile.user.username,
									avatar_url: userProfile.user.avatar_url,
									display_name: userProfile.user.display_name,
									about_me: userProfile.user.about_me,
									dob: userProfile.user.dob,
									logo: url
								})
							);
						}
						dispatch(appActions.setLoadingMainMobile(false));
					},
					Platform.OS === 'ios' ? 500 : 0
				);
			}
		} catch (e) {
			dispatch(appActions.setLoadingMainMobile(false));
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Direct Message Icon</Text>
			<TouchableOpacity
				style={[styles.image, { backgroundColor: logoCustom ? themeValue.primary : Colors.bgViolet }]}
				onPress={handleChangeLogo}
			>
				{logoCustom ? <MezonClanAvatar image={image} lightMode /> : <Icons.PlusLargeIcon height={size.s_18} width={size.s_18} />}
			</TouchableOpacity>
		</View>
	);
});
