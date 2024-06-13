import Toast from "react-native-toast-message";
import MezonMenuSection, { IMezonMenuSectionProps } from "../MezonMenuSection";

interface IMezonMenu {
    menu: IMezonMenuSectionProps[];
}

export default function MezonMenu({ menu }: IMezonMenu) {
    return menu.map((item, index) =>
        <MezonMenuSection
            key={index.toString()}
            {...item}
        />
    )
}

export const reserve = () => {
    Toast.show({
        type: 'info',
        text1: 'Coming soon'
    });
}