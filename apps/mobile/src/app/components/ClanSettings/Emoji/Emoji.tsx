import { QUALITY_IMAGE_UPLOAD } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { appActions, createEmojiSetting, selectCurrentClanId, selectEmojiByClanId, useAppDispatch } from '@mezon/store-mobile';
import { handleUploadEmoticon, useMezon } from '@mezon/transport';
import { LIMIT_SIZE_UPLOAD_IMG, MAX_FILE_NAME_EMOJI } from '@mezon/utils';
import { Snowflake } from '@theinternetfolks/snowflake';
import { Buffer as BufferMobile } from 'buffer';
import { ApiClanEmojiCreateRequest } from 'mezon-js/api.gen';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { openPicker } from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { APP_SCREEN, MenuClanScreenProps } from '../../../navigation/ScreenTypes';
import { EmojiList } from './EmojiList';
import { style } from './styles';

export const { width, height } = Dimensions.get('window');
type ClanSettingsScreen = typeof APP_SCREEN.MENU_CLAN.EMOJI_SETTING;
export function ClanEmojiSetting({ navigation }: MenuClanScreenProps<ClanSettingsScreen>) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const currentClanId = useSelector(selectCurrentClanId) || '';
	const { sessionRef, clientRef } = useMezon();
	const { t } = useTranslation(['clanEmojiSetting']);
	const emojiList = useSelector(selectEmojiByClanId(currentClanId || ''));

	const timerRef = useRef<any>(null);
	const buttonRef = useRef<any>(null);

	useEffect(() => {
		navigation.setOptions({
			headerStatusBarHeight: Platform.OS === 'android' ? 0 : undefined,
			headerBackTitleVisible: false
		});
	}, [navigation]);

	useEffect(() => {
		return () => {
			timerRef?.current && clearTimeout(timerRef.current);
		};
	}, []);

	const handleAddEmoji = async () => {
		try {
			const croppedFile = await openPicker({
				mediaType: 'photo',
				includeBase64: true,
				cropping: true,
				compressImageQuality: QUALITY_IMAGE_UPLOAD,
				...(typeof width === 'number' && { width: width, height: width })
			});
			const id = Snowflake.generate();
			const arrayBuffer = BufferMobile.from(croppedFile.data, 'base64');
			const uploadImagePayload = {
				name: croppedFile.filename || `emoji-${id}`,
				size: croppedFile.size,
				type: croppedFile.mime,
				uri: croppedFile.path,
				fileData: croppedFile.data,
				height: croppedFile.height,
				width: croppedFile.width
			} as unknown as File;

			if (Number(croppedFile.size) > Number(LIMIT_SIZE_UPLOAD_IMG / 4)) {
				Toast.show({
					type: 'error',
					text1: t('toast.errorSizeLimit')
				});
				return;
			}

			dispatch(appActions.setLoadingMainMobile(true));

			const session = sessionRef.current;
			const client = clientRef.current;
			const shortname = `:${`emoji_${id}`.slice(0, MAX_FILE_NAME_EMOJI / 5)}:`;
			const path = 'emojis/' + id + '.webp';
			const uploadedEmoji = await handleUploadEmoticon(client, session, path, uploadImagePayload, true, arrayBuffer);
			if (uploadedEmoji?.url) {
				const request: ApiClanEmojiCreateRequest = {
					id: id,
					category: 'Custom',
					clan_id: currentClanId,
					shortname: shortname,
					source: uploadedEmoji.url
				};
				dispatch(createEmojiSetting({ request: request, clanId: currentClanId }));
				dispatch(appActions.setLoadingMainMobile(false));
				return;
			} else {
				Toast.show({
					type: 'error',
					text1: 'Error uploading emoji'
				});
				dispatch(appActions.setLoadingMainMobile(false));
			}
		} catch (e) {
			Toast.show({
				type: 'error',
				text1: 'Error uploading emoji'
			});
			dispatch(appActions.setLoadingMainMobile(false));
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Pressable ref={buttonRef} style={styles.addEmojiButton} onPress={handleAddEmoji}>
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
