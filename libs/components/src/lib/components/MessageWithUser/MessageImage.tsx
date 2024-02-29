export type MessageImage = {
	content?: string;
	metaData: any;
};

function MessageImage({ content, metaData }: MessageImage) {
	const prefixText = content?.substring(0, metaData.dt.s);
	const srcImg = content?.substring(metaData.dt.s, metaData.dt.s + metaData.dt.l + 1);
	const sufferText = content?.substring(metaData.dt.s + metaData.dt.l + 1);
	return (
		<div className="break-all">
			{prefixText && <div>{prefixText}</div>}
			{srcImg && <img className="max-w-[350px] my-2 rounded" src={srcImg} alt="" />}
			{sufferText && <div>{sufferText}</div>}
		</div>
	);
}

export default MessageImage;
