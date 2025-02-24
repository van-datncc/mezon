import { useAppNavigation } from '@mezon/core';
import { authActions, useAppDispatch } from '@mezon/store';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const LoginCallback = () => {
	const [searchParams] = useSearchParams();
	const code = searchParams.get('code');
	const dispatch = useAppDispatch();
	const { navigate } = useAppNavigation();
	useEffect(() => {
		const handleLogin = async () => {
			if (!code) {
				navigate('/login');
				return;
			}

			try {
				const action = await dispatch(authActions.authenticateMezon(code));

				if (authActions.authenticateMezon.fulfilled.match(action)) {
					navigate('/chat/direct/friends');
				} else if (authActions.authenticateMezon.rejected.match(action)) {
					const errorMessage = (action.error?.message as string) || 'Login failed. Please try again.';
					throw new Error(errorMessage);
				}
			} catch (error) {
				alert(error instanceof Error ? error.message : 'An unknown error occurred.');
				navigate('/login');
			}
		};

		handleLogin();
	}, [code, dispatch, navigate]);

	return <div className="bg-[#313338] text-white w-screen h-screen flex justify-center items-center">Processing login...</div>;
};

export default LoginCallback;
