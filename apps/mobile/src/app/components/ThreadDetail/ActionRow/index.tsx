import { useNavigation } from "@react-navigation/native";

import { View } from "react-native";
import { Pressable, Text } from "react-native";
import styles from "./style";
import { MuteIcon, SearchIcon, SettingIcon, ThreadIcon } from "@mezon/mobile-components";

export default function ActionRow() {
    const navigation = useNavigation()

    const actionList = [
        {
            title: 'Search',
            action: () => { },
            icon: <SearchIcon width={22} height={22} />
        },
        {
            title: 'Threads',
            action: () => {
                // @ts-ignore
                navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD });
            },
            icon: <ThreadIcon width={22} height={22} />
        },
        {
            title: 'Mute',
            action: () => { },
            icon: <MuteIcon width={22} height={22} />
        },
        {
            title: 'Settings',
            action: () => { },
            icon: <SettingIcon width={22} height={22} />
        },
    ]
    return (
        <View style={styles.container}>
            {
                actionList.map((action, index) => (
                    <Pressable
                        key={index.toString()}
                        onPress={action.action}>

                        <View style={styles.iconBtn}>
                            <View style={styles.iconWrapper}>
                                {action.icon}
                            </View>

                            <Text style={styles.optionText}>
                                {action.title}
                            </Text>
                        </View>
                    </Pressable>
                ))
            }
        </View>
    )
}