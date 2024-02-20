import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'dangerouslySetInnerHTML'> {
	className?: string;
}

const Checkbox: React.FC<InputProps> = ({ ...rest }: any, className) => {
	return <input type="checkbox" className={`${className}`} {...rest} />;
};

export default Checkbox;
