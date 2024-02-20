import React, { ButtonHTMLAttributes } from 'react';
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML'> {
	className?: string;
	label: string;
	image?: string;
	disable?: boolean;
}

const Button: React.FC<ButtonProps> = ({ disable, label, className, ...rest }) => {
	return (
		<button
			className={`bg-primary text-white font-[500] py-2 px-4 rounded ${disable ? 'text-contentTertiary opacity-50 cursor-not-allowed' : 'hover:bg-hoverPrimary bg-primary'} ${className}`}
			{...rest}
		>
			{label}
		</button>
	);
};

export default Button;
