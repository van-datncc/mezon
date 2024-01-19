import React, { InputHTMLAttributes } from 'react';

interface InputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'dangerouslySetInnerHTML'
    > {
    type: string
    label?: string;
    className?: string;
    required?: boolean;
    maxLength?: number;
};

const InputField: React.FC<InputProps> = ({ type, className, maxLength, label, required, ...rest }) => {
    return (
        <div>
            <div className={'text-[14px] mb-2'}>{label}
                {required && (
                    <span className={'text-colorDanger'}> *</span>
                )}
            </div>
            <input type={type} className={`bg-black font-[400] py-[12px] px-[14px] rounded w-full border text-white outline-none ${className}`} {...rest} maxLength={maxLength} multiple />
        </div>
    )
}

export default InputField