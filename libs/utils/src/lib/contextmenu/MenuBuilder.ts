import { ItemParams } from "react-contexify";

type ConditionValue = boolean | (() => boolean) | undefined | null | number | string;

export type ContextMenuItem = {
    label: string;
    icon?: React.ReactNode;
    id?: string;
    subMenuItems?: ContextMenuItem[];
    hasSubmenu?: boolean;
    disabled?: boolean;
    handleItemClick?: (args: ItemParams<any, any>) => void;
  };

export class MenuBuilder {
  private items: ContextMenuItem[] = [];

  addMenuItem(id: string, label: string, handleItemClick?: () => void, icon?: any, disabled = false): MenuBuilder {
    this.items.push(this.craftMenuItem(id, label, handleItemClick, icon, disabled));
    return this;
  }

  addSeparator(): MenuBuilder {
    this.items.push(this.craftMenuItem('separator', 'separator'));
    return this;
  }

  removeMenuItem(id: string): MenuBuilder {
    this.items = this.items.filter((item) => item.id !== id);
    return this;
  }

  when(condition: ConditionValue, callback: (builder: MenuBuilder) => void): MenuBuilder {
    if (condition) {
      callback(this);
    }
    return this;
  }

  build(): ContextMenuItem[] {
    return this.items;
  }

  private craftMenuItem(id: string, label: string, handleItemClick?: () => void, icon?: any, disabled = false): ContextMenuItem {
    const clickHandler = handleItemClick || (() => console.log('No handler for this item'));
    return {
      label,
      id,
      icon,
      handleItemClick: clickHandler,
      disabled,
    };
  }
}