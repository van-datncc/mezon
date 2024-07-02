import { IMessageWithUser } from "@mezon/utils";
import { MezonModal } from "../../../../../../app/temp-ui";
import { memo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import MessageItem from "../../MessageItem";
import { ChannelStreamMode } from "mezon-js";

interface IReportMessageModalProps {
    isVisible: boolean;
    onClose: () => void;
	message: IMessageWithUser;
}
//TODO: update later, call api
export const ReportMessageModal = memo((props: IReportMessageModalProps) => {
    const { isVisible, onClose, message } = props;
    const [visibleBackButton, setVisibleBackButton] = useState(true);

    const onBack = () => {
        console.log('back!', message);
    }

    const onVisibleChange = (value: boolean) => {
        if (!value) {
            onClose();
        }
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
                <View style={styles.contentWrapper}>
                    <View>
                        <Text>Report message</Text>
                        <Text>sub description</Text>
                    </View>

                    <Text style={styles.selectedMessageText}>Selected message</Text>
                    <View style={styles.messageBox}>
                        <MessageItem
                            messageId={message.id}
                            channelId={message.channel_id}
                            mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
                            showUserInformation
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.cancelButtonWrapper} onPress={() => onVisibleChange(false)}>
                    <Text style={styles.cannelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </MezonModal>
    )
})