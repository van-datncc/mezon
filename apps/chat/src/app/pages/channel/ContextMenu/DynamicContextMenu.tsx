import { selectTheme } from '@mezon/store';
import { ContextMenuItem } from '@mezon/utils';
import { CSSProperties, useMemo, useState } from 'react';
import { Item, Menu, Separator, Submenu } from 'react-contexify';
// import 'react-contexify/dist/ReactContexify.css';
import { useSelector } from 'react-redux';
import ReactionPart from './ReactionPart';

type Props = {
	menuId: string;
	items: ContextMenuItem[];
	mode: number | undefined;
	messageId: string;
};

export default function DynamicContextMenu({ menuId, items, mode, messageId }: Props) {
	const appearanceTheme = useSelector(selectTheme);
	const emojiList = [':anhan:', , ':100:', ':rofl:', ':verify:'];
	const [warningStatus, setWarningStatus] = useState<string>('');

	//red: #E83247
	//gray: #ADB3B9
	const className: CSSProperties = {
		'--contexify-menu-bgColor': '#111214',
		'--contexify-item-color': '#ADB3B9',
		'--contexify-activeItem-color': '#FFFFFF',
		'--contexify-activeItem-bgColor': warningStatus,
		'--contexify-rightSlot-color': '#6f6e77',
		'--contexify-activeRightSlot-color': '#fff',
		'--contexify-arrow-color': '#6f6e77',
		'--contexify-activeArrow-color': '#fff',
		'--contexify-itemContent-padding': '3px',
		'--contexify-menu-radius': '2px',
		'--contexify-activeItem-radius': '2px',
		'--contexify-menu-minWidth': '188px',
	} as CSSProperties;

	const children = useMemo(() => {
		const elements: React.ReactNode[] = [];
		for (let index = 0; index < items.length; index++) {
			const item = items[index];
			const lableItemWarning = item.label === 'Delete Message' || item.label === 'Report Message';
			if (items[index].label === 'Copy Link') elements.push(<Separator key={`separator-${index}`} />);
			elements.push(
				<Item
					key={item.label}
					onClick={item.handleItemClick}
					disabled={item.disabled}
					onMouseEnter={() => {
						if (lableItemWarning) {
							setWarningStatus('#E13542');
						} else {
							setWarningStatus('#4B5CD6');
						}
					}}
					onMouseLeave={() => {
						setWarningStatus('#4B5CD6');
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
							fontFamily: `'gg sans', 'Noto Sans', sans-serif`,
							fontSize: '14px',
							fontWeight: 500,
						}}
					>
						<span>{item.label}</span>
						<span> {item.icon}</span>
					</div>
				</Item>,
			);

			if (item.hasSubmenu)
				elements.push(
					<Submenu label={item.label}>
						{item.subMenuItems?.map((subMenuItem) => (
							<Item key={subMenuItem.id} onClick={subMenuItem.handleItemClick} disabled={subMenuItem.disabled}>
								{subMenuItem.label}
							</Item>
						))}
					</Submenu>,
				);
		}
		return elements;
	}, [items]);

	return (
		<Menu id={menuId} style={appearanceTheme === 'light' ? className : className}>
			<ReactionPart emojiList={emojiList} activeMode={mode} messageId={messageId} />
			{children}
		</Menu>
	);
}
