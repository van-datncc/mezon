import { useColorRole } from '../contexts/ColorRoleContext';

export function useColorsRoleById(messageSenderId: string) {
	const { getUserHighestRoleColor, getUserHighestRoleIcon } = useColorRole();

	return {
		highestPermissionRoleColor: getUserHighestRoleColor(messageSenderId),
		highestPermissionRoleIcon: getUserHighestRoleIcon(messageSenderId)
	};
}
