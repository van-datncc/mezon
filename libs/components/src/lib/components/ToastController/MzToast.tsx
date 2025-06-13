import React from 'react';

interface MzToastProps {
	message: string;
	type: 'success' | 'error' | 'warning' | 'info' | 'default';
}

export const MzToast: React.FC<MzToastProps> = ({ message, type }) => {
	return (
		<div className="mztoast-content">
			<div className="mztoast-message">{message}</div>
		</div>
	);
};

export default MzToast;
