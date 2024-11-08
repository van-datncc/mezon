import { selectAllAuditLogData } from '@mezon/store';
import { useSelector } from 'react-redux';

const MainAuditLog = () => {
	const auditLogData = useSelector(selectAllAuditLogData);
	return (
		<div className="flex flex-col">
			<div className="border-b-[1px] dark:border-[#616161] my-[32px]" />
			<div
				className={`dark:text-[#b5bac1] text-textLightTheme py-[20px] px-[16px] flex justify-between items-center border dark:border-black border-[#d1d4d9] rounded-md dark:bg-[#2b2d31] bg-bgLightSecondary`}
			>
				test
			</div>
		</div>
	);
};

export default MainAuditLog;
