import { Block, size, useTheme } from '@mezon/mobile-ui';
import React, { useMemo } from 'react';

import { NotificationCode } from '@mezon/utils';
import NotificationIndividualItem from '../NotificationIndividualItem';
import NotificationMentionItem from '../NotificationMentionItem';
import NotificationWebhookClan from '../NotificationWebhookClan/NotificationWebhookClan';
import { NotifyProps } from '../types';

const NotificationItem = React.memo(({ notify, onLongPressNotify, onPressNotify }: NotifyProps) => {
	const { themeValue } = useTheme();

	const isNotificationIndividual = useMemo(
		() =>
			notify?.code !== NotificationCode.USER_REPLIED &&
			notify?.code !== NotificationCode.USER_MENTIONED &&
			notify?.code !== NotificationCode.NOTIFICATION_CLAN,
		[notify]
	);

	const isNotificationMentionItem = useMemo(
		() => notify?.code === NotificationCode.USER_REPLIED || notify?.code === NotificationCode.USER_MENTIONED,
		[notify]
	);

	const isNotificationWebhookClan = useMemo(() => notify?.code === NotificationCode.NOTIFICATION_CLAN, [notify]);
	return (
		<Block borderBottomWidth={size.s_2} borderBottomColor={themeValue.secondaryLight} paddingTop={size.s_6}>
			{isNotificationIndividual ? (
				<NotificationIndividualItem onPressNotify={onPressNotify} notify={notify} onLongPressNotify={onLongPressNotify} />
			) : null}
			{isNotificationMentionItem ? (
				<NotificationMentionItem onPressNotify={onPressNotify} notify={notify} onLongPressNotify={onLongPressNotify} />
			) : null}
			{isNotificationWebhookClan && <NotificationWebhookClan notify={notify}></NotificationWebhookClan>}
		</Block>
	);
});

export default NotificationItem;
