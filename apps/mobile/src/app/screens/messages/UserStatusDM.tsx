import { size } from '@mezon/mobile-ui';
import { getStore, selectClanMembersMetaEntities } from '@mezon/store-mobile';
import { safeJSONParse } from 'mezon-js';
import React from 'react';
import { UserStatus } from '../../components/UserStatus';

export const UserStatusDM = ({ isOnline, metadata, userId }: { isOnline: boolean; metadata: string; userId: string }) => {
	const customStatus = (): {
		status: string;
		isMobile: boolean;
		online: boolean;
	} => {
		try {
			let status = '';
			let isMobile = false;
			let online = false;
			const store = getStore();
			const membersMetaEntities = selectClanMembersMetaEntities(store.getState());
			if (membersMetaEntities[userId]?.isMobile) {
				isMobile = true;
			}
			if (membersMetaEntities[userId]?.online) {
				online = true;
			}
			if (membersMetaEntities[userId]?.status) {
				status = membersMetaEntities[userId]?.status;
			} else {
				const data = safeJSONParse(metadata);
				status = data?.user_status || '';
			}

			return {
				online,
				status,
				isMobile
			};
		} catch (e) {
			return {
				status: '',
				online: false,
				isMobile: false
			};
		}
	};

	return (
		<UserStatus
			status={{ status: isOnline || customStatus()?.online, isMobile: customStatus()?.isMobile }}
			iconSize={size.s_10}
			customStatus={customStatus()?.status}
			customStyles={{ zIndex: 100 }}
		/>
	);
};
