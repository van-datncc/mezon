import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';
import { ApiClanProfile } from '@mezon/mezon-js/dist/api.gen';
import { IClanProfile, LoadingStatus } from '@mezon/utils';
import { useSelector } from 'react-redux';
export const USER_CLAN_PROFILE_FEATURE_KEY = 'userClanProfile';

export interface UserClanProfileEntity extends IClanProfile {
  id: string; // Primary ID
}

export const mapUserClanProfileToEntity = (
  userClanProfileRes: ApiClanProfile,
) => {
  const id = (userClanProfileRes as unknown as any).clan_id;
  return { ...userClanProfileRes, id };
};

export interface UserClanProfileState
  extends EntityState<UserClanProfileEntity, string> {
  loadingStatus: LoadingStatus;
  error?: string | null;
  currentUserClanProfileId?: string | null;
}

export const userClanProfileAdapter =
  createEntityAdapter<UserClanProfileEntity>();

type fetchUserClanProfilePayload = {
  clanId: string;
};
export const fetchUserClanProfile = createAsyncThunk(
  'clans/userClanProfile',
  async ({ clanId }: fetchUserClanProfilePayload, thunkAPI) => {
    const mezon = await ensureSession(getMezonCtx(thunkAPI));
    const response = await mezon.client.getUserProfileOnClan(
      mezon.session,
      clanId,
    );
    if (!response) {
      return thunkAPI.rejectWithValue([]);
    }

    return response;
  },
);

export const initialUserClanProfileState: UserClanProfileState =
  userClanProfileAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null,
  });

export const userClanProfileSlice = createSlice({
  name: USER_CLAN_PROFILE_FEATURE_KEY,
  initialState: initialUserClanProfileState,
  reducers: {
    add: userClanProfileAdapter.addOne,
    remove: userClanProfileAdapter.removeOne,
    changeUserClanProfile: (state, action: PayloadAction<string>) => {
      state.currentUserClanProfileId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserClanProfile.pending, (state: UserClanProfileState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchUserClanProfile.fulfilled,
        (
          state: UserClanProfileState,
          action: PayloadAction<ApiClanProfile>,
        ) => {
          const userClanProfileEntity = mapUserClanProfileToEntity(
            action.payload,
          );
          userClanProfileAdapter.setAll(state, [userClanProfileEntity]);
          state.loadingStatus = 'loaded';
        },
      )
      .addCase(
        fetchUserClanProfile.rejected,
        (state: UserClanProfileState, action) => {
          state.loadingStatus = 'error';
          state.error = action.error.message;
        },
      );
  },
});

export const userClanProfileReducer = userClanProfileSlice.reducer;

export const userClanProfileActions = {
  ...userClanProfileSlice.actions,
  fetchUserClanProfile,
};

const { selectAll, selectEntities } = userClanProfileAdapter.getSelectors();

export const getUserClanProfileState = (rootState: {
  [USER_CLAN_PROFILE_FEATURE_KEY]: UserClanProfileState;
}): UserClanProfileState => rootState[USER_CLAN_PROFILE_FEATURE_KEY];

export const selectUserClanProfile = createSelector(
  getUserClanProfileState,
  selectAll,
);

// export const selectCurrentCategoryId = createSelector(
//   getUserClanProfileState,
//   (state) => state.currentUserClanProfileId
// );

// export const selectCategoriesEntities = createSelector(
//   getUserClanProfileState,
//   selectEntities
// );

// export const selectCategoryById = (id: string) => createSelector(
//   selectCategoriesEntities,
//   (categoriesEntities) => categoriesEntities[id]
// );

// export const selectCurrentCategory = createSelector(
//   selectCategoriesEntities,
//   selectCurrentCategoryId,
//   (categoriesEntities, clanId) => clanId ? categoriesEntities[clanId] : null
// );
