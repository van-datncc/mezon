import { emojiActions, selectEmojiState, useAppDispatch } from "@mezon/store";
import { SearchIndex } from "emoji-mart";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export type EmojiSuggestionOptions = {
    handleEmojiClick: (emoji: string) => void;
    onFocusEditorState: () => void;
};

function EmojiSuggestion({ handleEmojiClick, onFocusEditorState }: EmojiSuggestionOptions) {

    const emojiPopupState = useSelector(selectEmojiState);
    const dispatch = useAppDispatch();

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
	const liRefs = useRef<(HTMLLIElement | null)[]>([]);
	const ulRef = useRef<HTMLUListElement | null>(null);
	const [clicked, setClicked] = useState<boolean>(false);
    const [selectionToEnd, setSelectionToEnd] = useState(false);

    const setIsOpenEmojiChatBoxSuggestion = useCallback((state: boolean) => {
        dispatch(emojiActions.setEmojiChatBoxSuggestionSate(state));
    }, [dispatch]);
    
	useEffect(() => {
		if (liRefs.current[selectedItemIndex]) {
			liRefs?.current[selectedItemIndex]?.focus();
		}

		emojiResult.length > 0 ? setIsOpenEmojiChatBoxSuggestion(true) : setIsOpenEmojiChatBoxSuggestion(false);
	}, [selectedItemIndex, setIsOpenEmojiChatBoxSuggestion]);
    
    const [emojiResult, setEmojiResult] = useState<string[]>([]);
	function clickEmojiSuggestion(emoji: string, index: number) {
		setSelectedItemIndex(index);
		handleEmojiClick(emoji);
		setEditorState((prevEditorState) => {
			const currentContentState = prevEditorState.getCurrentContent();
			const raw = convertToRaw(currentContentState);
			const messageRaw = raw.blocks;
			const emojiPicker = messageRaw[0].text.toString();
			const regexEmoji = /:[^\s]+(?=$|[\p{Emoji}])/gu;
			const emojiArray = Array.from(emojiPicker.matchAll(regexEmoji), (match) => match[0]);
			const lastEmoji = emojiArray[0]?.slice(syntax.length);
			const blockMap = editorState.getCurrentContent().getBlockMap();
			const selectionsToReplace: SelectionState[] = [];
			const findWithRegex = (regex: RegExp, contentBlock: Draft.ContentBlock | undefined, callback: (start: number, end: number) => void) => {
				const text = contentBlock?.getText() || '';
				let matchArr, start, end;
				while ((matchArr = regex.exec(text)) !== null) {
					start = matchArr.index;
					end = start + matchArr[0].length;
					callback(start, end);
				}
			};

			blockMap.forEach((contentBlock) => {
				findWithRegex(regexEmoji, contentBlock, (start: number, end: number) => {
					const blockKey = contentBlock?.getKey();
					const blockSelection = SelectionState.createEmpty(blockKey ?? '').merge({
						anchorOffset: start,
						focusOffset: end,
					});

					selectionsToReplace.push(blockSelection);
				});
			});
			let contentState = editorState.getCurrentContent();
			selectionsToReplace.forEach((selectionState: SelectionState) => {
				contentState = Modifier.replaceText(contentState, selectionState, lastEmoji ?? '�️');
			});
			onFocusEditorState();
			const newEditorState = EditorState.push(prevEditorState, contentState, 'insert-characters');
			return newEditorState;
		});
	}

	const [syntax, setSyntax] = useState<string>('');
	const regexDetect = /:[^\s]{2,}/;
	const handleDetectEmoji = async (value: string) => {
		const inputValue = value;
		if (!regexDetect.test(inputValue)) {
			setEmojiResult([]);
			setIsOpenEmojiChatBoxSuggestion(false);
			return;
		}
		const matches = regexDetect.exec(inputValue)?.[0];
		matches && setSyntax(matches);
		const emojiPickerActive = matches?.startsWith(':');
		const lastEmojiIdx = emojiPickerActive ? inputValue.lastIndexOf(':') : null;
		const emojiSearch = emojiPickerActive ? inputValue.slice(Number(lastEmojiIdx)) : null;
		const emojiSearchWithOutPrefix = emojiSearch?.slice(1);
		let emojiResults = (await SearchIndex.search(emojiSearch)) || [];
		if (emojiResults.length === 0) {
			emojiResults = await SearchIndex.search(emojiSearchWithOutPrefix);
		}

		const results =
			emojiResults.map((emoji: any) => {
				return emoji.skins[0];
			}) || [];
		if (results) {
			setShowPlaceHolder(false);
            dispatch(emojiActions.set)
			setEmojiResult(results);
			moveSelectionToEnd();
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent, native: string) => {
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				setSelectedItemIndex((prevIndex) => Math.min(liRefs.current.length - 1, prevIndex - 1));
				liRefs?.current[selectedItemIndex]?.focus();
				setClicked(!clicked);
				break;
			case 'ArrowDown':
				e.preventDefault();
				setSelectedItemIndex((prevIndex) => Math.min(liRefs.current.length - 1, prevIndex + 1));
				liRefs?.current[selectedItemIndex]?.focus();
				setClicked(!clicked);
				break;
			case 'Enter':
				clickEmojiSuggestion(native as string, selectedItemIndex);
				setTimeout(() => {
					editorRef.current!.focus();
				}, 0);

				break;
			case 'Escape':
				setIsOpenEmojiChatBoxSuggestion(false);
				setEmojiResult([]);
				break;
			case 'Backscape':
				setIsOpenEmojiChatBoxSuggestion(false);
				setTimeout(() => {
					editorRef.current!.focus();
				}, 0);
				moveSelectionToEnd();
				break;
			default:
				editorRef.current!.focus();
				setSelectionToEnd(!selectionToEnd);
				break;
		}
	};

	useEffect(() => {
		handleDetectEmoji(content);
		liRefs?.current[selectedItemIndex]?.focus();
	}, [content]);


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