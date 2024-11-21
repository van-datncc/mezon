import { useTheme } from '@mezon/mobile-ui';
import { appActions, getStoreAsync } from '@mezon/store-mobile';
import { memo } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { style } from './styles';

interface EmbedDescriptionProps {
	title: string;
	url: string;
}

export const EmbedTitle = memo(({ title, url }: EmbedDescriptionProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const handleOpenUrl = async () => {
		const store = await getStoreAsync();
		store.dispatch(appActions.setLoadingMainMobile(true));
		await Linking.openURL(url);
		store.dispatch(appActions.setLoadingMainMobile(false));
	};

	return (
		<View style={styles.container}>
			{url ? (
				<TouchableOpacity onPress={handleOpenUrl}>
					<Text style={styles.urlTitle}>{title}</Text>
				</TouchableOpacity>
			) : (
				<Text style={styles.title}>{title}</Text>
			)}
		</View>
	);
});
