import { handleUploadEmoticonMobile } from "@mezon/mobile-components";
import { useTheme } from "@mezon/mobile-ui";
import { createSticker, selectAllStickerSuggestion, useAppDispatch } from "@mezon/store";
import { selectCurrentClanId, useAppSelector } from "@mezon/store-mobile";
import { useMezon } from "@mezon/transport";
import { Snowflake } from '@theinternetfolks/snowflake';
import { ApiClanSticker, ApiClanStickerAddRequest } from "mezon-js/api.gen";
import { useMemo, useRef, useState } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { openCropper } from "react-native-image-crop-picker";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { handleSelectImage, IFile } from "../../../temp-ui";
import MezonButton, { EMezonButtonSize, EMezonButtonTheme } from "../../../temp-ui/MezonButton2";
import StickerSettingItem from "./StickerItem";
import { style } from "./styles";

type EdittingSticker = Pick<ApiClanSticker, 'source' | 'shortname'> & {
    fileName: string | null;
};

export default function StickerSetting() {
    const { themeValue } = useTheme();
    const styles = style(themeValue);
    const timerRef = useRef<any>(null);
    const listSticker = useAppSelector(selectAllStickerSuggestion);
    const availableLeft = useMemo(() => 50 - listSticker?.length, [listSticker])
    const [image, setImage] = useState<string>("");
    const { sessionRef, clientRef } = useMezon();
    const currentClanId = useSelector(selectCurrentClanId) || '';
    const dispatch = useAppDispatch();

    const [editingSticker, setEditingSticker] = useState<EdittingSticker>({
        fileName: null,
        shortname: '',
        source: '',
    });

    const LIMIT_SIZE_UPLOAD_IMG = 512 * 1024;

    const handleUploadImage = async (file: IFile) => {
        if (file.size > LIMIT_SIZE_UPLOAD_IMG) {
            Toast.show({
                type: "error",
                text1: "Vượt quá kích thước cho phép"
            });
            return;
        }

        // const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        // if (!allowedTypes.includes(file.type)) {
        //   setOpenModalType(true);
        //   return;
        // }

        const session = sessionRef.current;
        const client = clientRef.current;
        if (!client || !session) {
            throw new Error('Client or file is not initialized');
        }

        const id = Snowflake.generate();
        const path = 'stickers/' + id;
        const attachment = await handleUploadEmoticonMobile(client, session, path, file)

        return {
            id,
            url: attachment.url
        }
    };

    async function handleUploadSticker() {
        const file = await handleSelectImage();

        if (file) {
            timerRef.current = setTimeout(
                async () => {
                    const croppedFile = await openCropper({
                        path: file.uri,
                        mediaType: 'photo',
                        includeBase64: true,
                        compressImageQuality: 1,
                        width: 320,
                        height: 320
                    });

                    // TODO: check category
                    const category = 'Among Us';

                    const { id, url } = await handleUploadImage({
                        fileData: croppedFile?.data,
                        name: file.name,
                        uri: croppedFile.path,
                        size: croppedFile.size,
                        type: croppedFile.mime,
                    });

                    const request: ApiClanStickerAddRequest = {
                        id: id,
                        category: category,
                        clan_id: currentClanId,
                        shortname: "sticker_00",
                        source: url,
                    };

                    dispatch(createSticker({ request: request, clanId: currentClanId }));
                },
                Platform.OS === 'ios' ? 500 : 0,
            );
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <MezonButton
                    title="Upload Sticker"
                    type={EMezonButtonTheme.SUCCESS}
                    size={EMezonButtonSize.MD}
                    rounded={true}
                    containerStyle={styles.btn}
                    onPress={handleUploadSticker}
                />

                <Text style={styles.text}>Add upto 250 custom stickers that anyone can use in this server.</Text>
                <Text style={[styles.text, styles.textTitle]}>Upload Requirements</Text>
                <Text style={styles.text}>- Can be static (PNG) or animated (APNG, GIF).</Text>
                <Text style={styles.text}>- Must be exactly 320 x 320 pixels.</Text>
                <Text style={styles.text}>- No larger than 512KB.</Text>
            </View>

            <View>
                <Text style={[styles.text, styles.textTitle]}>{`Sticker - ${availableLeft} SLOTS AVAILABLE`}</Text>

                <FlatList
                    data={listSticker}
                    renderItem={({ item }) => (
                        <StickerSettingItem
                            creatorID={item.creator_id}
                            name={item.shortname}
                            url={item.source}
                        />)
                    }
                />
            </View>
        </View>
    )
}