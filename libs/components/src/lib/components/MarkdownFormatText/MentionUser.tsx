import { Link } from 'react-router-dom';

type ChannelHashtagProps = {
	tagName: string;
};

const MentionUser = ({ tagName }: ChannelHashtagProps) => {
	return (
		<Link
			style={{ textDecoration: 'none' }}
			to={''}
			className="font-medium px-1 rounded-sm cursor-pointer whitespace-nowrap !text-[#3297ff] hover:!text-white dark:bg-[#3C4270] bg-[#D1E0FF] hover:bg-[#5865F2]"
		>
			{tagName}
		</Link>
	);
};

export default MentionUser;
