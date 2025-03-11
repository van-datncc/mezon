import { ImageSourceObject } from '@mezon/utils';
import React, { useEffect, useRef, useState } from 'react';

interface ImageEditorProps {
	imageSource: ImageSourceObject;
	onClose: () => void;
	onApply: (editedImage: string) => void;
	setImageObject: React.Dispatch<React.SetStateAction<ImageSourceObject | null>>;
	setImageCropped: React.Dispatch<React.SetStateAction<ImageSourceObject | null>>;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSource, onClose, onApply, setImageObject, setImageCropped }) => {
	const [zoom, setZoom] = useState<number>(1);
	const [rotation, setRotation] = useState<number>(0);
	const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [dragging, setDragging] = useState<boolean>(false);
	const [start, setStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

	const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const bgCanvas = bgCanvasRef.current;
		const overlayCanvas = overlayCanvasRef.current;
		if (!bgCanvas || !overlayCanvas) return;

		const bgCtx = bgCanvas.getContext('2d');
		const overlayCtx = overlayCanvas.getContext('2d');
		if (!bgCtx || !overlayCtx) return;

		const img = new Image();
		img.src = imageSource?.url;
		img.onload = () => {
			bgCanvas.width = overlayCanvas.width = 600;
			bgCanvas.height = overlayCanvas.height = 300;
			setupCanvases(bgCanvas, overlayCanvas, img, zoom, rotation, offset);
		};
	}, [imageSource, zoom, rotation, offset]);

	const setupCanvases = (
		bgCanvas: HTMLCanvasElement,
		overlayCanvas: HTMLCanvasElement,
		img: HTMLImageElement,
		zoom: number,
		rotation: number,
		offset: { x: number; y: number }
	) => {
		const bgCtx = bgCanvas.getContext('2d')!;
		const overlayCtx = overlayCanvas.getContext('2d')!;

		// *** Draw the background image on bgCanvas ***
		bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
		bgCtx.save();
		bgCtx.translate(bgCanvas.width / 2 + offset.x, bgCanvas.height / 2 + offset.y);
		bgCtx.rotate((rotation * Math.PI) / 180);
		bgCtx.drawImage(img, (-img.width / 2) * zoom, (-img.height / 2) * zoom, img.width * zoom, img.height * zoom);
		bgCtx.restore();

		// *** Create a blur effect on overlayCanvas ***
		overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
		overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

		// Erase a circular area
		const radius = 140;
		overlayCtx.globalCompositeOperation = 'destination-out';
		overlayCtx.beginPath();
		overlayCtx.arc(overlayCanvas.width / 2, overlayCanvas.height / 2, radius, 0, Math.PI * 2);
		overlayCtx.fill();
		overlayCtx.globalCompositeOperation = 'source-over';

		// Draw a white border
		overlayCtx.beginPath();
		overlayCtx.arc(overlayCanvas.width / 2, overlayCanvas.height / 2, radius, 0, Math.PI * 2);
		overlayCtx.strokeStyle = 'white';
		overlayCtx.lineWidth = 3;
		overlayCtx.stroke();
	};

	const handleZoom = (event: React.ChangeEvent<HTMLInputElement>) => {
		setZoom(parseFloat(event.target.value));
	};

	const handleWheelZoom = (event: WheelEvent) => {
		event.preventDefault();
		setZoom((prev) => Math.min(2, Math.max(0.5, prev - event.deltaY * 0.001)));
	};

	useEffect(() => {
		const canvas = bgCanvasRef.current;
		if (canvas) {
			canvas.addEventListener('wheel', handleWheelZoom);
			return () => canvas.removeEventListener('wheel', handleWheelZoom);
		}
	}, []);

	const handleRotate = () => {
		setRotation((prev) => prev + 90);
	};

	const handleReset = () => {
		setZoom(1);
		setRotation(0);
		setOffset({ x: 0, y: 0 });
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		setDragging(true);
		setStart({ x: e.clientX, y: e.clientY });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!dragging) return;
		setOffset((prev) => ({
			x: prev.x + (e.clientX - start.x),
			y: prev.y + (e.clientY - start.y)
		}));
		setStart({ x: e.clientX, y: e.clientY });
	};

	const handleMouseUp = () => {
		setDragging(false);
	};

	const handleClose = () => {
		setImageObject(null);
		onClose();
	};
	const handleApply = () => {
		const bgCanvas = bgCanvasRef.current;
		const cropCanvas = overlayCanvasRef.current;
		if (!bgCanvas || !cropCanvas) return;

		const ctx = cropCanvas.getContext('2d');
		if (!ctx) return;

		// Original canvas dimensions
		const { width, height } = bgCanvas;
		const radius = Math.min(width, height) / 2;

		// Determine the square with the same position as the circle
		const squareSize = radius * 2;
		const startX = (width - squareSize) / 2;
		const startY = (height - squareSize) / 2;

		// Update the dimensions of the cropped canvas
		cropCanvas.width = squareSize;
		cropCanvas.height = squareSize;

		// Clear previous content and draw a square from `bgCanvas`
		ctx.clearRect(0, 0, squareSize, squareSize);
		ctx.drawImage(bgCanvas, startX, startY, squareSize, squareSize, 0, 0, squareSize, squareSize);

		// Export the cropped image
		cropCanvas.toBlob((blob) => {
			if (!blob) return;

			const file = new File([blob], 'cropped-square.png', { type: 'image/png' });

			const newImageObject = {
				filename: file.name,
				filetype: file.type,
				size: file.size,
				url: URL.createObjectURL(file)
			};

			setImageCropped(newImageObject);
			handleClose();
		}, 'image/png');
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50  ">
			<div className="bg-[#313338] p-6 rounded-lg text-white text-center  flex flex-col items-center w-[650px] h-[600px]">
				<h3 className="text-lg font-semibold mb-4">Edit Image</h3>
				<div className="relative flex justify-center items-center w-[600px] h-[500px]">
					<canvas
						ref={bgCanvasRef}
						className="cursor-move absolute"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
					></canvas>
					<canvas ref={overlayCanvasRef} className="absolute pointer-events-none"></canvas>
				</div>
				<input type="range" min="0.5" max="2" step="0.1" value={zoom} onChange={handleZoom} className="w-full my-4" />
				<div className="flex justify-between mt-4 space-x-2">
					<button onClick={handleReset} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-md">
						Reset
					</button>
					<button onClick={handleClose} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md">
						Cancel
					</button>
					<button onClick={handleRotate} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md">
						Rotate
					</button>
					<button onClick={handleApply} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md">
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};

export default ImageEditor;
