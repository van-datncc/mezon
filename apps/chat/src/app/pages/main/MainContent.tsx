import { memo } from 'react';
import { Outlet } from 'react-router-dom';

export const MainContent = memo(
	() => <Outlet />,
	() => true
);
