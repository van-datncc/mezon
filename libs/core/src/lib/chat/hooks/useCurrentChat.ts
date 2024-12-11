import {
	selectAllUserClans,
	selectClanView,
	selectCurrentChannel,
	selectCurrentDM,
	selectEntitesUserClans,
	selectGrouplMembers,
	selectGroupMembersEntities,
	useAppSelector
} from '@mezon/store';
import { useAppParams } from '../../app/hooks/useAppParams';

export function useCurrentChat() {
	const { directId } = useAppParams();
	const isClanView = useAppSelector((state) => selectClanView(state));
	const allClanUsersEntities = useAppSelector(selectEntitesUserClans);
	const allDmUsersEntities = useAppSelector((state) => selectGroupMembersEntities(state, directId));
	const allClanUsers = useAppSelector(selectAllUserClans);
	const allDmUsers = useAppSelector((state) => selectGrouplMembers(state, directId));

	const currentChat = useAppSelector((state) => {
		return isClanView ? selectCurrentChannel(state) : selectCurrentDM(state);
	});

	const currentChatUsers = isClanView ? allClanUsers : allDmUsers;

	const currentChatUsersEntities = isClanView ? allClanUsersEntities : allDmUsersEntities;

	return {
		currentChat,
		currentChatUsers,
		currentChatUsersEntities
	};
}
