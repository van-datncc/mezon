import React from 'react';
import FormLogin from './FormLogin';

export type LoginFormPayload = {
	userEmail: string;
	password: string;
	remember: boolean;
};

type LoginFormProps = {
	onSubmit?: (data: LoginFormPayload) => void;
};
function LoginForm(props: LoginFormProps) {
	const OAUTH2_AUTHORIZE_URL = process.env.NX_CHAT_APP_OAUTH2_AUTHORIZE_URL;
	const CLIENT_ID = process.env.NX_CHAT_APP_OAUTH2_CLIENT_ID;
	const REDIRECT_URI = encodeURIComponent(process.env.NX_CHAT_APP_OAUTH2_REDIRECT_URI as string);
	const RESPONSE_TYPE = process.env.NX_CHAT_APP_OAUTH2_RESPONSE_TYPE;
	const SCOPE = process.env.NX_CHAT_APP_OAUTH2_SCOPE;

	const STATE = React.useMemo(() => {
		const randomState = Math.random().toString(36).substring(2, 15);
		sessionStorage.setItem('oauth_state', randomState);
		return randomState;
	}, []);

	const handleSubmit = React.useCallback(
		async (values: LoginFormPayload) => {
			const authUrl = `${OAUTH2_AUTHORIZE_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&state=${STATE}`;
			window.location.href = authUrl;
		},
		[STATE]
	);

	return <FormLogin onSubmit={handleSubmit} />;
}

export default LoginForm;
