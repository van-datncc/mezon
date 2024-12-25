import { sendCode, useAppDispatch } from '@mezon/store';
import React, { useEffect, useRef, useState } from 'react';

interface ModalSendCodeProps {
	onClose: () => void;
}

const ModalSendCode = ({ onClose }: ModalSendCodeProps) => {
	const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
	const [activeIndex, setActiveIndex] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
	const dispatch = useAppDispatch();
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (inputsRef.current[activeIndex]) {
			inputsRef.current[activeIndex]?.focus();
		}
	}, [activeIndex]);

	useEffect(() => {
		if (otp.every((val) => val !== '') && !isSubmitting) {
			handleSubmit();
		}
	}, [otp, isSubmitting]);

	const handleChange = (value: string, index: number) => {
		if (value.length > 1 || index !== activeIndex) return;
		if (!/^\d$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if (errorMessage) {
			setErrorMessage('');
		}

		if (value !== '' && index < otp.length - 1) {
			setActiveIndex(index + 1);
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
		const pastedText = e.clipboardData.getData('text').slice(0, 6);

		if (!/^\d+$/.test(pastedText)) {
			e.preventDefault();
			return;
		}

		const newOtp = [...otp];
		for (let i = 0; i < pastedText.length; i++) {
			if (index + i < otp.length) {
				newOtp[index + i] = pastedText[i];
			}
		}
		setOtp(newOtp);
		setActiveIndex(Math.min(index + pastedText.length, otp.length - 1));
		setErrorMessage('');
		e.preventDefault();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === 'Backspace') {
			e.preventDefault();
			const newOtp = [...otp];
			if (otp[index] === '') {
				if (index > 0) {
					newOtp[index - 1] = '';
					setOtp(newOtp);
					setActiveIndex(index - 1);
				}
			} else {
				newOtp[index] = '';
				setOtp(newOtp);
			}
		}
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		const otpCode = otp.join('');

		try {
			const response = await dispatch(sendCode({ code: otpCode }));
			if (response) {
				onClose();
			} else {
				setOtp(Array(6).fill(''));
				setActiveIndex(0);
				setErrorMessage('Invalid code. Please try again.');
			}
		} catch (error) {
			console.error(error);
			setErrorMessage('An error occurred. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			ref={modalRef}
			tabIndex={-1}
			className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto z-50 outline-none focus:outline-none bg-black bg-opacity-80 dark:text-white text-black hide-scrollbar overflow-hidden"
		>
			<div className="flex flex-col items-center max-w-sm mx-auto bg-white shadow-md rounded-md relative">
				<div className="w-full dark:bg-[#1E1F22] bg-bgLightModeSecond dark:text-white text-black flex justify-end items-center p-4 rounded-t">
					<button className="text-5xl leading-3 dark:hover:text-white hover:text-black" onClick={onClose}>
						×
					</button>
				</div>
				<div className="flex flex-col items-center gap-2 px-4 pb-4 dark:bg-[#1E1F22] bg-bgLightModeSecond dark:text-white text-black rounded-b">
					<h2 className="text-lg font-semibold dark:hover:text-white hover:text-gray-800">Enter pin code</h2>
					<p className="text-gray-600 text-sm text-center">
						Once you confirm on your mobile device that you requested a code, you can enter it here.
					</p>
					<div className="flex space-x-2">
						{otp.map((value, index) => (
							<input
								key={index}
								ref={(el) => (inputsRef.current[index] = el)}
								type="text"
								value={value ? '•' : ''}
								onChange={(e) => handleChange(e.target.value, index)}
								onKeyDown={(e) => handleKeyDown(e, index)}
								onPaste={(e) => handlePaste(e, index)}
								className={`w-12 h-12 text-center border rounded focus:outline-none text-lg ${index === activeIndex ? 'border-blue-500 focus:ring' : 'border-gray-300'} ${value ? 'font-bold text-black' : 'text-gray-500'} caret-transparent`}
								maxLength={1}
								disabled={isSubmitting || index !== activeIndex}
							/>
						))}
					</div>
					{isSubmitting && <p className="text-blue-500 mt-4">Sending...</p>}
					{errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
				</div>
			</div>
		</div>
	);
};

export default ModalSendCode;
