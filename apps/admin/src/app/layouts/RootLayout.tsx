import { selectIsLogin } from '@mezon/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLoaderData } from 'react-router-dom';
import { tabs } from '../common/constants/tabSideBar';
import CollapseSideBar from '../components/CollapseSideBar';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import { useAppearance } from '../context/AppearanceContext';
import { IAuthLoaderData } from '../loader/authLoader';

const RootLayout: React.FC = () => {
	const { isLogin: isLoginLoader, redirect } = useLoaderData() as IAuthLoaderData;
	const isLoginStore = useSelector(selectIsLogin);
	const isLogin = isLoginLoader && isLoginStore;
	const { isDarkMode } = useAppearance();

	const [showCollapseSideBar, setShowCollapseSideBar] = useState(false);
	const toggleCollapseSideBar = () => {
		setShowCollapseSideBar(!showCollapseSideBar);
	};

	if (!isLogin) {
		return <Navigate to={redirect || '/login'} replace />;
	}

	return (
		<div className="dark:bg-bgPrimary bg-bgLightPrimary flex flex-col h-screen dark:text-textDarkTheme text-textLightTheme">
			<Header toggleSideBar={toggleCollapseSideBar} />
			<div className="flex flex-1 overflow-hidden">
				<CollapseSideBar tabs={tabs} isShow={showCollapseSideBar} toggleSideBar={toggleCollapseSideBar} />
				<div className="min-w-[350px] px-[32px] pt-[16px] pb-[32px] h-full overflow-y-auto max-lg:hidden">
					<SideBar tabs={tabs} />
				</div>
				<div className={`w-full h-full overflow-y-auto overflow-x-hidden px-[32px] py-[16px] ${isDarkMode ? '' : 'customScrollLightMode'}`}>
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default RootLayout;
