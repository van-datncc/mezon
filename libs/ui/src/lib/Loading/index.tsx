import React from 'react';

interface IconLoadingProps {
	classProps: string;
}

export const Loading: React.FC<IconLoadingProps> = ({ classProps }) => {
	return (
		<div className={classProps}>
			<img src={'/assets/svg/loading.svg'} alt='loading'></img>
		</div>
	);
};
