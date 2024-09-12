import { Icons } from '@mezon/ui';
import { useEffect, useRef, useState } from 'react';

type SelectItemProps = {
	title?: string;
	content?: string;
	onClick?: () => void;
};

const SelectItemUser = ({ title, content, onClick }: SelectItemProps) => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [backgroundColor, setBackgroundColor] = useState<string>('');

	useEffect(() => {
		if (buttonRef.current) {
			const buttonStyle = window.getComputedStyle(buttonRef.current);
			console.log(buttonStyle.backgroundColor);
			setBackgroundColor(buttonStyle.backgroundColor);
		}
	}, []);

	return (
		<button ref={buttonRef} onClick={onClick} className="flex flex-row justify-between items-center group w-full cursor-pointer rounded  p-2">
			<div>
				<span className="text-textPrimaryLight dark:text-textPrimary font-semibold">{title}</span>
				<span className="text-textSecondary400 dark:text-textPrimary">{content}</span>
			</div>
			<div className="group-hover:opacity-100 opacity-0">
				<Icons.Plus />
			</div>
		</button>
	);
};

export default SelectItemUser;
