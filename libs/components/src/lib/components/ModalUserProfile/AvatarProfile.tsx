import { ChannelMembersEntity } from '@mezon/utils';

type AvatarProfileProps = {
	avatar?: string;
	username?: string;
	userById: ChannelMembersEntity | null;
};

const AvatarProfile = ({ avatar, username, userById }: AvatarProfileProps) => {
	return (
		<div className="text-black ml-[50px]">
			{userById ? (
				!avatar ? (
					<div className="w-[90px] h-[90px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[50px] mt-[-50px] ml-[-25px]">
						{username?.charAt(0).toUpperCase()}
					</div>
				) : (
					<img
						src={avatar}
						alt=""
						className="w-[90px] h-[90px] xl:w-[100px] xl:h-[100px] rounded-[50px] dark:bg-bgSecondary bg-white mt-[-50px] ml-[-25px] border-[6px] border-solid dark:border-bgSecondary600 border-white object-cover"
						crossOrigin="anonymous"
					/>
				)
			) : (
				<img
					src="./assets/images/anonymous-avatar.jpg"
					alt=""
					className="w-[90px] h-[90px] xl:w-[100px] xl:h-[100px] rounded-[50px] dark:bg-bgSecondary bg-white mt-[-50px] ml-[-25px] border-[6px] border-solid dark:border-bgSecondary600 border-white object-cover"
					crossOrigin="anonymous"
				/>
			)}
		</div>
	);
};

export default AvatarProfile;
