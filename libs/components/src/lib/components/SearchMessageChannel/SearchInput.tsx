import { searchMentionsHashtag } from '@mezon/utils';
import { memo, useCallback, useState } from 'react';
import { Mention as MentionComponent, MentionsInput as MentionsInputComponent } from 'react-mentions';
import { UserMentionList } from '../UserMentionList';
import SelectGroup from './SelectGroup';
import SelectItemUser from './SelectItemUser';
import { HasOption, SearchInputProps } from './types';

const MentionsInput = MentionsInputComponent as any;
const Mention = MentionComponent as any;

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

	const [valueHighlight, setValueHighlight] = useState<string>('');

	const handleSearchUserMention = useCallback(
		(search: string, callback: any) => {
			setValueHighlight(search);
			const results = searchMentionsHashtag(search, userListData || []);
			callback(results.length > 0 ? results : userListData || []);
		},
		[userListData]
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
			style={{
				...(appearanceTheme === 'light' ? lightMentionsInputStyle : darkMentionsInputStyle),
				suggestions: {
					...(appearanceTheme === 'light' ? lightMentionsInputStyle.suggestions : darkMentionsInputStyle.suggestions),
					width: '100%',
					left: '0px'
				}
			}}
			onChange={onChange}
			className="none-draggable-area w-full mr-[10px] dark:bg-transparent bg-transparent text-theme-primary rounded-md focus-visible:!border-0 focus-visible:!outline-none focus-visible:[&>*]:!outline-none"
			allowSpaceInQuery={true}
			singleLine={true}
			onClick={onInputClick}
			onKeyDown={onKeyDown}
			customSuggestionsContainer={renderSuggestionsContainer as any}
		>
			{/* From user filter: > */}
			<Mention
				markup=">[__display__](__id__)"
				appendSpaceOnAdd={true}
				data={handleSearchUserMention}
				trigger=">"
				displayTransform={(id: string, display: string) => `from:${display}`}
				renderSuggestion={(suggestion: any, search: any, highlightedDisplay: any, index: any, focused: any) => (
					<SelectItemUser
						search={valueHighlight}
						isFocused={focused}
						title="from: "
						content={suggestion.display}
						onClick={() => setIsShowSearchOptions('')}
					/>
				)}
				className="dark:bg-[#3B416B] bg-bgLightModeButton"
			/>

			<Mention
				markup="~[__display__](__id__)"
				appendSpaceOnAdd={true}
				data={handleSearchUserMention}
				trigger="~"
				displayTransform={(id: string, display: string) => `mentions:${display}`}
				renderSuggestion={(suggestion: any, search: any, highlightedDisplay: any, index: any, focused: any) => (
					<SelectItemUser
						search={valueHighlight}
						isFocused={focused}
						title="mentions: "
						content={suggestion.display}
						onClick={() => setIsShowSearchOptions('')}
					/>
				)}
				className="dark:bg-[#3B416B] bg-bgLightModeButton"
			/>

			<Mention
				markup="&[__display__](__id__)"
				appendSpaceOnAdd={true}
				data={HAS_OPTIONS}
				trigger="&"
				displayTransform={(id: string, display: string) => `has:${display}`}
				renderSuggestion={(suggestion: any, search: any, highlightedDisplay: any, index: any, focused: any) => (
					<SelectItemUser search={search} isFocused={focused} title="has: " content={suggestion.display} key={suggestion.id} />
				)}
				className="dark:bg-[#3B416B] bg-bgLightModeButton"
			/>
		</MentionsInput>
	);
};

export default memo(SearchInput);
