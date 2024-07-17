import { EmptySearchIcon } from "@mezon/mobile-components";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import styles from "./EmptyMedia.styles";

const EmptyMedia = () => {
  const { t } = useTranslation('media');
  return (
    <View style={styles.emptyBox}>
      <EmptySearchIcon width={100} height={100} />
      <Text style={styles.textEmpty}>{t('emptyDescription')}</Text>
    </View>
  )
}

export default EmptyMedia;
