import { Icons } from '@mezon/ui';
import React from 'react';
import { ButtonSwitch } from '.';

interface CopyButtonComponentProps {
	title?: string;
	copyText?: string;
	disabled?: boolean;
	duration?: number;
	className?: string;
}

const CopyButtonComponent: React.FC<CopyButtonComponentProps> = ({ title, copyText, disabled, duration, className }) => {
	const handleCopy = React.useCallback(() => {
		if (!copyText) return;
		navigator.clipboard.writeText(copyText);
	}, [copyText]);
	return (
		<ButtonSwitch
			className={`dark:text-[#B5BAC1] text-colorTextLightMode gap-2 p-1 text-sm bg-transparent dark:hover:bg-zinc-700 hover:bg-bgLightModeButton ${className ?? ''}`}
			iconDefault={<Icons.CopyIcon />}
			iconSwitch={<Icons.Tick defaultSize="w-4 h-4" fill="currentColor" />}
			onClick={handleCopy}
			disabled={disabled}
			title={title}
			duration={duration}
		/>
	);
};

export default React.memo(CopyButtonComponent);
