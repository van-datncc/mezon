import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BannerAvatar from "./components/Banner";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { HashSignIcon } from "@mezon/mobile-components";
import styles from "./styles";
import DetailInfo from "./components/Info";

export default function UserProfile() {
    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <BannerAvatar />
            <View style={styles.btnGroup}>
                <View style={styles.btnIcon}>
                    <TouchableOpacity>
                        <HashSignIcon width={16} height={16} />
                    </TouchableOpacity>
                </View>
            </View>
            <DetailInfo />
        </ScrollView>
    )
}