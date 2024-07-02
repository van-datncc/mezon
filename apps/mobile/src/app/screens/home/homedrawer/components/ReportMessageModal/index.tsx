import { IMessageWithUser } from "@mezon/utils";
import { MezonModal } from "apps/mobile/src/app/temp-ui";
import { memo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import MessageItem from "../../MessageItem";

interface IReportMessageModalProps {
    isVisible: boolean;
    onVisibleChange: (value: boolean) => void;
	message: IMessageWithUser;
}

export const ReportMessageModal = memo((props: IReportMessageModalProps) => {
    const { isVisible, onVisibleChange, message } = props;
    const [visibleBackButton, setVisibleBackButton] = useState(true);

    const onBack = () => {
        console.log('back!', message);
    }

    return (
        <MezonModal
            visible={isVisible}
            rightClose={true}
            onBack={onBack}
            visibleBackButton={visibleBackButton}
            visibleChange={onVisibleChange}
        >
            <View style={styles.reportMessageModalContainer}>
                <View>
                    <Text>Report message</Text>
                    <Text>sub description</Text>
                </View>

                <View>
                    <Text>Selected message</Text>
                    {/* <MessageItem
                        messageId={valueThread?.id}
                        mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
                        channelId={currentChannel.channel_id}
                        channelLabel={currentChannel?.channel_label}
                        isNumberOfLine={true}
                    /> */}
                </View>

                <TouchableOpacity style={styles.cancelButtonWrapper} onPress={() => onVisibleChange(false)}>
                    <Text style={styles.cannelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </MezonModal>
    )
})