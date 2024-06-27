import { ChannelMembersEntity } from "@mezon/utils";
import { Image, View } from "react-native";
import { Text } from '@mezon/mobile-ui';
import { OfflineStatus, OnlineStatus } from "@mezon/mobile-components"
import style from "./style";
import { useMemo } from "react";
interface IProps {
    user: ChannelMembersEntity;
    status?: boolean;
    numCharCollapse?: number;
    isHideIconStatus?: boolean;
    isHideUserName?: boolean;
    isOffline?: boolean;
    nickName?: string;
}

export default function MemberProfile({
    user, status,
    isHideIconStatus, isHideUserName,
    numCharCollapse = 6,
    isOffline,
    nickName
}: IProps) {

    const name = useMemo(() => {
        if (user) {
          return nickName || user?.user?.display_name || user?.user?.username
        }
    }, [user])
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
                                ? `${name.substring(0, numCharCollapse)}...`
                                : name
                        }
                    </Text>
                }
            </View>
        </View >
    )
}
