import { Icons } from '@mezon/ui';
import { memo } from 'react';

interface PopoutControlProps {
	isGridView?: boolean;
	isShowMember?: boolean;
	isOpenPopOut: boolean | undefined;
	onToggle: () => void;
}

export const PopoutControl = memo(({ isOpenPopOut, onToggle }: PopoutControlProps) => {
	const iconClassName = 'cursor-pointer text-[var(--bg-icon-theme)] hover:text-[var(--bg-icon-theme-active)]';

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
