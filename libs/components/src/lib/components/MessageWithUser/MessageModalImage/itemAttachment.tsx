import { AttachmentEntity } from '@mezon/store';

type ItemAttachmentProps = {
	attachment: AttachmentEntity;
	urlImg: string;
	previousDate: any;
	selectedImageRef: React.MutableRefObject<HTMLDivElement | null>;
	showDate: boolean;
	setUrlImg: React.Dispatch<React.SetStateAction<string>>;
	handleDrag: (e: any) => void;
};

const ItemAttachment = (props: ItemAttachmentProps) => {
	const { attachment, urlImg, previousDate, selectedImageRef, showDate, setUrlImg, handleDrag } = props;
	const url = attachment.url;
	const isSelected = url === urlImg;
	return (
		<div className={` w-fit h-fit `} ref={isSelected ? selectedImageRef : null}>
			{showDate && <div className={`dark:text-white text-black mb-1 text-center`}>{previousDate}</div>}
			<div className={`rounded-md ${isSelected ? 'flex items-center border-2 border-white' : 'relative'}`} onClick={() => setUrlImg(url || '')}>
				<img
					src={url}
					alt={url}
					className={`size-[88px] max-w-[88px] max-h-[88px] mx-auto gap-5 object-cover rounded-md cursor-pointer ${isSelected ? '' : 'overlay'} border-2 ${isSelected ? 'dark:bg-slate-700 bg-bgLightModeButton border-colorTextLightMode' : 'border-transparent'}`}
					onDragStart={handleDrag}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							setUrlImg(url || '');
						}
					}}
				/>
				{!isSelected && <div className="absolute inset-0 bg-black opacity-50 rounded"></div>}
			</div>
		</div>
	);
};

export default ItemAttachment;
