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
			if (!state.listChannelRender[clanId]) {
				const listChannelRender: (ICategoryChannel | IChannel)[] = [];
				const listFavorChannel: IChannel[] = [];
				listCategory.map((category) => {
					const categoryChannels = listChannel.filter((channel) => channel && channel.category_id === category.id) as IChannel[];
					const listChannelIds = categoryChannels.map((channel) => channel.id);
					const sortChannelList = sortChannels(categoryChannels);
					const categoryWithChannels: ICategoryChannel = {
						...category,
						channels: listChannelIds
					};

					listChannelRender.push(categoryWithChannels);
					sortChannelList.forEach((channel) => {
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
      state.listChannelRender[clanId] = state.listChannelRender[clanId].map((channel)=>{
        if(channel.id === channelId){
          return {
            ...channel,
            count_mess_unread : ((channel as IChannel).count_mess_unread || 0) + 1
          }
        }
        return channel
      })
		},
		removeBadgeFromChannel: (state, action: PayloadAction<{ channelId: string; clanId: string }>) => {
			const { channelId, clanId } = action.payload;
			if (state.listChannelRender[clanId]) {
				state.listChannelRender[clanId] = state.listChannelRender[clanId].map((channel)=>{
          if(channel.id === channelId){
            return {
              ...channel,
              count_mess_unread : 0
            }
          }
          return channel
        })
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

function sortChannels(channels: IChannel[]): IChannel[] {
	const sortedChannels: IChannel[] = [];

	channels.forEach((channel) => {
		if (!channel.parrent_id || channel.parrent_id === '0') {
			sortedChannels.push(channel);
			addChildren(channel, sortedChannels);
		}
	});
	// Then add threads of a channel into list
	function addChildren(parent: IChannel, acc: IChannel[]) {
		channels
			.filter((child) => child.parrent_id === parent.id)
			.forEach((child) => {
				acc.push(child);
			});
	}
	return sortedChannels;
}

export enum EMarkAsReadType {
	CHANNEL,
	CLAN,
	CATEGORY
}
