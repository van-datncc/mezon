import { Image, View } from "react-native";
import styles from "./styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PenIcon } from "@mezon/mobile-components";
import Toast from "react-native-toast-message";
import { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";


export default function BannerAvatar() {
    const [bannerColor, setBannerColor] = useState<string>("purple");
    const [imageUrl, setImageUrl] = useState<string>("https://yt3.ggpht.com/yti/ANjgQV-w_YfI5jYAikRqhb_bQ-Japg9HasGI3_OqRNkr6fc=s108-c-k-c0x00ffffff-no-rj");

    function reserve() {
        Toast.show({
            type: "info",
            text1: "Coming soon..."
        })
    }

    async function selectImage() {
        const result = await launchImageLibrary({ mediaType: "photo" });
        if (result.assets) {
            // @ts-ignore
            setImageUrl(result.assets[0].uri);
        }
    }

    return (
        <View style={{ display: "flex" }}>
            <View style={[styles.bannerContainer, { backgroundColor: bannerColor }]}>
                <View style={styles.btnGroup}>
                    <TouchableOpacity
                        onPress={reserve}
                        style={styles.btnRound}>
                        <PenIcon height={12} width={12} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatar}
                    source={{ uri: imageUrl }}
                />

                <View style={[styles.btnGroup, styles.absolute]}>
                    <TouchableOpacity
                        onPress={selectImage}
                        style={styles.btnRound} >
                        <PenIcon height={12} width={12} color="gray" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.onLineStatus]}></View>
            </View>
        </View>
    )
}