import React, { ButtonHTMLAttributes } from 'react';
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML'> {
	className?: string;
	children?: React.ReactNode;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ disabled, children, className, ...rest }) => {
	return (
		<button
			className={`bg-buttonPrimary border border-buttonBorder text-white font-[500] rounded capitalize disabled:opacity-50 disabled:cursor-not-allowed hover:bg-buttonPrimaryHover ease-linear transition-all duration-150  ${className}`}
			{...rest}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
