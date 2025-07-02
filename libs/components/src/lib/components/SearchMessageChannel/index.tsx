import { selectTheme } from '@mezon/store';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import SearchMessageChannelModal from './SearchMessageChannelModal';
import darkMentionsInputStyle from './StyleSearchMessagesDark';
import lightMentionsInputStyle from './StyleSearchMessagesLight';
import { hasKeySearch } from './constant';
import { SearchMessageChannelProps } from './types';
import { useSearchLogic } from './useSearchLogic';

const SearchMessageChannel = ({ mode }: SearchMessageChannelProps) => {
	const appearanceTheme = useSelector(selectTheme);

	const {
		expanded,
		isShowSearchMessageModal,
		isShowSearchOptions,
		valueDisplay,
		inputRef,
		searchRef,
		channelId,
		currentClanId,
		searchedRequest,
		valueInputSearch,
		handleInputClick,
		handleChange,
		handleKeyDown,
		handleClose,
		handleClickSearchOptions,
		setIsShowSearchOptions
	} = useSearchLogic(mode);

	return (
		<div className="relative hidden sbm:block " ref={inputRef}>
			<SearchBar
				expanded={expanded}
				valueInputSearch={valueInputSearch}
				valueDisplay={valueDisplay}
				channelId={channelId}
				mode={mode}
				currentClanId={currentClanId ?? undefined}
				searchedRequest={searchedRequest}
				appearanceTheme={appearanceTheme}
				lightMentionsInputStyle={lightMentionsInputStyle}
				darkMentionsInputStyle={darkMentionsInputStyle}
				searchRef={searchRef}
				onInputClick={handleInputClick}
				onKeyDown={handleKeyDown}
				onChange={handleChange}
				onClose={handleClose}
				setIsShowSearchOptions={setIsShowSearchOptions}
			/>
			{isShowSearchMessageModal && !hasKeySearch(valueInputSearch ?? '') && (
				<SearchMessageChannelModal
					theme={appearanceTheme}
					hasKeySearch={hasKeySearch(valueInputSearch ?? '')}
					valueInputSearch={valueInputSearch}
					valueDisplay={valueDisplay}
					isShowSearchOptions={isShowSearchOptions}
					onClickSearchOptions={handleClickSearchOptions}
				/>
			)}
		</div>
	);
};

export default memo(SearchMessageChannel, (prevProps, nextProps) => {
	return prevProps.mode === nextProps.mode;
});
