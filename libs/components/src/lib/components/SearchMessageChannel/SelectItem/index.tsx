import { selectTheme } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';

type SelectItemProps = {
	title?: string;
	content?: string;
	onClick?: () => void;
	className?: string;
};

const SelectItem = ({ title, content, onClick, className }: SelectItemProps) => {
	const appearanceTheme = useSelector(selectTheme);
	const [isHovered, setIsHovered] = useState(false);

	const iconColorClass =
		className === 'bg-[#EBEBED]'
			? 'text-black'
			: className === 'bg-[#282A2E]'
				? 'text-white'
				: isHovered
					? appearanceTheme === 'light'
						? 'text-black'
						: 'text-white'
					: '';

	return (
		<button
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
			className={`flex flex-row justify-between items-center group w-full cursor-pointer rounded py-1 px-2 ${className} bg-item-hover`} // Apply className
		>
			<div>
				<span className=" font-semibold">{title}</span>
				<span className="">{content}</span>
			</div>
			{className === 'bg-item-theme' || className === 'bg-item-theme' || isHovered ? (
				<div className={`${iconColorClass} transition-colors duration-300`}>
					<Icons.Plus />
				</div>
			) : null}
		</button>
	);
};

export default SelectItem;
