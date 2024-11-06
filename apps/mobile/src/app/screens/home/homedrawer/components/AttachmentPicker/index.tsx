import { Icons } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { appActions, referencesActions } from '@mezon/store-mobile';
import { createUploadFilePath, useMezon } from '@mezon/transport';
import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PermissionsAndroid, Platform, Text, TouchableOpacity, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useDispatch } from 'react-redux';
import { IFile } from '../../../../../componentUI';
import Gallery from './Gallery';
import { style } from './styles';
export type AttachmentPickerProps = {
	mode?: number;
	currentChannelId?: string;
	currentClanId?: string;
	onCancel?: () => void;
};

function AttachmentPicker({ mode, currentChannelId, currentClanId, onCancel }: AttachmentPickerProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['message']);
	const { sessionRef } = useMezon();
	const timeRef = useRef<any>();
	const dispatch = useDispatch();

	useEffect(() => {
		return () => {
			timeRef?.current && clearTimeout(timeRef.current);
		};
	}, []);

	const getFullFileName = useCallback(
		(fileName: string) => {
			const session = sessionRef.current;
			return createUploadFilePath(session, currentClanId, currentChannelId, fileName, true)?.filePath;
		},
		[currentChannelId, currentClanId, sessionRef]
	);

	const onPickFiles = async () => {
		try {
			timeRef.current = setTimeout(() => {
				dispatch(appActions.setIsFromFCMMobile(true));
			}, 500);
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles]
			});
			const file = res?.[0];

			dispatch(
				referencesActions.setAtachmentAfterUpload({
					channelId: currentChannelId,
					files: [
						{
							filename: getFullFileName(file?.name || file?.uri),
							url: file?.uri || file?.fileCopyUri,
							filetype: file?.type,
							size: file.size as number
						}
					]
				})
			);

			timeRef.current = setTimeout(() => {
				dispatch(appActions.setIsFromFCMMobile(false));
			}, 2000);
		} catch (err) {
			timeRef.current = setTimeout(() => {
				dispatch(appActions.setIsFromFCMMobile(false));
			}, 2000);
			if (DocumentPicker.isCancel(err)) {
				onCancel?.();
				// User cancelled the picker
			} else {
				throw err;
			}
		}
	};

	const handleSelectedAttachments = useCallback((file: IFile) => {
		dispatch(
			referencesActions.setAtachmentAfterUpload({
				channelId: currentChannelId,
				files: [
					{
						filename: file.name,
						url: file.uri,
						filetype: file.type,
						size: file.size as number,
						width: file?.width,
						height: file?.height
					}
				]
			})
		);
	}, []);

	const requestLocationPermission = async () => {
		if (Platform.OS === 'android') {
			const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
			if (granted) {
				return true;
			} else {
				const requestResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
				return requestResult === PermissionsAndroid.RESULTS.GRANTED;
			}
		}
		return true;
	};

	const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> => {
		return new Promise((resolve, reject) => {
			Geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					resolve({ latitude, longitude });
				},
				(error) => reject(error)
			);
		});
	};

	const handleLinkGoogleMap = async () => {
		const permissionGranted = await requestLocationPermission();
		if (permissionGranted) {
			try {
				const { latitude, longitude } = await getCurrentPosition();
				dispatch(referencesActions.setGeolocation({ latitude, longitude }));
			} catch (error) {
				console.error(error);
			}
		} else {
			console.error('Location permission denied');
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.wrapperHeader}>
				<TouchableOpacity activeOpacity={0.8} style={styles.buttonHeader} onPress={() => handleLinkGoogleMap()}>
					<Icons.LocationIcon height={20} width={20} color={themeValue.text} />
					<Text style={styles.titleButtonHeader}>{t('message:actions.location')}</Text>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8} onPress={onPickFiles} style={styles.buttonHeader}>
					<Icons.AttachmentIcon height={20} width={20} color={themeValue.text} />
					<Text style={styles.titleButtonHeader}>{t('message:actions.files')}</Text>
				</TouchableOpacity>
			</View>
			<Gallery onPickGallery={handleSelectedAttachments} currentChannelId={currentChannelId} />
		</View>
	);
}

export default AttachmentPicker;
