import { useAppNavigation } from '@mezon/core';
function TeamsPage() {
	const { navigate } = useAppNavigation();

	return (
		<div className="flex flex-1 flex-col items-center">
			<div className="flex flex-row justify-between w-full">
				<span className="text-[24px] font-medium">Teams</span>
			</div>
		</div>
	);
}

export default TeamsPage;
