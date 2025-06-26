import { searchMentionsHashtag } from '@mezon/utils';
import { memo, useCallback } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { UserMentionList } from '../UserMentionList';
import SelectGroup from './SelectGroup';
import SelectItemUser from './SelectItemUser';
import { HasOption, SearchInputProps, UserMentionData } from './types';

const HAS_OPTIONS: HasOption[] = [
	{ id: 'video', display: 'video' },
	{ id: 'link', display: 'link' },
	{ id: 'image', display: 'image' }
];

const SearchInput = ({
	channelId,
	mode,
	valueInputSearch,
	valueDisplay,
	appearanceTheme,
	lightMentionsInputStyle,
	darkMentionsInputStyle,
	searchRef,
	onInputClick,
	onKeyDown,
	onChange,
	setIsShowSearchOptions
}: SearchInputProps) => {
	const userListData = UserMentionList({
		channelID: channelId,
		channelMode: mode
	});

	const userListDataSearchByMention: UserMentionData[] = userListData.map((user) => ({
		id: String(user?.id ?? ''),
		display: user?.username ?? '',
		avatarUrl: user?.avatarUrl ?? '',
		subDisplay: user?.display ?? ''
	}));

	const handleSearchUserMention = useCallback(
		(search: string, callback: any) => {
			callback(searchMentionsHashtag(search, userListDataSearchByMention));
		},
		[userListDataSearchByMention]
	);

	const renderSuggestionsContainer = useCallback(
		(children: any) => (
			<div
				className={`absolute left-0 top-10 pb-3 ${valueInputSearch ? 'pt-0' : 'pt-3'} rounded dark:bg-bgProfileBody bg-bgLightPrimary z-[9999] w-widthModalSearch min-h-heightModalSearch shadow`}
			>
				{valueInputSearch && (
					<div className="first:mt-0 mt-3 p-3 rounded-t dark:bg-bgSecondary600 border-b border-borderDivider last:border-b-0 last:bottom-b-0">
						<div className="flex items-center justify-between">
							<div className="flex flex-row items-center flex-1 overflow-x-hidden">
								<h3 className="text-xs font-medium text-textLightTheme dark:text-textPrimary uppercase mr-1 flex-shrink-0">
									Search for:
								</h3>
								<p className="text-sm font-semibold w-full mr-[10px] whitespace-normal text-ellipsis overflow-x-hidden">
									{valueDisplay}
								</p>
							</div>
							<button className="px-1 h-5 w-10 text-xs text-textLightTheme dark:text-textPrimary font-semibold rounded bg-borderDividerLight dark:bg-borderDividerLight">
								Enter
							</button>
						</div>
					</div>
				)}
				<SelectGroup groupName="From user">{children}</SelectGroup>
			</div>
		),
		[valueInputSearch, valueDisplay]
	);

	return (
		<MentionsInput
			inputRef={searchRef as any}
			placeholder="Search"
			value={valueInputSearch ?? ''}
			style={appearanceTheme === 'light' ? lightMentionsInputStyle : darkMentionsInputStyle}
			onChange={onChange}
			className="none-draggable-area w-full mr-[10px] dark:bg-transparent bg-transparent text-theme-primary rounded-md focus-visible:!border-0 focus-visible:!outline-none focus-visible:[&>*]:!outline-none"
			allowSpaceInQuery={true}
			singleLine={true}
			onClick={onInputClick}
			onKeyDown={onKeyDown}
			customSuggestionsContainer={renderSuggestionsContainer as any}
		>
			<Mention
				markup="has:[__display__](__id__)"
				appendSpaceOnAdd={true}
				data={HAS_OPTIONS}
				trigger="has:"
				displayTransform={(id: string, display: string) => `has:${display}`}
				renderSuggestion={(suggestion: any, search: any, highlightedDisplay: any, index: any, focused: any) => (
					<SelectItemUser search={search} isFocused={focused} title="has: " content={suggestion.display} key={suggestion.id} />
				)}
				className="dark:bg-[#3B416B] bg-bgLightModeButton"
			/>

			<Mention
				markup="from:[__display__](__id__)"
				appendSpaceOnAdd={true}
				data={handleSearchUserMention}
				trigger="from:"
				displayTransform={(id: string, display: string) => `from:${display}`}
				renderSuggestion={(suggestion: any, search: any, highlightedDisplay: any, index: any, focused: any) => (
					<SelectItemUser
						search={search}
						isFocused={focused}
						title="from: "
						content={suggestion.display}
						onClick={() => setIsShowSearchOptions('')}
					/>
				)}
				className="dark:bg-[#3B416B] bg-bgLightModeButton"
			/>

			<Mention
				markup="mention:[__display__](__id__)"
				appendSpaceOnAdd={true}
				data={userListDataSearchByMention}
				trigger="mentions:"
				displayTransform={(id: string, display: string) => `mentions:${display}`}
				renderSuggestion={(suggestion: any, search: any, highlightedDisplay: any, index: any, focused: any) => (
					<SelectItemUser
						search={search}
						isFocused={focused}
						title="mentions: "
						content={suggestion.display}
						onClick={() => setIsShowSearchOptions('')}
					/>
				)}
				className="dark:bg-[#3B416B] bg-bgLightModeButton"
			/>
		</MentionsInput>
	);
};

export default memo(SearchInput);
