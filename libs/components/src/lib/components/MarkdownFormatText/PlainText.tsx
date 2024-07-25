type PlainTextOpt = {
	text: string;
};

export const PlainText: React.FC<PlainTextOpt> = ({ text }) => {
	return <span className="dark:text-white text-colorTextLightMode whitespace-pre-line">{text}</span>;
};
export default PlainText;
