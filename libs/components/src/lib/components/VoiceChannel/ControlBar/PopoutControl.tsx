import { Icons } from '@mezon/ui';
import { memo } from 'react';
import { voiceChromeIconClass } from '../voiceChromeStyles';

interface PopoutControlProps {
	isGridView?: boolean;
	isShowMember?: boolean;
	isOpenPopOut: boolean | undefined;
	onToggle: () => void;
}

export const PopoutControl = memo(({ isOpenPopOut, onToggle }: PopoutControlProps) => {
	const iconClassName = `cursor-pointer ${voiceChromeIconClass}`;

	return (
		<div onClick={onToggle}>
			{isOpenPopOut ? (
				<span>
					<Icons.VoicePopOutIcon className={`${iconClassName} rotate-180`} />
				</span>
			) : (
				<span>
					<Icons.VoicePopOutIcon className={iconClassName} />
				</span>
			)}
		</div>
	);
});
