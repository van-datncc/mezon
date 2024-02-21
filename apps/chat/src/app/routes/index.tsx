import { createBrowserRouter } from 'react-router-dom';

// Layouts
import AppLayout from '../layouts/AppLayout';
import GuessLayout from '../layouts/GuessLayout';
import MainLayout from '../layouts/MainLayout';
import ServerLayout from '../layouts/ServerLayout';

// Pages
import Chanel from '../pages/channel';
import DirectMain from '../pages/directMessage';
import InvitePage from '../pages/invite';
import Login from '../pages/login';
import Main from '../pages/main';
import ErrorRoutes from './ErrorRoutes';
import InitialRoutes from './InititalRoutes';
import ProtectedRoutes from './ProtectedRoutes';

// Loaders
import { authLoader, shouldRevalidateAuth } from '../loaders/authLoader';
import { channelLoader, shouldRevalidateChannel } from '../loaders/channelLoader';
import { directLoader } from '../loaders/directLoader';
import { directMessageLoader } from '../loaders/directMessageLoader';
import { friendsLoader } from '../loaders/friendsLoader';
import { mainLoader, shouldRevalidateMain } from '../loaders/mainLoader';
import { serverLoader, shouldRevalidateServer } from '../loaders/serverLoader';
import { ChannelIndex } from '../pages/channel/ChannelIndex';
import { ClanIndex } from '../pages/clan/ClanIndex';
import { DirectMessage } from '../pages/directMessage/DMPage';
import { DirectMessageIndex } from '../pages/directMessage/DMPage/DirectMessageIndex';
import FriendsPage from '../pages/directMessage/FriendsPage';
import ChannelsRoutes from './ChannelsRoutes';
import ClansRoutes from './ClanRoutes';
import DMRoutes from './DMRoutes';

// Components
export const routes = createBrowserRouter([
	{
		path: '',
		element: <AppLayout />,
		errorElement: <ErrorRoutes />,
		children: [
			// initial route to redirect to /chat
			{
				path: '',
				element: <InitialRoutes />,
			},
			{
				path: 'guess',
				element: <GuessLayout />,
				children: [
					{
						path: 'login',
						element: <Login />,
					},
				],
			},
			{
				path: 'chat',
				loader: authLoader,
				shouldRevalidate: shouldRevalidateAuth,
				element: <ProtectedRoutes />,
				children: [
					{
						path: '',
						loader: mainLoader,
						shouldRevalidate: shouldRevalidateMain,
						element: <MainLayout />,
						children: [
							{
								path: '',
								element: <Main />,
								children: [
									{
										path: 'servers',
										element: <ClansRoutes />,
										children: [
											{
												path: ':serverId',
												loader: serverLoader,
												shouldRevalidate: shouldRevalidateServer,
												element: <ServerLayout />,
												children: [
													{
														path: '',
														element: <ClanIndex />,
													},
													{
														path: 'channels',
														element: <ChannelsRoutes />,
														children: [
															{
																path: '',
																element: <ChannelIndex />,
															},
															{
																path: ':channelId',
																loader: channelLoader,
																shouldRevalidate: shouldRevalidateChannel,
																element: <Chanel />,
															},
														],
													},
												],
											},
										],
									},
									{
										path: 'direct',
										element: <DirectMain />,
										loader: directLoader,
										children: [
											{
												path: '',
												element: <DirectMessageIndex />,
											},

											{
												path: 'friends',
												loader: friendsLoader,
												element: <FriendsPage />,
											},
											{
												path: 'message',
												element: <DMRoutes />,
												children: [
													{
														path: '',
														element: <DirectMessageIndex />,
													},
													{
														path: ':directId/:type',
														loader: directMessageLoader,
														shouldRevalidate: shouldRevalidateChannel,
														element: <DirectMessage />,
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				path: 'invite',
				loader: authLoader,
				children: [
					{
						path: ':inviteId',
						// TODO: add loader
						element: <InvitePage />,
					},
				],
			},
			// fallback route, renders when no other route is matched
			{
				path: '*',
				element: <InitialRoutes />,
			},
		],
	},
]);
