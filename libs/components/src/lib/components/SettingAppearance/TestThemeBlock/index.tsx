import { useAuth } from '@mezon/core';

const TestThemeBlock = () => {
	const { userProfile } = useAuth();
	const date = new Date();
	const realTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
	return (
		<div>
			<div className="font-semibold dark:text-white text-black text-[24px] mb-6">Appearance</div>
			<div
				className={`test-container dark:bg-bgSecondary border bg-[#F0F0F0] border-solid dark:border-gray-900 pb-5 overflow-y-hidden h-[150px] rounded-sm`}
			>
				<div className="test-item flex px-5 mt-[-15px]">
					<div className="test-left">
						<img className="aspect-square w-[45px] rounded-full object-cover" src={userProfile?.user?.avatar_url} alt="" />
					</div>
					<div className="test-right ml-3">
						<div className="test-right-top flex gap-3 items-center">
							<div className={`test-right-top-username font-semibold dark:text-[#ccc] text-black`}>
								{userProfile?.user?.display_name}
							</div>
							<div className="test-right-top-time text-[12px] dark:text-stone-400 text-black ">Today at {realTime}</div>
						</div>
						<div className="test-right-comment dark:text-[#ccc] text-black">Look at me I'm a beautiful butterfly</div>
					</div>
				</div>
				<div className="test-item flex px-5 mt-5">
					<div className="test-left">
						<img className="aspect-square w-[45px] rounded-full object-cover" src={userProfile?.user?.avatar_url} alt="" />
					</div>
					<div className="test-right ml-3">
						<div className="test-right-top flex gap-3 items-center">
							<div className={`test-right-top-username font-semibold dark:text-[#ccc] text-black`}>
								{userProfile?.user?.display_name}
							</div>
							<div className="test-right-top-time text-[12px] dark:text-stone-400 text-black ">Today at {realTime}</div>
						</div>
						<div className="test-right-comment dark:text-[#ccc] text-black">Look at me I'm a beautiful butterfly</div>
					</div>
				</div>
				<div className="test-item flex px-5 mt-5">
					<div className="test-left">
						<img className="aspect-square w-[45px] rounded-full object-cover" src={userProfile?.user?.avatar_url} alt="" />
					</div>
					<div className="test-right ml-3">
						<div className="test-right-top flex gap-3 items-center">
							<div className={`test-right-top-username font-semibold dark:text-[#ccc] text-black`}>
								{userProfile?.user?.display_name}
							</div>
							<div className="test-right-top-time text-[12px] dark:text-stone-400 text-black ">Today at {realTime}</div>
						</div>
						<div className="test-right-comment dark:text-[#ccc] text-black">Look at me I'm a beautiful butterfly</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TestThemeBlock;
