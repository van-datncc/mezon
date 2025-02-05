import { selectStatusStream } from '@mezon/store-mobile';
import React from 'react';
import { useSelector } from 'react-redux';
import StreamingPopup from '../StreamingPopup/StreamingPopup';

const StreamingWrapper = () => {
	const streamPlay = useSelector(selectStatusStream);

	if (!streamPlay) return null;
	return <StreamingPopup />;
};

export default StreamingWrapper;
