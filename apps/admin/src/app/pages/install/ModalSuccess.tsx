import { Icons } from '@mezon/ui';

type ModalSuccessProps = {
	name?: string;
	isModalTry?: boolean;
	handleModal: () => void;
};

const ModalSuccess = (props: ModalSuccessProps) => {
	const { name, isModalTry, handleModal } = props;
	return (
		<div className="rounded bg-bgProfileBody max-w-[440px] w-full pt-4 flex flex-col items-center p-6 gap-y-5">
			<Icons.PicSuccessModal />
			<p className="text-base text-colorWhiteSecond">Success!</p>
			<p className="text-sm text-colorWhiteSecond">
				<strong>{name}</strong>
				&nbsp;has been authorised and added to&nbsp;
				<strong>nameClan</strong>
			</p>
			{!isModalTry && (
				<button className="px-4 py-2 rounded bg-primary w-fit text-sm font-medium" onClick={handleModal}>
					Go to <strong>nameClan</strong>
				</button>
			)}
			<p className="text-xs text-contentTertiary">You may now close this window or tab.</p>
		</div>
	);
};

export default ModalSuccess;
