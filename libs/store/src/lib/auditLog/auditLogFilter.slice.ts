import { IUserAuditLog } from '@mezon/utils';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const AUDIT_LOG_FILTER_FEATURE_KEY = 'auditlogfilter';

export interface AuditLogFilterState {
	user: IUserAuditLog | null;
	action: string;
}

const initialState: AuditLogFilterState = {
	user: null,
	action: ''
};

const auditLogFilterSlice = createSlice({
	name: 'auditlogfilter',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<IUserAuditLog>) => {
			state.user = action.payload;
		},
		setAction: (state, action: PayloadAction<string>) => {
			state.action = action.payload;
		}
	}
});

export const auditLogFilterReducer = auditLogFilterSlice.reducer;

export const auditLogFilterActions = {
	...auditLogFilterSlice.actions
};

export const getAuditLogFilterState = (rootState: { [AUDIT_LOG_FILTER_FEATURE_KEY]: AuditLogFilterState }): AuditLogFilterState =>
	rootState[AUDIT_LOG_FILTER_FEATURE_KEY];

export const selectUserAuditLog = createSelector(getAuditLogFilterState, (state) => state.user);

export const selectActionAuditLog = createSelector(getAuditLogFilterState, (state) => state.action);
