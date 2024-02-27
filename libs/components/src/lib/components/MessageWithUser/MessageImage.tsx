export type MessageImage = {
    content?: string;
    metaData: any;
};

function MessageImage({ content, metaData }: MessageImage) {
    return (
        <div className="pb-2">
            {content !== metaData?.image?.src && (<div className='pb-2'>{content?.replace("\n", "")}</div>)}
            <img src={metaData?.image?.src ?? ''} className='max-w-[350px]' alt='' />
        </div>
    );
}

export default MessageImage;
