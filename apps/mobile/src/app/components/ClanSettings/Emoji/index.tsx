import { handleUploadEmoticonMobile } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { appActions, createEmojiSetting, selectAllEmojiSuggestion, selectCurrentClanId, useAppDispatch } from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import { EEmojiCategory, MAX_FILE_NAME_EMOJI } from '@mezon/utils';
import { Snowflake } from '@theinternetfolks/snowflake';
import { ApiClanEmojiCreateRequest, ApiMessageAttachment } from 'mezon-js/api.gen';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { openCropper } from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { APP_SCREEN, MenuClanScreenProps } from '../../../navigation/ScreenTypes';
import EmojiList from './EmojiList';
import { style } from './styles';

export interface IFile {
	uri: string;
	name: string;
	type: string;
	size: number;
	fileData: any;
}

export const { width, height } = Dimensions.get('window');
type ClanSettingsScreen = typeof APP_SCREEN.MENU_CLAN.EMOJI_SETTING;
export default function ClanEmojiSetting({ navigation }: MenuClanScreenProps<ClanSettingsScreen>) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const currentClanId = useSelector(selectCurrentClanId) || '';
	const { sessionRef, clientRef } = useMezon();
	const { t } = useTranslation(['clanEmojiSetting']);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	const emojiList = useSelector(selectAllEmojiSuggestion).filter((emoji) => emoji.category === EEmojiCategory.CUSTOM);
	const timerRef = useRef<any>(null);

	navigation.setOptions({
		headerBackTitleVisible: false,
	});

	useEffect(() => {
		return () => {
			timerRef?.current && clearTimeout(timerRef.current);
		};
	}, []);

	const handleSelectImage = async () => {
		if (isButtonDisabled) return;
		setIsButtonDisabled(true);
		const response = await launchImageLibrary({
			mediaType: 'photo',
			includeBase64: true,
			quality: 1,
		});

		if (response.didCancel) {
			console.log('User cancelled camera');
		} else if (response.errorCode) {
			console.log('Camera Error: ', response.errorMessage);
		} else {
			const file = response.assets[0];
			return file;
		}
		setTimeout(() => {
			setIsButtonDisabled(false);
		}, 1000);
	};

	const handleAddEmoji = async () => {
		const file = await handleSelectImage();
		if (file) {
			timerRef.current = setTimeout(async () => {
				const croppedFile = await openCropper({
					path: file.uri,
					mediaType: 'photo',
					includeBase64: true,
					compressImageQuality: 1,
					...(typeof width === 'number' && { width: width, height: width }),
				});
				const uploadImagePayload = {
					name: file.fileName,
					size: croppedFile.size,
					type: croppedFile.mime,
					uri: croppedFile.path,
					fileData: croppedFile.data,
				} as IFile;
				const session = sessionRef.current;
				const client = clientRef.current;
				const fileNameParts = file.fileName.split('.');
				const shortname = fileNameParts.slice(0, -1).join('.').slice(0, MAX_FILE_NAME_EMOJI);
				const id = Snowflake.generate();
				const path = 'emojis/' + id + '.webp';
				dispatch(appActions.setLoadingMainMobile(true));
				handleUploadEmoticonMobile(client, session, path, uploadImagePayload)
					.then(async (attachment: ApiMessageAttachment) => {
						const request: ApiClanEmojiCreateRequest = {
							id: id,
							category: 'Custom',
							clan_id: currentClanId,
							shortname: ':' + shortname + ':',
							source: attachment.url,
						};
						dispatch(createEmojiSetting({ request: request, clanId: currentClanId }));
					})
					.then(() => {
						dispatch(appActions.setLoadingMainMobile(false));
					});
			});
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Pressable style={styles.addEmojiButton} onPress={handleAddEmoji}>
					<Text style={styles.buttonText}>{t('button.upload')}</Text>
				</Pressable>
				<Text style={styles.title}>{t('description.descriptions')}</Text>
				<Text style={styles.lightTitle}>{t('description.requirements')}</Text>
				<Text style={styles.requireTitle}>{t('description.requireList')}</Text>
				<EmojiList emojiList={emojiList} />
			</ScrollView>
		</View>
	);
}
