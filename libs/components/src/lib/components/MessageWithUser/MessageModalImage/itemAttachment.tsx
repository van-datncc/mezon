import { AttachmentEntity } from "@mezon/store";

type ItemAttachmentProps = {
    attachment: AttachmentEntity;
    urlImg: string;
    previousDate: any;
    selectedImageRef: React.MutableRefObject<HTMLDivElement | null>;
    showDate: boolean;
    setUrlImg: React.Dispatch<React.SetStateAction<string>>;
    handleDrag: (e: any) => void;
}

const ItemAttachment = (props: ItemAttachmentProps) => {
    const {attachment, urlImg, previousDate, selectedImageRef, showDate, setUrlImg, handleDrag} = props;
    const url = attachment.url;
    const isSelected = url === urlImg;
    return (
        <div
            className={`border ${isSelected ? 'dark:bg-slate-700 bg-bgLightModeButton w-full h-fit dark:border-white border-colorTextLightMode' : 'border-transparent'}`}
            ref={isSelected ? selectedImageRef : null}
        >
            {showDate && <div className={`dark:text-white text-black mb-1 text-center sbm:block hidden`}>{previousDate}</div>}
            <div className={isSelected ? 'flex items-center' : 'relative'} onClick={() => setUrlImg(url || '')}>
                <img
                    src={url}
                    alt={url}
                    className={`md:size-[150px] size-[100px] md:max-w-[150px] max-w-[100px] md:max-h-[150px] max-h-[100px] mx-auto gap-5 object-cover rounded cursor-pointer ${isSelected ? '' : 'overlay'}`}
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
    )
}

export default ItemAttachment;