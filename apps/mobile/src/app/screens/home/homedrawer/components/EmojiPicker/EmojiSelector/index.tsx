
import { BicycleIcon, BowlIcon, GameControllerIcon, HeartIcon, LeafIcon, MemberListIcon, ObjectIcon, RibbonIcon, SmilingFaceIcon } from "@mezon/mobile-components";
import { ScrollView } from "react-native-gesture-handler";
import styles from "./styles";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { IEmoji } from "@mezon/utils";
import { useEmojiSuggestion, useGifsStickersEmoji } from "@mezon/core";
import { useEffect } from "react";
import { Colors } from "@mezon/mobile-ui";

type EmojiSelectorProps = {
    onSelected: (url: string) => void;
    searchText: string;
};

const cateIcon = [
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
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [emojisSearch, setEmojiSearch] = useState<IEmoji[]>();
    const { valueInputToCheckHandleSearch } = useGifsStickersEmoji();
    const { categoriesEmoji, emojiListPNG, setEmojiSuggestion } = useEmojiSuggestion();

    const searchEmojis = (emojis: any[], searchTerm: string) => {
        return emojis.filter((emoji) => emoji.shortname.includes(searchTerm));
    };

    const categoriesWithIcons = categoriesEmoji.map((category, index) => ({ name: category, icon: cateIcon[index] }));

    useEffect(() => {
        if (valueInputToCheckHandleSearch !== '') {
            const result = searchEmojis(emojiListPNG, valueInputToCheckHandleSearch ?? '');
            setEmojiSearch(result);
            console.log(result);
        }
    }, [valueInputToCheckHandleSearch]);

    const handleEmojiSelect = async (emojiPicked: string) => {
        setEmojiSuggestion(emojiPicked);
    };

    return (
        <>
            <ScrollView horizontal contentContainerStyle={styles.cateContainer}>
                {categoriesWithIcons.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => { console.log("heheheh") }}
                        style={{
                            ...styles.cateItem,
                            backgroundColor: item.name === selectedCategory ? Colors.green : 'transparent'
                        }}>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>
    )
}