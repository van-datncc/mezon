import { selectTheme } from '@mezon/store';
import { IClan } from '@mezon/utils';
import { Tooltip } from 'flowbite-react';
import { useSelector } from 'react-redux';

export type SidebarTooltipProps = {
	titleTooltip?: string;
	readonly children?: React.ReactElement | string;
	clan?: IClan;
};

const SidebarTooltip = ({ titleTooltip, clan, children }: SidebarTooltipProps) => {
	const appearanceTheme = useSelector(selectTheme);

	return (
		<Tooltip
			content={
				<p style={{ whiteSpace: 'nowrap' }} className="max-w-60 truncate flex gap-1 items-center">
					{clan?.is_onboarding && <OnboardingIcon />} <div className="flex-1 truncate"> {titleTooltip} </div>
				</p>
			}
			trigger="hover"
			animation="duration-500"
			style={appearanceTheme === 'light' ? 'light' : 'dark'}
			placement="right"
		>
			{children}
		</Tooltip>
	);
};

const OnboardingIcon = () => {
	return (
		<div className="relative h-4 w-4">
			<svg className="absolute" role="img" width="16" height="16" viewBox="0 0 16 15.2">
				<path
					fill="#ffffff"
					fillRule="evenodd"
					d="m16 7.6c0 .79-1.28 1.38-1.52 2.09s.44 2 0 2.59-1.84.35-2.46.8-.79 1.84-1.54 2.09-1.67-.8-2.47-.8-1.75 1-2.47.8-.92-1.64-1.54-2.09-2-.18-2.46-.8.23-1.84 0-2.59-1.54-1.3-1.54-2.09 1.28-1.38 1.52-2.09-.44-2 0-2.59 1.85-.35 2.48-.8.78-1.84 1.53-2.12 1.67.83 2.47.83 1.75-1 2.47-.8.91 1.64 1.53 2.09 2 .18 2.46.8-.23 1.84 0 2.59 1.54 1.3 1.54 2.09z"
				></path>
			</svg>
			<svg
				className="absolute top-1 right-1"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				width="8"
				height="8"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					fill="#000000"
					d="m2.4 8.4 8.38-6.46a2 2 0 0 1 2.44 0l8.39 6.45a2 2 0 0 1-.79 3.54l-.32.07-.82 8.2a2 2 0 0 1-1.99 1.8H16a1 1 0 0 1-1-1v-5a3 3 0 0 0-6 0v5a1 1 0 0 1-1 1H6.31a2 2 0 0 1-1.99-1.8L3.5 12l-.32-.07a2 2 0 0 1-.79-3.54Z"
				></path>
			</svg>
		</div>
	);
};
export default SidebarTooltip;
