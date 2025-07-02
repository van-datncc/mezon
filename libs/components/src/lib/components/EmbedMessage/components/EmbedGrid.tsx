import { IMessageGridItem } from '@mezon/utils';
import { useMemo } from 'react';

interface EmbedGridProps {
	senderId: string;
	messageId: string;
	channelId: string;
	pool: IMessageGridItem[];
	columns: number;
	rows: number;
}

export function EmbedGrid({ senderId, messageId, pool, columns, rows }: EmbedGridProps) {
	const style: React.CSSProperties = useMemo(() => {
		return {
			display: 'grid',
			maxWidth: 480,
			width: 480,
			gridTemplateColumns: `repeat(${columns}, ${480 / columns}px)`,
			gridTemplateRows: `repeat(${rows}, ${480 / rows}px)`
		};
	}, []);

	return (
		<div className={`grid`} style={style}>
			{pool.map((item, index) => (
				<ItemGrid item={item} index={index} />
			))}
		</div>
	);
}

const ItemGrid = ({ item, index }: { item: IMessageGridItem; index: number }) => {
	const styleItem: React.CSSProperties = useMemo(() => {
		return {
			gridColumn: `${item.start_col} / span ${item.width || 1}`,
			gridRow: `${item.start_row} / span ${item.height || 1}`
		};
	}, []);
	return <div className={`bg-blue-50`} style={styleItem}></div>;
};
