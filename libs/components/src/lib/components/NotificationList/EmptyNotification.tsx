import { Icons } from '@mezon/ui';

type EmptyNotification = {
	isEmptyForYou?: boolean;
	isEmptyMessages?: boolean;
	isEmptyMentions?: boolean;
};

const EmptyNotification = ({ isEmptyForYou, isEmptyMessages, isEmptyMentions }: EmptyNotification) => {
	return (
		<div className="m-4 flex flex-col justify-center h-[400px] py-[80px] select-none">
			{isEmptyForYou && <EmptyForYou />}
			{isEmptyMessages && <EmptyMessages />}
			{isEmptyMentions && <EmptyMentions />}
		</div>
	);
};

export default EmptyNotification;

const EmptyForYou = () => {
	return (
		<>
			<img className="mx-auto mb-4" src="assets/images/empty-for-you.svg" alt="empty-for-you" />
			<h1 className="text-center dark:text-white text-textLightTheme text-lg font-bold mb-2">Nothing here yet</h1>
			<div className="text-center text-base font-medium dark:text-textThreadPrimary text-textSecondary800">
				Come back for notifications on events, streams, and more.
			</div>
		</>
	);
};

const EmptyMessages = () => {
	return (
		<>
			<button className="relative mx-auto mb-4 p-[22px] rounded-full dark:bg-bgPrimary bg-bgLightPrimary cursor-default">
				<Icons.EmptyUnread className="w-9 h-9 dark:bg-bgPrimary bg-bgLightPrimary dark:text-bgIconDark text-bgIconLight" />
				<Icons.EmptyUnreadStyle className="w-[104px] h-[80px] absolute top-0 left-[-10px]" />
			</button>
			<h1 className="text-center dark:text-white text-textLightTheme text-2xl font-semibold mb-2">You're all caught up!</h1>
			<div className="text-center text-xs font-normal dark:text-textThreadPrimary text-textSecondary800">
				<span className="uppercase text-xs text-textPro font-semibold">Protip: </span>
				Open the Inbox by pressing CTRL+I, and mark your top message as read with CTRL+Shift+E.
			</div>
		</>
	);
};

const EmptyMentions = () => {
	return (
		<>
			<button className="relative mx-auto mb-4 p-[22px] rounded-full dark:bg-bgPrimary bg-bgLightPrimary cursor-default">
				<Icons.EmptyMention className="w-9 h-9 dark:bg-bgPrimary bg-bgLightPrimary dark:text-bgIconDark text-bgIconLight" />
				<Icons.EmptyUnreadStyle className="w-[104px] h-[80px] absolute top-0 left-[-10px]" />
			</button>
			<h1 className="text-center dark:text-white text-textLightTheme text-2xl font-semibold mb-2">You made it through everything!</h1>
			<div className="text-center text-xs font-normal dark:text-textThreadPrimary text-textSecondary800">
				<span className="uppercase text-xs text-textPro font-semibold">Protip: </span>
				Whenever someone mentions you it will be saved here for 7 days.
			</div>
		</>
	);
};
