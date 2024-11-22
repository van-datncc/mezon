import { DEFAULT_ROLE_COLOR } from '@mezon/utils';
import React from 'react';

interface IRoleNameCardProps {
	roleName: string;
	roleColor: string;
	classNames?: string;
}

const RoleNameCard: React.FC<IRoleNameCardProps> = ({ roleName, roleColor, classNames }) => {
	return (
		<span
			className={`inline-flex gap-x-1 items-center text-xs rounded p-1 dark:bg-slate-800 bg-slate-300 dark:text-borderDividerLight text-colorTextLightMode hoverIconBlackImportant truncate max-w-24 ${classNames} `}
			style={{ backgroundColor: `${roleColor || DEFAULT_ROLE_COLOR}50` }}
		>
			<div className="text-transparent size-3 rounded-full" style={{ backgroundColor: roleColor || DEFAULT_ROLE_COLOR }} />
			<span className="text-xs font-medium px-1 truncate max-w-16 dark:text-white text-black" style={{ lineHeight: '15px' }}>
				{roleName}
			</span>
		</span>
	);
};

export default RoleNameCard;
