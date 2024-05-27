
import { MemberListIcon, SmilingFaceIcon } from "@mezon/mobile-components";
import { BicycleIcon, BowlIcon, GameControllerIcon, HeartIcon, LeafIcon, ObjectIcon, RibbonIcon } from "libs/mobile-components/src/lib/icons";
import { ScrollView } from "react-native-gesture-handler";
import styles from "./styles";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

type EmojiSelectorProps = {
    onSelected: (url: string) => void;
    searchText: string;
};

const cate = [
    <MemberListIcon />,
    <SmilingFaceIcon height={24} width={24} />,
    <GameControllerIcon />,
    <HeartIcon />,
    <ObjectIcon />,
    <LeafIcon />,
    <BicycleIcon />,
    <BowlIcon />,
    <RibbonIcon />,
    <MemberListIcon />,
    <SmilingFaceIcon height={24} width={24} />,
    <GameControllerIcon />,
    <HeartIcon />,
    <ObjectIcon />,
    <LeafIcon />,
    <BicycleIcon />,
    <BowlIcon />,
    <RibbonIcon />
]

export default function EmojiSelector({ }: EmojiSelectorProps) {
    return (
        <>
            <ScrollView horizontal contentContainerStyle={styles.cateContainer}>
                {cate.map((item, index) => (
                    <TouchableOpacity
                        key={index} style={styles.cateItem}>
                        {item}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>
    )
}