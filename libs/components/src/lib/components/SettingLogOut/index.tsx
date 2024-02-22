const SettingRightProfile = () => {
	return (
		<div className="w-1/2 text-white">
			<p className="ml-[30px] mt-[30px]">PREVIEW</p>
			<div className="bg-black h-[542px] ml-[30px] mt-[10px] rounded-[10px] flex flex-col relative">
				<div className="h-1/6 bg-green-500 rounded-tr-[10px] rounded-tl-[10px]"></div>

				<div className="bg-bgSecondary w-[380px] h-2/3 mt-[20px] ml-[15px] rounded-[20px]">
					<div className="w-[300px] mt-[16px] ml-[16px]">
						<p className="text-xl font-medium">{name}</p>
						<p>{displayName}</p>
					</div>
					<div className="w-[300px] mt-[50px] ml-[16px]">
						<p>CUSTOMIZING MY PROFILE</p>
						<div className="flex">
							<img
								src="https://i.postimg.cc/3RSsTnbD/3d63f5caeb33449b32d885e5aa94bbbf.jpg"
								alt=""
								className="w-[100px] h-[100px] rounded-[8px] mt-[16px]"
							/>
							<div className="mt-[40px] ml-[20px]">
								<p>User Profile</p>
								<p>
									{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
								</p>
							</div>
						</div>
					</div>
					<div className="w-[300px] mt-[40px] ml-[16px]">
						<button className="w-5/6 h-[50px] ml-[30px] bg-black rounded-[8px]">Example button</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingRightProfile;
