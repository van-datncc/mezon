import { ICategoryChannel, IChannel } from '@mezon/utils';
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiChannelDescription, ApiUpdateCategoryDescRequest } from 'mezon-js/api.gen';
import { CategoriesEntity } from '../categories/categories.slice';
import { RootState } from '../store';
import { ChannelsEntity, IUpdateChannelRequest } from './channels.slice';

export const CHANNEL_LIST_RENDER = 'CHANNEL_LIST_RENDER';

export interface ChannelListRenderState {
	listChannelRender: Record<string, Array<IChannel | ICategoryChannel>>;
}

export const initialListChannelRenderState: ChannelListRenderState = {
	listChannelRender: {}
};

export interface DataChannelAndCate {
	listChannel: IChannel[];
	listCategory: CategoriesEntity[];
	clanId: string;
	listChannelFavor: string[];
}

export const FAVORITE_CATEGORY_ID = 'favorCate';

export const listChannelRenderSlice = createSlice({
	name: CHANNEL_LIST_RENDER,
	initialState: initialListChannelRenderState,
	reducers: {
		mapListChannelRender: (state, action: PayloadAction<DataChannelAndCate>) => {
			const { listChannel, listCategory, clanId, listChannelFavor } = action.payload;
			// Prioritize moving channel forward thread
			const listChannelPriority = prioritizeChannel(listChannel);
			if (!state.listChannelRender[clanId]) {
				const listChannelRender: (ICategoryChannel | IChannel)[] = [];
				const listFavorChannel: IChannel[] = [];
				listCategory.map((category) => {
					const categoryChannels = sortChannels(listChannelPriority, category.id);
					const listChannelIds = categoryChannels.map((channel) => channel.id);
					const categoryWithChannels: ICategoryChannel = {
						...category,
						channels: listChannelIds
					};

					listChannelRender.push(categoryWithChannels);
					categoryChannels.forEach((channel) => {
						if (listChannelFavor.includes(channel.id)) {
							listFavorChannel.push({
								...channel,
								isFavor: true,
								category_id: 'favorCate'
							});
						}
						listChannelRender.push(channel);
					});
				});
				const favorCate: ICategoryChannel = {
					channels: listChannelFavor,
					id: 'favorCate',
					category_id: 'favorCate',
					category_name: 'Favorite Channel',
					clan_id: clanId,
					creator_id: '0',
					category_order: 1,
					isFavor: true
				};

				state.listChannelRender[clanId] = [favorCate, ...listFavorChannel, ...listChannelRender];
			}
		},
		addChannelToListRender: (state, action: PayloadAction<ApiChannelDescription>) => {
			const channelData: IChannel = {
				...(action.payload as IChannel),
				id: action.payload.channel_id || ''
			};
			const clanId = channelData.clan_id;
			if (clanId && state.listChannelRender[clanId]) {
				const indexInsert = state.listChannelRender[clanId].findIndex((channel) => channel.id === channelData.category_id);
				if (indexInsert === -1) {
					return;
				}
				state.listChannelRender[clanId].splice(indexInsert + 1, 0, channelData);
				state.listChannelRender[clanId].join();
			}
		},
		deleteChannelInListRender: (state, action: PayloadAction<{ channelId: string; clanId: string }>) => {
			const { channelId, clanId } = action.payload;
			if (!state.listChannelRender[clanId]) {
				return;
			}
			state.listChannelRender[clanId] = state.listChannelRender[clanId].filter(
				(channel) => channel.id !== channelId && (channel as IChannel).parrent_id !== channelId
			);
		},
		updateChannelInListRender: (state, action: PayloadAction<{ channelId: string; clanId: string; dataUpdate: IUpdateChannelRequest }>) => {
			const { channelId, clanId, dataUpdate } = action.payload;
			if (state.listChannelRender[clanId]) {
				const indexUpdate = state.listChannelRender[clanId].findIndex((channel) => channel.id === channelId);
				if (indexUpdate === -1) {
					return;
				}
				state.listChannelRender[clanId][indexUpdate] = {
					...state.listChannelRender[clanId][indexUpdate],
					channel_label: dataUpdate.channel_label,
					app_url: dataUpdate.app_url,
					e2ee: dataUpdate.e2ee,
					topic: dataUpdate.topic,
					age_restricted: dataUpdate.age_restricted,
					channel_private: dataUpdate.channel_private
				};
			}
		},
		updateChannelPositionInRenderedList: (state, action: PayloadAction<{ channelId: string; clanId: string; categoryId: string }>) => {
			const { channelId, clanId, categoryId } = action.payload;
			if (!state.listChannelRender[clanId]) {
				return;
			}
			const oldIndexOfChannel = state.listChannelRender[clanId].findIndex((channel) => channel.id === channelId);
			const indexOfNewCategory = state.listChannelRender[clanId].findIndex((channel) => channel.id === categoryId);
			if (oldIndexOfChannel === -1 || indexOfNewCategory === -1) {
				return;
			}

			const newChannelWithThreads = state.listChannelRender[clanId].filter((item) => {
				if ((item as IChannel).id === channelId || (item as IChannel).parrent_id === channelId) {
					return {
						...item,
						category_id: categoryId
					};
				}
			});

			state.listChannelRender[clanId].splice(oldIndexOfChannel, newChannelWithThreads.length);

			if (indexOfNewCategory > oldIndexOfChannel) {
				state.listChannelRender[clanId].splice(indexOfNewCategory - newChannelWithThreads.length + 1, 0, ...newChannelWithThreads);
			} else {
				state.listChannelRender[clanId].splice(indexOfNewCategory + 1, 0, ...newChannelWithThreads);
			}
		},
		addCategoryToListRender: (state, action: PayloadAction<{ clanId: string; cate: ICategoryChannel }>) => {
			const { clanId, cate } = action.payload;
			if (state.listChannelRender[clanId]) {
				state.listChannelRender[clanId] = [...state.listChannelRender[clanId], cate];
			}
		},
		updateCategory: (state, action: PayloadAction<{ clanId: string; cate: ApiUpdateCategoryDescRequest }>) => {
			const { clanId, cate } = action.payload;
			if (state.listChannelRender[clanId]) {
				const indexUpdate = state.listChannelRender[clanId].findIndex((channel) => channel.id === cate.category_id);
				state.listChannelRender[clanId][indexUpdate] = {
					...state.listChannelRender[clanId][indexUpdate],
					category_name: cate.category_name
				};
			}
		},
		addThreadToListRender: (state, action: PayloadAction<{ clanId: string; channel: ChannelsEntity }>) => {
			const { channel, clanId } = action.payload;

			const channelData: IChannel = {
				...(channel as IChannel),
				id: channel.id
			};

			if (!state.listChannelRender[clanId]) {
				return;
			}

			const isExistChannel = state.listChannelRender[clanId]?.findIndex((channel) => (channel as IChannel)?.channel_id === channelData.id);
			if (isExistChannel === -1 && clanId) {
				const indexInsert = state.listChannelRender[clanId]?.findIndex(
					(channel) => (channel as IChannel)?.channel_id === channelData.parrent_id && !(channel as IChannel).isFavor
				);

				if (indexInsert === -1) {
					return;
				}
				state.listChannelRender[clanId]?.splice(indexInsert + 1, 0, channelData);
				state.listChannelRender[clanId].join();
			}
		},
		addBadgeToChannelRender: (state, action: PayloadAction<{ channelId: string; clanId: string }>) => {
			const { channelId, clanId } = action.payload;
			if (clanId === '0') {
				return;
			}
			if (!state.listChannelRender[clanId]) {
				return;
			}
			state.listChannelRender[clanId] = state.listChannelRender[clanId].map((channel) => {
				if (channel.id === channelId) {
					return {
						...channel,
						count_mess_unread: ((channel as IChannel).count_mess_unread || 0) + 1
					};
				}
				return channel;
			});
		},
		removeBadgeFromChannel: (state, action: PayloadAction<{ channelId: string; clanId: string }>) => {
			const { channelId, clanId } = action.payload;
			if (state.listChannelRender[clanId]) {
				state.listChannelRender[clanId] = state.listChannelRender[clanId].map((channel) => {
					if (channel.id === channelId) {
						return {
							...channel,
							count_mess_unread: 0
						};
					}
					return channel;
				});
			}
		},
		leaveChannelListRender: (state, action: PayloadAction<{ channelId: string; clanId: string }>) => {
			const { channelId, clanId } = action.payload;
			if (state.listChannelRender[clanId]) {
				const indexRemove = state.listChannelRender[clanId]?.findIndex((channel) => channel.id === channelId);
				if (indexRemove === -1) {
					return;
				}
				state.listChannelRender[clanId]?.splice(indexRemove, 1);
				state.listChannelRender[clanId].join();
			}
		},
		handleMarkAsReadListRender: (
			state,
			action: PayloadAction<{ channelId?: string; clanId?: string; categoryId?: string; type: EMarkAsReadType }>
		) => {
			const { channelId, clanId, categoryId, type } = action.payload;
			switch (type) {
				case EMarkAsReadType.CHANNEL:
					if (!clanId || !channelId || !state.listChannelRender[clanId]) {
						return;
					}
					state.listChannelRender[clanId] = state.listChannelRender[clanId].map((channel) => {
						if (channel.id === channelId || (channel as IChannel).parrent_id === channelId) {
							return {
								...channel,
								count_mess_unread: 0
							};
						}
						return channel;
					});
					break;
				case EMarkAsReadType.CLAN:
					if (!clanId || !state.listChannelRender[clanId]) {
						return;
					}
					state.listChannelRender[clanId] = state.listChannelRender[clanId].map((channel) => {
						return {
							...channel,
							count_mess_unread: 0
						};
					});
					break;
				case EMarkAsReadType.CATEGORY:
					if (!clanId || !categoryId || !state.listChannelRender[clanId]) {
						return;
					}
					state.listChannelRender[clanId] = state.listChannelRender[clanId].map((channel) => {
						if ((channel as IChannel).category_id === categoryId) {
							return {
								...channel,
								count_mess_unread: 0
							};
						}
						return channel;
					});
					break;
				default:
					break;
			}
		}
	}
});

