export const validateEmail = (value: string) => {
	if (!value) {
		return 'Email is required';
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(value)) {
		return 'Please enter a valid email address';
	}

	return '';
};

export const validatePassword = (value: string) => {
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
