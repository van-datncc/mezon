import {isGifFile, isImageFile, LoadingStatus} from '@mezon/utils';
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  EntityState,
  createSelector
} from '@reduxjs/toolkit';
import {
  ApiClanEmoji,
  ApiClanEmojiCreateRequest,
  ApiClanEmojiList,
  MezonUpdateClanEmojiByIdBody
} from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';
import {StickersEntity} from "../giftStickerEmojiPanel/stickers.slice";

export const SETTING_CLAN_EMOJI = 'settingEmoji';

export interface SettingClanEmojiState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	listEmoji: {
    staticEmoji: Array<ApiClanEmoji>,
    animatedEmoji: Array<ApiClanEmoji>
  };
}

type fetchEmojiRequest = {
  clanId: string;
}

type updateEmojiRequest = {
  request: MezonUpdateClanEmojiByIdBody,
  currentClanId: string
}

export const initialSettingClanEmojiState: SettingClanEmojiState = {
	loadingStatus: 'not loaded',
	error: null,
	listEmoji: {
    staticEmoji: [],
    animatedEmoji: []
  },
};

export const emojiAdapter = createEntityAdapter<StickersEntity>();

export const fetchEmojisByClanId = createAsyncThunk('settingClanEmoji/fetchClanEmoji', async ({clanId}: fetchEmojiRequest, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const response = await mezon.client.listClanEmoji(mezon.session, clanId);
    return response;
	} catch (error) {
		return thunkAPI.rejectWithValue([]);
	}
});

export const createEmoji = createAsyncThunk('settingClanEmoji/createEmoji', async (request: ApiClanEmojiCreateRequest, thunkAPI) => {
  try {
    const mezon = await ensureSession(getMezonCtx(thunkAPI));
    const res = await mezon.client.createClanEmoji(mezon.session, request);
    if(res) {
      const newEmoji: ApiClanEmoji = {
        src: request.source,
        category: request.category,
        shortname: request.shortname,
      }
      return newEmoji;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue({})
  }
});

export const updateEmoji = createAsyncThunk('settingClanEmoji/updateEmoji', async ({request, currentClanId}: updateEmojiRequest, thunkAPI) => {
  try {
    console.log (request, currentClanId);
    const mezon = await ensureSession(getMezonCtx(thunkAPI));
    const res = await mezon.client.updateClanEmojiById(mezon.session, currentClanId, request);
    if(res) {
      console.log (res);
    }
  } catch (error) {
    console.log (request, currentClanId);
    return thunkAPI.rejectWithValue({})
  }
})

export const settingClanEmojiSlice = createSlice({
	name: SETTING_CLAN_EMOJI,
	initialState: initialSettingClanEmojiState,
	reducers: {
  },
	extraReducers(builder) {
		builder
			.addCase(fetchEmojisByClanId.fulfilled, (state: SettingClanEmojiState, actions: PayloadAction<ApiClanEmojiList>) => {
				state.loadingStatus = 'loaded';
				state.listEmoji.staticEmoji = actions.payload.emoji_list?.filter(emoji => isImageFile(emoji.src ?? '')) ?? [];
        state.listEmoji.animatedEmoji = actions.payload.emoji_list?.filter(emoji => isGifFile(emoji.src ?? '')) ?? [];
			})
			.addCase(fetchEmojisByClanId.pending, (state: SettingClanEmojiState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchEmojisByClanId.rejected, (state: SettingClanEmojiState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			})
      .addCase(createEmoji.fulfilled, (state: SettingClanEmojiState, action) => {
        if(action.payload) {
          if(isImageFile(action.payload.src ?? '')) {
            state.listEmoji.staticEmoji.unshift(action.payload);
          } else if(isGifFile(action.payload.src ?? '')) {
            state.listEmoji.animatedEmoji.unshift(action.payload);
          }
        }
      })
      .addCase(updateEmoji.fulfilled, (state: SettingClanEmojiState, action) => {
        console.log (action.payload)
      })
	},
});

export const { selectAll, selectEntities } = emojiAdapter.getSelectors();

export const getEmojiSettingState = (rootState: { [SETTING_CLAN_EMOJI]: SettingClanEmojiState }): SettingClanEmojiState => rootState[SETTING_CLAN_EMOJI];
export const selectAllEmoji = createSelector(getEmojiSettingState, (state) => state?.listEmoji);

export const settingClanEmojiReducer = settingClanEmojiSlice.reducer;

export const settingClanEmojiActions = { ...settingClanEmojiSlice.actions, fetchEmojisByClanId, createEmoji, updateEmoji };

