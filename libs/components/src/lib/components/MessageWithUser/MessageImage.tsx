export type MessageImage = {
    content?: string;
    metaData: any;
};

function MessageImage({ content, metaData }: MessageImage) {
    const prefixText = content?.substring(0, metaData.dt.s);
    const srcImg = content?.substring(metaData.dt.s, metaData.dt.s + metaData.dt.l + 1);
    const sufferText = content?.substring(metaData.dt.s + metaData.dt.l + 1);
    return (
        <div>
            {prefixText && <div>{prefixText}</div>}
            {srcImg && <img className="max-w-[350px] py-2" src={srcImg} alt="" />}
            {sufferText && <div>{sufferText}</div>}
        </div>
    );
}

export default MessageImage;
