import { useClans, useReference } from '@mezon/core';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

type ChannelHashtagProps = {
	tagName: string;
};

const MentionUser = ({ tagName }: ChannelHashtagProps) => {
	const linkRef = useRef<HTMLAnchorElement>(null);
	const { usersClan } = useClans();
	const { setUserIdToShowProfile,setPositionOfMention } = useReference();
	const rect = linkRef?.current?.getBoundingClientRect();

	const dispatchUserIdToShowProfile = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.stopPropagation();
		e.preventDefault();
		const username = tagName.slice(1);
		const user = usersClan.find((userClan) => userClan.user?.username === username);
		setUserIdToShowProfile(user?.user?.id || '');
		setPositionOfMention({
			top: rect?.top,
			right: rect?.right,
			left: rect?.left,
			bottom: rect?.bottom,
		});
	};

	return (
		<Link
			ref={linkRef}
			onClick={(e) => dispatchUserIdToShowProfile(e)}
			style={{ textDecoration: 'none' }}
			to={''}
			className="font-medium px-1 rounded-sm cursor-pointer whitespace-nowrap !text-[#3297ff] hover:!text-white dark:bg-[#3C4270] bg-[#D1E0FF] hover:bg-[#5865F2]"
		>
			{tagName}
		</Link>
	);
};

export default MentionUser;
