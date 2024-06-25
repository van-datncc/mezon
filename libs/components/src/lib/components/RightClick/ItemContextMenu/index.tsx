import { messagesActions, referencesActions } from '@mezon/store';
import { RightClickList } from '@mezon/utils';
import { selectMessageIdRightClicked } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { memo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import ItemDetail from '../ItemDetail';
import { handleCopyImage, handleCopyLink, handleOpenLink, handleSaveImage } from './function';

interface IMenuItem {
	item: any;
	urlData: string;
}

const MenuItem: React.FC<IMenuItem> = ({ item, urlData }) => {
	const dispatch = useDispatch();
	const getMessageIdRightClicked = useSelector(selectMessageIdRightClicked);
	const clickItem = () => {
		if (item.name === RightClickList.COPY_IMAGE) {
			return handleCopyImage(urlData);
		}
		if (item.name === RightClickList.SAVE_IMAGE) {
			return handleSaveImage(urlData);
		}
		if (item.name === RightClickList.COPY_LINK) {
			return handleCopyLink(urlData);
		}
		if (item.name === RightClickList.OPEN_LINK) {
			return handleOpenLink(urlData);
		}
		if (item.name === RightClickList.EDIT_MESSAGE) {
			dispatch(referencesActions.setOpenReplyMessageState(false));
			dispatch(referencesActions.setOpenEditMessageState(true));
			dispatch(messagesActions.setOpenOptionMessageState(false));
			dispatch(referencesActions.setIdReferenceMessageEdit(getMessageIdRightClicked));
		}
	};

	return (
		<div>
			{item.name === RightClickList.COPY_LINK ? (
				<CopyToClipboard text={urlData}>
					<ItemDetail item={item} onClick={clickItem} />
				</CopyToClipboard>
			) : (
				<ItemDetail item={item} onClick={clickItem} />
			)}
		</div>
	);
};

export default memo(MenuItem);
