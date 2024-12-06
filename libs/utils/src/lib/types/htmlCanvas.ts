export interface Circle {
	type: 'circle';
	x: number;
	y: number;
	radius: number;
	color?: string;
}

export interface Rectangle {
	type: 'rectangle';
	x: number;
	y: number;
	width: number;
	height: number;
	color?: string;
}

export interface Line {
	type: 'line';
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	color?: string;
}

export interface BezierCurve {
	type: 'bezierCurve';
	startX: number;
	startY: number;
	cp1x: number;
	cp1y: number;
	cp2x: number;
	cp2y: number;
	endX: number;
	endY: number;
	color?: string;
}

export interface QuadraticCurve {
	type: 'quadraticCurve';
	startX: number;
	startY: number;
	cpx: number;
	cpy: number;
	endX: number;
	endY: number;
	color?: string;
}

export interface Path {
	type: 'path';
	points: { x: number; y: number }[];
	color?: string;
}

export interface Text {
	type: 'text';
	text: string;
	x: number;
	y: number;
	font?: string;
	color?: string;
}

export interface ImageShape {
	type: 'image';
	src: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface VideoShape {
	type: 'video';
	src: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export type Shape = Circle | Rectangle | Line | BezierCurve | QuadraticCurve | Path | Text | ImageShape | VideoShape;

export interface CanvasDataResponse {
	shapeData: Shape[];
	width: number;
	height: number;
}

export function hasColor(shape: Shape): shape is Circle | Rectangle | Line | BezierCurve | QuadraticCurve | Path | Text {
	return 'color' in shape;
}
