'use client';

import type React from 'react';
import { useState } from 'react';
import { FormError } from './formError';

interface PasswordInputProps {
	id: string;
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
}

export function PasswordInput({ id, label, value, onChange, error }: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="space-y-2">
			<label htmlFor={id} className="block text-sm font-medium">
				{label}
			</label>
			<div className="relative">
				<input
					id={id}
					type={showPassword ? 'text' : 'password'}
					value={value}
					onChange={onChange}
					className={`w-full px-3 py-2 border rounded-md pr-10 ${
						error ? 'border-red-500' : 'border-gray-300'
					} focus:outline-none focus:ring-2 focus:ring-blue-500`}
				/>
				<button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
					{showPassword ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
							<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
							<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
							<line x1="2" x2="22" y1="2" y2="22" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
					)}
				</button>
			</div>
			{error && <FormError message={error} />}
		</div>
	);
}
