import React from 'react';
import Avatar from './Avatar';

type AvatarProfileProps = {
	avatar?: string;
	username?: string;
	userToDisplay: any;
	customStatus?: string;
};

const AvatarProfile = ({ customStatus, avatar, username, userToDisplay }: AvatarProfileProps) => {
	return (
		<div className="text-black flex flex-row gap-[6px] items-center mt-[-50px] w-full px-[16px]">
			<Avatar
				src={avatar}
				alt={username}
				placeholder={userToDisplay ? undefined : './assets/images/anonymous-avatar.jpg'}
				isUser={!!userToDisplay}
			/>
			{customStatus ? (
				<div className="flex flex-col gap-[12px] mt-[30px]">
					<div className="dark:bg-bgProfileBody bg-white w-[12px] h-[12px] rounded-full"></div>
					<div className="relative flex-1">
						<div className="dark:bg-bgProfileBody bg-white w-[20px] h-[20px] rounded-full absolute top-[-11px] left-[16px]"></div>
						<div className="dark:bg-bgProfileBody bg-white px-[16px] py-[12px] flex items-center justify-center rounded-[12px] w-full">
							<span className="font-medium text-[14px] dark:text-white text-black w-full line-clamp-2">
								{customStatus}
							</span>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default React.memo(AvatarProfile);
