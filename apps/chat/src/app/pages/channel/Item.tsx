import { memo } from 'react';

interface ItemProps {
	prepend?: boolean;
	orderKey?: number;
}

export const Item = memo(({ prepend }: ItemProps) => {
	return (
		<div className="p-2 border-b dark:border-gray-700">
			{/* Placeholder content - customize based on your needs */}
			<div className="h-16 flex items-center justify-center">{prepend ? 'Prepended Item' : 'Message Item'}</div>
		</div>
	);
});

Item.displayName = 'Item';
