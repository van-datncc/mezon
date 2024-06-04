import { Icons } from '@mezon/components';
import { useClans, useSearchMessages } from '@mezon/core';
import { messagesActions, useAppDispatch } from '@mezon/store';
import { UserSearchDataProps } from '@mezon/utils';
import { ApiSearchMessageRequest } from 'mezon-js/api.gen';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Mention, MentionsInput, OnChangeHandlerFunc } from 'react-mentions';
import SelectGroup from './SelectGroup';
import SelectItem from './SelectItem';
import darkMentionsInputStyle from './StyleSearchMessages';

const SearchMessageChannel = () => {
	const dispatch = useAppDispatch();

	const { searchMessages } = useSearchMessages();
	const { listUserSearch } = useClans();

	const [test, setTest] = useState<UserSearchDataProps[] | []>([]);

	const [expanded, setExpanded] = useState(false);
	const [isss, setIsss] = useState(false);
	const [isShowSearchMessageModal, setIsShowSearchMessageModal] = useState(false);
	const [value, setValue] = useState<string>('');
	const [search, setSearch] = useState<ApiSearchMessageRequest | undefined>();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleInputClick = () => {
		setExpanded(true);
		setIsss(true);
		setTest(listUserSearch);
		setIsShowSearchMessageModal(true);
	};

	const handleOutsideClick = (event: MouseEvent) => {
		const targetIsOutside = inputRef.current && !inputRef.current.contains(event.target as Node);

		if (targetIsOutside && !value) {
			setExpanded(false);
			setIsShowSearchMessageModal(false);
		}
		if (targetIsOutside && value) {
			setIsShowSearchMessageModal(false);
		}
	};

	const handleChange: OnChangeHandlerFunc = (event, newValue, newPlainTextValue, mentions) => {
		const value = event.target.value;
		setValue(value);
		setSearch({ ...search, filters: [{ field_name: 'content', field_value: value }], from: 0, size: 10 });
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>) => {
		if (value && event.key === 'Enter') {
			setTest([]);
			setIsShowSearchMessageModal(false);
			dispatch(messagesActions.setIsSearchMessage(true));
			if (search) {
				searchMessages(search);
			}
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [value]);

	return (
		<div className="relative" ref={inputRef}>
			<div
				className={`transition-all duration-300 ${
					expanded ? 'w-80' : 'w-40'
				} h-8 pl-2 pr-2 py-3 dark:bg-bgTertiary bg-bgLightTertiary rounded items-center inline-flex`}
			>
				<MentionsInput
					placeholder="Search"
					value={value ?? ''}
					style={darkMentionsInputStyle}
					onChange={handleChange}
					className="w-full mr-[10px] dark:bg-transparent bg-transparent dark:text-white text-colorTextLightMode rounded-md focus-visible:!border-0 focus-visible:!outline-none focus-visible:[&>*]:!outline-none"
					allowSpaceInQuery={true}
					singleLine={true}
					onClick={handleInputClick}
					onKeyDown={handleKeyDown}
					customSuggestionsContainer={(children: React.ReactNode) => {
						return (
							<div
								className={`absolute left-0 top-10 pb-3 ${value ? 'pt-0' : 'pt-3'} rounded dark:bg-bgProfileBody bg-bgLightPrimary z-[9999] w-widthModalSearch min-h-heightModalSearch`}
							>
								{value && (
									<div className="first:mt-0 mt-3 p-3 rounded-t dark:bg-bgSecondary600 border-b border-borderDivider last:border-b-0 last:bottom-b-0">
										<div className="flex items-center justify-between">
											<div className="flex flex-row items-center flex-1 overflow-x-hidden">
												<h3 className="text-xs font-medium uppercase mr-1 flex-shrink-0">Search for:</h3>
												<p className="text-sm font-semibold w-full mr-[10px] whitespace-normal text-ellipsis overflow-x-hidden">
													{value}
												</p>
											</div>
											<button className="px-1 h-5 w-10 text-xs font-semibold rounded bg-borderDividerLight">Enter</button>
										</div>
									</div>
								)}
								{isShowSearchMessageModal && <SelectGroup groupName="From user">{children}</SelectGroup>}
								{children}
							</div>
						);
					}}
				>
					<Mention
						appendSpaceOnAdd={true}
						data={listUserSearch ?? []}
						trigger="from:"
						displayTransform={(id: any, display: any) => {
							return `from:${display}`;
						}}
						renderSuggestion={(suggestion) => {
							return <SelectItem title="from: " content={suggestion.display} />;
						}}
						className="dark:bg-[#3B416B] bg-bgLightModeButton"
					/>
				</MentionsInput>
			</div>
			<div className="w-5 h-6 flex flex-row items-center pl-1 absolute right-1 bg-transparent top-1/2 transform -translate-y-1/2">
				<Icons.Search />
			</div>
		</div>
	);
};

export default SearchMessageChannel;
