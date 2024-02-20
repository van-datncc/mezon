import { GoogleButtonLogin, LoginForm, QRSection, TitleSection } from '@mezon/components';
import { selectIsLogin } from '@mezon/store';
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
			className=" w-screen h-screen  overflow-x-hidden overflow-y-scroll  scrollbar-hide flex items-center"
			style={{
				background: 'linear-gradient(219.23deg, #2970FF 1.49%, #8E84FF 43.14%, #E0D1FF 94.04%)',
			}}
		>
			<div className=" justify-center items-center flex max-w-9/10 lg:min-h-600 rounded-2xl lg:p-12 bg-[#0b0b0b] flex-col mx-auto max-h-4/5 overflow-scroll hide-scrollbar">
				<div className="relative top-250 flex-col pb-2 lg:top-0 lg:pb-0 flex lg:flex-row lg:gap-x-12 items-center w-full">
					<div className="flex-col justify-start items-center flex h-fit p-0 lg:gap-y-8 gap-12 pb-2 lg:pb-0 w-4/5">
						<TitleSection />
						<GoogleButtonLogin />
						<LoginForm />
					</div>
					<QRSection />
				</div>
			</div>
		</div>
	);
}

export default Login;
