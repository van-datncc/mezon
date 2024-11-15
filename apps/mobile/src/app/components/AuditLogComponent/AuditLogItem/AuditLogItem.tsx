import { Block, size, useTheme } from '@mezon/mobile-ui';
import { selectMemberClanByUserId, useAppSelector } from '@mezon/store-mobile';
import { convertTimeString, getAvatarForPrioritize } from '@mezon/utils';
import { ApiAuditLog } from 'mezon-js/api.gen';
import React, { memo } from 'react';
import { Text } from 'react-native';
import { MezonAvatar } from '../../../componentUI';
import { style } from './styles';

type AuditLogItemProps = {
	data: ApiAuditLog;
};
//
export const AuditLogItem = memo(({ data }: AuditLogItemProps) => {
	const auditLogTime = convertTimeString(data?.time_log as string);
	const userAuditLogItem = useAppSelector(selectMemberClanByUserId(data?.user_id ?? ''));
	const userName = userAuditLogItem?.user?.username;
	const avatar = getAvatarForPrioritize(userAuditLogItem?.clan_avatar, userAuditLogItem?.user?.avatar_url);
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<Block
			flexDirection="row"
			padding={size.s_10}
			backgroundColor={themeValue.secondary}
			borderRadius={size.s_10}
			gap={size.s_10}
			alignItems="center"
			borderWidth={1}
			borderColor={themeValue.tertiary}
			marginVertical={size.s_6}
		>
			<MezonAvatar avatarUrl={avatar} username={userName} height={size.s_30} width={size.s_30} />
			<Block flex={1}>
				<Text style={styles.userName}>
					{userName}
					<Text style={styles.actionText}>{` ${data?.action_log} #${data?.entity_name || data?.entity_id}`}</Text>
				</Text>
				<Text style={styles.textTime}>{auditLogTime}</Text>
			</Block>
		</Block>
	);
});
