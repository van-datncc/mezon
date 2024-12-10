import { Icons } from '@mezon/ui';

const EmptyFile = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-12">
			<button className="relative mx-auto mb-4 p-[22px] rounded-full dark:bg-bgPrimary bg-bgLightPrimary cursor-default">
				<Icons.ThreadEmpty className="w-9 h-9 dark:bg-bgPrimary bg-bgLightPrimary dark:text-bgIconDark text-bgIconLight" />
				<Icons.EmptyUnreadStyle className="w-[104px] h-[80px] absolute top-0 left-[-10px]" />
			</button>
			<h2 className="text-2xl dark:text-gray-100 text-bgPrimary font-semibold mb-2">There are no file.</h2>
			<p className="text-base dark:text-gray-300 text-textSecondary800 text-center">
				Stay focused on a conversation with a file - a temporary text channel.
			</p>
		</div>
	);
};

export default EmptyFile;
