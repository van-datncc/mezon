import { IMessageWithUser } from "@mezon/utils";
import { memo } from "react";
import { View, Text, ScrollView } from "react-native";
import { EMessageActionType } from "../../enums";
import Modal from "react-native-modal";
import { styles } from "./styles";
import MessageItem from "../../MessageItem";
import { ChannelStreamMode } from "mezon-js";
import { useDispatch } from "react-redux";
import { AppDispatch, pinMessageActions } from "@mezon/store-mobile";
import { SeparatorWithLine } from "../../../../../components/Common";
import { MezonButton } from "../../../../../temp-ui";
import { Colors } from "@mezon/mobile-ui";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { CheckIcon } from "@mezon/mobile-components";

interface IConfirmPinMessageModalProps {
    isVisible: boolean,
    onClose: () => void,
    message: IMessageWithUser;
    type?: EMessageActionType
}

export const ConfirmPinMessageModal = memo((props: IConfirmPinMessageModalProps) => {
    const { isVisible, message, onClose, type } = props;
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation('message');

    const onConfirm = async () => {
        switch (type) {
            case EMessageActionType.UnPinMessage:
		        dispatch(pinMessageActions.deleteChannelPinMessage({ channel_id: message?.channel_id || '', message_id: message?.id }));
                break;
            case EMessageActionType.PinMessage:
                dispatch(pinMessageActions.setChannelPinMessage({ channel_id: message?.channel_id, message_id: message?.id }));
                break;
            default:
                break;
        }
        Toast.show({
			type: 'success',
			props: {
				text2: EMessageActionType.PinMessage === type ? t('pinSuccess') : t('unpinSuccess'),
				leadingIcon: <CheckIcon color={Colors.green} />,
			},
		});
        onClose()
    }
    return (
        <View style={{flex: 1}}>
            <Modal
                isVisible={isVisible}
                animationIn={'fadeIn'}
                hasBackdrop={true}
                coverScreen={true}
                avoidKeyboard={false}
                backdropColor={'rgba(0,0,0, 0.7)'}
            >
                <View style={styles.container}>
                    <View>
                        <Text style={styles.title}>{EMessageActionType.PinMessage === type ? t('pinMessage') : t('unpinMessage')}</Text>
                        <SeparatorWithLine />
                    </View>
                    <Text style={styles.descriptionText}>{EMessageActionType.PinMessage === type ? t('confirmPinMessage') : t('confirmUnPinMessage')}</Text>
                    <ScrollView>
						{message && <MessageItem message={message} mode={ChannelStreamMode.STREAM_MODE_CHANNEL} showUserInformation preventAction />}
					</ScrollView>
                    <View style={styles.buttonsWrapper}>
                        <MezonButton
                            onPress={() => onConfirm()}
                            textStyle={[styles.button, {backgroundColor: Colors.bgViolet}]}
                            viewContainerStyle={styles.borderRadius}
                        >
                            {t('Yes')}
                        </MezonButton>
                        <MezonButton
                            onPress={() => onClose()}
                            textStyle={styles.button}
                            viewContainerStyle={styles.borderRadius}
                        >
                            {t('No')}
                        </MezonButton>
                    </View>
                </View>
            </Modal>
        </View>
    )
})