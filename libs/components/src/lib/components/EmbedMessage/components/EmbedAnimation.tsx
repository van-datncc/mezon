import { useEffect } from 'react';

export const EmbedAnimation = () => {
	const jsonPosition = {
		frames: {
			'RunRight01.png': {
				frame: {
					x: 1,
					y: 1,
					w: 128,
					h: 128
				},
				rotated: false,
				trimmed: false,
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 128,
					h: 128
				},
				sourceSize: {
					w: 128,
					h: 128
				}
			},
			'RunRight02.png': {
				frame: {
					x: 131,
					y: 1,
					w: 128,
					h: 128
				},
				rotated: false,
				trimmed: false,
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 128,
					h: 128
				},
				sourceSize: {
					w: 128,
					h: 128
				}
			},
			'RunRight03.png': {
				frame: {
					x: 1,
					y: 131,
					w: 128,
					h: 128
				},
				rotated: false,
				trimmed: false,
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 128,
					h: 128
				},
				sourceSize: {
					w: 128,
					h: 128
				}
			},
			'RunRight04.png': {
				frame: {
					x: 131,
					y: 131,
					w: 128,
					h: 128
				},
				rotated: false,
				trimmed: false,
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 128,
					h: 128
				},
				sourceSize: {
					w: 128,
					h: 128
				}
			}
		},
		meta: {
			app: 'http://www.codeandweb.com/texturepacker',
			version: '1.0',
			image: 'spritesheet.png',
			format: 'RGBA8888',
			size: {
				w: 260,
				h: 260
			},
			scale: '1'
		}
	};
	const url_image = '';
	useEffect(() => {
		const style = document.createElement('style');
		const innerAnimation = makeAnimation(jsonPosition).animate;
		style.innerHTML = `

    .slot-machine {
	background-image: url(${url_image});
	animation: slot_machine 2s steps(1) infinite;
}

@keyframes slot_machine {
  ${innerAnimation}
}


`;

		const div = document.getElementById('Test_animation');
		div?.appendChild(style);
	}, []);

	return (
		<div className="rounded-md bg-white">
			<div id="Test_animation" className="w-32 h-32 slot-machine"></div>
		</div>
	);
};
export default EmbedAnimation;

const makeAnimation = (data: TDataAnimation) => {
	const imageNumber = Object.keys(data.frames).length;
	let animate = '';
	Object.keys(data.frames).map((value, index) => {
		const frame = data.frames[value].frame;
		if (!index) {
			animate =
				animate +
				`
      ${index * (100 / imageNumber)}%{
        background-position : ${frame.x}px ${frame.y}px;
        }
        100%{
        background-position : ${frame.x}px ${frame.y}px;
        }
        `;
		} else {
			animate =
				animate +
				`${index * (100 / imageNumber)}%{
        background-position : ${frame.x}px ${frame.y}px;
    }
        `;
		}
	});

	return {
		animate: animate
	};
};
type TDataAnimation = {
	frames: {
		[key: string]: {
			frame: {
				x: number;
				y: number;
				w: number;
				h: number;
			};
			rotated: boolean;
			trimmed: boolean;
			spriteSourceSize: {
				x: number;
				y: number;
				w: number;
				h: number;
			};
			sourceSize: {
				w: number;
				h: number;
			};
		};
	};
	meta: {
		app: string;
		version: string;
		image: string;
		format: string;
		size: {
			w: number;
			h: number;
		};
		scale: string;
	};
};
