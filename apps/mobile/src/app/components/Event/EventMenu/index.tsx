import { EventManagementEntity } from "@mezon/store-mobile";
import MezonMenu, { reserve } from "../../../temp-ui/MezonMenu";
import { IMezonMenuSectionProps } from "../../../temp-ui/MezonMenuSection";

interface IEventMenuProps {
    event: EventManagementEntity;
}

export default function EventMenu({ event }: IEventMenuProps) {
    const menu: IMezonMenuSectionProps[] = [
        {
            items: [
                {
                    title: "a",
                    onPress: () => reserve()
                },
                {
                    title: "b",
                    onPress: () => reserve()
                },
                {
                    title: "c",
                    onPress: () => reserve(),
                    textStyle: { color: "red" }
                },
            ]
        }
    ]

    return (
        <MezonMenu menu={menu} />
    )
}