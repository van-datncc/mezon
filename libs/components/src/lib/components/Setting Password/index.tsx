'use client';
import type React from 'react';
import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { FormError } from './formError';
import { Input } from './input';
import { PasswordInput } from './passwordInput';
import { PasswordRequirements } from './passwordRequirements';

interface SetPasswordProps {
	onSubmit?: (data: { email: string; password: string }) => void;
	title?: string;
	description?: string;
	submitButtonText?: string;
	initialEmail?: string;
}

export default function SetPassword({
	onSubmit,
	title = 'Set Password',
	description = 'Please create a new password for your account',
	submitButtonText = 'Confirm',
	initialEmail = ''
}: SetPasswordProps) {
	const [email, setEmail] = useState(initialEmail);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});

	const validateEmail = (value: string) => {
		if (!value) {
			return 'Email is required';
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return 'Please enter a valid email address';
		}

		return '';
	};

	const validatePassword = (value: string) => {
		if (value.length < 8) {
			return 'Password must be at least 8 characters';
		}
		if (!/[A-Z]/.test(value)) {
			return 'Password must contain at least 1 uppercase letter';
		}
		if (!/[a-z]/.test(value)) {
			return 'Password must contain at least 1 lowercase letter';
		}
		if (!/[0-9]/.test(value)) {
			return 'Password must contain at least 1 number';
		}
		if (!/[^A-Za-z0-9]/.test(value)) {
			return 'Password must contain at least 1 special character';
		}
		return '';
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);

		const emailError = validateEmail(value);
		setErrors((prev) => ({
			...prev,
			email: emailError
		}));
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPassword(value);

		const passwordError = validatePassword(value);
		setErrors((prev) => ({
			...prev,
			password: passwordError
		}));

		if (confirmPassword) {
			setErrors((prev) => ({
				...prev,
				confirmPassword: value !== confirmPassword ? "Confirmation password doesn't match" : ''
			}));
		}
	};

	const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setConfirmPassword(value);

		setErrors((prev) => ({
			...prev,
			confirmPassword: value !== password ? "Confirmation password doesn't match" : ''
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const emailError = validateEmail(email);
		const passwordError = validatePassword(password);
		const confirmError = password !== confirmPassword ? "Confirmation password doesn't match" : '';

		if (emailError || passwordError || confirmError) {
			setErrors({
				email: emailError,
				password: passwordError,
				confirmPassword: confirmError
			});
			return;
		}

		if (onSubmit) {
			onSubmit({ email, password });
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</div>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="email" className="block text-sm font-medium text-black">
								Email
							</label>
							<Input
								id="email"
								type="email"
								value={'phong.nguyennam@ncc.asia'}
								onChange={handleEmailChange}
								placeholder="your.email@example.com"
								className={errors.email ? 'border-red-500 dark:border-red-400' : ''}
								disabled={true}
							/>
							{errors.email && <FormError message={errors.email} />}
						</div>

						<div className="space-y-2">
							<PasswordInput id="password" label="Password" value={password} onChange={handlePasswordChange} error={errors.password} />
							<PasswordRequirements password={password} />
						</div>

						<PasswordInput
							id="confirmPassword"
							label="Confirm Password"
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							error={errors.confirmPassword}
						/>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full"
							disabled={!!errors.email || !!errors.password || !!errors.confirmPassword || !email || !password || !confirmPassword}
						>
							{submitButtonText}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
