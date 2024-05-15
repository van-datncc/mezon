import { useEffect } from 'react';

type MessageProps = {
	chatRef: React.RefObject<HTMLDivElement>;
	hasMoreMessage: boolean;
	loadMoreMessage: () => void;
};

export const useMessages = ({ chatRef, hasMoreMessage, loadMoreMessage }: MessageProps) => {
	useEffect(() => {
		const topDiv = chatRef?.current;

		const handleScroll = () => {
			const scrollHeight = topDiv?.scrollHeight || 0;
			const clientHeight = topDiv?.clientHeight || 0;
			const scrollTop = topDiv?.scrollTop || 0;

			const scrollBottom = scrollHeight + (scrollTop - clientHeight);

			if (scrollBottom <= 1 && hasMoreMessage) {
				loadMoreMessage();
			}
		};

		topDiv?.addEventListener('scroll', handleScroll);
		return () => {
			topDiv?.removeEventListener('scroll', handleScroll);
		};
	}, [hasMoreMessage, loadMoreMessage, chatRef]);
};
