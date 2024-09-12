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
			// border: '1px solid rgba(0,0,0,0.15)',
			fontSize: 14
		},
		item: {
			// padding: '5px 15px',
			// borderBottom: '1px solid rgba(0,0,0,0.15)',
			'&focused': {
				backgroundColor: '#EBEBED'
			}
		}
	}
};
