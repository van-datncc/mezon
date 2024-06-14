import { EventManagementEntity, selectChannelById, selectMemberByUserId } from "@mezon/store-mobile";
import { Text, View } from "react-native";
import styles from "./styles";
import { CalendarIcon, CheckIcon, LocationIcon, MemberListIcon, ShareIcon, SpeakerIcon } from "@mezon/mobile-components";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import { isSameDay, timeFormat } from "./timeFormatter";
import { OptionEvent } from "@mezon/utils";
import MezonBadge from "../../../temp-ui/MezonBadge";
import MezonButton from "../../../temp-ui/MezonButton2";

interface IEventItemProps {
    event: EventManagementEntity
}

export default function EventItem({ event }: IEventItemProps) {
    const userCreate = useSelector(selectMemberByUserId(event?.creator_id || ''));
    const option = event.address ? OptionEvent.OPTION_LOCATION : OptionEvent.OPTION_SPEAKER;
    const channelVoice = useSelector(selectChannelById(event?.channel_id));
    // const channelFirst = useSelector(selectChannelFirst);

    return (
        <View style={styles.container}>
            <View style={styles.infoSection}>
                <View style={styles.inline}>
                    {
                        // @ts-ignore
                        isSameDay(event.create_time as string) &&
                        <MezonBadge title="new" type="success" />
                    }
                    <CalendarIcon height={20} width={20} />
                    <Text style={styles.smallText}>{timeFormat(event.start_time)} </Text>

                    {/* Coming soon */}
                    {/* Active now */}
                </View>

                <View style={[styles.inline, styles.infoRight]}>
                    <View style={styles.avatar}>
                        <FastImage
                            source={{ uri: userCreate.user.avatar_url }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.inline}>
                        <MemberListIcon height={10} width={10} />
                        <Text style={styles.tinyText}>{event.user_ids.length}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.mainSec}>
                <Text style={{ color: "white" }}>{event.title}</Text>
                {event.description && <Text style={styles.description}>{event.description}</Text>}
                {option === OptionEvent.OPTION_SPEAKER && (
                    <View style={styles.inline}>
                        <SpeakerIcon height={16} width={16} />
                        <Text style={styles.smallText}>{channelVoice.channel_label}</Text>
                    </View>
                )}

                {option === OptionEvent.OPTION_LOCATION && (
                    <View style={styles.inline}>
                        <LocationIcon height={16} width={16} />
                        <Text style={styles.smallText}>{event.title}</Text>
                    </View>
                )}

                {/* {option === '' && !event && !channelVoice && (
                <>
                    <Icons.Location />
                    <p className="hover:underline text-slate-400">{channelFirst.channel_label}</p>
                </>
            )} */}
            </View>

            <View style={styles.inline}>
                {/* <MezonButton title="End event" fluid /> */}
                <MezonButton icon={<CheckIcon height={16} width={16} />} title="Interested" fluid border />
                {/* <MezonButton title="Start event" fluid type="success" /> */}
                <MezonButton icon={<ShareIcon height={20} width={20} />} />
            </View>
        </View>
    )
}