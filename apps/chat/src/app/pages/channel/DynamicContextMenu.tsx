import { ContextMenuItem } from '@mezon/utils';
import { useMemo } from 'react';
import { Menu, Item, Separator, Submenu, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';


type Props = {
  menuId: string;
  items: ContextMenuItem[];
};

export default function DynamicContextMenu({ menuId, items }: Props) {
  
  const children = useMemo(() => {
    const elements: React.ReactNode[] = [];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      elements.push(
        <Item
          key={item.label}
          onClick={item.handleItemClick}
          disabled={item.disabled}
        >
          {item.label}
        </Item>,
      );
      if (index !== items.length - 1) elements.push(<Separator />);
      if (item.hasSubmenu)
        elements.push(
          <Submenu label={item.label}>
            {item.subMenuItems?.map((subMenuItem) => (
              <Item
                key={subMenuItem.label}
                onClick={subMenuItem.handleItemClick}
                disabled={subMenuItem.disabled}
              >
                {subMenuItem.label}
              </Item>
            ))}
          </Submenu>,
        );
    }

    return elements;
  }, [items]);

  return <Menu id={menuId} theme='dark'>{children}</Menu>;
}