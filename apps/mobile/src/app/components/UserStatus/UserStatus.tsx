import { Icons, IUserStatusProps, OfflineStatus, OnlineStatus } from '@mezon/mobile-components';
import { Block, size, useTheme } from '@mezon/mobile-ui';
import React from 'react';

export const UserStatus = React.memo(({ status, customStyles, iconSize = size.s_12 }: IUserStatusProps) => {
	const { themeValue } = useTheme();
	const mobileIconSize = iconSize + size.s_4;

	return (
		<Block
			position="absolute"
			bottom={-size.s_2}
			right={-size.s_4}
			backgroundColor={themeValue.tertiary}
			padding={size.s_2}
			borderRadius={size.s_20}
			{...(customStyles && customStyles)}
		>
			{status?.isMobile ? (
				<Icons.IconMobileDevice width={mobileIconSize} height={mobileIconSize} />
			) : status?.status ? (
				<OnlineStatus width={iconSize} height={iconSize} />
			) : (
				<OfflineStatus width={iconSize} height={iconSize} />
			)}
		</Block>
	);
});
