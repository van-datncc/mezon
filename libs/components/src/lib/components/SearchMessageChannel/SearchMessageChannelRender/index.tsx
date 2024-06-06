import { useSearchMessages } from '@mezon/core';
import { searchMessagesActions, useAppDispatch } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { Pagination } from 'flowbite-react';
import EmptySearch from './EmptySearch';
import MessageChannel from './MessageChannel';

const SearchMessageChannelRender = () => {
	const dispatch = useAppDispatch();
	const { searchMessagesChannel, currentPage } = useSearchMessages();

	const onPageChange = (page: number) => {
		dispatch(searchMessagesActions.setCurrentPage(page));
	};

	return (
		<>
			<div className="w-1 h-full dark:bg-bgPrimary bg-bgLightPrimary"></div>
			<div className="flex flex-col w-[420px] h-full">
				<div className="flex flex-row justify-between items-center h-14 p-4 bg-bgTertiary">
					<h3 className="select-none">{`${searchMessagesChannel?.messageChannels.length ?? 0} Results`}</h3>
					<div className="flex flex-row gap-2">
						<button className="px-1 h-8 min-w-12 text-base font-medium rounded bg-buttonSearch hover:bg-buttonSearchHover">New</button>
						<button className="px-1 h-8 min-w-12 text-base font-medium rounded bg-transparent hover:bg-buttonSearchHover">Old</button>
						<button className="px-1 h-8 min-w-12 text-base font-medium rounded bg-transparent hover:bg-buttonSearchHover">
							Relevant
						</button>
					</div>
				</div>
				{searchMessagesChannel.messageChannels?.length > 0 ? (
					<div className="flex flex-col flex-1 h-full p-4 bg-bgSecondary overflow-y-auto overflow-x-hidden">
						<div className="flex flex-col">
							{searchMessagesChannel.messageChannels?.map((messagesChannels) =>
								messagesChannels.map((messagesChannel) => (
									<div key={messagesChannel.channel_label} className="flex flex-col">
										<h3 className="mb-2 text-base font-medium text-ellipsis whitespace-nowrap overflow-hidden">
											{messagesChannel.channel_label}
										</h3>
										<div className="flex flex-col gap-[10px]">
											{messagesChannel.messages?.map((message) => (
												<MessageChannel key={message.message_id} message={message as IMessageWithUser} />
											))}
										</div>
									</div>
								)),
							)}
						</div>
						<div className="mt-4">
							<Pagination
								currentPage={currentPage}
								totalPages={100}
								onPageChange={onPageChange}
								previousLabel="Back"
								nextLabel="Next"
								showIcons
								theme={{
									pages: {
										previous: {
											base: 'h-7 ml-0 mr-1 flex items-center justify-center rounded font-semibold border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-none dark:bg-bgSecondary dark:text-gray-400 enabled:dark:hover:bg-bgSecondary600 enabled:dark:hover:text-white',
											icon: 'h-5 w-5',
										},
										next: {
											base: 'h-7 ml-1 flex items-center justify-center rounded font-semibold border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-none dark:bg-bgSecondary dark:text-gray-400 enabled:dark:hover:bg-bgSecondary600 enabled:dark:hover:text-white',
											icon: 'h-5 w-5',
										},
										selector: {
											base: 'w-7 h-7 mx-1 flex items-center justify-center rounded-full font-semibold border border-gray-300 bg-white py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-none dark:bg-bgSecondary dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
											active: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:border-none dark:bg-bgSelectItem dark:text-white',
										},
									},
								}}
							/>
						</div>
					</div>
				) : (
					<EmptySearch />
				)}
			</div>
		</>
	);
};

export default SearchMessageChannelRender;
