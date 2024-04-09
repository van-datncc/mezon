export default {
	control: {
		backgroundColor: '#000',
		fontSize: 15,
	},

	'&multiLine': {
		control: {
			fontFamily: 'manrope',
			minHeight: 35,
			border: 'none',
			outline: 'none',
		},
		highlighter: {
			padding: 9,
			border: '1px solid transparent',
		},
		input: {
			padding: 9,
			border: 'none',
			outline: 'none',
		},
	},

	'&singleLine': {
		display: 'inline-block',
		width: 180,

		highlighter: {
			padding: 1,
			border: '2px inset transparent',
		},
		input: {
			padding: 1,
			border: '2px inset',
		},
	},

	suggestions: {
		control: {
			marginBottom:'300px',
			// marginBottom: '330px'
		},
		list: {
			// backgroundColor: '#26262B',
			border: '1px solid rgba(0,0,0,0.15)',
			fontSize: 15,
			marginBottom:'300px',

		},
		item: {
			padding: '5px 15px',
			borderBottom: '1px solid rgba(0,0,0,0.15)',
			marginBottom:'300px',

			'&focused': {
				backgroundColor: '#cee4e5',
			},
		},
	},
};
