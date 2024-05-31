import { Text, View } from "react-native";
import styles from "./styles";
import MezonInput from "apps/mobile/src/app/temp-ui/MezonInput";
import { useTranslation } from "react-i18next";

export default function DetailInfo() {
    const { t } = useTranslation(['profileSetting']);

    return (
        <View style={styles.container}>
            <View style={styles.nameWrapper}>
                <Text style={styles.name}>nghia.dotuan</Text>
                <Text style={styles.username}>nghiacangao</Text>
            </View>
            <MezonInput
                placeHolder="nghiacangao"
                label={t('fields.displayName.label')}
            />

            <MezonInput
                textarea
                placeHolder=""
                label={t("fields.pronouns.label")}
            />

            <MezonInput
                textarea
                placeHolder="nghiacangao"
                label={t("fields.bio.label")}
            />
        </View>
    )
}