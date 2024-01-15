import React, { SelectHTMLAttributes } from 'react';
interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps
    extends Omit<
        SelectHTMLAttributes<HTMLSelectElement>,
        'dangerouslySetInnerHTML'
    > {
    className?: string;
    options: SelectOption[];
}



const Select: React.FC<SelectProps> = ({ className, options, ...rest }) => {
    return (
        <>
            <div className="relative my-6 md:w-60">
                <select
                    required
                    className={`peer relative h-10 w-full appearance-none rounded border border-borderDefault px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-borderFocus focus-visible:outline-none focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${className}`} {...rest}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

            </div>
        </>
    )
}

export default Select;