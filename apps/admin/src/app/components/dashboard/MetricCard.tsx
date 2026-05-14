import React from 'react';

interface MetricCardProps {
	label: string;
	value: string | number;
	valueClassName?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, valueClassName = 'text-gray-900 dark:text-white' }) => (
	<div className="dark:bg-bgSecondary bg-white rounded-lg shadow border dark:border-borderClan border-gray-200 p-6">
		<div className="text-sm font-medium dark:text-textSecondary text-gray-500">{label}</div>
		<div className={`mt-2 text-3xl font-bold ${valueClassName}`}>{value}</div>
	</div>
);

export default MetricCard;
