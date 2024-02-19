import { BaseSyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { AlertTitleTextWarning } from '../../../../../../ui/src/lib/Alert/index';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Loading } from 'libs/ui/src/lib/Loading/index';
import * as Icons from '../../Icons';
import { useSelector } from 'react-redux';
import { RootState, authActions } from '@mezon/store';
import { useAppDispatch } from '@mezon/store';
import { toast } from 'react-toastify';

export type LoginFormPayload = {
	userEmail: string;
	password: string;
	remember: boolean;
};

type LoginFormProps = {
	onSubmit: (data: LoginFormPayload) => void;
};

export const validationSchema = Yup.object().shape({
	userEmail: Yup.string().email('Invalid email address').required('Email is required'),
	password: Yup.string()
		.required('Password is required')
		.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number'),
});

function LoginForm(props: LoginFormProps) {
	const isLoading = useSelector((state: RootState) => state.auth.loadingStatus);
	const dispatch = useAppDispatch();

	const { onSubmit } = props;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormPayload>({
		resolver: yupResolver(validationSchema) as unknown as Resolver<LoginFormPayload>,

		defaultValues: {
			password: '',
			remember: false,
			userEmail: '',
		},
	});

	const submitForm = useCallback(
		(data: LoginFormPayload) => {
			if (typeof onSubmit === 'function') {
				onSubmit(data);
			}
			return false;
		},
		[onSubmit],
	);

	const handleFormSubmit = useCallback(
		(e: BaseSyntheticEvent) => {
			e.preventDefault();
			handleSubmit(submitForm)(e);
		},
		[handleSubmit, submitForm],
	);

	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleRefreshStatusLogin = () => {
		dispatch(authActions.refreshStatus());
	};

	return (
		<div className="flex-col justify-start items-center flex lg:w-[496px] h-fit px-36 lg:px-0 w-full">
			<div className="flex-row justify-start items-center flex w-full h-fit gap-x-4 pb-6">
				<hr className="h-[0.08px] w-[272px] border-[#1E1E1E]" />
				<p className="w-fit h-fit font-manrope text-sm text-[#aeaeae] leading-[130%]">or</p>
				<hr className="h-[0.08px] w-[272px]  border-[#1E1E1E]" />
			</div>
			<div className="flex-col justify-start items-start flex w-full h-fit gap-y-5">
				<div className="flex-col justify-start items-start flex w-full h-fit gap-y-5 ">
					<div className="flex-col justify-start items-start flex w-full h-fit gap-y-3 relative">
						<div className="flex-row justify-start items-center flex w-full h-fit gap-x-1 ">
							<p className="w-fit h-fit font-manrope text-left text-sm font-medium text-[#cccccc] leading-[150%]">
								Email or Phone number
							</p>
							<p className="w-fit font-manrope h-fit text-left text-xs font-medium text-[#dc2626] leading-[150%]">✱</p>
						</div>
						<div
							className={`flex-row justify-start items-center flex w-full h-fit pt-3 pr-4 pb-3 pl-4 gap-x-2 rounded-[4px] bg-[#000000] relative border-[1px] border-[#1e1e1e] ${
								errors.userEmail ? 'border-red-500' : 'border-[#1e1e1e]'
							}`}
						>
							<input
								className="w-full h-6  bg-transparent outline-none relative text-white"
								{...register('userEmail')}
								name="userEmail"
								id="userEmail"
								placeholder="Enter your email"
								autoComplete='userEmail'
							/>
						</div>
					</div>

					<div className="flex-col justify-start items-start flex w-full h-fit gap-y-3">
						<div className="flex-row justify-start items-center flex w-full h-fit gap-x-1 ">
							<p className="w-fit h-fit font-manrope text-left text-sm font-medium text-[#cccccc] leading-[150%]">Password</p>
							<p className="w-fit h-fit font-manrope text-left text-xs font-medium text-[#dc2626] leading-[150%]">✱</p>
						</div>

						<div className="flex-col justify-start items-start flex w-full h-fit ">
							<div
								className={`flex-row justify-start items-center flex w-full h-fit pt-3 pr-4 pb-3 pl-4 gap-x-2 rounded-[4px] bg-[#000000] border-[1px] ${
									errors.password ? 'border-red-500' : 'border-[#1e1e1e]'
								} `}
							>
								<input
									type={showPassword ? 'text' : 'password'}
									className="w-full h-6 bg-transparent outline-none text-white pl-0 border-none placeholder:font-manrope"
									{...register('password')}
									name="password"
									id="password"
									placeholder="Enter your password"
									autoComplete='password'
								/>
								<button onClick={togglePasswordVisibility} className="outline-none z-50 fill-current left-0">
									{showPassword ? <Icons.EyeOpen /> : <Icons.EyeClose />}
								</button>
							</div>

							<p className="w-full h-fit font-manrope text-left text-sm font-medium pt-1 text-[#528bff] leading-[150%]">
								<span>
									<a className="hover:underline cursor-pointer">Forgot your password?</a>
								</span>
							</p>
						</div>
					</div>
				</div>

				<div className="flex-col justify-start items-start flex w-full h-fit">
					<button
						onClick={handleFormSubmit}
						className="flex-col justify-start items-center flex w-full h-[48px] pt-3 pr-4 pb-3 pl-4 rounded-[4px] bg-[#155eef] "
					>
						<p className="w-fit h-fit font-manrope text-left text-base font-medium text-[#ffffff] leading-[150%]">
							{isLoading === 'loading' ? (
								<Loading classProps="w-5 h-5 ml-2" />
							) : isLoading === 'loaded' ? (
								'Login successful'
							) : (
								'Sign in'
							)}
						</p>
					</button>

					<div className="flex-row justify-start items-center flex w-full h-fit gap-y-2 ">
						<p className="w-fit h-fit font-manrope text-left text-sm font-normal text-[#cccccc] leading-[130%]">Need an account?</p>
						<div className="flex-col justify-start items-center flex w-fit h-fit pt-2 pr-4 pb-2 pl-4 rounded-[4px] ">
							<p className="w-fit h-fit font-manrope text-left text-sm font-medium hover:underline text-[#528bff] leading-[130%]">
								<span>
									<a className="hover:underline cursor-pointer">Sign up</a>
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="absolute">
				{errors.password && toast.error(errors.password.message, { toastId: 'errorPassword' })}
				{errors.userEmail && toast.error(errors.userEmail.message, { toastId: 'errorUserEmail' })}
			</div>
		</div>
	);
}

export default LoginForm;
