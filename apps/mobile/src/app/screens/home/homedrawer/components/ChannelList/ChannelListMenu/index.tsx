import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import styles from "./styles";
import MezonBadge from "apps/mobile/src/app/temp-ui/MezonBadge";
import { AddFillIcon,  BellIcon, CircleIcon, KeyframeIcon, NittroIcon } from "@mezon/mobile-components";
import MezonButtonIcon from "apps/mobile/src/app/temp-ui/MezonButtonIcon";

export default function ServerMenu() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarWrapper}>
                    <FastImage
                        source={{ uri: "https://avatars.githubusercontent.com/u/14251235?s=280&v=4" }}
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>
                <Text style={styles.serverName}>KOMU</Text>
                <View style={styles.info}>
                    <MezonBadge title="Community Server" />
                    <View style={styles.inlineInfo}>
                        <CircleIcon height={10} width={10} color="green" />
                        <Text style={styles.inlineText}>333 Online</Text>
                    </View>

                    <View style={styles.inlineInfo}>
                        <CircleIcon height={10} width={10} color="gray" />
                        <Text style={styles.inlineText}>398 Members</Text>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.actionWrapper}
                    horizontal>
                    <MezonButtonIcon title="18 Boots" icon={KeyframeIcon} iconStyle={{ color: "red" }} />
                    <MezonButtonIcon title="Invite" icon={AddFillIcon} />
                    <MezonButtonIcon title="Notifications" icon={BellIcon} />
                </ScrollView>
            </View>
        </View>
    )
}