import { Icons } from '@mezon/ui';
import Tooltip from 'rc-tooltip';

type SelectGroupProps = {
	groupName?: string;
	children?: React.ReactNode;
	isSearch?: boolean;
};

const tooltipContent = (
	<div className="bg-gray-900 dark:bg-gray-800 text-white p-4 rounded-lg shadow-xl border border-gray-700 text-sm max-w-sm">
		<div className="font-semibold mb-3 text-blue-300">Type special characters to search:</div>

		<div className="space-y-2 mb-3">
			<div className="flex items-center gap-2">
				<span className="font-mono font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded text-lg">&gt;</span>
				<span>
					Search messages <strong>from</strong> specific user
				</span>
			</div>
			<div className="flex items-center gap-2">
				<span className="font-mono font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded text-lg">~</span>
				<span>
					Search messages <strong>mentioning</strong> specific user
				</span>
			</div>
			<div className="flex items-center gap-2">
				<span className="font-mono font-bold text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded text-lg">&amp;</span>
				<span>
					Search messages with <strong>specific content</strong> (video, link, image)
				</span>
			</div>
		</div>

		<div className="border-t border-gray-600 pt-3">
			<div className="text-gray-300 text-xs mb-1">Examples:</div>
			<div className="space-y-1 text-xs">
				<div>
					<span className="font-mono bg-gray-700 px-1 rounded">&gt;john</span> - Find messages from john
				</div>
				<div>
					<span className="font-mono bg-gray-700 px-1 rounded">~mary</span> - Find messages mentioning mary
				</div>
				<div>
					<span className="font-mono bg-gray-700 px-1 rounded">&amp;video</span> - Find messages with videos
				</div>
			</div>
		</div>
	</div>
);

const SelectGroup = ({ groupName, children, isSearch }: SelectGroupProps) => {
	return (
		<div className="first:mt-0 mt-3 mx-3 border-b border-borderDivider last:border-b-0 last:bottom-b-0 pb-3 last:pb-0">
			<div className="flex items-center justify-between pb-2">
				<h3 className="px-2 text-xs font-bold text-textPrimaryLight dark:text-textPrimary uppercase">
					{groupName}
					{isSearch && (
						<Tooltip placement="topRight" overlay={tooltipContent} overlayClassName="search-help-tooltip" trigger={['hover', 'click']}>
							<svg className="inline-block ml-1 mb-1" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
							</svg>
						</Tooltip>
					)}
				</h3>
				<div className="relative">
					<button title="Learn More">
						<Icons.Help defaultSize="w-4 h-4" />
					</button>
				</div>
			</div>
			{children}
		</div>
	);
};

export default SelectGroup;
