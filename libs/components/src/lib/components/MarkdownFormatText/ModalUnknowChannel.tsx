import { FRIEND_PAGE_LINK, toChannelPage, useAppNavigation } from '@mezon/core';
import { RootState, getStoreAsync, selectCurrentClanId, selectWelcomeChannelByClanId, toastActions } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { useDispatch } from 'react-redux';

type ModalUnknowChannelProps = {
	onClose?: () => void;
	isError?: boolean;
	errMessage?: string;
	idErr?: string;
	errorType?: 'connection' | 'permission' | 'critical' | 'unknown';
};

const getErrorConfig = (errMessage?: string) => {
	const connectionKeywords = ['disconnect', 'socket', 'network', 'timeout', 'connection', 'reconnect'];
	const permissionKeywords = ['access', 'permission', 'denied', 'unauthorized', 'forbidden'];

	const message = errMessage?.toLowerCase() || '';
	let detectedType = '';

	if (connectionKeywords.some((keyword) => message.includes(keyword))) {
		detectedType = 'connection';
	} else if (permissionKeywords.some((keyword) => message.includes(keyword))) {
		detectedType = 'permission';
	} else {
		detectedType = 'unknown';
	}

	return {
		type: detectedType,
		shouldShowModal: detectedType === 'permission' || detectedType === 'critical',
		shouldShowPopover: detectedType === 'connection',
		shouldAutoRetry: detectedType === 'connection'
	};
};

function ModalUnknowChannel(props: ModalUnknowChannelProps) {
	const dispatch = useDispatch();
	const { onClose, isError = false, errMessage, idErr } = props;
	const { toClanPage, navigate } = useAppNavigation();

	const errorConfig = getErrorConfig(errMessage);

	const removeToastError = () => {
		if (idErr) {
			dispatch(toastActions.removeToastError(idErr));
		}
	};

	const clearAllToastError = () => {
		dispatch(toastActions.clearAllToastErrors());
	};

	const directToWelcomeChannel = async () => {
		clearAllToastError();
		const store = await getStoreAsync();
		const currentClanId = selectCurrentClanId(store.getState() as RootState);
		if (!currentClanId || currentClanId === '0') {
			navigate(FRIEND_PAGE_LINK);
			return;
		}
		const welcomeChannelId = selectWelcomeChannelByClanId(store.getState(), currentClanId);

		if (welcomeChannelId) {
			navigate(toClanPage(currentClanId));
			navigate(toChannelPage(welcomeChannelId, currentClanId));
			return;
		}
	};

	const onCloseAndReset = () => {
		if (isError) {
			removeToastError();
		}
		onClose?.();
	};

	if (errorConfig.type === 'connection') return null;

	return (
		<div className="fixed inset-0 z-[1000] flex items-center justify-center">
			<div className="absolute inset-0 bg-black/10 backdrop-blur-sm transition-opacity" onClick={onCloseAndReset} />
			<div className="relative bg-theme-setting-primary border-theme-primary rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
				<button
					onClick={onCloseAndReset}
					className="absolute top-4 right-4 z-10 text-theme-primary text-theme-primary-hover transition-colors p-1 rounded-full "
				>
					<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>

				<div className="p-6 pt-8">
					<div className="flex flex-col items-center text-center space-y-4">
						<div className="flex items-center justify-center w-16 h-16 bg-[#5865f2]/20 rounded-full">
							<Icons.IconClockChannel />
						</div>

						{isError ? (
							<div className="space-y-2">
								<h3 className="text-xl font-semibold text-theme-primary-active">{errMessage || 'Oops! Something Went Wrong'}</h3>
								<p className="text-theme-primary text-sm leading-relaxed">
									{errorConfig.type === 'permission'
										? "You don't have the necessary permissions to access this content. Please contact an administrator if you believe this is an error."
										: "We encountered an issue while trying to access this content. Let's get you back on track."}
								</p>
							</div>
						) : (
							<div className="space-y-2">
								<h3 className="text-xl font-semibold text-theme-primary-active">Access Denied</h3>
								<p className="text-theme-primary text-sm leading-relaxed">
									You don't have permission to access this channel or clan. Please check with the server administrator if you
									believe this is an error.
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="bg-theme-setting-nav px-6 py-4 flex gap-3">
					{isError ? (
						<>
							<button
								onClick={directToWelcomeChannel}
								className="flex-1 bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium py-2.5 px-4 rounded transition-colors duration-200"
							>
								Go to Welcome Channel
							</button>
							<button
								onClick={onCloseAndReset}
								className="px-4 py-2.5 text-theme-primary hover:underline rounded transition-colors duration-200"
							>
								Cancel
							</button>
						</>
					) : (
						<button
							onClick={onCloseAndReset}
							className="flex-1 bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium py-2.5 px-4 rounded transition-colors duration-200"
						>
							Okay, Got It
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default ModalUnknowChannel;
