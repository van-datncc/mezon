import { CheckIcon } from '@mezon/mobile-components';
import { Colors, useTheme } from '@mezon/mobile-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, View } from 'react-native';
import { styles } from './styles';

export const LanguageSetting = () => {
	const [currentLanguage, setCurrentLanguage] = useState<string>('en');
	const { themeValue } = useTheme();
	const themeStyles = styles(themeValue);
	const { i18n } = useTranslation();

	useEffect(() => {
		setCurrentLanguage(i18n.language);
	}, [i18n]);

	const languageList = useMemo(() => {
		return [
			{
				title: 'English',
				value: 'en'
			},
			{
				title: 'Tiếng Việt',
				value: 'vi'
			}
		];
	}, []);

	const changeLanguage = (lang: string) => {
		setCurrentLanguage(lang);
		i18n.changeLanguage(lang);
	};

	return (
		<View style={themeStyles.languageSettingContainer}>
			<FlatList
				data={languageList}
				keyExtractor={(item) => item.value}
				ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
				renderItem={({ item }) => (
					<Pressable onPress={() => changeLanguage(item.value)} style={[themeStyles.languageItem]}>
						<Text style={themeStyles.optionText}>{item.title}</Text>
						{currentLanguage === item.value ? <CheckIcon color={Colors.bgViolet} /> : null}
					</Pressable>
				)}
			/>
		</View>
	);
};
