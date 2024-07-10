import loadable from '@loadable/component';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LoaderFunctionArgs, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { selectInitialPath, useAppDispatch } from '@mezon/store';
// Layouts
import AppLayout from '../layouts/AppLayout';
import RootLayout from '../layouts/RootLayout';
//loader
import { appLoader, CustomLoaderFunction } from '../loader/appLoader';
import { authLoader } from '../loader/authLoader';
// Pages
import InitialRoutes from './InititalRoutes';
const Login = loadable(() => import('../pages/login'));
const ApplicationsPage = loadable(() => import('../pages/applications'));
const TeamsPage = loadable(() => import('../pages/teams'));
const DocsPage = loadable(() => import('../pages/docs'));
const EmbedsPage = loadable(() => import('../pages/embeds'));

export const Routes = () => {
    const dispatch = useAppDispatch();
    const initialPath = useSelector(selectInitialPath);

    const loaderWithStore = useCallback(
        (loaderFunction: CustomLoaderFunction) => {
            return async (props: LoaderFunctionArgs) =>
                await loaderFunction({
                    ...props,
                    dispatch,
                    initialPath: initialPath,
                });
        },
        [dispatch, initialPath],
    );

    const routes = useMemo(
        () =>
            createBrowserRouter([
                {
                    path: '',
                    loader: loaderWithStore(appLoader),
                    element: <AppLayout />,
                    children: [
                        {
                            path: '',
                            element: <InitialRoutes />,
                        },
                        {
                            path: 'login',
                            element: <Login />,
                        },
                        {
                            path: 'admin',
                            loader: loaderWithStore(authLoader),
                            element: <RootLayout />,
                            children: [
                                {
                                    path: '',
                                    element: <InitialRoutes />,
                                },
                                {
                                    path: 'applications',
                                    element: <ApplicationsPage />,
                                },
                                {
                                    path: 'teams',
                                    element: <TeamsPage />,
                                },
                                {
                                    path: 'embeds',
                                    element: <EmbedsPage />,
                                },
                                {
                                    path: 'docs',
                                    element: <DocsPage />,
                                },
                            ],
                        },
                    ],
                },
            ]),
        [loaderWithStore],
    );

    return <RouterProvider router={routes} />;
};
