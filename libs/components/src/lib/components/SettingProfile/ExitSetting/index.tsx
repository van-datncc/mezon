import { auditLogFilterActions, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { UserAuditLog } from '@mezon/utils';

export type ModalExitProps = {
	onClose: () => void;
};
const ExitSetting = (props: ModalExitProps) => {
	const dispatch = useAppDispatch();
	const { onClose } = props;
	const handleClose = () => {
		dispatch(auditLogFilterActions.setAction(''));
		dispatch(
			auditLogFilterActions.setUser({
				userId: '',
				userName: UserAuditLog.ALL_USER_AUDIT
			})
		);
		onClose();
	};

	return (
		<div className="relative dark:bg-bgPrimary bg-[#ffff] w-1/12 xl:w-1/5 flex-grow hidden sbm:block">
			<div className="fixed w-1/4 ml-5 pt-[94px]">
				<div className="w-fit flex flex-col items-center gap-2 text-bgPrimary dark:text-[#a8a6a6] group">
					<div
						onClick={handleClose}
						className="rounded-full p-[10px] border-2 hover:bg-bgLightModeThird dark:bg-transparent dark:group-hover:text-white dark:border-[#a8a6a6] dark:group-hover:border-white border-black cursor-pointer"
					>
						<Icons.CloseButton className="w-4" />
					</div>
					<div className="font-semibold text-[13px] dark:group-hover:text-white">ESC</div>
				</div>
			</div>
		</div>
	);
};

export default ExitSetting;
