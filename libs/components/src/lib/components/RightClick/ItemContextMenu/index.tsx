import { RightClickList } from '@mezon/utils';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ItemDetail } from '../ItemDetail';
import { handleCopyImage, handleCopyLink, handleOpenLink, handleSaveImage } from './function';

interface IMenuItem {
	item: any;
	urlData: string;
}

const MenuItem: React.FC<IMenuItem> = ({ item, urlData }) => {
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

export default MenuItem;
