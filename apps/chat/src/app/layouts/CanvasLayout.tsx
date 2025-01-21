import { Canvas } from '@mezon/components';
import { selectTheme } from '@mezon/store';
import { useSelector } from 'react-redux';

const CanvasLayout = () => {
	const appearanceTheme = useSelector(selectTheme);
	return (
		<div
			className={`flex flex-1 justify-center overflow-y-scroll overflow-x-hidden ${appearanceTheme === 'light' ? 'customScrollLightMode' : ''}`}
		>
			<Canvas />
		</div>
	);
};

export default CanvasLayout;
