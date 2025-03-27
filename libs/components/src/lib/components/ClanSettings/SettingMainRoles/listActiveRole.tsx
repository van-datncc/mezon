import { useClanOwner } from '@mezon/core';
import { RolesClanEntity, selectUserMaxPermissionLevel } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { DEFAULT_ROLE_COLOR, EDragBorderPosition, SlugPermission } from '@mezon/utils';
import { ApiPermission } from 'mezon-js/api.gen';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

type ListActiveRoleProps = {
	activeRoles: RolesClanEntity[];
	setShowModal: (roleId: string) => void;
	setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
	handleRoleClick: (roleId: string) => void;
};

const ListActiveRole = (props: ListActiveRoleProps) => {
	const { activeRoles, handleRoleClick, setShowModal, setOpenEdit } = props;
	const isClanOwner = useClanOwner();
	const userMaxPermissionLevel = useSelector(selectUserMaxPermissionLevel);
	const [rolesList, setRolesList] = useState(activeRoles);
	const dragItemIndexRef = useRef<number | null>(null);
	const dragOverItemIndexRef = useRef<number | null>(null);
	const [dragBorderPosition, setDragBorderPosition] = useState<EDragBorderPosition | null>(null);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	const handleOpenDeleteRoleModal = (e: React.MouseEvent, roleId: string) => {
		e.stopPropagation();
		setShowModal(roleId);
	};

	const handleOpenEditRole = (roleId: string) => {
		handleRoleClick(roleId);
		setOpenEdit(true);
	};

	const handleDragStart = (index: number) => {
		dragItemIndexRef.current = index;
	};

	const handleDragEnd = () => {
		setDragBorderPosition(null);
		setHoveredIndex(null);

		if (dragItemIndexRef.current !== null && dragOverItemIndexRef.current !== null) {
			const copyRolesList = [...rolesList];
			const [draggedItem] = copyRolesList.splice(dragItemIndexRef.current, 1);
			copyRolesList.splice(dragOverItemIndexRef.current, 0, draggedItem);

			setRolesList(copyRolesList);
		}

		dragOverItemIndexRef.current = null;
		dragItemIndexRef.current = null;
	};

	const SCROLL_SPEED = 10; // Scrolling speed while dragging
	const SCROLL_THRESHOLD = 10; // Threshold (in pixels) to trigger scrolling

	const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
		e.preventDefault();
		setHoveredIndex(index);
		dragOverItemIndexRef.current = index;

		const { clientY } = e;

		const windowHeight = window.innerHeight;

		// Scroll up if dragging near the top edge
		if (clientY < SCROLL_THRESHOLD) {
			window.scrollBy({
				top: -SCROLL_SPEED,
				behavior: 'smooth'
			});
		}
		// Scroll down if dragging near the bottom edge
		else if (clientY > windowHeight - SCROLL_THRESHOLD) {
			window.scrollBy({
				top: SCROLL_SPEED,
				behavior: 'smooth'
			});
		}

		// Determine drop position
		if (dragItemIndexRef.current !== null) {
			if (dragItemIndexRef.current > index) {
				setDragBorderPosition(EDragBorderPosition.TOP);
			} else {
				setDragBorderPosition(EDragBorderPosition.BOTTOM);
			}
		}
	};

	return rolesList.map((role, index) => {
		const hasPermissionEdit = isClanOwner || Number(userMaxPermissionLevel) > Number(role.max_level_permission);
		return (
			<tr
				key={role.id}
				className={`h-14 dark:text-white text-black group dark:hover:bg-bgModifierHover hover:bg-bgLightModeButton cursor-pointer
						${
							hoveredIndex === index
								? dragBorderPosition === EDragBorderPosition.BOTTOM
									? '!border-b !border-b-green-500'
									: '!border-t !border-t-green-500'
								: ''
						}`}
				onClick={() => handleOpenEditRole(role.id)}
				draggable
				onDragStart={() => handleDragStart(index)}
				onDragOver={(e) => handleDragOver(e, index)}
				onDragEnd={handleDragEnd}
			>
				<td>
					<p className="inline-flex gap-1 items-center text-[15px] break-all whitespace-break-spaces overflow-hidden line-clamp-2 font-medium mt-1.5">
						{role.role_icon ? (
							<img src={role.role_icon} alt="" className={'size-5'} />
						) : (
							<Icons.RoleIcon defaultSize="w-5 h-[30px] min-w-5 mr-2" defaultFill={`${role.color || DEFAULT_ROLE_COLOR}`} />
						)}

						{!hasPermissionEdit && <Icons.IconLock defaultSize="size-3 text-contentTertiary" />}
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
						<div className="text-[15px] cursor-pointer dark:hover:bg-slate-800 hover:bg-bgModifierHoverLight dark:bg-bgTertiary bg-bgLightModeThird p-2 rounded-full opacity-0 group-hover:opacity-100">
							{hasPermissionEdit ? (
								<span title="Edit">
									<Icons.PenEdit className="size-5" />
								</span>
							) : (
								<span title="View">
									<Icons.ViewRole defaultSize="size-5" />
								</span>
							)}
						</div>
						{hasPermissionEdit && (
							<div
								className={`text-[15px] cursor-pointer dark:hover:bg-slate-800 hover:bg-bgModifierHoverLight dark:bg-bgTertiary bg-bgLightModeThird p-2 rounded-full ${hasPermissionEdit ? 'opacity-100' : 'opacity-20'}`}
								onClick={(e) => handleOpenDeleteRoleModal(e, role.id)}
							>
								<span title="Delete">
									<Icons.DeleteMessageRightClick defaultSize="size-5" />
								</span>
							</div>
						)}
					</div>
				</td>
			</tr>
		);
	});
};

export default ListActiveRole;

export function useCheckHasAdministrator(permissions?: ApiPermission[]) {
	return permissions?.some((permission) => permission.slug === SlugPermission.Admin && permission.active === 1);
}
