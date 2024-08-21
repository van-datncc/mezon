import { Icons } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { CircleXIcon } from 'libs/mobile-components/src/lib/icons2';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import { style } from './styles';

interface MezonInputProps {
	onChangeText?: (text: string) => void;
	hasBackground?: boolean;
	size?: 'small' | 'medium' | 'large';
	value?: string;
}

export default function MezonSearch({ onChangeText, hasBackground, size = 'medium', value }: MezonInputProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const inputRef = useRef(null);
	const { t } = useTranslation(['searchMessageChannel']);

	const clearTextInput = () => {
		onChangeText('');
		setTimeout(() => {
			inputRef.current?.focus();
		}, 100);	
	};

	return (
		<View style={[styles.inputWrapper, { backgroundColor: hasBackground ? themeValue.primary : themeValue.secondary }]}>
			<Icons.MagnifyingIcon color={themeValue.text} height={20} width={20} />
			<TextInput 
				ref={inputRef}
				style={styles.input} 
				placeholderTextColor={themeValue.text} 
				placeholder={t('search')}
				value={value} 
				onChangeText={onChangeText} 
				autoFocus
			/>
			{!!value?.length && (
				<Pressable onPress={clearTextInput}>
					<CircleXIcon height={18} width={18} color={themeValue.text} />
				</Pressable>
			)}
		</View>
	);
}
