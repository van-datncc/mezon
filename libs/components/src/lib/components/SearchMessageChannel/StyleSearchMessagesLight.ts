import { MsOverflowStyle, OverflowY, ScrollbarWidth } from '@mezon/utils';

export default {
	control: {
		fontSize: 16
	},

	'&singleLine': {
		display: 'inline-block',
		width: '100%',

		highlighter: {
			padding: 1,
			border: '1px inset transparent'
		},
		input: {
			padding: 1,
			border: 'none',
			outline: 'none',
			width: 'calc(100% - 16px)'
		}
	},

	suggestions: {
		top: -16,
		left: -7,
		list: {
			backgroundColor: '#FFFFFF',
			fontSize: 14,
			overflowY: 'scroll' as OverflowY,
			maxHeight: '500px',
			scrollbarWidth: 'none' as ScrollbarWidth,
			msOverflowStyle: 'none' as MsOverflowStyle
		},
		item: {
			'&focused': {
				backgroundColor: '#EBEBED'
			}
		}
	}
};
