import { Image, View } from "react-native";
import styles from "./styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PenIcon } from "@mezon/mobile-components";
import Toast from "react-native-toast-message";
import { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker"

interface IBannerAvatarProps {
    avatar: string;
    onChange?: (url: string)=>void;
}

export default function BannerAvatar({ avatar, onChange }: IBannerAvatarProps) {
    const [bannerColor, setBannerColor] = useState<string>("purple");
    const [imageUrl, setImageUrl] = useState<string>(avatar);

    console.log(avatar);
    

    function reserve() {
        Toast.show({
            type: "info",
            text1: "Coming soon..."
        })
    }

    async function selectImage() {
        const result = await launchImageLibrary({
            mediaType: "photo",
            includeBase64: true
        });
        if (result.assets) {
            // TODO: Update banner color
            setImageUrl(result.assets[0].uri);
            onChange && onChange(result.assets[0].uri);
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