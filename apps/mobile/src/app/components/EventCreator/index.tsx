import { Text, View } from "react-native";
import { MenuClanScreenProps, APP_SCREEN } from "../../navigation/ScreenTypes";
import { MezonInput, MezonOption, MezonSelect } from "../../temp-ui";
import { useTranslation } from "react-i18next";
import styles from "./styles";
import { SpeakerIcon } from "@mezon/mobile-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectVoiceChannelAll } from "@mezon/store-mobile";
import MezonButton from "../../temp-ui/MezonButton2";


type CreateEventScreen = typeof APP_SCREEN.MENU_CLAN.CREATE_EVENT;
export default function EventCreator({ navigation }: MenuClanScreenProps<CreateEventScreen>) {
    const { t } = useTranslation(['eventCreator']);
    const voicesChannel = useSelector(selectVoiceChannelAll);
    const [eventType, setEventType] = useState<number>(0);

    const options = [
        {
            title: t('fields.channelType.voiceChannel.title'),
            description: t('fields.channelType.voiceChannel.description'),
            value: 0
        },
        {
            title: t('fields.channelType.somewhere.title'),
            description: t('fields.channelType.somewhere.description'),
            value: 1
        }
    ]

    const channels = voicesChannel.map(item => ({
        title: item.channel_label,
        value: item.channel_id
    }))

    function handleEventTypeChange(value: number) {
        setEventType(value);
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                {/* <Text>Step 1 of 3</Text> */}
                <Text style={styles.title}>{t('title')}</Text>
                <Text style={styles.subtitle}>{t('subtitle')}</Text>
            </View>

            <MezonOption
                data={options}
                onChange={handleEventTypeChange}
            />

            {
                eventType === 0
                    ? <MezonSelect
                        title={t('fields.channel.title')}
                        data={channels} icon={<SpeakerIcon height={20} width={20} />}
                    />

                    : <MezonInput
                        onTextChange={() => { }} value=""
                        inputWrapperStyle={styles.input}
                        label={t('fields.address.title')}
                        placeHolder={t('fields.address.placeholder')}
                    />
            }

            <Text style={styles.bottomDescription}>{t('description')}</Text>

            <MezonButton title={t('actions.next')} type="success"/>
        </View>
    )
}