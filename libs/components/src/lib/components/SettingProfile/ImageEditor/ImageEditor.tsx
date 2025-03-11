import React, { useEffect, useRef, useState } from 'react';

interface ImageEditorProps {
	imageSrc: string;
	onClose: () => void;
	onApply: (editedImage: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onClose, onApply }) => {
	console.log('imageSrc :', imageSrc);
	const [zoom, setZoom] = useState<number>(1);
	const [rotation, setRotation] = useState<number>(0);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.src = imageSrc;
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			drawImage(ctx, img);
		};
	}, [imageSrc, zoom, rotation]);

	const drawImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
		const canvas = ctx.canvas;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.drawImage(img, (-img.width / 2) * zoom, (-img.height / 2) * zoom, img.width * zoom, img.height * zoom);
		ctx.restore();
	};

	const handleZoom = (event: React.ChangeEvent<HTMLInputElement>) => {
		setZoom(parseFloat(event.target.value));
	};

	const handleRotate = () => {
		setRotation((prev) => prev + 90);
	};

	const handleReset = () => {
		setZoom(1);
		setRotation(0);
	};

	const handleApply = () => {
		const canvas = canvasRef.current;
		if (canvas) {
			onApply(canvas.toDataURL('image/png'));
		}
	};

	return (
		<div className="editor-overlay">
			<div className="editor-container">
				<h3>Edit Image</h3>
				<div className="editor-canvas">
					<canvas ref={canvasRef}></canvas>
				</div>
				<input type="range" min="0.5" max="2" step="0.1" value={zoom} onChange={handleZoom} />
				<div className="editor-buttons">
					<button onClick={handleReset}>Reset</button>
					<button onClick={onClose}>Cancel</button>
					<button onClick={handleRotate}>Rotate</button>
					<button onClick={handleApply} className="apply-btn">
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};

export default ImageEditor;
