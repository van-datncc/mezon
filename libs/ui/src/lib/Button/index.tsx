import React, { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'link';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML'> {
	className?: string;
	children?: React.ReactNode;
	disabled?: boolean;
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({ disabled, children, className, variant, size, ...rest }) => {
	return (
		<button
			className={` text-theme-primary font-[500] rounded capitalize disabled:opacity-50 disabled:cursor-not-allowed bg-item-theme-hover ease-linear transition-all duration-150  ${className}`}
			{...rest}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
