import { Icons } from '@mezon/ui';
import type { ReactNode } from 'react';

interface ControlButtonProps {
	onClick: () => void;
	isActive: boolean;
	label: string;
	icon: ReactNode;
	audioLevel?: number;
}

export function ControlButton({ onClick, isActive, label, icon, audioLevel }: ControlButtonProps) {
	return (
		<button onClick={onClick} className="flex flex-col items-center gap-2">
			<Icons.AudioLevelCircle audioLevel={audioLevel || 0} isActive={isActive && audioLevel !== undefined}>
				<div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-indigo-600' : 'bg-zinc-700'}`}>{icon}</div>
			</Icons.AudioLevelCircle>

			<span className="text-sm text-gray-300">{label}</span>
		</button>
	);
}
