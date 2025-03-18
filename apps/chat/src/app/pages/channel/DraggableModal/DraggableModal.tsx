import { useCallback, useEffect, useRef, useState } from 'react';

interface DraggableModalProps {
	onClose: () => void;
	children: React.ReactNode;
	parentRef: React.RefObject<HTMLDivElement>;
	initialWidth?: number;
	initialHeight?: number;
	aspectRatio?: number | null;
	headerTitle?: string;
}

const DraggableModal: React.FC<DraggableModalProps> = ({
	onClose,
	children,
	parentRef,
	initialWidth = 600,
	initialHeight = 400,
	aspectRatio = null,
	headerTitle
}) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 100, y: 100 });
	const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
	const [isDragging, setIsDragging] = useState(false);
	const [resizeDir, setResizeDir] = useState<string | null>(null);
	const [bounds, setBounds] = useState({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

	useEffect(() => {
		const parent = parentRef?.current;
		if (!parent) return;

		const updateBounds = () => {
			const parentRect = parent.getBoundingClientRect();
			setBounds({
				minX: 0,
				maxX: parentRect.width - size.width,
				minY: 0,
				maxY: parentRect.height - size.height - 20
			});
		};

		updateBounds();

		const resizeObserver = new ResizeObserver(updateBounds);
		resizeObserver.observe(parent);

		return () => {
			resizeObserver.disconnect();
		};
	}, [parentRef, size]);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleResizeMouseDown = useCallback((direction: string) => {
		return (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setResizeDir(direction);
		};
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging && !resizeDir) return;

			if (isDragging) {
				setPosition((prev) => ({
					x: Math.min(Math.max(prev.x + e.movementX, bounds.minX), bounds.maxX),
					y: Math.min(Math.max(prev.y + e.movementY, bounds.minY), bounds.maxY)
				}));
			} else if (resizeDir) {
				let newWidth = size.width;
				let newHeight = size.height;
				let newX = position.x;
				let newY = position.y;

				const isCorner = resizeDir.includes('-');
				const shouldMaintainAspect = aspectRatio && isCorner;

				if (resizeDir.includes('right')) {
					newWidth = Math.max(300, size.width + e.movementX);
				}
				if (resizeDir.includes('left')) {
					newWidth = Math.max(300, size.width - e.movementX);
					newX += e.movementX;
				}
				if (resizeDir.includes('bottom')) {
					newHeight = Math.max(200, size.height + e.movementY);
				}
				if (resizeDir.includes('top')) {
					newHeight = Math.max(200, size.height - e.movementY);
					newY += e.movementY;
				}

				if (shouldMaintainAspect && aspectRatio) {
					if (resizeDir === 'top-left' || resizeDir === 'bottom-right') {
						newHeight = newWidth / aspectRatio;
						if (resizeDir === 'top-left') {
							newY = position.y + (size.height - newHeight);
						}
					} else if (resizeDir === 'top-right' || resizeDir === 'bottom-left') {
						newHeight = newWidth / aspectRatio;
						if (resizeDir === 'top-right') {
							newY = position.y + (size.height - newHeight);
						}
					}
				}

				const parent = parentRef?.current;
				if (parent) {
					const parentRect = parent.getBoundingClientRect();
					newWidth = Math.min(newWidth, parentRect.width - newX);
					newHeight = Math.min(newHeight, parentRect.height - newY);
					newWidth = Math.max(newWidth, 300);
					newHeight = Math.max(newHeight, 200);
					if (shouldMaintainAspect && aspectRatio) {
						newHeight = newWidth / aspectRatio;
					}
				}

				setSize({ width: newWidth, height: newHeight });
				setPosition({ x: newX, y: newY });
			}
		},
		[isDragging, resizeDir, bounds, size, position, aspectRatio, parentRef]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
		setResizeDir(null);
	}, []);

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	return (
		<div
			ref={modalRef}
			className="absolute dark:bg-[#1E1F22] bg-[#E3E5E8] shadow-lg rounded-sm z-50"
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				width: `${size.width}px`,
				height: `${size.height}px`,
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			{/* Header (Drag) */}
			<div
				className="cursor-move dark:bg-[#1E1F22] bg-[#E3E5E8] px-3 py-1 flex justify-between items-center rounded-t-xl"
				onMouseDown={handleMouseDown}
			>
				<span className="dark:text-white text-black text-sm">{headerTitle}</span>
				{/* Nút X */}
				<button
					onClick={onClose}
					className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center text-[#B5BAC1] text-sm  hover:bg-[#404249] hover:text-white transition"
				>
					✕
				</button>{' '}
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto relative p-0.1">
				{children}
				{(isDragging || resizeDir) && <div className="absolute inset-0" style={{ background: 'transparent', zIndex: 10 }} />}
			</div>

			{/* Resize Handles */}
			<div className="absolute top-0 h-2 w-full cursor-n-resize z-40 " onMouseDown={handleResizeMouseDown('top')} />
			<div className="absolute bottom-0 h-2 w-full cursor-s-resize z-40" onMouseDown={handleResizeMouseDown('bottom')} />
			<div className="absolute left-0 w-2 h-full cursor-w-resize z-40" onMouseDown={handleResizeMouseDown('left')} />
			<div className="absolute right-0 w-2 h-full cursor-e-resize z-40 " onMouseDown={handleResizeMouseDown('right')} />

			{/* Corner Resizers */}
			<div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={handleResizeMouseDown('bottom-right')} />
			<div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" onMouseDown={handleResizeMouseDown('bottom-left')} />
			<div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize z-50 " onMouseDown={handleResizeMouseDown('top-right')} />
			<div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" onMouseDown={handleResizeMouseDown('top-left')} />
		</div>
	);
};

export default DraggableModal;
