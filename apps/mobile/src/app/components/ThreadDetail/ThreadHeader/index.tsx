import { memo, useContext, useMemo } from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./styles";
import { threadDetailContext } from "../MenuThreadDetail";
import { HashSignIcon, UserGroupIcon } from "@mezon/mobile-components";
import { ChannelType } from "mezon-js";

export const ThreadHeader = memo(() => {
    const currentChannel = useContext(threadDetailContext);
    const isDMThread = useMemo(() => {
        return [ChannelType.CHANNEL_TYPE_DM, ChannelType.CHANNEL_TYPE_GROUP].includes(currentChannel?.type)
    }, [currentChannel]);
    const userStatus = true;
    return (
        <View style={styles.channelLabelWrapper}>
            {isDMThread ? (
                <View style={styles.avatarWrapper}>
                    <View>
                        {currentChannel?.channel_avatar?.length > 1 ? (
                            <View style={[styles.groupAvatar,styles.avatarSize]}>
                                <UserGroupIcon />
                            </View>
                        ): (
                            <View style={styles.avatarSize}>
                                <Image source={{ uri: currentChannel.channel_avatar[0] }} style={[styles.friendAvatar, styles.avatarSize]} />
                                <View style={[styles.statusCircle, userStatus ? styles.online : styles.offline]} />
                            </View>
                        )}
                    </View>
                    <Text numberOfLines={1} style={styles.channelLabel}>{currentChannel?.channel_label}</Text>
                </View>
            ): (
                <View style={styles.channelText}>
                    <HashSignIcon width={18} height={18} />
                    <Text numberOfLines={1} style={styles.channelLabel}>{currentChannel?.channel_label}</Text>
                </View>
            )}
        </View>
    )
})