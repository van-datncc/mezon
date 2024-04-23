import { UserRestrictionZone, useCategory, useClanRestriction, useEscapeKey } from '@mezon/core';
import { channelsActions, useAppDispatch } from '@mezon/store';
import { ChannelThreads, EPermission, ICategory, ICategoryChannel, IChannel } from '@mezon/utils';
import { getIsShowPopupForward } from 'libs/store/src/lib/forwardMessage/forwardMessage.slice';
import { ChannelType } from 'mezon-js';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { CreateNewChannelModal } from '../CreateChannelModal';
import ForwardMessageModal from '../ForwardMessage';
import * as Icons from '../Icons';
import { BrowseChannel, Events } from './ChannelListComponents';
import ChannelListItem from './ChannelListItem';
export type ChannelListProps = { className?: string };
export type CategoriesState = Record<string, boolean>;

// TODO: implement useClipboard hook
export const unsecuredCopyToClipboard = (text: string) => {
	const textArea = document.createElement('textarea');
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	try {
		document.execCommand('copy');
	} catch (err) {
		console.error('Unable to copy to clipboard', err);
	}
	document.body.removeChild(textArea);
};

export const handleCopyToClipboard = (content: string) => {
	if (window.isSecureContext && navigator.clipboard) {
		navigator.clipboard.writeText(content);
	} else {
		unsecuredCopyToClipboard(content);
	}
};

function ChannelList({ channelCurrentType }: { channelCurrentType?: number }) {
	const { categorizedChannels } = useCategory();
	const [hasManageChannelPermission, { isClanCreator }] = useClanRestriction([EPermission.manageChannel]);
	const [categoriesState, setCategoriesState] = useState<CategoriesState>(
		categorizedChannels.reduce((acc, category) => {
			acc[category.id] = false;
			return acc;
		}, {} as CategoriesState),
	);

	const handleToggleCategory = (category: ICategoryChannel, setToTrue?: boolean) => {
		if (setToTrue) {
			setCategoriesState((prevState) => ({
				...prevState,
				[category.id]: prevState[category.id],
			}));
		} else {
			setCategoriesState((prevState) => ({
				...prevState,
				[category.id]: !prevState[category.id],
			}));
		}
	};

	const dispatch = useAppDispatch();
	const openModalCreateNewChannel = (paramCategory: ICategory) => {
		dispatch(channelsActions.openCreateNewModalChannel(true));
		dispatch(channelsActions.getCurrentCategory(paramCategory));
	};
	const isChange = useSelector(getIsShowPopupForward);

	useEscapeKey(() => dispatch(channelsActions.openCreateNewModalChannel(false)));

	return (
		<div
			onContextMenu={(event) => event.preventDefault()}
			className="overflow-y-scroll scrollbar-thin overflow-x-hidden w-[100%] h-[100%] pb-[10px] "
			id="channelList"
		>
			{isChange ? <ForwardMessageModal open={isChange} /> : null}
			{<CreateNewChannelModal />}
			<div className="self-stretch h-[52px] px-4 flex-col justify-start items-start gap-3 flex mt-[24px]">
				<Events />
				<BrowseChannel />
			</div>
			<hr className="h-[0.08px] w-[272px] mt-[24px] border-[#1E1E1E]" />
			<div
				className={`overflow-y-scroll flex-1 pt-3 space-y-[21px]  text-gray-300 scrollbar-hide ${channelCurrentType === ChannelType.CHANNEL_TYPE_VOICE ? 'pb-[230px]' : 'pb-[120px]'}`}
			>
				{categorizedChannels.map((category: ICategoryChannel) => (
					<div key={category.id}>
						{category.category_name && (
							<div className="flex flex-row px-2 relative">
								<button
									onClick={() => {
										handleToggleCategory(category);
									}}
									className="text-[#AEAEAE] flex items-center px-0.5 w-full font-title tracking-wide hover:text-gray-100 uppercase text-[15px]"
								>
									{!categoriesState[category.id] ? <Icons.ArrowDown /> : <Icons.ArrowRight defaultSize="text-[16px]" />}
									{category.category_name}
								</button>
								<UserRestrictionZone policy={isClanCreator || hasManageChannelPermission}>
									<button
										className="focus-visible:outline-none"
										onClick={() => {
											handleToggleCategory(category, true);
											openModalCreateNewChannel(category);
										}}
									>
										<Icons.Plus />
									</button>
								</UserRestrictionZone>
							</div>
						)}
						{!categoriesState[category.id] && (
							<div className="mt-[5px] space-y-0.5 text-[#AEAEAE]">
								{category?.channels
									?.filter((channel: IChannel) => {
										const categoryIsOpen = !categoriesState[category.id];
										return categoryIsOpen || channel?.unread;
									})
									.map((channel: IChannel, index: number) => {
										return <ChannelListItem key={index} channel={channel as ChannelThreads} />;
									})}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default ChannelList;
