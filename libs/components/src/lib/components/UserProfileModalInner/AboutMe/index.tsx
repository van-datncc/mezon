import { formatDateI18n } from '@mezon/utils';
import { useTranslation } from 'react-i18next';

type AboutMeProps = {
	createTime?: string | number;
};

const AboutMe = ({ createTime }: AboutMeProps) => {
	const { t } = useTranslation('common');

	const formatCreateTime = () => {
		if (!createTime) return '';
		const timestamp = typeof createTime === 'number' ? (createTime.toString().length <= 10 ? createTime * 1000 : createTime) : createTime;
		return formatDateI18n(new Date(timestamp), 'en', 'MMMM d, yyyy');
	};

	return (
		<div className="flex flex-col gap-[20px]">
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold text-theme-primary">{t('userProfile.memberSince')}</p>
				<span className="text-sm font-normal text-theme-primary">{formatCreateTime()}</span>
			</div>
		</div>
	);
};

export default AboutMe;
