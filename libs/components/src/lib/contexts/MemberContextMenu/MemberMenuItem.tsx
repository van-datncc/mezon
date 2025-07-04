import { FC, ReactNode } from 'react';
import { Item } from 'react-contexify';

interface MemberMenuItemProps {
	label: string;
	onClick: () => void;
	isWarning?: boolean;
	rightElement?: ReactNode;
	setWarningStatus?: (status: string) => void;
}

export const MemberMenuItem: FC<MemberMenuItemProps> = ({ label, onClick, isWarning = false, rightElement, setWarningStatus }) => {
	return (
		<Item
			onClick={onClick}
			className="flex truncate justify-between items-center w-full font-sans text-sm font-medium text-theme-primary text-theme-primary-hover p-1"
			onMouseEnter={() => {
				if (setWarningStatus) {
					if (isWarning) {
						setWarningStatus('#E13542');
					} else {
						setWarningStatus('var(--bg-item-hover)');
					}
				}
			}}
			onMouseLeave={() => {
				if (setWarningStatus) {
					setWarningStatus('var(--bg-item-hover)');
				}
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					fontFamily: `'gg sans', 'Noto Sans', sans-serif`,
					fontSize: '14px',
					fontWeight: 500
				}}
				className={`${isWarning ? 'text-[#E13542] hover:text-white' : 'text-theme-primary-hover'} p-1`}
			>
				<span className="truncate max-w-[160px] block overflow-hidden text-ellipsis whitespace-nowrap" title={label}>
					{label}
				</span>
				{rightElement}
			</div>
		</Item>
	);
};
