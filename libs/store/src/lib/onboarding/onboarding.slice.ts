import { captureSentryError } from '@mezon/logger';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import memoizee from 'memoizee';
import { ApiOnboardingContent, ApiOnboardingItem } from 'mezon-js/api.gen';
import { MezonValueContext, ensureSession, getMezonCtx } from '../helpers';
const LIST_THREADS_CACHED_TIME = 1000 * 60 * 3;

export const ONBOARDING_FEATURE_KEY = 'ONBOARDING_FEATURE_KEY';

// export interface OnboardingEntity extends ApiOnboardingItem {
// 	id: string; // Primary ID
// }

export type OnboardingClanType = {
	greeting?: ApiOnboardingItem;
	rule: ApiOnboardingItem[];
	question: ApiOnboardingItem[];
	mission: ApiOnboardingItem[];
};

export interface OnboardingState {
	onboardingMode: boolean;
	missionDone: number;
	missionSum: number;
	guideFinished: boolean;
	listOnboarding: Record<string, OnboardingClanType>;
}

const fetchOnboardingCached = memoizee(
	async (mezon: MezonValueContext, clan_id: string) => {
		const response = await mezon.client.listOnboarding(mezon.session, clan_id);
		return response.list_onboarding;
	},
	{
		promise: true,
		maxAge: LIST_THREADS_CACHED_TIME,
		normalizer: (args) => {
			return args[1] + args[0].session.username;
		}
	}
);

export const fetchOnboarding = createAsyncThunk('onboarding/fetchOnboarding', async ({ clan_id }: { clan_id: string }, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const response = await fetchOnboardingCached(mezon, clan_id);

		if (response) {
			return { response, clan_id };
		}
		return { response: [], clan_id };
	} catch (error) {
		captureSentryError(error, 'onboarding/fetchOnboarding');
		return thunkAPI.rejectWithValue(error);
	}
});

export const createOnboardingTask = createAsyncThunk(
	'onboarding/createOnboarding',
	async ({ content, clan_id }: { content: ApiOnboardingContent[]; clan_id: string }, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));

			const response = await mezon.client.createOnboarding(mezon.session, {
				clan_id,
				contents: [...content]
			});
			if (!response.channeldesc) {
				return [];
			}

			return response;
		} catch (error) {
			captureSentryError(error, 'onboarding/createOnboarding');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const initialOnboardingState: OnboardingState = {
	onboardingMode: false,
	missionDone: 0,
	missionSum: 3,
	guideFinished: false,
	listOnboarding: {}
};

export enum ETypeMission {
	SEND_MESSAGE = 0,
	VISIT = 1,
	DOSOMETHING = 2
}
export enum EGuideType {
	GREETING = 1,
	RULE = 2,
	TASK = 3,
	QUESTION = 4
}

export const onboardingSlice = createSlice({
	name: ONBOARDING_FEATURE_KEY,
	initialState: initialOnboardingState,
	reducers: {
		openOnboardingMode: (state) => {
			state.onboardingMode = true;
		},
		closeOnboardingMode: (state) => {
			state.onboardingMode = false;
		},
		doneMission: (state) => {
			if (state.missionDone < state.missionSum) {
				state.missionDone = state.missionDone + 1;
				if (state.missionDone + 1 === state.missionSum) {
					state.guideFinished = true;
				}
			}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchOnboarding.fulfilled, (state, action) => {
			if (!Object.prototype.hasOwnProperty.call(state.listOnboarding, action.payload.clan_id)) {
				const onboardingClan: OnboardingClanType = {
					greeting: undefined,
					mission: [],
					question: [],
					rule: []
				};
				action.payload.response.map((onboardingItem) => {
					switch (onboardingItem.guide_type) {
						case EGuideType.GREETING:
							onboardingClan.greeting = onboardingItem;
							break;
						case EGuideType.RULE:
							onboardingClan.rule.push(onboardingItem);
							break;
						case EGuideType.QUESTION:
							onboardingClan.question.push(onboardingItem);
							break;
						case EGuideType.TASK:
							onboardingClan.mission.push(onboardingItem);
							break;
						default:
							break;
					}
					state.listOnboarding[action.payload.clan_id] = onboardingClan;
				});
			}
		});
	}
});

export const onboardingReducer = onboardingSlice.reducer;

export const onboardingActions = { ...onboardingSlice.actions, createOnboardingTask };

export const getOnboardingState = (rootState: { [ONBOARDING_FEATURE_KEY]: OnboardingState }): OnboardingState => rootState[ONBOARDING_FEATURE_KEY];

export const selectOnboardingMode = createSelector(getOnboardingState, (state) => state.onboardingMode);

export const selectMissionDone = createSelector(getOnboardingState, (state) => state.missionDone);

export const selectMissionSum = createSelector(getOnboardingState, (state) => state.missionSum);
export const selectFinishGuide = createSelector(getOnboardingState, (state) => state.guideFinished);
export const selectOnboardingByClan = (clan_id: string) => createSelector(getOnboardingState, (state) => state.listOnboarding[clan_id]);
