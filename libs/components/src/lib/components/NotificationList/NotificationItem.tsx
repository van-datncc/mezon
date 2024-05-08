import { useNotification } from '@mezon/core';
import { selectMemberClanByUserId } from '@mezon/store';
import { convertTimeString } from '@mezon/utils';
import { INotification } from 'libs/store/src/lib/notification/notify.slice';
import { useSelector } from 'react-redux';
import MemberProfile from '../MemberProfile';
export type NotifyProps = {
	readonly notify: INotification;
};

function NotificationItem({ notify }: NotifyProps) {
	const { deleteNotify } = useNotification();
	const user = useSelector(selectMemberClanByUserId(notify.sender_id || ''));

	const userName = notify?.content?.username;

	let notice = notify?.subject;

	if (userName) {
		const userNameLenght = userName.length;
		notice = notify?.subject?.slice(userNameLenght);
	}

	return (
		<div className="flex flex-row justify-between hover:bg-bgSecondaryHover py-3 px-3 w-full cursor-pointer">
			<div className="flex items-center gap-2">
				<MemberProfile
					isHideUserName={true}
					avatar={user?.user?.avatar_url || ''}
					name={notify?.content?.username ?? ''}
					isHideStatus={true}
					isHideIconStatus={true}
					textColor="#fff"
				/>
				<div className="flex flex-col gap-1">
					<div>
						<span className="font-bold">{userName}</span>
						<span>{notice}</span>
					</div>
					<span className="text-zinc-400 text-[11px]">{convertTimeString(notify.create_time as string)}</span>
				</div>
			</div>
			<button
				className="bg-bgTertiary mr-1 text-contentPrimary rounded-full w-6 h-6 flex items-center justify-center text-[10px]"
				onClick={() => {
					deleteNotify(notify.id);
				}}
			>
				✕
			</button>
		</div>
	);
}

export default NotificationItem;
