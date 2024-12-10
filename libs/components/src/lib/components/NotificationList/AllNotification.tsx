import { useNotification } from '@mezon/core';
import { channelMetaActions, useAppDispatch } from '@mezon/store';
import { INotification, TIME_OFFSET } from '@mezon/utils';
import { useCallback } from 'react';
import AllNotificationItem from './AllNotificationItem';

type AllNotificationProps = {
	notification?: INotification;
};

export const AllNotification = ({ notification }: AllNotificationProps) => {
	const dispatch = useAppDispatch();
	const { deleteNotify } = useNotification();

	const handleDeleteNotification = useCallback(
		(notification: INotification) => {
			const timestamp = Date.now() / 1000;
			dispatch(
				channelMetaActions.setChannelLastSeenTimestamp({
					channelId: '0',
					timestamp: timestamp + TIME_OFFSET
				})
			);
			deleteNotify(notification.id, notification.content.clan_id ?? '0');
		},
		[deleteNotify, dispatch]
	);

	return (
		<div>
			{notification && (
				<div key={notification.content.id} className="flex flex-col gap-2 py-3 px-3 w-full">
					<AllNotificationItem
						notify={notification}
						key={notification.id}
						onDeleteNotification={() => handleDeleteNotification(notification)}
					/>
				</div>
			)}
		</div>
	);
};

export default AllNotification;
