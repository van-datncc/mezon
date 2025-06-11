import { ETypeSearch } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { getStoreAsync } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import { style } from './styles';

function SearchDmList() {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['clanMenu']);
	const navigation = useNavigation<any>();

	const navigateToSearchPage = async () => {
		navigation.navigate(APP_SCREEN.MENU_CHANNEL.STACK, {
			screen: APP_SCREEN.MENU_CHANNEL.SEARCH_MESSAGE_CHANNEL,
			params: {
				typeSearch: ETypeSearch.SearchAll,
				currentChannel: {}
			}
		});
	};

	return (
		<Pressable onPress={navigateToSearchPage} style={styles.searchMessage}>
			<MezonIconCDN icon={IconCDN.magnifyingIcon} height={size.s_18} width={size.s_18} color={themeValue.text} />
			<Text style={styles.placeholderSearchBox}>{t('common.search')}</Text>
		</Pressable>
	);
}

export default React.memo(SearchDmList);
