import { RenderAttachmentThumbnail } from '@mezon/ui';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React from 'react';
import { Icons } from '../../components';

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
	const filename = attachment.filename;
	const displayedFilename = filename && filename.length > 25 ? filename.substring(0, 25) + '...' : filename;
	const thumbnailAttachment = RenderAttachmentThumbnail(attachment);

	return (
		<div
			title={attachment.filename}
			className="flex justify-center items-center p-2 mb-3 rounded bg-bgSecondary w-[216px] h-[216px] flex-shrink-0 border border-[#2B2D31] relative"
		>
			<div className="cursor-pointer rounded-md flex flex-row justify-center items-center mb-2">
				<div>
					<div>{thumbnailAttachment}</div>
				</div>
				<div className="bg-[#313338] flex flex-row w-21 top-[-5px] right-[-5px] h-7 absolute rounded-sm">
					<button className=" w-7 h-7 flex flex-row justify-center items-center hover:bg-[#393C41]">
						<Icons.EyeOpen defaultFill="#AEAEAE" />
					</button>
					<button className=" w-7 h-7 flex flex-row justify-center items-center hover:bg-[#393C41]">
						<Icons.PenEdit defaultSize="w-7 h-7" />
					</button>
					<div className="w-7 h-7 p-2 flex flex-row justify-center items-center hover:bg-[#393C41]">
						<button onClick={handleRemove} className=" flex flex-row justify-center items-center hover:bg-[#393C41] scale-75">
							<Icons.TrashIcon defaultFill="#F93C48" defaultSize="w-4 w-4" />
						</button>
					</div>
				</div>
				<div className=" absolute bottom-0 mt-2 left-1 text-sm ">
					<p>{displayedFilename}</p>
				</div>
			</div>
		</div>
	);
};

export default Thumbnail;
