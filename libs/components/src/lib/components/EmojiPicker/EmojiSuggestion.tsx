import { selectEmojiState } from "@mezon/store";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export type EmojiSuggestionOptions = {
	emojiResult: string[];
    syntax: string;
    selectedItemIndex: number;
    //ulRef: HTMLUListElement;
};

function EmojiSuggestion({ emojiResult, syntax, selectedItemIndex }: EmojiSuggestionOptions) {

    const emojiPopupState = useSelector(selectEmojiState);
    
    const handleKeyPress = useCallback(() => {

    }, []);

    const clickEmojiSuggestion = useCallback(() => {

    }, []);

    return (
        <div>
            { emojiPopupState && (
            <div tabIndex={1} id="content" className="absolute bottom-[150%] bg-black rounded w-[400px] flex justify-center flex-col">
                <p className=" text-center p-2">Emoji Matching: {syntax}</p>
                <div className={`${emojiResult?.length > 0} ? 'p-2' : '' w-[100%] h-[400px] overflow-y-auto hide-scrollbar`}>
                    <ul
                        //ref={ulRef}
                        className="w-full flex flex-col"
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                e.preventDefault();
                            }
                        }}
                    >
                        {emojiResult?.map((emoji: any, index: number) => (
                            <li
                                //ref={(el) => (liRefs.current[index] = el)}
                                key={emoji.shortcodes}
                                onKeyDown={(e) => handleKeyPress } //(e, emoji.native)}
                                onClick={() => clickEmojiSuggestion }//(emoji.native, index)}
                                className={`hover:bg-gray-900 p-2 cursor-pointer focus:bg-gray-900 focus:outline-none focus:p-2 ${
                                    selectedItemIndex === index ? 'selected-item' : ''
                                }`}
                                tabIndex={0}
                            >
                                {emoji.native} {emoji.shortcodes}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            )} 
        </div>   
    );
}

export default EmojiSuggestion;