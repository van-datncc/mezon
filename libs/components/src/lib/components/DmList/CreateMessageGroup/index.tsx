import { useAppNavigation } from '@mezon/core';
import { directActions, IFriend, selectAllFriends, useAppDispatch } from '@mezon/store';
import { Icons, InputField } from '@mezon/ui';
import { ChannelType } from 'mezon-js';
import { ApiCreateChannelDescRequest } from 'mezon-js/api.gen';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AvatarImage } from '../../AvatarImage/AvatarImage';

type CreateMessageGroupProps = {
	isOpen: boolean;
	onClose: () => void;
};

const CreateMessageGroup = ({ onClose }: CreateMessageGroupProps) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { toDmGroupPage } = useAppNavigation();
	const friends = useSelector(selectAllFriends);
	const itemRef = useRef<HTMLDivElement | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const [idActive, setIdActive] = useState(0);
	const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
	const [length, setLength] = useState<number>(selectedFriends.length);

	const filteredFriends = friends.filter((friend: IFriend) => friend.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		setSelectedFriends((prevSelectedFriends) => {
			if (prevSelectedFriends.includes(value)) {
				return prevSelectedFriends.filter((friend) => friend !== value);
			} else {
				return [...prevSelectedFriends, value];
			}
		});
	};

	const resetAndCloseModal = () => {
		setSelectedFriends([]);
		onClose();
	};

	const handleCreateDM = async () => {
		const bodyCreateDmGroup: ApiCreateChannelDescRequest = {
			type: length > 1 ? ChannelType.CHANNEL_TYPE_GROUP : ChannelType.CHANNEL_TYPE_DM,
			channel_private: 1,
			user_ids: selectedFriends,
		};

		const response = await dispatch(directActions.createNewDirectMessage(bodyCreateDmGroup));
		const resPayload = response.payload as ApiCreateChannelDescRequest;
		if (resPayload.channel_id) {
			await dispatch(
				directActions.joinDirectMessage({
					directMessageId: resPayload.channel_id,
					channelName: resPayload.channel_label,
					type: Number(resPayload.type),
				}),
			);
			const directChat = toDmGroupPage(resPayload.channel_id, Number(resPayload.type));
			navigate(directChat);
		}
		resetAndCloseModal();
	};

	useEffect(() => {
		setLength(selectedFriends.length);
	}, [selectedFriends]);

	return (
		<div
			onMouseDown={(e) => e.stopPropagation()}
			className="absolute top-[20px] left-0 dark:bg-bgPrimary bg-bgLightPrimary z-10 w-[440px] border border-slate-300 dark:border-none rounded shadow shadow-neutral-800"
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<div className="cursor-default text-start">
				<div className="p-4">
					<h3 className="text-xl text-white">Select Friends</h3>
					<p className="text-textThreadPrimary pt-1">{`You can add ${friends.length} more friends.`}</p>
					<InputField
						type="text"
						placeholder="Type the username of a friend"
						className="h-[34px] dark:bg-bgTertiary bg-bgLightModeThird dark:text-textDarkTheme text-textLightTheme text-[16px] mt-[20px]"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className="w-full h-[190px] overflow-y-auto overflow-x-hidden thread-scroll">
					{filteredFriends.map((friend: IFriend, index) => (
						<div
							key={friend.id}
							ref={itemRef}
							className={`${idActive === index ? 'dark:bg-bgModifierHover bg-bgLightModeThird' : ''} flex items-center h-10 px-2 ml-3 mr-2 py-[8px] rounded-[6px] cursor-pointer`}
						>
							<label className="flex flex-row items-center justify-between w-full gap-2 py-[3px]">
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
				<div className="p-[20px]">
					<button
						disabled={length === 0}
						onClick={handleCreateDM}
						className="h-[38px] w-full text-sm text-white dark:bg-buttonPrimary dark:hover:bg-bgSelectItemHover rounded"
					>
						{selectedFriends.length === 0 ? 'Create DM or Group Chat' : selectedFriends.length === 1 ? 'Create DM' : 'Create Group Chat'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateMessageGroup;
