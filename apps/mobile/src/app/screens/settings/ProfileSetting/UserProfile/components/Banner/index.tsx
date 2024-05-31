import { Image, View } from "react-native";
import styles from "./styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PenIcon } from "@mezon/mobile-components";


export default function BannerAvatar() {
    return (
        <View style={{ display: "flex" }}>
            <View style={styles.bannerContainer}>
                <View style={styles.btnGroup}>
                    <TouchableOpacity style={styles.btnRound}>
                        <PenIcon height={14} width={14} color="gray"/>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatar}
                    source={{ uri: "https://yt3.ggpht.com/yti/ANjgQV-w_YfI5jYAikRqhb_bQ-Japg9HasGI3_OqRNkr6fc=s108-c-k-c0x00ffffff-no-rj" }}
                />
                <View style={[styles.btnGroup, styles.absolute]}>
                    <TouchableOpacity style={styles.btnRound}>
                        <PenIcon height={14} width={14} color="gray"/>
                    </TouchableOpacity>
                </View>

                <View style={[styles.onLineStatus]}></View>
            </View>
        </View>
    )
}