import { MezonStoreProvider, initStore } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HeaderMezon from './components/HeaderMezon';
import ClanDetailPage from './pages/ClanDetailPage';
import DiscoverPage from './pages/DiscoverPage';

/**
 */
function AppWithStore() {
	const [sideBarIsOpen, setSideBarIsOpen] = useState(false);

	const toggleSideBar = () => {
		setSideBarIsOpen(!sideBarIsOpen);
	};

	return (
		<div className="min-h-screen bg-[#F4F7F9]">
			<HeaderMezon sideBarIsOpen={sideBarIsOpen} toggleSideBar={toggleSideBar} />

			<div className="pt-[80px]">
				<Routes>
					<Route path="/" element={<Navigate to="/clans" replace />} />
					<Route path="/clans" element={<DiscoverPage />} />
					<Route path="/clan/:id" element={<ClanDetailPage />} />
				</Routes>
			</div>
		</div>
	);
}

export default function App() {
	const mezon = useMezon();

	if (!mezon) {
		return <div className="loading">Loading...</div>;
	}

	const { store, persistor } = initStore(mezon);

	return (
		<MezonStoreProvider store={store} persistor={persistor} loading={false}>
			<AppWithStore />
		</MezonStoreProvider>
	);
}
