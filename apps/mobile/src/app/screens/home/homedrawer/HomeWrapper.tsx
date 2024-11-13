import { Block, useTheme } from '@mezon/mobile-ui';
import { setTimeout } from '@testing-library/react-native/build/helpers/timers';
import React, { useEffect, useState } from 'react';
import MessageItemSkeleton from '../../../components/Skeletons/MessageItemSkeleton';
import HomeDefault from './HomeDefault';

const HomeWrapper = React.memo((props: any) => {
	const [isReadyForUse, setIsReadyForUse] = useState<boolean>(false);
	const { themeValue } = useTheme();
	useEffect(() => {
		const timer = setTimeout(async () => {
			setIsReadyForUse(true);
		}, 1000);
		return () => {
			clearTimeout(timer);
		};
	}, []);
	if (!isReadyForUse)
		return (
			<Block backgroundColor={themeValue.secondary}>
				<MessageItemSkeleton skeletonNumber={15} />
			</Block>
		);

	return <HomeDefault {...props} />;
});

export default HomeWrapper;
