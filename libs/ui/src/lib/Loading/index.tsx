import svgLoading from 'libs/assets/src/assets/svg/loading.svg';
import React from 'react';

interface IconLoadingProps {
	classProps: string;
}

export const Loading: React.FC<IconLoadingProps> = ({ classProps }) => {
	return (
		<div className={classProps}>
			<img src={svgLoading} alt="loading"></img>
		</div>
	);
};
