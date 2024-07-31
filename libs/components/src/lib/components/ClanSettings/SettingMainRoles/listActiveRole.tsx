import { Icons } from '@mezon/components';
import { useClanRestriction } from '@mezon/core';
import { RolesClanEntity, selectAllAccount, selectTheme } from '@mezon/store';
import { EPermission } from '@mezon/utils';
import { Tooltip } from 'flowbite-react';
import { useSelector } from 'react-redux';

type ListActiveRoleProps = {
	activeRoles: RolesClanEntity[];
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
	handleRoleClick: (roleId: string) => void;
};

const ListActiveRole = (props: ListActiveRoleProps) => {
	const { activeRoles, handleRoleClick, setShowModal, setOpenEdit } = props;
	const userProfile = useSelector(selectAllAccount);
	const [hasAdminPermission, {isClanCreator}] = useClanRestriction([EPermission.administrator]);
	const appearanceTheme = useSelector(selectTheme);

	return activeRoles.map((role) => (
		<tr key={role.id} className="h-14 dark:text-white text-black group dark:hover:bg-bgModifierHover hover:bg-bgLightModeButton">
			<td>
				<p
					className="inline-flex gap-x-2 items-center text-[15px] break-all whitespace-break-spaces overflow-hidden line-clamp-2 font-medium mt-1.5"
					onClick={() => {
						setShowModal(false);
					}}
				>
					<Icons.RoleIcon defaultSize="w-5 h-[30px] min-w-5" />
					<span className="one-line">{role.title}</span>
				</p>
			</td>
			<td className="text-[15px] text-center">
				<p className="inline-flex gap-x-2 items-center dark:text-textThreadPrimary text-gray-500">
					{role.role_user_list?.role_users?.length ?? 0}
					<Icons.MemberIcon defaultSize="w-5 h-[30px] min-w-5" />
				</p>
			</td>
			<td className="  flex h-14 justify-center items-center">
				<div className="flex gap-x-2">
					<div
						className="text-[15px] cursor-pointer dark:hover:bg-slate-800 hover:bg-bgModifierHoverLight dark:bg-bgTertiary bg-bgLightModeThird p-2 rounded-full opacity-0 group-hover:opacity-100"
						onClick={() => {
							handleRoleClick(role.id);
							setOpenEdit(true);
						}}
					>
						{(role.creator_id === userProfile?.user?.id || isClanCreator) ?
						<Tooltip content="Edit" trigger="hover" animation="duration-500" style={appearanceTheme === 'light' ? 'light' : 'dark'}>
							<Icons.PenEdit defaultSize="size-5" />
						</Tooltip> :
						<Tooltip content="View" trigger="hover" animation="duration-500" style={appearanceTheme === 'light' ? 'light' : 'dark'}>
							<Icons.ViewRole defaultSize="size-5" />
						</Tooltip>
						}
					</div>
					<div
						className="text-[15px] cursor-pointer dark:hover:bg-slate-800 hover:bg-bgModifierHoverLight dark:bg-bgTertiary bg-bgLightModeThird p-2 rounded-full"
						onClick={() => {
							setShowModal(true);
							handleRoleClick(role.id);
						}}
					>
						<Tooltip content="Delete" trigger="hover" animation="duration-500" style={appearanceTheme === 'light' ? 'light' : 'dark'}>
							<Icons.DeleteMessageRightClick defaultSize="size-5" />
						</Tooltip>
					</div>
				</div>
			</td>
		</tr>
	));
};

export default ListActiveRole;
