import { IThread } from '@mezon/utils';
import { createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit';
const LIST_THREADS_CACHED_TIME = 1000 * 60 * 3;

export const ONBOARDING_FEATURE_KEY = 'ONBOARDING_FEATURE_KEY';

/*
 * Update these interfaces according to your requirements.
 */
export interface OnboardingEntity extends IThread {
	id: string; // Primary ID
}

export interface OnboardingState extends EntityState<OnboardingEntity, string> {
	onboardingMode: boolean;
	missionDone: number;
	missionSum: number;
	guideFinished: boolean;
	listMission: { title: string; description: string }[];
}

export const onboardingAdapter = createEntityAdapter({ selectId: (thread: OnboardingEntity) => thread.id || '' });

export const initialOnboardingState: OnboardingState = onboardingAdapter.getInitialState({
	onboardingMode: false,
	missionDone: 0,
	missionSum: 3,
	guideFinished: false,
	listMission: [
		{
			title: `Sends message in #general`,
			description: `Sends message in #general`
		},
		{
			title: "Visit clan's members list ",
			description: `Open clan's members list`
		},
		{
			title: 'Visit events clans ',
			description: `Open events clan`
		}
	]
});

export enum ETypeMission {
	SEND_MESSAGE = 0,
	VISIT = 1,
	DOSOMETHING = 2
}

export const onboardingSlice = createSlice({
	name: ONBOARDING_FEATURE_KEY,
	initialState: initialOnboardingState,
	reducers: {
		add: onboardingAdapter.addOne,
		remove: onboardingAdapter.removeOne,
		update: onboardingAdapter.updateOne,
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
	}
});

export const onboardingReducer = onboardingSlice.reducer;

export const onboardingActions = { ...onboardingSlice.actions };

const { selectAll, selectEntities } = onboardingAdapter.getSelectors();

export const getOnboardingState = (rootState: { [ONBOARDING_FEATURE_KEY]: OnboardingState }): OnboardingState => rootState[ONBOARDING_FEATURE_KEY];

export const selectOnboardingMode = createSelector(getOnboardingState, (state) => state.onboardingMode);

export const selectMissionDone = createSelector(getOnboardingState, (state) => state.missionDone);

export const selectMissionSum = createSelector(getOnboardingState, (state) => state.missionSum);
export const selectFinishGuide = createSelector(getOnboardingState, (state) => state.guideFinished);
export const selectListMission = createSelector(getOnboardingState, (state) => state.listMission);
