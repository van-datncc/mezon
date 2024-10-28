import { acitvitiesActions, useAppDispatch } from '@mezon/store';
import { ActivitiesInfo } from '@mezon/utils';
import { useCallback, useMemo } from 'react';

export enum ActivitiesName {
	CODE = 'Code',
	SPOTIFY = 'Spotify'
}

export enum ActititiesType {
	CODE = 0,
	SPOTIFY = 1
}

const testToActivityTypeMap: Record<ActivitiesName, ActititiesType> = {
	[ActivitiesName.CODE]: ActititiesType.CODE,
	[ActivitiesName.SPOTIFY]: ActititiesType.SPOTIFY
};

export function useActivities() {
	const dispatch = useAppDispatch();
	const setUserActivity = useCallback(
		(info: ActivitiesInfo) => {
			const body = {
				activity_description: info.windowTitle,
				activity_name: info.appName,
				activity_type: testToActivityTypeMap[info.appName as ActivitiesName],
				application_id: '0',
				status: 1
			};
			dispatch(acitvitiesActions.createActivity(body));
		},
		[dispatch]
	);
	return useMemo(
		() => ({
			setUserActivity
		}),
		[setUserActivity]
	);
}
