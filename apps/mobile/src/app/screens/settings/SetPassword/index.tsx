import { useTheme } from '@mezon/mobile-ui';
import { appActions, authActions, selectAllAccount, useAppDispatch } from '@mezon/store-mobile';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { TextInputUser } from '../../../components/auth/TextInput';
import { style } from './styles';

const SetPassword = ({ navigation }) => {
	const { t } = useTranslation(['accountSetting']);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});
	const dispatch = useAppDispatch();

	const userProfile = useSelector(selectAllAccount);

	const handlePasswordChange = (passwordText: string) => {
		setPassword(passwordText);

		setErrors((prev) => ({
			...prev,
			password: validatePassword(passwordText),
			confirmPassword: confirmPassword && passwordText !== confirmPassword ? t('setPasswordAccount.error.notEqual') : ''
		}));
	};

	const handleConfirmPasswordChange = (passwordText: string) => {
		setConfirmPassword(passwordText);

		setErrors((prev) => ({
			...prev,
			confirmPassword: passwordText !== password ? t('setPasswordAccount.error.notEqual') : ''
		}));
	};

	const validatePassword = (value: string) => {
		if (value.length < 8) {
			return t('setPasswordAccount.error.characters');
		}
		if (!/[A-Z]/.test(value)) {
			return t('setPasswordAccount.error.uppercase');
		}
		if (!/[a-z]/.test(value)) {
			return t('setPasswordAccount.error.lowercase');
		}
		if (!/[0-9]/.test(value)) {
			return t('setPasswordAccount.error.number');
		}
		if (!/[^A-Za-z0-9]/.test(value)) {
			return t('setPasswordAccount.error.symbol');
		}
		return '';
	};

	const handleSubmit = async () => {
		try {
			dispatch(appActions.setLoadingMainMobile(true));
			const passwordError = validatePassword(password);
			const confirmError = password !== confirmPassword ? t('setPasswordAccount.error.notEqual') : '';

			if (confirmError || passwordError) {
				setErrors({
					password: passwordError,
					confirmPassword: confirmError
				});
				return;
			}

			await dispatch(authActions.registrationPassword({ email: userProfile?.email, password }));
			dispatch(appActions.setLoadingMainMobile(false));
			Toast.show({
				type: 'info',
				text1: t('setPasswordAccount.notification')
			});
			navigation.goBack();
		} catch (error) {
			dispatch(appActions.setLoadingMainMobile(false));
			console.error(error);
		}
	};

	return (
		<View style={styles.container}>
			<TextInputUser
				placeholder={''}
				isPass={false}
				value={userProfile?.email}
				label={t('setPasswordAccount.email')}
				error={errors?.password}
				require={false}
				disable
			/>
			<TextInputUser
				placeholder={t('setPasswordAccount.password')}
				isPass={true}
				value={password}
				onChangeText={handlePasswordChange}
				label={t('setPasswordAccount.password')}
				error={errors?.password}
				touched={true}
			/>
			<Text style={styles.description}>{t('setPasswordAccount.description')}</Text>
			<TextInputUser
				placeholder={t('setPasswordAccount.confirmPassword')}
				isPass={true}
				value={confirmPassword}
				onChangeText={handleConfirmPasswordChange}
				label={t('setPasswordAccount.confirmPassword')}
				error={errors?.confirmPassword}
				touched={true}
			/>
			<Pressable style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonTitle}>{t('setPasswordAccount.confirm')}</Text>
			</Pressable>
		</View>
	);
};

export default SetPassword;
