import { useThreads } from '@mezon/core';
import { threadsActions, useAppDispatch } from '@mezon/store';
import { Checkbox, Label } from 'flowbite-react';

type PrivateThreadProps = {
	label?: string;
	title?: string;
};

const PrivateThread = ({ label, title }: PrivateThreadProps) => {
	const dispatch = useAppDispatch();
	const { isPrivate } = useThreads();

	const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.checked ? 1 : 0;
		dispatch(threadsActions.setIsPrivate(value));
	};

	return (
		<div className="flex flex-col mt-4 mb-4">
			<span className="text-xs font-semibold uppercase mb-2 text-[#CCC]">{title}</span>
			<div className="flex items-center gap-2">
				<Checkbox onChange={handleToggle} id="private" className="w-6 h-6 rounded-lg focus:ring-transparent cursor-pointer" />
				<Label htmlFor="private" className="text-[#CCC] text-base hover:text-white cursor-pointer">
					{label}
				</Label>
			</div>
			{isPrivate === 1 && <span className="text-xs text-[#CCC] mt-2">You can invite new people by @mentioning them.</span>}
		</div>
	);
};

export default PrivateThread;
