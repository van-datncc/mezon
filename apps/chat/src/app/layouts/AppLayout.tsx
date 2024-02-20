import { Outlet } from 'react-router-dom';

const AppLayout = () => {
	return (
		<div id="app-layout">
			<Outlet />
		</div>
	);
};

export default AppLayout;
