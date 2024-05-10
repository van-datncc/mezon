import { ChannelMembersEntity } from "@mezon/utils";
import { Image, StyleSheet, Text, View } from "react-native";
import { OfflineStatus, OnlineStatus } from "@mezon/mobile-components"
import { Colors, Fonts, Metrics, } from "@mezon/mobile-ui";

interface IProps {
    user: ChannelMembersEntity;
    status?: boolean;
    numCharCollapse?: number;
    isHideIconStatus?: boolean;
    isHideUserName?: boolean;
    isOffline?: boolean;
}

export default function MemberProfile({
    user, status,
    isHideIconStatus, isHideUserName,
    numCharCollapse = 6,
    isOffline
}: IProps) {
    return (
        <View style={{ ...style.container, opacity: isOffline ? 0.5 : 1 }} >

            {/* Avatar */}
            <View style={{ padding: 0 }}>
                <View style={style.avatarContainer}>
                    <Image
                        style={style.avatar}
                        source={{ uri: user.user.avatar_url }}
                    />

                    {!isHideIconStatus &&
                        <View style={style.statusWrapper}>
                            {status ? <OnlineStatus /> : <OfflineStatus />}
                        </View>
                    }
                </View>
            </View>

            {/* Name */}
            <View style={{ ...style.nameContainer, borderBottomWidth: 1 }}>
                {!isHideUserName &&
                    <Text style={style.textName}>
                        {
                            user.user.username.length > numCharCollapse
                                ? `${user.user.username.substring(0, numCharCollapse)}...`
                                : user.user.username
                        }
                    </Text>
                }
            </View>
        </View >
    )
}


const style = StyleSheet.create({
    avatar: {
        height: 35,
        width: 35,
        overflow: "hidden",
        borderRadius: 9999,
    },

    avatarContainer: {
        position: "relative",
        width: 35,
        height: 35,
        borderRadius: 9999
    },

    statusWrapper: {
        backgroundColor: Colors.secondary,
        padding: 3,
        position: "absolute",
        bottom: -4,
        right: -4,
        borderRadius: 9999,
    },

    nameContainer: {
        paddingVertical: 20,
        width: "100%",
        borderBottomColor: "#5a5b5c30",
    },

    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        paddingHorizontal: 20
    },

    textName: {
        color: "purple",
        fontSize: Fonts.size.small,
        fontWeight: "700"
    }
})