import React from 'react';

interface InfoRowProps {
	label: string;
	value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
	<div>
		<div className="text-sm font-medium dark:text-textSecondary text-gray-500">{label}</div>
		<div className="mt-1 dark:text-textDarkTheme text-gray-900">{value}</div>
	</div>
);

export default InfoRow;
