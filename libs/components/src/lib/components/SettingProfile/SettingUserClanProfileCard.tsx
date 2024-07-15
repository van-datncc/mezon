import { useAuth } from '@mezon/core';
import { useEffect, useState } from 'react';
import { getColorAverageFromURL } from './AverageColor';
export type Profilesform = {
	displayName: string;
	urlImage: string;
};
export type propProfilesform = {
	profiles: Profilesform;
};
const SettingUserClanProfileCard = (props: propProfilesform) => {
	const { userProfile } = useAuth();
	const { profiles } = props;
	const checkUrl = profiles.urlImage === undefined || profiles.urlImage === '';

	const [color, setColor] = useState<string>('#323232');

	useEffect(() => {
		const getColor = async () => {
			if (!checkUrl) {
				const colorImg = await getColorAverageFromURL(profiles.urlImage);
				if (colorImg) setColor(colorImg);
			}
		};

		getColor();
	}, [checkUrl, profiles.urlImage]);

	return (
		<div className="dark:bg-bgSecondary600 bg-[#f0f0f0] mt-[10px]  rounded-lg flex flex-col relative">
			<div className="h-[105px] rounded-tr-[10px] rounded-tl-[10px]" style={{ backgroundColor: color }}></div>
			<div className="text-black ml-[50px]">
				{checkUrl ? (
					<div className="w-[90px] h-[90px] dark:bg-bgDisable bg-gray-100 rounded-full flex justify-center items-center text-contentSecondary text-[50px] mt-[-50px] ml-[-25px]">
						{userProfile?.user?.username?.charAt(0).toUpperCase()}
					</div>
				) : (
					<img
						crossOrigin="anonymous"
						src={profiles.urlImage}
						alt=""
						className="w-[90px] h-[90px] xl:w-[100px] xl:h-[100px] rounded-[50px] bg-bgSecondary mt-[-50px] ml-[-25px] border-[6px] border-solid dark:border-black border-[#F0F0F0] object-cover"
					/>
				)}
			</div>
			<div className="px-[16px]">
				<div className="dark:bg-bgTertiary bg-[#e2e2e2] dark:text-white text-black w-full p-4 my-[16px] rounded-[10px] flex flex-col gap-y-6 xl:gap-y-7">
					<div className="w-[300px]">
						<p className="font-bold tracking-wider text-xl one-line">{profiles.displayName}</p>
						<p className="font-medium tracking-wide text-sm">{userProfile?.user?.username}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SettingUserClanProfileCard;
