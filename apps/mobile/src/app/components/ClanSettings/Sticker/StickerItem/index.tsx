import { useTheme } from "@mezon/mobile-ui";
import { selectMemberClanByUserId, useAppSelector } from "@mezon/store-mobile";
import { MezonAvatar } from "apps/mobile/src/app/temp-ui";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { style } from "./styles";

interface IStickerItem {
    creatorID: string;
    name: string;
    url: string;
}
export default function StickerSettingItem({ creatorID, name, url }: IStickerItem) {
    const { themeValue } = useTheme();
    const styles = style(themeValue);
    const user = useAppSelector(selectMemberClanByUserId(creatorID));

    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <FastImage
                    source={{ uri: url }}
                    style={{ height: 40, width: 40 }}
                />

                <Text style={styles.text}>{name}</Text>
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
    )
}