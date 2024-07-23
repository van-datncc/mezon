type PlainTextOpt = {
	text: string;
};

export const PlainText: React.FC<PlainTextOpt> = ({ text }) => {
	return <span>{text}</span>;
};
export default PlainText;
