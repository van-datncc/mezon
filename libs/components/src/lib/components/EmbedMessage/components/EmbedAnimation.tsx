import { useEffect } from 'react';

type EmbedAnimationProps = {
	url_image?: string;
	url_position?: string;
	pool?: Array<string[]>;
	messageId: string;
	repeat?: number;
	duration?: number;
};

export const EmbedAnimation = ({ url_image, url_position, pool, messageId, repeat = 1, duration = 2 }: EmbedAnimationProps) => {
	useEffect(() => {
		const fetchAnimationData = async () => {
			if (!url_position) {
				return;
			}
			// const jsonPosition = (await (await fetch(url_position)).json()) as TDataAnimation;
			const jsonPosition = json as TDataAnimation;

			pool?.map((poolItem, index) => {
				const style = document.createElement('style');
				const innerAnimation = makeAnimation(jsonPosition, poolItem).animate;
				style.innerHTML = `

        .box_animation_${index}_${messageId} {
          background-image: url(${url_image});
          animation: animation_embed_${index}_${messageId} ${duration}s steps(1) forwards;
          animation-iteration-count: ${repeat ? repeat : 'infinite'};
          background-repeat : no-repeat;
          width : ${jsonPosition.frames[poolItem[index]].frame.w}px;
          height : ${jsonPosition.frames[poolItem[index]].frame.h}px;
          }

          @keyframes animation_embed_${index}_${messageId} {
            ${innerAnimation}
            }


            `;
				const div = document.getElementById(`${messageId}_animation_${index}`);
				div?.appendChild(style);
			});
		};
		fetchAnimationData();
	}, []);

	return (
		<div className="rounded-md bg-white">
			{pool?.map((poolItem, index) => <div id={`${messageId}_animation_${index}`} className={`box_animation_${index}_${messageId}`}></div>)}
		</div>
	);
};
export default EmbedAnimation;

const makeAnimation = (data: TDataAnimation, poolImages: string[]) => {
	const imageNumber = poolImages.length;
	let animate = '';
	poolImages.map((key, index) => {
		const frame = data.frames[key].frame;
		if (!index) {
			animate =
				animate +
				`
      ${index * (100 / imageNumber)}%{
        background-position : -${frame.x}px -${frame.y}px;
        }

        `;
		} else {
			animate =
				animate +
				`${100 - (imageNumber - 1 - index) * (100 / imageNumber)}%{
        background-position : -${frame.x}px -${frame.y}px;
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

const json = {
	frames: {
		'1.JPG': {
			frame: {
				x: 1,
				y: 1,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'10.JPG': {
			frame: {
				x: 136,
				y: 1,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'11.JPG': {
			frame: {
				x: 271,
				y: 1,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'12.JPG': {
			frame: {
				x: 1,
				y: 129,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'13.JPG': {
			frame: {
				x: 136,
				y: 129,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'14.JPG': {
			frame: {
				x: 271,
				y: 129,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'2.JPG': {
			frame: {
				x: 1,
				y: 257,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'3.JPG': {
			frame: {
				x: 136,
				y: 257,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'4.JPG': {
			frame: {
				x: 271,
				y: 257,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'5.JPG': {
			frame: {
				x: 406,
				y: 1,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'6.JPG': {
			frame: {
				x: 406,
				y: 129,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'7.JPG': {
			frame: {
				x: 406,
				y: 257,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'8.JPG': {
			frame: {
				x: 1,
				y: 385,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		},
		'9.JPG': {
			frame: {
				x: 136,
				y: 385,
				w: 133,
				h: 126
			},
			rotated: false,
			trimmed: false,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: 133,
				h: 126
			},
			sourceSize: {
				w: 133,
				h: 126
			}
		}
	},
	meta: {
		app: 'http://www.codeandweb.com/texturepacker',
		version: '1.0',
		image: 'spritesheet.png',
		format: 'RGBA8888',
		size: {
			w: 540,
			h: 512
		},
		scale: '1'
	}
};
