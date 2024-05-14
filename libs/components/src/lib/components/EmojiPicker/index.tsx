import { useChatReaction, useEmojiSuggestion, useGifsStickersEmoji, useReference } from '@mezon/core';
import { EmojiPlaces, IEmoji, IMessageWithUser, SubPanelName } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { useEffect, useRef, useState } from 'react';
import { Icons } from '../../components';

export type EmojiCustomPanelOptions = {
	messageEmoji?: IMessageWithUser;
	emojiAction?: EmojiPlaces;
	mode?: number;
};

function EmojiCustomPanel(props: EmojiCustomPanelOptions) {
	const { emojis, categoriesEmoji } = useEmojiSuggestion();
	const containerRef = useRef<HTMLDivElement>(null);
	const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const dataCategories = categoriesEmoji(emojis);

	const categoryIcons = [
		<Icons.MemberList defaultSize="w-7 h-7" />,
		<Icons.Smile defaultSize="w-7 h-7" />,
		<Icons.GameController defaultSize="w-7 h-7" />,
		<Icons.Heart defaultSize="w-7 h-7" />,
		<Icons.Object defaultSize="w-7 h-7" />,
		<Icons.TheLeaf defaultSize="w-7 h-7" />,
		<Icons.Bicycle defaultSize="w-7 h-7" />,
		<Icons.Bowl defaultSize="w-7 h-7" />,
		<Icons.Ribbon defaultSize="w-7 h-7" />,
	];
	const categoriesWithIcons = dataCategories
		.map((category, index) => ({ name: category, icon: categoryIcons[index] }))
		.filter((category) => category.name !== '' && category.name !== 'Component');

	const {
		reactionMessageDispatch,
		setReactionRightState,
		setReactionBottomState,
		setReactionPlaceActive,
		setUserReactionPanelState,
		setReactionBottomStateResponsive,
	} = useChatReaction();
	const { setReferenceMessage } = useReference();
	const { setSubPanelActive } = useGifsStickersEmoji();
	const { setEmojiSuggestion } = useEmojiSuggestion();
	const [emojiHoverNative, setEmojiHoverNative] = useState<string>('');
	const [emojiHoverShortCode, setEmojiHoverShortCode] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<string>('');

	const handleEmojiSelect = async (emojiPicked: string) => {
		if (props.emojiAction === EmojiPlaces.EMOJI_REACTION || props.emojiAction === EmojiPlaces.EMOJI_REACTION_BOTTOM) {
			await reactionMessageDispatch(
				'',
				props.mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL,
				props.messageEmoji?.id ?? '',
				emojiPicked,
				1,
				props.messageEmoji?.sender_id ?? '',
				false,
			);
			setReactionRightState(false);
			setReactionBottomState(false);
			setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION_NONE);
			setReferenceMessage(null);
			setUserReactionPanelState(false);
			setReactionBottomStateResponsive(false);
		} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
			setEmojiSuggestion(emojiPicked);
			setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION_NONE);
			setSubPanelActive(SubPanelName.NONE);
		}
	};

	const handleOnHover = (emojiHover: IEmoji) => {
		setEmojiHoverNative(emojiHover.emoji);
		setEmojiHoverShortCode(emojiHover.shortname);
	};

	const scrollToCategory = (categoryName: string) => {
		setSelectedCategory(categoryName);
		const categoryDiv = categoryRefs.current[categoryName];
		if (categoryDiv && containerRef.current) {
			categoryDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			if (containerRef.current) {
				const containerTop = containerRef.current.getBoundingClientRect().top;

				let closestCategory = '';
				let minDistance = Number.MAX_VALUE;

				Object.keys(categoryRefs.current).forEach((category) => {
					const ref = categoryRefs.current[category];
					if (ref) {
						const distance = Math.abs(ref.getBoundingClientRect().top - containerTop);
						if (distance < minDistance) {
							minDistance = distance;
							closestCategory = category;
						}
					}
				});
			}
		};

		const container = containerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
			return () => container.removeEventListener('scroll', handleScroll);
		}
	}, []);

	return (
		<div className="flex max-h-full flex-row w-full md:w-[500px]">
			<div className="w-[10%] md:w-[10%] md:max-w-[10%] flex flex-col gap-y-1 max-w-[90%]  md:ml-2 bg-[#1E1F22] mb-2 pt-1 px-1 md:items-start  h-[25rem] pb-1">
				<div className="w-9 h-9  flex flex-row justify-center items-center hover:bg-[#41434A] hover:rounded-md">
					<Icons.Star defaultSize="w-7 h-7" />
				</div>
				<div className="w-9 h-9  flex flex-row justify-center items-center hover:bg-[#41434A] hover:rounded-md">
					<Icons.ClockHistory defaultSize="w-7 h-7" />
				</div>
				<hr className=" bg-gray-200  border w-full" />
				{categoriesWithIcons.map((item, index) => {
					return (
						<button
							key={index}
							className={`w-9 h-9 flex flex-row justify-center items-center ${selectedCategory === item.name ? 'bg-[#41434A]' : 'hover:bg-[#41434A]'} rounded-md`}
							onClick={() => scrollToCategory(item.name)}
						>
							{item.icon}
						</button>
					);
				})}
			</div>
			<div className="flex flex-col">
				<div ref={containerRef} className="w-full max-h-[352px] overflow-y-scroll overflow-x-hidden hide-scrollbar">
					{categoriesWithIcons.map((item, index) => {
						return (
							<div className="w-full" key={item.name} ref={(el) => (categoryRefs.current[item.name] = el)}>
								<DisplayByCategories onEmojiSelect={handleEmojiSelect} onEmojiHover={handleOnHover} categoryName={item.name} />
							</div>
						);
					})}
				</div>
				<div className="w-full min-h-12  bg-[#232428] mb-2 flex flex-row items-center pl-1 gap-x-1 justify-start">
					<span className="text-3xl"> {emojiHoverNative}</span>
					{emojiHoverShortCode}
				</div>
			</div>
		</div>
	);
}

