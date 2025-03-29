import { EDragBorderPosition } from '@mezon/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import isEqual  from "lodash.isequal";

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

		if (dragItemIndexRef.current !== null && dragOverItemIndexRef.current !== null) {
			const copyRolesList = [...rolesList];
			const [draggedItem] = copyRolesList.splice(dragItemIndexRef.current, 1);
			copyRolesList.splice(dragOverItemIndexRef.current, 0, draggedItem);

			setRolesList(copyRolesList);
		}

		dragOverItemIndexRef.current = null;
		dragItemIndexRef.current = null;
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
