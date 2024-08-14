import { FriendsEntity, IFriend } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { forwardRef } from 'react';
import { AvatarImage } from '../../AvatarImage/AvatarImage';

type ListFriendProps = {
	listFriends: FriendsEntity[];
	idActive: string;
	selectedFriends: string[];
	setIdActive: (idFriend: string) => void;
	handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ListFriends = forwardRef<HTMLDivElement, ListFriendProps>(
	({ listFriends, selectedFriends, idActive, setIdActive, handleCheckboxChange }, ref) => {
		return (
			<div ref={ref} className="w-full h-[190px] overflow-y-auto overflow-x-hidden thread-scroll">
				{listFriends.map((friend: IFriend, index) => (
					<div
						key={friend.id}
						onMouseEnter={() => setIdActive(friend.id ?? '')}
						onMouseLeave={() => setIdActive(friend.id ?? '')}
						className={`${idActive === friend.id ? 'dark:bg-bgModifierHover bg-bgLightModeThird' : ''} flex items-center h-10 px-2 ml-3 mr-2 py-[8px] rounded-[6px] cursor-pointer`}
					>
						<label className="flex flex-row items-center justify-between w-full gap-2 py-[3px] cursor-pointer">
							<div className="flex flex-row items-center gap-2">
								<AvatarImage
									alt={''}
									userName={friend.user?.username}
									src={friend.user?.avatar_url}
									className="size-8"
									classNameText="text-[9px] min-w-5 min-h-5 pt-[3px]"
								/>
								<span className={`text-base font-medium dark:text-white text-textLightTheme one-line`}>
									{friend.user?.display_name}
								</span>
								<span className="dark:text-colorNeutral text-colorTextLightMode font-medium">{friend.user?.username}</span>
							</div>
							<div className="relative flex flex-row justify-center">
								<input
									id={`checkbox-item-${index}`}
									type="checkbox"
									value={friend.id}
									checked={selectedFriends.includes(friend?.id || '')}
									onChange={handleCheckboxChange}
									className="peer appearance-none forced-colors:appearance-auto relative w-4 h-4 border dark:border-textPrimary border-gray-600 rounded-md focus:outline-none"
								/>
								<Icons.Check className="absolute invisible peer-checked:visible forced-colors:hidden w-4 h-4" />
							</div>
						</label>
					</div>
				))}
			</div>
		);
	},
);

export default ListFriends;
