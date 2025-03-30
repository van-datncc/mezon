import { EDragBorderPosition } from '@mezon/utils';
import isEqual from 'lodash.isequal';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useDragAndDropRole<T>(initialList: T[]) {
	const [rolesList, setRolesList] = useState([...initialList]);
	const dragItemIndexRef = useRef<number | null>(null);
	const dragOverItemIndexRef = useRef<number | null>(null);
	const [dragBorderPosition, setDragBorderPosition] = useState<EDragBorderPosition | null>(null);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const hasChanged = useMemo(() => {
		return !isEqual(rolesList, initialList);
	}, [rolesList, initialList]);

	const SCROLL_SPEED = 10;
	const SCROLL_THRESHOLD = 10;

	const handleDragStart = useCallback((index: number) => {
		dragItemIndexRef.current = index;
	}, []);

	const handleDragEnd = useCallback(() => {
		setDragBorderPosition(null);
		setHoveredIndex(null);

		setRolesList((currentRolesList) => {
			const dragIndex = dragItemIndexRef.current;
			const dropIndex = dragOverItemIndexRef.current;

			if (dragIndex === null || dropIndex === null) {
				return currentRolesList;
			}

			const updatedRolesList = [...currentRolesList];
			const [draggedItem] = updatedRolesList.splice(dragIndex, 1);
			updatedRolesList.splice(dropIndex, 0, draggedItem);

			dragItemIndexRef.current = null;
			dragOverItemIndexRef.current = null;

			return updatedRolesList;
		});
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent<HTMLTableRowElement>) => {
		e.preventDefault();
		const { clientY } = e;
		const windowHeight = window.innerHeight;

		if (clientY < SCROLL_THRESHOLD) {
			window.scrollBy({ top: -SCROLL_SPEED, behavior: 'smooth' });
		} else if (clientY > windowHeight - SCROLL_THRESHOLD) {
			window.scrollBy({ top: SCROLL_SPEED, behavior: 'smooth' });
		}
	}, []);

	const handleDragEnter = useCallback((index: number) => {
		setHoveredIndex(index);
		dragOverItemIndexRef.current = index;
		if (dragItemIndexRef.current !== null) {
			setDragBorderPosition(dragItemIndexRef.current > index ? EDragBorderPosition.TOP : EDragBorderPosition.BOTTOM);
		}
	}, []);

	const resetRolesList = useCallback(() => {
		setRolesList([...initialList]);
	}, [initialList]);

	useEffect(() => {
		setRolesList([...initialList]);
	}, [initialList]);

	return {
		rolesList,
		hoveredIndex,
		dragBorderPosition,
		handleDragStart,
		handleDragEnd,
		handleDragOver,
		handleDragEnter,
		resetRolesList,
		setRolesList,
		hasChanged
	};
}
