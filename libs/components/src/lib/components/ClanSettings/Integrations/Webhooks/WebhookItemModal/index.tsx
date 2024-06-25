import { Icons } from 'libs/components/src/lib/components';
import { useState } from 'react';

const WebhookItemModal = () => {
	const [isExpand, setIsExpand] = useState(false);
	return (
		<div className="dark:bg-[#2b2d31] bg-bgLightMode p-[20px] border dark:border-black rounded-md mb-[20px]">
			<div className="flex gap-[20px] items-center mb-[12px]">
				<img
					src="https://dl.memuplay.com/new_market/img/com.discord.icon.2024-01-05-03-09-38.png"
					alt=""
					className="aspect-square w-[50px] rounded-full"
				/>
				<div className="flex w-full justify-between items-center dark:text-textDarkTheme text-textLightTheme">
					<div className="">
						<div>Captain Hook</div>
						<div className="flex gap-1 items-center">
							<Icons.ClockIcon className="dark:text-[#b5bac1] text-textLightTheme" />
							<div className="dark:text-[#b5bac1] text-textLightTheme text-[13px]">Created on 24 Jun 2024 by tung.nguyenquyson</div>
						</div>
					</div>
					<div onClick={() => setIsExpand(!isExpand)} className={`cursor-pointer transition duration-100 ease-in-out ${isExpand ? "" : "-rotate-90"}`}>
						<Icons.ArrowDown defaultSize="h-[30px] w-[30px] dark:text-[#b5bac1] text-black" />
					</div>
				</div>
			</div>
			{isExpand ? (
				<div className="pt-[20px] border-t dark:border-[#3b3d44]">
					<div className="flex">
						<div className="w-3/12 dark:text-[#b5bac1] text-textLightTheme">
							<img
								src="https://dl.memuplay.com/new_market/img/com.discord.icon.2024-01-05-03-09-38.png"
								alt=""
								className="aspect-square w-[100px] rounded-full hover:grayscale-[50%]"
							/>
							<div className="text-[10px] mt-[10px]">
								Minimum Size: <b>128x128</b>
							</div>
						</div>
						<div className="w-9/12">
							<div className="flex gap-6 w-full">
								<div className="w-1/2">
									<div className="dark:text-[#b5bac1] text-textLightTheme text-[12px] mb-[10px]">
										<b>NAME</b>
									</div>
									<input
										type="text"
										value={'Captain Hook'}
										className="w-full dark:text-[#b5bac1] text-textLightTheme dark:bg-[#1e1f22] bg-bgLightModeThird p-[10px] rounded-sm outline-none"
									/>
								</div>
								<div className="w-1/2">
									<div className="dark:text-[#b5bac1] text-textLightTheme text-[12px] mb-[10px]">
										<b>CHANNEL</b>
									</div>
									<input
										type="text"
										value={'Captain Hook'}
										className="w-full dark:text-[#b5bac1] text-textLightTheme dark:bg-[#1e1f22] bg-bgLightModeThird p-[10px] rounded-sm outline-none"
									/>
								</div>
							</div>
							<div className="border-t dark:border-[#3b3d44] my-[24px]"></div>
							<div className="flex items-center gap-[20px]">
								<div className="px-4 py-2 dark:bg-[#4e5058] bg-[#808084] dark:hover:bg-[#808084] hover:bg-[#4e5058] rounded-sm cursor-pointer">Copy Webhook URL</div>
								<div className="text-red-400 hover:underline cursor-pointer">Delete Webhook</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default WebhookItemModal;