export default EmojiCustomPanel;

type DisplayByCategoriesProps = {
	readonly categoryName: string;
	onEmojiSelect: (emoji: string) => void;
	onEmojiHover: (item: IEmoji) => void;
};

function DisplayByCategories({ categoryName, onEmojiSelect, onEmojiHover }: DisplayByCategoriesProps) {
	const { emojis } = useEmojiSuggestion();
	const getEmojisByCategories = (emojis: IEmoji[], categoryParam: string) => {
		return emojis
			.filter((emoji) => emoji.category.includes(categoryParam))
			.map((emoji) => ({
				...emoji,
				category: emoji.category.replace(/ *\([^)]*\) */g, ''),
			}));
	};
	const emojisByCategoryName = getEmojisByCategories(emojis, categoryName);

	const [emojisPanel, setEmojisPanelStatus] = useState<boolean>(true);

	return (
		<div>
			{categoryName !== '' && (
				<button
					onClick={() => setEmojisPanelStatus(!emojisPanel)}
					className="w-full flex flex-row justify-start items-center pl-1 my-1 py-1 sticky top-0 bg-[#2B2D31] z-10"
				>
					{categoryName}
					<span className={`${emojisPanel ? ' rotate-90' : ''}`}>
						{' '}
						<Icons.ArrowRight />
					</span>
				</button>
			)}
			{emojisPanel && (
				<div className=" grid grid-cols-12 ml-1 gap-1">
					{emojisByCategoryName.map((item, index) => (
						<button
							key={index}
							className="text-2xl emoji-button border rounded-md border-[#363A53] hover:bg-[#41434A] hover:rounded-md w-8 h-8 flex items-center justify-center w-full"
							onClick={() => onEmojiSelect(item.emoji)}
							onMouseEnter={() => onEmojiHover(item)}
						>
							{item.emoji}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
