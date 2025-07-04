import { size, useTheme } from '@mezon/mobile-ui';
import { sleep } from '@mezon/utils';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { StyleProp, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ErrorInput } from '../../components/ErrorInput';
import { IconCDN } from '../../constants/icon_cdn';
import { validInput } from '../../utils/validate';
import MezonIconCDN from '../MezonIconCDN';
import { style } from './styles';

interface IMezonInputProps {
	placeHolder?: string;
	label?: string;
	titleStyle?: StyleProp<TextStyle>;
	titleUppercase?: boolean;
	textarea?: boolean;
	value?: string;
	onTextChange?: (value: string) => void;
	maxCharacter?: number;
	inputWrapperStyle?: StyleProp<ViewStyle>;
	inputStyle?: StyleProp<TextStyle>;
	showBorderOnFocus?: boolean;
	errorMessage?: string;
	onFocus?: () => void;
	onBlur?: () => void;
	prefixIcon?: ReactNode;
	postfixIcon?: ReactNode;
	disabled?: boolean;
	isValid?: boolean;
	defaultValue?: string;
	forcusInput?: boolean;
}

export default function MezonInput({
	placeHolder,
	label,
	textarea,
	value,
	onFocus,
	onBlur,
	onTextChange,
	maxCharacter = 60,
	inputWrapperStyle,
	inputStyle,
	showBorderOnFocus,
	errorMessage,
	titleUppercase,
	titleStyle,
	postfixIcon,
	prefixIcon,
	disabled = false,
	isValid = true,
	defaultValue = '',
	forcusInput = false
}: IMezonInputProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const ref = useRef<TextInput>(null);
	const [showCount, setShowCount] = useState<boolean>(false);
	const [isFocus, setFocus] = useState<boolean>(false);
	const [isCheckValid, setIsCheckValid] = useState<boolean>(true);

	useEffect(() => {
		setIsCheckValid(validInput(value));
	}, [value]);

	const focusInput = async () => {
		await sleep(300);
		ref.current.focus();
		setFocus(true);
	};

	useEffect(() => {
		if (forcusInput) {
			focusInput();
		}
	}, []);

	function handleClearBtn() {
		ref && ref.current && ref.current.clear();
		onTextChange && onTextChange('');
	}

	function handleFocus() {
		onFocus?.();
		setShowCount(true);
		setFocus(true);
	}

	function handleBlur() {
		setShowCount(false);
		setFocus(false);
		onBlur?.();
	}

	const renderBorder = (): StyleProp<ViewStyle> => {
		if (showBorderOnFocus) {
			return isFocus ? styles.fakeInputFocus : styles.fakeInputBlur;
		} else {
			return {};
		}
	};

	return (
		<View style={styles.container}>
			{label && <Text style={[styles.label, titleUppercase ? styles.titleUppercase : {}, titleStyle]}>{label}</Text>}
			<View style={[styles.fakeInput, textarea && { paddingTop: 10 }, renderBorder(), inputWrapperStyle]}>
				<View style={styles.inputBox}>
					{prefixIcon}
					<TextInput
						ref={ref}
						value={value}
						onChangeText={onTextChange}
						multiline={textarea}
						numberOfLines={textarea ? 4 : 1}
						textAlignVertical={textarea ? 'top' : 'center'}
						maxLength={maxCharacter}
						style={[styles.input, textarea && { height: size.s_100 }, inputStyle]}
						placeholder={placeHolder}
						placeholderTextColor="gray"
						onFocus={handleFocus}
						onBlur={handleBlur}
						editable={!disabled}
						defaultValue={defaultValue}
					/>
					{postfixIcon}

					{!textarea && value?.length > 0 && !disabled && (
						<TouchableOpacity onPress={handleClearBtn} style={styles.clearBtn}>
							<MezonIconCDN icon={IconCDN.circleXIcon} color={themeValue.white} />
						</TouchableOpacity>
					)}
				</View>

				{showCount && textarea && (
					<View style={styles.lineCountWrapper}>
						<Text style={styles.count}>{`${value?.length || '0'}/${maxCharacter}`}</Text>
					</View>
				)}
			</View>
			{(!isCheckValid || !isValid) && errorMessage && <ErrorInput style={styles.errorInput} errorMessage={errorMessage} />}
		</View>
	);
}
