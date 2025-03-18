import { useCallback, useEffect, useRef, useState } from 'react';

type ModalHeaderProps = {
	onClose: () => void;
	handleMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	title?: string;
	isFocused?: boolean;
	zIndex?: string;
};

const ModalHeader = ({ title, onClose, handleMouseDown, isFocused, zIndex }: ModalHeaderProps) => {
	const bgColor = isFocused ? 'bg-[#1E1F22]' : 'bg-[#404249]';

	return (
		<div className={`px-3 py-1 flex justify-between items-center  ${zIndex} ${bgColor}`} onMouseDown={handleMouseDown}>
			<span className="text-sm text-white">{title}</span>
			<button
				onClick={onClose}
				className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center text-[#B5BAC1] text-sm hover:bg-[#404249] hover:text-white transition"
			>
				✕
			</button>
		</div>
	);
};

type ModalContentProps = {
	children: React.ReactNode;
	isDragging: boolean;
	resizeDir: string | null;
	onFocus?: () => void;
};

const ModalContent: React.FC<ModalContentProps> = ({ children, isDragging, resizeDir, onFocus }) => (
	<div onMouseDown={onFocus} className="flex-1 overflow-auto relative p-0.1">
		{children}
		{(isDragging || resizeDir) && <div className="absolute inset-0" style={{ background: 'transparent', zIndex: 10 }} />}
	</div>
);

type ResizeHandlesProps = {
	handleResizeMouseDown: (dir: string) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ handleResizeMouseDown }) => (
	<>
		<div className="absolute top-0 left-1 w-[calc(100%-8px)] h-1 cursor-n-resize z-50 " onMouseDown={handleResizeMouseDown('top')} />
		<div className="absolute bottom-0 left-1 w-[calc(100%-8px)] h-1 cursor-s-resize z-50 " onMouseDown={handleResizeMouseDown('bottom')} />

		<div className="absolute left-0 top-1 h-[calc(100%-8px)] w-1 cursor-w-resize z-50 " onMouseDown={handleResizeMouseDown('left')} />
		<div className="absolute right-0 top-1 h-[calc(100%-8px)] w-1 cursor-e-resize z-50 " onMouseDown={handleResizeMouseDown('right')} />

		<div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50 " onMouseDown={handleResizeMouseDown('bottom-right')} />
		<div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50 " onMouseDown={handleResizeMouseDown('bottom-left')} />
		<div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50 " onMouseDown={handleResizeMouseDown('top-right')} />
		<div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50 " onMouseDown={handleResizeMouseDown('top-left')} />
	</>
);

interface DraggableModalProps {
	onClose: () => void;
	children: React.ReactNode;
	parentRef: React.RefObject<HTMLDivElement>;
	initialWidth?: number;
	initialHeight?: number;
	aspectRatio?: number | null;
	headerTitle?: string;
	isFocused?: boolean;
	onFocus?: () => void;
}

const DraggableModal: React.FC<DraggableModalProps> = ({
	onClose,
	children,
	parentRef,
	initialWidth = 600,
	initialHeight = 400,
	aspectRatio = null,
	headerTitle,
	isFocused,
	onFocus
}) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 100, y: 100 });
	const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
	const [isDragging, setIsDragging] = useState(false);
	const [resizeDir, setResizeDir] = useState<string | null>(null);
	const [bounds, setBounds] = useState({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
	const zIndex = isFocused ? 'z-50' : 'z-40';

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
			onMouseDown={onFocus}
			ref={modalRef}
			className={`absolute dark:bg-[#1E1F22] bg-[#E3E5E8] shadow-lg rounded-sm ${zIndex}`}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				width: `${size.width}px`,
				height: `${size.height}px`,
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<ModalHeader zIndex={zIndex} isFocused={isFocused} onClose={onClose} title={headerTitle} handleMouseDown={handleMouseDown} />
			<ModalContent onFocus={onFocus} isDragging={isDragging} resizeDir={resizeDir}>
				{children}
			</ModalContent>
			<ResizeHandles handleResizeMouseDown={handleResizeMouseDown} />
		</div>
	);
};

export default DraggableModal;
