export const useNavigation = () => {
	const toClanPage = (clanId: string) => {
		return `/clan/${clanId}`;
	};

	const toDiscoverPage = () => {
		return '/clans';
	};

	return {
		toClanPage,
		toDiscoverPage
	};
};
