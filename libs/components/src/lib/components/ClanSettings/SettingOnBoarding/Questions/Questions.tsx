import { Icons } from '@mezon/ui';
import { useState } from 'react';

const Questions = () => {
	const [showChannelNotAssigned, setShowChannelNotAssigned] = useState(false);

	const toggleChannelNotAssigned = () => {
		setShowChannelNotAssigned(!showChannelNotAssigned);
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="flex gap-3">
				<Icons.LongArrowRight className="rotate-180 w-3" />
				<div className="font-semibold">BACK</div>
			</div>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<div className="text-[20px] text-white font-semibold">Questions</div>
					<div className="font-medium">
						Create questions to help members pick additional channels and roles. Their channel list will be customised based on their
						answers.
					</div>
					<div className="flex gap-2 items-center">
						<div className="cursor-pointer text-blue-500 hover:underline">See examples</div>
						<div className="w-1 h-1 rounded-full bg-gray-600" />
						<div className="cursor-pointer text-blue-500 hover:underline">Preview</div>
						<div className="w-1 h-1 rounded-full bg-gray-600" />
						<div className="cursor-pointer text-blue-500 hover:underline">Switch to Advanced Mode</div>
					</div>
				</div>
				<div>
					<div
						className={`flex items-center justify-between gap-2 bg-bgTertiary py-3 px-4 ${showChannelNotAssigned ? 'rounded-t-xl' : 'rounded-xl'}`}
					>
						<div className="text-[12px] font-semibold">No public channels are missing from Questions and Default Channels.</div>
						<div className="flex items-center gap-3">
							<div className="w-[120px] h-[6px] bg-[#3b3d44] rounded-lg flex justify-start">
								<div className="w-[70%] h-full rounded-lg bg-green-600" />
							</div>
							<div onClick={toggleChannelNotAssigned}>
								<Icons.ArrowRight defaultSize={`${showChannelNotAssigned ? 'rotate-90' : '-rotate-90'} w-6 duration-200`} />
							</div>
						</div>
					</div>
					{showChannelNotAssigned && (
						<div className="bg-bgSecondary px-4 py-3 rounded-b-xl flex flex-col gap-5 duration-200">
							<div className="uppercase font-semibold">Channel not assigned</div>
							<div className="tex-[12px] font-medium">No channels here</div>
						</div>
					)}
				</div>
				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2 cursor-pointer">
						<div className="text-[16px] text-white font-bold">Pre-join Questions</div>
						<div>
							Members will be asked these questions before they join your server. Use them to assign channels and important roles.
							Pre-join Questions will also be available on the Channels & Roles page.
						</div>
						<div className="rounded-xl text-[#949cf7] justify-center items-center p-4 border-2 border-[#4e5058] border-dashed font-medium flex gap-2">
							<Icons.CirclePlusFill className="w-5" />
							<div>Add a Question</div>
						</div>
					</div>
					<div className="border-t border-[#4e5058]" />
					<div className="flex flex-col gap-2 cursor-pointer">
						<div className="text-[16px] text-white font-bold">Post-join Questions</div>
						<div>
							Members will be asked these questions after they join your server, on the Channels & Roles page. Use them to assign roles
							that members can pick later, like vanity roles.
						</div>
						<div className="rounded-xl text-[#949cf7] justify-center items-center p-4 border-2 border-[#4e5058] border-dashed font-medium flex gap-2">
							<Icons.CirclePlusFill className="w-5" />
							<div>Add a Question</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Questions;
