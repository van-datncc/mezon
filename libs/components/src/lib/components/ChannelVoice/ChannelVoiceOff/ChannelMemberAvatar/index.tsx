import { selectMemberByUserId } from '@mezon/store';
import { useSelector } from 'react-redux';

export type ChannelMemberAvatarProps = {
	readonly userId: Readonly<string>;
};
function ChannelMemberAvatar({ userId }: ChannelMemberAvatarProps) {
	const user = useSelector(selectMemberByUserId(userId));
	return (
		<div className="bg-black rounded-[10px] w-full m-auto flex justify-center items-center min-h-full overflow-hidden">
			<img src={user?.user?.avatar_url} alt={user?.user?.avatar_url} className="size-[100px] max-w-[100px] object-cover rounded-full m-auto" />
		</div>
	);
}

export default ChannelMemberAvatar;
