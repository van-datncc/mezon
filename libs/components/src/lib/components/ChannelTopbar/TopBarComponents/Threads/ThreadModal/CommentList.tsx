import { useEffect } from 'react';

import Comment from './Comment';
import './CommentList.css';
import useOnScreen from './useOnScreen';

export default function CommentList({ hasMore, isLoading, loadMore, comments }: any) {
	const { measureRef, isIntersecting, observer } = useOnScreen();

	useEffect(() => {
		if (isIntersecting && hasMore) {
			loadMore();
			observer?.disconnect();
		}
	}, [isIntersecting, hasMore, loadMore]);

	return (
		<ul className="comment-list">
			{comments.map((comment: any, index: any) => {
				if (index === comments.length - 1) {
					return <Comment mesureRef={measureRef} key={comment.id} comment={comment} />;
				}
				return <Comment key={comment.id} comment={comment} />;
			})}
			{isLoading && <li>Loading...</li>}
		</ul>
	);
}