export const listChannelRenderAction = {
	...listChannelRenderSlice.actions
};

export const listChannelRenderReducer = listChannelRenderSlice.reducer;

export const getListChannelRenderState = (rootState: { [CHANNEL_LIST_RENDER]: ChannelListRenderState }): ChannelListRenderState =>
	rootState[CHANNEL_LIST_RENDER];

export const selectListChannelRenderByClanId = createSelector(
	[getListChannelRenderState, (state: RootState, clanId?: string) => clanId],
	(state, clanId) => {
		if (!clanId || !state.listChannelRender[clanId]) {
			return undefined;
		}
		return state.listChannelRender[clanId];
	}
);

function prioritizeChannel(channels: IChannel[]): IChannel[] {
	return channels.sort((a, b) => {
		const aParrentId = a.parrent_id ?? '';
		const bParrentId = b.parrent_id ?? '';

		if ((aParrentId === '0' || aParrentId === '') && bParrentId !== '0') {
			return -1;
		}
		if (aParrentId !== '0' && (bParrentId === '0' || bParrentId === '')) {
			return 1;
		}
		if (aParrentId === '0' || aParrentId === '') {
			const aChannelId = a.channel_id ?? '';
			const bChannelId = b.channel_id ?? '';
			return aChannelId < bChannelId ? -1 : aChannelId > bChannelId ? 1 : 0;
		}
		return aParrentId < bParrentId ? -1 : aParrentId > bParrentId ? 1 : 0;
	});
}

function sortChannels(channels: IChannel[], categoryId: string): IChannel[] {
	const sortedChannels: IChannel[] = [];
	let indexThread = channels.length;
	const numOfChannel = channels.length;
	for (let i = 0; i < numOfChannel; i++)
		if (channels[i].parrent_id !== '0' && channels[i].parrent_id !== undefined) {
			indexThread = i;
			break;
		}

	const numOfParrent = indexThread;
	for (let i = 0; i < numOfParrent; i++) {
		const channel = channels[i];
		if (channel.category_id === categoryId) {
			sortedChannels.push(channel);
			for (; indexThread < numOfChannel; indexThread++) {
				const thread = channels[indexThread];
				const parrentId = thread.parrent_id || '';
				if (thread.parrent_id === channel.id) {
					sortedChannels.push(thread);
				} else if (channel.id < parrentId) {
					indexThread--;
					break;
				}
			}
		}
	}
	return sortedChannels;
}

export enum EMarkAsReadType {
	CHANNEL,
	CLAN,
	CATEGORY
}
