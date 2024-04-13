import { RenderAttachmentThumbnail } from '@mezon/ui';
import React from 'react';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
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
	const thumbnailAttachment = RenderAttachmentThumbnail(attachment, 'w-32 h-32');

	return (
		<div title={attachment.filename} className="py-[2.5rem] my-[0.2rem] border border-[#2B2D31] rounded-sm relative">
			<div className="cursor-pointer w-48 min-h-24 rounded-md px-1 flex flex-row justify-center items-center">
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
				<div className=" absolute bottom-0 left-1 text-xs ">
					<p>{displayedFilename}</p>
				</div>
			</div>
		</div>
	);
};

export default Thumbnail;
