import { ActionEmitEvent, Icons } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Pressable, TextInput, View } from 'react-native';
import { useThrottledCallback } from 'use-debounce';
import { style } from './styles';

function SearchDmList() {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const searchInputRef = useRef(null);
	const [searchText, setSearchText] = useState<string>('');
	const { t } = useTranslation(['dmMessage']);

	const handleSearchDM = (value) => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_SEARCH_DM, { searchText: value });
	};

	const clearTextInput = () => {
		if (searchInputRef?.current) {
			searchInputRef.current.clear();
			setSearchText('');
			handleSearchDM('');
		}
	};
	const typingSearchDebounce = useThrottledCallback((text) => {
		setSearchText(text);
		handleSearchDM(text);
	}, 500);

	return (
		<View style={styles.searchMessage}>
			<Icons.MagnifyingIcon height={size.s_20} width={size.s_20} color={themeValue.text} />
			<TextInput
				ref={searchInputRef}
				placeholder={t('common:searchPlaceHolder')}
				placeholderTextColor={themeValue.text}
				style={styles.searchInput}
				onChangeText={(text) => typingSearchDebounce(text)}
			/>
			{!!searchText?.length && (
				<Pressable onPress={clearTextInput}>
					<Icons.CircleXIcon height={size.s_20} width={size.s_20} color={themeValue.text} />
				</Pressable>
			)}
		</View>
	);
}

export default React.memo(SearchDmList);
