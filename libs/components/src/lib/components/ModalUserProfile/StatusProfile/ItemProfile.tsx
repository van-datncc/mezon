import { createImgproxyUrl } from '@mezon/utils';

type ItemProfileProps = {
	avatar?: string;
	username?: string;
};

const ItemProfile = ({ avatar, username }: ItemProfileProps) => {
	return (
		<div className="flex items-center justify-between gap-2 rounded-sm dark:hover:bg-zinc-700 hover:bg-bgLightModeButton dark:hover:[&>*]:text-[#fff] hover:[&>*]:text-black px-2">
			{avatar ? (
				<img src={createImgproxyUrl(avatar ?? '')} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
			) : (
				<div className="w-[30px] h-[30px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[16px]">
					{username && username.charAt(0).toUpperCase()}
				</div>
			)}
			<li className="text-[14px] dark:text-white text-colorTextLightMode w-full py-[6px] cursor-pointer list-none ">{username}</li>
		</div>
	);
};

export default ItemProfile;
