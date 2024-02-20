import { LoginForm } from '@mezon/components';
import { selectIsLogin } from '@mezon/store';
import { GoogleButtonLogin, TitleSection, QRSection } from '@mezon/components';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Login() {
	const isLogin = useSelector(selectIsLogin);
	const navigate = useNavigate();

	useEffect(() => {
		if (isLogin) {
			navigate('/chat/direct/friends');
		} else {
			navigate('/guess/login');
		}
	}, [isLogin, navigate]);

	return (
		<div
			className=" w-screen h-screen flex items-center overflow-x-hidden overflow-y-scroll justify-center scrollbar-hide"
			style={{
				background: 'linear-gradient(219.23deg, #2970FF 1.49%, #8E84FF 43.14%, #E0D1FF 94.04%)',
			}}
		>
			<div className="lg:flex-row justify-center items-center flex max-w-[850px] lg:h-auto p-12 lg:gap-x-12 rounded-2xl bg-[#0b0b0b] flex-col">
				<div className="flex-col justify-start items-center flex w-full h-fit p-0 lg:gap-y-8 gap-12 pb-2 lg:pb-0">
					<TitleSection />
					<GoogleButtonLogin />
					<LoginForm />
				</div>
				<QRSection />
			</div>
		</div>
	);
}

export default Login;
