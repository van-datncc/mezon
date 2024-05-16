import { useEffect, useState } from 'react';

type MessageProps = {
	chatRef: React.RefObject<HTMLDivElement>;
	hasMoreMessage: boolean;
	loadMoreMessage: () => void;
};

export const useMessages = ({ chatRef, hasMoreMessage, loadMoreMessage }: MessageProps) => {
	const [isFetching, setIsFetching] = useState(false);
	useEffect(() => {
		const topDiv = chatRef?.current;

		const handleScroll = () => {
			const scrollHeight = topDiv?.scrollHeight || 0;
			const clientHeight = topDiv?.clientHeight || 0;
			const scrollTop = topDiv?.scrollTop || 0;

			const scrollBottom = scrollHeight + (scrollTop - clientHeight);

			if (scrollBottom <= 1 && hasMoreMessage) {
				setIsFetching(true);
				loadMoreMessage();
			}
		};

		topDiv?.addEventListener('scroll', handleScroll);
		return () => {
			topDiv?.removeEventListener('scroll', handleScroll);
		};
	}, [hasMoreMessage, loadMoreMessage, chatRef]);

	return isFetching;
};
