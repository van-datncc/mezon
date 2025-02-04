import { Icons } from '@mezon/ui';

interface IStartCallButtonProps {
	isTalking: boolean;
}

export function StartCallButton({ isTalking }: IStartCallButtonProps) {
	return (
		<div className="relative leading-5 h-6">
			<button className="focus-visible:outline-none" onContextMenu={(e) => e.preventDefault()}>
				{isTalking ? (
					<Icons.StartCall className="size-6 dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode" />
				) : (
					<Icons.StopCall className="size-6 text-red-600" />
				)}
			</button>
		</div>
	);
}
