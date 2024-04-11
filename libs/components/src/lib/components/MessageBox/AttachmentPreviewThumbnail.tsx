import React from 'react';
import { ApiMessageAttachment } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

interface ThumbnailProps {
	attachment: ApiMessageAttachment;
	onRemove?: () => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ attachment, onRemove }) => {
	return (
		<div className="cursor-pointer border relative w-48 h-auto">
			<img src={attachment.url} role="presentation" className="w-48" alt={attachment.url} />
			<div
				className="absolute top-0 right-0 bg-[#34383E] w-8 h-8 rounded hover:bg-slate-800"
				style={{ display: 'flex', justifyContent: 'center' }}
			>
				<button className="remove-icon" onClick={onRemove}>
					x
				</button>
			</div>
		</div>
	)
}

export default Thumbnail;
