import { Icons } from '@mezon/ui';
import { memo } from 'react';

type FooterModalProps = {
	name?: string;
};

const FooterModal = memo(({ name }: FooterModalProps) => {
	return (
		<div className="text-[#ffffff] text-xs space-y-3  p-4 bg-[#2b2d31]">
			<hr className="border-[#3f4147] my-5" />
			<div className="flex items-center gap-x-2">
				<Icons.IconLock defaultSize="size-4 text-[#ffffff]" />
				<p>
					The Privacy Policy and Terms of Service of <span className="text-white font-semibold">{name}</span>'s developer apply.
				</p>
			</div>
			<div className="flex items-center gap-x-2">
				<Icons.IconClock defaultSize="size-4 text-[#ffffff]" />
				<p className="text-[#ffffff]">Active since 20 Aug 2024</p>
			</div>
		</div>
	);
});

export default FooterModal;
