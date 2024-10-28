import { Icons, IUserStatusProps, OfflineStatus, OnlineStatus } from '@mezon/mobile-components';
import { Block, size, useTheme } from '@mezon/mobile-ui';
import React from 'react';

export const UserStatus = React.memo(({ status, customStyles }: IUserStatusProps) => {
	const { themeValue } = useTheme();

	return (
		<Block
			position="absolute"
			bottom={-size.s_2}
			right={-size.s_4}
			backgroundColor={themeValue.tertiary}
			padding={size.s_2}
			borderRadius={size.s_10}
			{...(customStyles && customStyles)}
		>
			{status?.isMobile ? (
				<Icons.IconMobileDevice width={size.s_16} height={size.s_16} />
			) : status?.status ? (
				<OnlineStatus width={size.s_12} height={size.s_12} />
			) : (
				<OfflineStatus width={size.s_12} height={size.s_12} />
			)}
		</Block>
	);
});
