import { ClockIcon, LockIcon } from 'libs/ui/src/lib/Icons';
import { memo } from 'react';
import { useAppearance } from '../../../context/AppearanceContext';

type FooterModalProps = {
	name?: string;
};

const FooterModal = memo(({ name }: FooterModalProps) => {
	const { isDarkMode } = useAppearance();

	const bgColor = isDarkMode ? 'bg-[#1e1f22]' : 'bg-[#f9fafb]';
	const textPrimary = isDarkMode ? 'text-[#d1d5db]' : 'text-[#111827]';
	const textSecondary = isDarkMode ? 'text-[#9ca3af]' : 'text-[#4b5563]';
	const borderColor = isDarkMode ? 'border-[#4b5563]' : 'border-[#d1d5db]';

	return (
		<div className={`text-xs space-y-3 p-4 ${bgColor}`}>
			<hr className={`my-3 ${borderColor}`} />
			<div className="flex gap-x-2 items-start">
				<LockIcon className={`h-4 w-4 ${textSecondary}`} />
				<p className={`${textSecondary}`}>
					The Privacy Policy and Terms of Service of{' '}
					<span className={`${textPrimary} font-semibold`}>{name}</span>&apos;s developer apply.
				</p>
			</div>
			<div className="flex gap-x-2 items-start">
				<ClockIcon className={`h-4 w-4 ${textSecondary}`} />
				<p className={`${textSecondary}`}>Active since 20 Aug 2024</p>
			</div>
		</div>

	);
});

export default FooterModal;
