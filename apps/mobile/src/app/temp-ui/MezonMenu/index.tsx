import MezonMenuSection, { IMezonMenuSectionProps } from "../MezonMenuSection";

interface IMezonMenu {
    menu: IMezonMenuSectionProps[];
}

export default function MezonMenu({ menu }: IMezonMenu) {
    return menu.map((item, index) =>
        <MezonMenuSection
            key={index.toString()}
            title={item?.title}
            items={item.items}
        />
    )
}