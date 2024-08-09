import { FriendsEntity } from '@mezon/store';
import FriendsListItem from './FriendsListItem';

type ListFriendsProps = {
	listFriendFilter: FriendsEntity[];
};
const FriendList = ({ listFriendFilter }: ListFriendsProps) => {
	return (
		<div className={'flex flex-1 overflow-y-auto flex-col pr-3'}>
			{listFriendFilter.map((friend: FriendsEntity) => (
				<FriendsListItem friend={friend} key={friend.id} />
			))}
		</div>
	);
};

export default FriendList;
