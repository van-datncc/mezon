import React from 'react';
import { ApiMessageAttachment } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

interface ThumbnailProps {
	attachment: ApiMessageAttachment;
	onRemove?: (value: string) => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ attachment, onRemove }) => {
	const handleRemove = () => {
		if (onRemove) {
			onRemove(attachment.url ?? '');
		}
	};

	return (
		<div className='py-[2rem] m-[0.5rem] border border-gray-500 rounded-sm'>
			<div className="cursor-pointer w-48 h-auto rounded-sm relative">
				<img src={attachment.url} role="presentation" className="w-48" alt={attachment.url} />
				<div
					className="absolute top-0 right-0 bg-[#34383E] w-32 h-8 rounded hover:bg-slate-800 border top-0 right-0"
					style={{ display: 'flex', justifyContent: 'center' }}
				>
					<button className="remove-icon absolute " onClick={handleRemove}>
						x
					</button>
				</div>
			</div>
		</div>
	);
};

export default Thumbnail;
