import { Text, TouchableOpacity, View } from "react-native";
import { styles } from './styles';
import LongCornerIcon from '../../../../assets/svg/long-corner.svg';
import ShortCornerIcon from '../../../../assets/svg/short-corner.svg';
import { useSelector } from "react-redux";
import { selectIsUnreadChannelById, selectLastChannelTimestamp, selectNotificationMentionCountByChannelId } from "@mezon/store-mobile";

interface IThreadListItem {
    onPress?: (thread: any) => void;
    thread: any;
    isActive?: boolean;
    isFirstThread?: boolean;
}

function useChannelBadgeCount(channelId: string) {
    const lastChannelTimestamp = useSelector(selectLastChannelTimestamp(channelId));
    const numberNotification = useSelector(selectNotificationMentionCountByChannelId(channelId, lastChannelTimestamp));

    return numberNotification;
}


export default function ThreadListItem({ onPress, thread, isActive, isFirstThread }: IThreadListItem) {
    const isUnReadChannel = useSelector(selectIsUnreadChannelById(thread.id));
    const numberNotification = useChannelBadgeCount(thread.id);

    return (
        <TouchableOpacity
            key={thread.id}
            activeOpacity={1}
            onPress={() => {
                onPress(thread);
            }}
            style={[styles.channelListLink]}
        >
            <View style={[styles.threadItem]}>
                {isActive && <View style={[styles.threadItemActive, isFirstThread && styles.threadFirstItemActive]} />}
                {isFirstThread ? <ShortCornerIcon /> : <LongCornerIcon />}
                <Text style={[styles.titleThread, isUnReadChannel && styles.channelListItemTitleActive]}>{thread?.channel_label}</Text>
            </View>

            {numberNotification > 0 &&
                <View style={styles.channelDotWrapper}>
                    <Text style={styles.channelDot}>{numberNotification}</Text>
                </View>
            }
        </TouchableOpacity>
    )
}