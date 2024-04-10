import { selectMemberByUserId } from '@mezon/store';
import { useSelector } from 'react-redux';

export type ChannelMemberAvatarProps = {
	userId: string;
};
function ChannelMemberAvatar({ userId }: ChannelMemberAvatarProps) {
	const user = useSelector(selectMemberByUserId(userId));
	return (
		<div className="h-[200px] bg-black rounded-[10px] w-full m-auto max-w-[350px] flex justify-center items-center">
			<img src={user?.user?.avatar_url} alt={user?.user?.avatar_url} className="size-[100px] object-cover rounded-full m-auto" />
		</div>
	);
}

export default ChannelMemberAvatar;
