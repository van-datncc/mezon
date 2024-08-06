
import { useTheme } from "@mezon/mobile-ui";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import OptionSearch from "../OptionSearch";
import { style } from "./ListOptionSearch.styles";

export const searchOptions = [
  { title: 'from:', content: 'user', value: 'username' },
  { title: 'mentions:', content: 'user', value: 'username' },
  { title: 'has:', content: 'link, embed or file', value: 'attachment' },
  { title: 'before:', content: 'specific data', value: 'username' },
  { title: 'during:', content: 'specific data', value: 'username' },
  { title: 'after:', content: 'specific data', value: 'username' },
  { title: 'pinned:', content: 'true or false', value: 'username' },
];
const ListOptionSearch = () => {
  const { t } = useTranslation(['searchMessageChannel']);
  const { themeValue } = useTheme();
  const styles = style(themeValue);

  return (
    <View style={styles.optionSearchContainer}>
      <Text style={styles.headerTitle}>{t('filterResults')}</Text>
      {
        searchOptions.map((option, index) => (
          <OptionSearch option={option} key={`${option.value}_${index}`}></OptionSearch>
        ))
      }
    </View>
  )
}

export default ListOptionSearch;
