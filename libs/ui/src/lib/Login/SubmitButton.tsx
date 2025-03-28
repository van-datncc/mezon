import { LoadingStatus } from '@mezon/utils';

const SubmitButton = ({ disabled, isLoading, submitButtonText }: { disabled?: boolean; isLoading?: LoadingStatus; submitButtonText?: string }) => {
	return (
		<button
			type="submit"
			className={`w-full px-4 py-2 rounded-md font-medium focus:outline-none 
          ${
				disabled
					? 'bg-gray-400 text-white cursor-not-allowed dark:bg-gray-600 dark:text-gray-300'
					: 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-600'
			}`}
			disabled={disabled}
		>
			{isLoading === 'loading' ? 'Submitting...' : submitButtonText}
		</button>
	);
};

export default SubmitButton;
