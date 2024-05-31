import { Text, View } from "react-native";
import styles from "./styles";
import MezonInput from "apps/mobile/src/app/temp-ui/MezonInput";
import { useTranslation } from "react-i18next";

interface IDetailUser {
    username: string;
    displayName: string;
    bio: string;
}

interface IDetailInfoProps {
    value: IDetailUser,
    onChange: (value: IDetailUser) => void
}
export default function DetailInfo({ value, onChange }: IDetailInfoProps) {
    const { t } = useTranslation(['profileSetting']);

    return (
        <View style={styles.container}>
            <View style={styles.nameWrapper}>
                <Text style={styles.name}>{value.displayName}</Text>
                <Text style={styles.username}>{value.username}</Text>
            </View>
            <MezonInput
                placeHolder={value.displayName}
                label={t('fields.displayName.label')}
            />

            <MezonInput
                textarea
                placeHolder=""
                label={t("fields.pronouns.label")}
            />

            <MezonInput
                textarea
                placeHolder=""
                label={t("fields.bio.label")}
            />
        </View>
    )
}