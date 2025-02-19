import { useAppNavigation, useAuth } from '@mezon/core';
import { useAppDispatch } from '@mezon/store';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const LoginCallback = () => {
	const [searchParams] = useSearchParams();
	const code = searchParams.get('code');
	const state = searchParams.get('state');
	const dispatch = useAppDispatch();
	const { navigate } = useAppNavigation();
	const { loginByEmail } = useAuth();
	useEffect(() => {
		if (code) {
			loginByEmail(code)
				.then(() => navigate('/chat/direct/friends'))
				.catch(() => navigate('/login'));
		} else {
			navigate('/login');
		}
	}, [code, state, dispatch, navigate]);

	return <div className="bg-[#313338] text-white w-screen h-screen flex justify-center items-center">Processing login...</div>;
};

export default LoginCallback;
