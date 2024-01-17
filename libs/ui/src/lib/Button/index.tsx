import React, { ButtonHTMLAttributes } from 'react';
interface ButtonProps
    extends Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        'dangerouslySetInnerHTML'
    > {
    className?: string;
    label: string;
    image?: string;
    disable?: boolean
}

const Button: React.FC<ButtonProps> = ({ disable, label, className, ...rest }) => {
    return (
        <button className={`bg-primary text-white font-[600] py-2 px-4 rounded ${disable ? 'opacity-75 ' : 'hover:bg-hoverPrimary'} ${className}`} {...rest}>
            {label}
        </button>
    );
};

export default Button;
