import { FriendsEntity } from '@mezon/store';
import FriendsListItem from './FriendsListItem';

type ListFriendsProps = {
	listFriendFilter: FriendsEntity[];
};
const FriendList = ({ listFriendFilter }: ListFriendsProps) => {
	return (
		<div className={'flex h-full flex-col pr-8 overflow-y-auto w-full'}>
			{listFriendFilter.map((friend: FriendsEntity) => (
				<FriendsListItem friend={friend} key={friend.id} />
			))}
		</div>
	);
};

export default FriendList;
