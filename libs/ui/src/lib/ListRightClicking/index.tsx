import { Icons } from '@mezon/components';

const CopyImageIcon = () => <Icons.CopyIcon />;
const SaveImageIcon = () => <Icons.CopyIcon />;
const CopyLinkIcon = () => <Icons.CopyIcon />;
const OpenLinkIcon = () => <Icons.CopyIcon />;

export const imageList = [
	{ name: 'Copy Image', symbol: <></> },
	{ name: 'Save Image', symbol: <></> },
];

export const linkList = [
	{ name: 'Copy Link', symbol: <></> },
	{ name: 'Open Link', symbol: <></> },
];

export const listClickDefault = [
	{ id: 0, name: '0. Add Reaction', symbol: <CopyImageIcon /> },
	{ id: 4, name: '4. Reply', symbol: <SaveImageIcon /> },
	{ id: 5, name: '5. Create Thread', symbol: <SaveImageIcon /> },
	{ id: 6, name: '6. Copy Text', symbol: <CopyLinkIcon /> },
	{ id: 7, name: '7. Apps', symbol: <OpenLinkIcon /> },
	{ id: 8, name: '8. Mark Unread', symbol: <OpenLinkIcon /> },
	{ id: 9, name: '9. Copy Message Link', symbol: <OpenLinkIcon /> },
];

export const pinMessageList = [
	{ id: 3, name: '3. Pin Message', symbol: <SaveImageIcon /> },
]

export const speakMessageList = [
	{ id: 10, name: '10. Speak Message', symbol: <OpenLinkIcon /> },
]

export const editAndDeleteMessageList = [
	{ id: 2, name: '2. Edit Message', symbol: <CopyImageIcon /> }, 
	{ id: 13, name: '13. Delete Message', symbol: <OpenLinkIcon /> }, 
];

export const removeMessageReactionList = [
	{ id: 11, name: '11. Remove Reaction', symbol: <OpenLinkIcon /> }, 
	{ id: 12, name: '12. Remove All Reaction', symbol: <OpenLinkIcon /> }, 
];

export const reportMessageList= [
	{ id: 14, name: '14. Report Message', symbol: <OpenLinkIcon /> }
];

export const viewReactionList = [
	{ id: 1, name: '1. View Reactions', symbol: <CopyImageIcon /> },
]

