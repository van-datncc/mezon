import loadingSvg from 'apps/chat/src/assets/Svg/loading.svg';
import React from 'react';

interface IconLoadingProps {
	classProps: string;
}

export const Loading: React.FC<IconLoadingProps> = ({ classProps }) => {
	return (
		<div className={classProps}>
			<img src={loadingSvg}></img>
		</div>
	);
};
