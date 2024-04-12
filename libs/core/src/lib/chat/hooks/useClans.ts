import {
	ClansEntity,
	clansActions,
	selectAllClans,
	selectAllUsesClan,
	selectCurrentClan,
	selectCurrentClanId,
	useAppDispatch,
	userClanProfileActions,
} from '@mezon/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useClans() {
	const dispatch = useAppDispatch();
	const clans = useSelector(selectAllClans);
	const currentClanId = useSelector(selectCurrentClanId);
	const currentClan = useSelector(selectCurrentClan);
	const usersClan = useSelector(selectAllUsesClan);

	const changeCurrentClan = React.useCallback(
		async (clanId: string) => {
			await dispatch(clansActions.changeCurrentClan({ clanId }));
		},
		[dispatch],
	);

	const getUserClanProfile = React.useCallback(
		async (clanId: string) => {
			await dispatch(userClanProfileActions.fetchUserClanProfile({ clanId }));
		},
		[dispatch],
	);

	const updateUserClanProfile = React.useCallback(
		async (clanId: string, name: string, logoUrl: string) => {
			const action = await dispatch(
				userClanProfileActions.updateUserClanProfile({
					clanId,
					username: name,
					avatarUrl: logoUrl,
				}),
			);
			const payload = action.payload;
			return payload;
		},
		[dispatch],
	);

	const createClans = React.useCallback(
		async (name: string, logoUrl: string) => {
			const action = await dispatch(clansActions.createClan({ clan_name: name, logo: logoUrl }));
			const payload = action.payload as ClansEntity;
			if (payload && payload.clan_id) {
				changeCurrentClan(payload.clan_id);
			}
			return payload;
		},
		[changeCurrentClan, dispatch],
	);

	const avatarClans = usersClan.map((user) => user.user?.avatar_url).slice(0, 5);

	const remainingMember = usersClan.map((user) => user.user).slice(5);

	return useMemo(
		() => ({
			clans,
			currentClanId,
			currentClan,
			usersClan,
			avatarClans,
			remainingMember,
			getUserClanProfile,
			updateUserClanProfile,
			createClans,
		}),
		[clans, usersClan, currentClanId, currentClan, getUserClanProfile, updateUserClanProfile, createClans],
	);
}
