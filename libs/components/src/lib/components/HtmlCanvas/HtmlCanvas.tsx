import { CanvasDataResponse, Circle, hasColor } from '@mezon/utils';
import { useEffect, useRef } from 'react';

export const canvasDataTemplate: CanvasDataResponse = {
	shapeData: [
		{ type: 'rectangle', x: 0, y: 0, width: 800, height: 300, color: 'skyblue' },
		{ type: 'circle', x: 700, y: 100, radius: 50, color: 'yellow' },
		{
			type: 'path',
			points: [
				{ x: 100, y: 300 },
				{ x: 300, y: 100 },
				{ x: 500, y: 300 }
			],
			color: 'darkgreen'
		},
		{
			type: 'path',
			points: [
				{ x: 400, y: 300 },
				{ x: 600, y: 150 },
				{ x: 800, y: 300 }
			],
			color: 'darkgreen'
		},
		{ type: 'bezierCurve', startX: 0, startY: 400, cp1x: 200, cp1y: 350, cp2x: 400, cp2y: 450, endX: 800, endY: 400, color: 'blue' },
		{ type: 'rectangle', x: 150, y: 250, width: 20, height: 50, color: 'saddlebrown' },
		{ type: 'circle', x: 160, y: 230, radius: 30, color: 'green' },
		{ type: 'line', startX: 0, startY: 500, endX: 800, endY: 500, color: 'gray' },
		{ type: 'text', text: 'Picture title', x: 350, y: 50, font: '30px Arial', color: 'black' },
		{ type: 'image', src: 'path/to/house.png', x: 600, y: 350, width: 100, height: 100 },
		{ type: 'video', src: 'path/to/clouds.mp4', x: 50, y: 50, width: 100, height: 50 }
	],
	width: 400,
	height: 300
};

function draw(ctx: CanvasRenderingContext2D, response: CanvasDataResponse) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	response.shapeData.forEach((shape) => {
		if (hasColor(shape)) {
			ctx.strokeStyle = shape.color || 'black';
			ctx.fillStyle = shape.color || 'black';
		} else {
			ctx.strokeStyle = 'black';
			ctx.fillStyle = 'black';
		}

		switch (shape.type) {
			case 'circle':
				ctx.beginPath();
				ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
				ctx.fill();
				break;
			case 'rectangle':
				ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
				break;
			case 'line':
				ctx.beginPath();
				ctx.moveTo(shape.startX, shape.startY);
				ctx.lineTo(shape.endX, shape.endY);
				ctx.stroke();
				break;
			case 'bezierCurve':
				ctx.beginPath();
				ctx.moveTo(shape.startX, shape.startY);
				ctx.bezierCurveTo(shape.cp1x, shape.cp1y, shape.cp2x, shape.cp2y, shape.endX, shape.endY);
				ctx.stroke();
				break;
			case 'quadraticCurve':
				ctx.beginPath();
				ctx.moveTo(shape.startX, shape.startY);
				ctx.quadraticCurveTo(shape.cpx, shape.cpy, shape.endX, shape.endY);
				ctx.stroke();
				break;
			case 'path':
				ctx.beginPath();
				ctx.moveTo(shape.points[0].x, shape.points[0].y);
				shape.points.slice(1).forEach((point) => {
					ctx.lineTo(point.x, point.y);
				});
				ctx.stroke();
				break;
			case 'text':
				ctx.font = shape.font || '16px Arial';
				ctx.fillText(shape.text, shape.x, shape.y);
				break;
			case 'image': {
				const img = new Image();
				img.src = shape.src;
				img.onload = () => {
					ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height);
				};
				break;
			}
			case 'video': {
				const video = document.createElement('video');
				video.src = shape.src;
				video.autoplay = true;
				video.loop = true;
				video.muted = true;
				video.onplay = () => {
					const drawFrame = () => {
						if (!video.paused && !video.ended) {
							ctx.drawImage(video, shape.x, shape.y, shape.width, shape.height);
							requestAnimationFrame(drawFrame);
						}
					};
					drawFrame();
				};
				break;
			}
			default:
				console.error('Unsupported shape type:', (shape as Circle).type);
		}
	});
}

export function HtmlCanvasView({ response }: { response: CanvasDataResponse }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const timeoutId = setTimeout(() => draw(ctx, response), 100);
		return () => {
			clearTimeout(timeoutId);
		};
	}, [response]);

	const { width, height } = response;

	return (
		<div style={{ width, height }}>
			<canvas ref={canvasRef} width={width} height={height} style={{ border: '1px solid #000000' }}></canvas>
		</div>
	);
}
