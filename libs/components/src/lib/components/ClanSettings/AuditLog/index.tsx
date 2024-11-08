import { Icons } from '@mezon/ui';
import MainAuditLog from './AuditItem';

const AuditLog = () => {
	return (
		<div className="mt-[60px]">
			<div className="flex justify-between items-center mb-5">
				<h2 className="text-xl font-semibold  dark:text-textDarkTheme text-textLightTheme flex">
					<div>Audit Log</div>
				</h2>
				<div className="flex items-center gap-1">
					<div className="flex items-center gap-1">
						<div>Filter by User</div>
						<div className="flex items-center gap-1">
							<div>All</div>
							<Icons.ArrowRight />
						</div>
					</div>
					<div className="flex items-center gap-1">
						<div>Filter by Action</div>
						<div className="flex items-center gap-1">
							<div>All</div>
							<Icons.ArrowRight />
						</div>
					</div>
				</div>
			</div>

			<MainAuditLog />
		</div>
	);
};

export default AuditLog;
