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
	{ id: 0, name: 'Add Reaction', symbol: <CopyImageIcon /> },
	{ id: 4, name: 'Reply', symbol: <SaveImageIcon /> },
	{ id: 5, name: 'Create Thread', symbol: <SaveImageIcon /> },
	{ id: 6, name: 'Copy Text', symbol: <CopyLinkIcon /> },
	{ id: 7, name: 'Apps', symbol: <OpenLinkIcon /> },
	{ id: 8, name: 'Mark Unread', symbol: <OpenLinkIcon /> },
	{ id: 9, name: 'Copy Message Link', symbol: <OpenLinkIcon /> },
];

export const pinMessageList = [{ id: 3, name: 'Pin Message', symbol: <SaveImageIcon /> }];

export const speakMessageList = [{ id: 10, name: 'Speak Message', symbol: <OpenLinkIcon /> }];

export const editMessageList = [{ id: 2, name: 'Edit Message', symbol: <CopyImageIcon /> }];

export const deleteMessageList = [{ id: 13, name: 'Delete Message', symbol: <OpenLinkIcon /> }];

export const removeReactionList = [{ id: 11, name: 'Remove Reaction', symbol: <OpenLinkIcon /> }];

export const removeAllReactionList = [{ id: 12, name: 'Remove All Reaction', symbol: <OpenLinkIcon /> }];

export const reportMessageList = [{ id: 14, name: 'Report Message', symbol: <OpenLinkIcon /> }];

export const viewReactionList = [{ id: 1, name: 'View Reactions', symbol: <CopyImageIcon /> }];
