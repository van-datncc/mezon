import { captureSentryError } from '@mezon/logger';
import { createAsyncThunk, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';
import { RootState } from '../store';

export const COMUNITY_FEATURE_KEY = 'COMUNITY_FEATURE_KEY';

export interface ComunityClanState {
    isCommunityEnabled: boolean;
    communityBanner: string | null;
    about: string;
}

export interface ComunityState {
    byClanId: Record<string, ComunityClanState>;
    isLoading: boolean;
    error: string | null;
}

export const initialComunityState: ComunityState = {
    byClanId: {},
    isLoading: false,
    error: null,
};

export const updateCommunityStatus = createAsyncThunk(
    'comunity/updateCommunityStatus',
    async (
        { clan_id, enabled }: { clan_id: string; enabled: boolean },
        thunkAPI
    ) => {
        try {
            const mezon = await ensureSession(getMezonCtx(thunkAPI));
            await mezon.client.updateClanDesc(mezon.session, clan_id, {
                is_community: enabled,
            });
            return { clan_id, enabled };
        } catch (error) {
            captureSentryError(error, 'comunity/updateCommunityStatus');
            return thunkAPI.rejectWithValue('Failed to update community status');
        }
    }
);

export const updateCommunityBanner = createAsyncThunk(
    'comunity/updateCommunityBanner',
    async (
        { clan_id, bannerUrl }: { clan_id: string; bannerUrl: string },
        thunkAPI
    ) => {
        try {
            const mezon = await ensureSession(getMezonCtx(thunkAPI));
            await mezon.client.updateClanDesc(mezon.session, clan_id, {
                community_banner: bannerUrl,
            });
            return { clan_id, bannerUrl };
        } catch (error) {
            captureSentryError(error, 'comunity/updateCommunityBanner');
            return thunkAPI.rejectWithValue('Failed to update community banner');
        }
    }
);

export const comunitySlice = createSlice({
    name: COMUNITY_FEATURE_KEY,
    initialState: initialComunityState,
    reducers: {
        resetComunityState: (state) => {
            state.byClanId = {};
            state.isLoading = false;
            state.error = null;
        },
        setCommunityBanner: (state, action: PayloadAction<{ clanId: string; banner: string | null }>) => {
            const { clanId, banner } = action.payload;
            if (!state.byClanId[clanId]) state.byClanId[clanId] = { isCommunityEnabled: false, communityBanner: null, about: "" };
            state.byClanId[clanId].communityBanner = banner;
        },
        setCommunityAbout: (state, action: PayloadAction<{ clanId: string; about: string }>) => {
            const { clanId, about } = action.payload;
            if (!state.byClanId[clanId]) state.byClanId[clanId] = { isCommunityEnabled: false, communityBanner: null, about: "" };
            state.byClanId[clanId].about = about;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateCommunityStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCommunityStatus.fulfilled, (state, action) => {
                const { clan_id, enabled } = action.payload;
                if (!state.byClanId[clan_id]) state.byClanId[clan_id] = { isCommunityEnabled: false, communityBanner: null, about: "" };
                state.byClanId[clan_id].isCommunityEnabled = enabled;
                state.isLoading = false;
            })
            .addCase(updateCommunityStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCommunityBanner.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCommunityBanner.fulfilled, (state, action) => {
                const { clan_id, bannerUrl } = action.payload;
                if (!state.byClanId[clan_id]) state.byClanId[clan_id] = { isCommunityEnabled: false, communityBanner: null, about: "" };
                state.byClanId[clan_id].communityBanner = bannerUrl;
                state.isLoading = false;
            })
            .addCase(updateCommunityBanner.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const comunityReducer = comunitySlice.reducer;

export const comunityActions = {
    ...comunitySlice.actions,
    updateCommunityStatus,
    updateCommunityBanner,
};

export const selectComunityState = (state: RootState) => state[COMUNITY_FEATURE_KEY] as ComunityState;

export const selectIsCommunityEnabled = createSelector(
    [(state: RootState, clanId: string) => selectComunityState(state).byClanId?.[clanId]?.isCommunityEnabled],
    (isCommunityEnabled) => isCommunityEnabled ?? false
);

export const selectCommunityBanner = createSelector(
    [(state: RootState, clanId: string) => selectComunityState(state).byClanId?.[clanId]?.communityBanner],
    (communityBanner) => communityBanner ?? null
);

export const selectComunityAbout = createSelector(
    [(state: RootState, clanId: string) => selectComunityState(state).byClanId?.[clanId]?.about],
    (about) => about ?? ""
);

export const selectComunityLoading = createSelector(
    [selectComunityState],
    (state) => state.isLoading
);

export const selectComunityError = createSelector(
    [selectComunityState],
    (state) => state.error
);