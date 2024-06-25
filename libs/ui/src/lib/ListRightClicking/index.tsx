import { Icons } from '@mezon/components';

const AddReaction = () => <Icons.RightArrowRightClick />;
const Reply = () => <Icons.ReplyRightClick />;
const CreateThread = () => <Icons.ThreadIconRightClick />;
const CopyText = () => <Icons.CopyTextRightClick />;
const App = () => <Icons.RightArrowRightClick />;
const MarkUnread = () => <Icons.UnreadRightClick />;
const CopyMessageLink = () => <Icons.CopyMessageLinkRightClick />;
const PinMessage = () => <Icons.PinMessageRightClick />;
const SpeakingMessage = () => <Icons.SpeakMessageRightClick />;
const EditMessage = () => <Icons.EditMessageRightClick />;
const DeleteMessage = () => <Icons.DeleteMessageRightClick />;
const RemoveReactions = () => <Icons.RightArrowRightClick />;
const ViewReactions = () => <Icons.ViewReactionRightClick />;
const ReportMessage = () => <Icons.ReportMessageRightClick />;
const ForwardMessage = () => <Icons.ForwardRightClick />;

export const imageList = [
	{ name: 'Copy Image', symbol: <></> },
	{ name: 'Save Image', symbol: <></> },
];

export const linkList = [
	{ name: 'Copy Link', symbol: <></> },
	{ name: 'Open Link', symbol: <></> },
];

export const listClickDefault = [
	{ id: 0, name: 'Add Reaction', symbol: <AddReaction /> },
	{ id: 4, name: 'Reply', symbol: <Reply /> },
	{ id: 5, name: 'Create Thread', symbol: <CreateThread /> },
	{ id: 6, name: 'Copy Text', symbol: <CopyText /> },
	{ id: 7, name: 'Apps', symbol: <App /> },
	{ id: 8, name: 'Mark Unread', symbol: <MarkUnread /> },
	{ id: 9, name: 'Copy Message Link', symbol: <CopyMessageLink /> },
	{ id: 10, name: 'Forward Message', symbol: <ForwardMessage /> },
];

export const pinMessageList = [{ id: 3, name: 'Pin Message', symbol: <PinMessage /> }];

export const speakMessageList = [{ id: 11, name: 'Speak Message', symbol: <SpeakingMessage /> }];

export const editMessageList = [{ id: 2, name: 'Edit Message', symbol: <EditMessage /> }];

export const deleteMessageList = [{ id: 14, name: 'Delete Message', symbol: <DeleteMessage /> }];

export const removeReactionList = [{ id: 12, name: 'Remove Reactions', symbol: <RemoveReactions /> }];

export const removeAllReactionList = [{ id: 13, name: 'Remove All Reactions', symbol: <></> }];

export const reportMessageList = [{ id: 15, name: 'Report Message', symbol: <ReportMessage /> }];

export const viewReactionList = [{ id: 1, name: 'View Reactions', symbol: <ViewReactions /> }];
