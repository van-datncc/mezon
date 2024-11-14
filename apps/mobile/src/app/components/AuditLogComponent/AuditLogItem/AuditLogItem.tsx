import { Block, size, useTheme } from '@mezon/mobile-ui';
import { selectMemberClanByUserId, useAppSelector } from '@mezon/store-mobile';
import { convertTimeString, getAvatarForPrioritize } from '@mezon/utils';
import { ApiAuditLog } from 'mezon-js/api.gen';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { MezonAvatar } from '../../../componentUI';
import { style } from './styles';

type AuditLogItemProps = {
	data: ApiAuditLog;
};
const actionMap: Record<string, string> = {
	'Create Channel': 'created',
	'Delete Channel': 'removed',
	'Change Channel': 'changed'
};
export const AuditLogItem = memo(({ data }: AuditLogItemProps) => {
	const auditLogTime = convertTimeString(data?.time_log as string);
	const userAuditLogItem = useAppSelector(selectMemberClanByUserId(data?.user_id ?? ''));
	const userName = userAuditLogItem?.user?.username;
	const avatar = getAvatarForPrioritize(userAuditLogItem?.clan_avatar, userAuditLogItem?.user?.avatar_url);
	const { t } = useTranslation('auditLog');
	const actionText = (data.action_log && actionMap[data?.action_log]) || t('auditLogItem.performedAnAction');
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<Block
			flexDirection="row"
			paddingHorizontal={size.s_10}
			paddingVertical={size.s_20}
			backgroundColor={themeValue.secondaryWeight}
			borderRadius={size.s_10}
			gap={size.s_10}
			alignItems="center"
			borderWidth={1}
			borderColor={themeValue.tertiary}
			marginVertical={size.s_8}
		>
			<MezonAvatar avatarUrl={avatar} username={userName} height={size.s_40} width={size.s_40} />
			<Block flex={1}>
				<Text style={styles.userName} numberOfLines={1}>
					{userName}
					<Text style={styles.actionText} numberOfLines={1}>{` ${actionText} #${data?.entity_name || data?.entity_id}`}</Text>
				</Text>
				<Text style={styles.textTime} numberOfLines={1}>
					{auditLogTime}
				</Text>
			</Block>
		</Block>
	);
});
