import { useMemo } from 'react';

interface Field {
	name: string;
	value: string;
	inline?: boolean;
}

interface EmbedFieldsProps {
	fields: Field[];
}

export function EmbedFields({ fields }: EmbedFieldsProps) {
	const groupedFields = useMemo(() => {
		return fields.reduce<Field[][]>((acc, field) => {
			if (!field.inline) {
				acc.push([field]);
			} else {
				const lastRow = acc[acc.length - 1];
				if (lastRow && lastRow[0].inline && lastRow.length < 3) {
					lastRow.push(field);
				} else {
					acc.push([field]);
				}
			}
			return acc;
		}, []);
	}, [fields]);

	return (
		<div className="mt-2 grid gap-2">
			{groupedFields.map((row, index) => (
				<div key={index} className={`grid gap-4 ${row.length === 1 ? 'grid-cols-1' : row.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
					{row.map((field, index) => (
						<div key={index} className={`${field.inline ? `col-span-${3 / row.length}` : 'col-span-3'}`}>
							<div className="font-semibold text-sm">{field.name}</div>

							<div className="text-textSecondary800 dark:text-textSecondary text-sm">{field.value}</div>
						</div>
					))}
				</div>
			))}
		</div>
	);
}
