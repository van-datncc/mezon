import { Icons } from '@mezon/ui';
import { useNavigate } from 'react-router-dom';

const AppDetailRightMenu = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-6 items-center w-full">
			<div className="w-full">
				<div className="text-[12px] font-semibold mb-2">ACTIONS</div>
				<div className="flex flex-col w-full gap-[10px]">
					<button
						onClick={() => navigate('/developers/applications')}
						className="flex gap-3 items-center py-2 px-4 dark:text-white text-textLightTheme hover:dark:bg-[#3C4370] hover:bg-bgLightModeButton hover:text-[#5865F3] rounded-md"
					>
						<Icons.LeftArrowIcon className="w-4" />
						<p className="font-medium text-base">Back to Applications</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default AppDetailRightMenu;
