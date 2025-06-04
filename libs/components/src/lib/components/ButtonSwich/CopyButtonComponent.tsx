import { Icons } from '@mezon/ui';
import React from 'react';
import { ButtonSwitch } from '.';

interface CopyButtonComponentProps {
	title?: string;
	onCopy: () => void;
	disabled?: boolean;
	duration?: number;
	className?: string;
}

const CopyButtonComponent: React.FC<CopyButtonComponentProps> = ({ title, onCopy, disabled, duration, className }) => {
	return (
		<ButtonSwitch
			className={`dark:text-[#B5BAC1] text-colorTextLightMode gap-2 p-1 text-sm bg-transparent dark:hover:bg-zinc-700 hover:bg-bgLightModeButton ${className ?? ''}`}
			iconDefault={<Icons.CopyIcon />}
			iconSwitch={<Icons.Tick defaultSize="w-4 h-4" fill="currentColor" />}
			onClick={onCopy}
			disabled={disabled}
			title={title}
			duration={duration}
		/>
	);
};

export default React.memo(CopyButtonComponent);
