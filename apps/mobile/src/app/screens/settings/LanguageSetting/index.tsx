import { CheckIcon } from '@mezon/mobile-components';
import { Colors, useTheme } from '@mezon/mobile-ui';
import { appActions, selectCurrentLanguage, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, View } from 'react-native';
import { styles } from './styles';

export const LanguageSetting = () => {
	const currentLanguage = useAppSelector(selectCurrentLanguage);
	const dispatch = useAppDispatch();
	const { themeValue } = useTheme();
	const themeStyles = styles(themeValue);
	const { i18n } = useTranslation();

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

	const changeLanguage = async (lang: string) => {
		try {
			dispatch(appActions.setLanguage(lang));
			await i18n.changeLanguage(lang);
		} catch (error: any) {
			console.error('Error changing language: ', error);
		}
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
			<Text style={{ color: Colors.textGray }}>{currentLanguage}</Text>
		</View>
	);
};
