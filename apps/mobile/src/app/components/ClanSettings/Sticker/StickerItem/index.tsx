import { Icons } from "@mezon/mobile-components";
import { baseColor, useTheme } from "@mezon/mobile-ui";
import { deleteSticker, updateSticker, useAppDispatch } from "@mezon/store";
import { selectMemberClanByUserId, useAppSelector } from "@mezon/store-mobile";
import { MezonAvatar } from "apps/mobile/src/app/temp-ui";
import { ClanSticker } from "mezon-js";
import { MezonUpdateClanStickerByIdBody } from "mezon-js/api.gen";
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { TextInput } from "react-native-gesture-handler";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Toast from "react-native-toast-message";
import { style } from "./styles";

interface IStickerItem {
    data: ClanSticker,
    clanID: string;
}

const CloseAction = memo(() => {
    const { themeValue } = useTheme();
    const styles = style(themeValue);

    return (
        <View style={styles.close}>
            <Icons.CloseIcon color={baseColor.white} />
        </View>
    )
})

export default function StickerSettingItem({ data, clanID }: IStickerItem) {
    const { themeValue } = useTheme();
    const styles = style(themeValue);
    const user = useAppSelector(selectMemberClanByUserId(data.creator_id));
    const [stickerName, setStickerName] = useState<string>(data.shortname);
    const dispatch = useAppDispatch();
    const { t } = useTranslation(["clanStickerSetting"])

    const [sticker, setSticker] = useState({
        shortname: data.shortname ?? '',
        source: data.source ?? '',
        id: data.id ?? '0',
        category: data.category ?? '',
    });

    const handleDeleteSticker = useCallback(async () => {
        console.log("start");
        if (data.id) {
            const result = await dispatch(deleteSticker({ stickerId: data.id, clan_id: clanID }));
            // @ts-ignore
            if (!!result?.error) {
                Toast.show({
                    type: "error",
                    text1: t('toast.errorUpdating')
                })
            }
        }
        console.log("end");
    }, [])

    const handleSaveChange = useCallback(async () => {
        if (sticker && sticker.id && stickerName !== sticker.shortname) {
            console.log("start");
            const stickerChange: MezonUpdateClanStickerByIdBody = {
                source: sticker?.source,
                category: sticker?.category,
                shortname: stickerName,
            };

            setSticker({
                ...sticker,
                shortname: stickerName
            });

            const result = await dispatch(updateSticker({ stickerId: sticker?.id ?? '', request: stickerChange }));
            // @ts-ignore
            if (!!result?.error) {
                Toast.show({
                    type: "error",
                    text1: t('toast.errorUpdating')
                })
            }
            console.log("done");
            return;
        }
    }, []);

    return (
        <View style={{ backgroundColor: "red" }}>
            <Swipeable
                renderRightActions={() => <CloseAction />}
                renderLeftActions={() => <CloseAction />}
                onSwipeableOpen={handleDeleteSticker}
            >
                <View style={styles.container}>
                    <View style={styles.flexRow}>
                        <FastImage
                            source={{ uri: data.source }}
                            style={{ height: 40, width: 40 }}
                        />

                        <TextInput
                            value={stickerName}
                            style={{ color: themeValue.text }}
                            onChangeText={setStickerName}
                            onBlur={handleSaveChange}
                        />
                    </View>

                    <View style={styles.flexRow}>
                        <Text style={styles.text}>{user?.user?.username}</Text>
                        <MezonAvatar
                            height={30}
                            width={30}
                            avatarUrl={user?.user?.avatar_url}
                            username={user?.user?.username}
                        />
                    </View>
                </View>
            </Swipeable>
        </View>

    )
}