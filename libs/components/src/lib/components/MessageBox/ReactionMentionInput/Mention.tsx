import type React from "react";
import { useCallback, useEffect, useState } from "react";

export interface MentionData {
	id: string;
	display: string;
	src?: string;
	category?: string;
	shortname?: string;
	is_for_sale?: boolean;
	emoji?: string;
	[key: string]: any;
}

export interface MentionState {
	isActive: boolean;
	query: string;
	startPos: number;
	endPos: number;
	suggestions: MentionData[];
	isLoading: boolean;
	selectedIndex: number;
}

export interface MentionProps {
	trigger: string;
	displayPrefix?: string;
	data: MentionData[] | ((query: string) => Promise<MentionData[]>) | ((query: string) => MentionData[]);
	renderSuggestion?: (suggestion: MentionData, search: string, highlightedDisplay: React.ReactNode, index: number, focused: boolean) => React.ReactNode;
	markup?: string;
	displayTransform?: (id: string, display: string) => string;
	regex?: RegExp;
	onAdd?: (id: string, display: string, startPos: number, endPos: number) => void;
	appendSpaceOnAdd?: boolean;
	allowSpaceInQuery?: boolean;
	style?: React.CSSProperties;
	className?: string;
	mentionState?: MentionState;
	onSelect?: (suggestion: MentionData) => void;
	onKeyDown?: (e: React.KeyboardEvent) => boolean;
	suggestionsClassName?: string;
	suggestionStyle?: React.CSSProperties;
	onMouseEnter?: (index: number) => void;
	triggerSelection?: boolean;
	onSelectionTriggered?: () => void;
}

export default function Mention({
	trigger,
	data,
	renderSuggestion,
	markup = `${trigger}[__display__](__id__)`,
	displayTransform,
	onAdd,
	appendSpaceOnAdd = true,
	className = "",
	style,
	mentionState,
	onSelect,
	onKeyDown,
	suggestionsClassName = "",
	suggestionStyle,
	onMouseEnter,
	triggerSelection,
	onSelectionTriggered,
}: MentionProps) {
	const [suggestions, setSuggestions] = useState<MentionData[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const loadSuggestions = useCallback(async (query: string) => {
		if (Array.isArray(data)) {
			const filtered = data
				.filter(item => {
					const display = item.display?.toLowerCase() || '';
					const username = (item as any).username?.toLowerCase() || '';
					const displayName = (item as any).displayName?.toLowerCase() || '';
					const queryLower = query.toLowerCase();

					return display.includes(queryLower) ||
						   username.includes(queryLower) ||
						   displayName.includes(queryLower);
				})
				.slice(0, 10);
			setSuggestions(filtered);
			return;
		}

		if (typeof data === 'function') {
			try {
				setIsLoading(true);
				const result = data(query);
				if (result instanceof Promise) {
					const resolved = await result;
					setSuggestions(resolved.slice(0, 10));
				} else {
					setSuggestions(result.slice(0, 10));
				}
			} catch (error) {
				console.error('Error loading mention suggestions:', error);
				setSuggestions([]);
			} finally {
				setIsLoading(false);
			}
		}
	}, [data]);

	const handleSelect = useCallback((suggestion: MentionData) => {
		onSelect?.(suggestion);
		onAdd?.(suggestion.id, suggestion.display, mentionState?.startPos || 0, mentionState?.endPos || 0);
	}, [onSelect, onAdd, mentionState]);

	useEffect(() => {
		if (mentionState?.isActive && mentionState.query !== undefined) {
			loadSuggestions(mentionState.query);
		} else {
			setSuggestions([]);
			setIsLoading(false);
		}
	}, [mentionState?.isActive, mentionState?.query, loadSuggestions]);

	useEffect(() => {
		if (triggerSelection && mentionState?.isActive && suggestions.length > 0) {
			const selectedSuggestion = suggestions[mentionState.selectedIndex];
			if (selectedSuggestion) {
				handleSelect(selectedSuggestion);
			}
			onSelectionTriggered?.();
		}
	}, [triggerSelection, mentionState?.isActive, mentionState?.selectedIndex, suggestions, handleSelect, onSelectionTriggered]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (!mentionState?.isActive || suggestions.length === 0) {
			return false;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				return true;
			case 'ArrowUp':
				e.preventDefault();
				return true;
			case 'Enter':
			case 'Tab':
				e.preventDefault();
				if (suggestions[mentionState.selectedIndex]) {
					handleSelect(suggestions[mentionState.selectedIndex]);
				}
				return true;
			case 'Escape':
				e.preventDefault();
				return true;
			default:
				return false;
		}
	}, [mentionState, suggestions, handleSelect]);

	if (!mentionState?.isActive) {
		return null;
	}

	if (isLoading) {
		return (
			<div
				className={`mention-dropdown ${suggestionsClassName}`}
				style={suggestionStyle}
			>
				<div className="mention-item mention-loading">Loading...</div>
			</div>
		);
	}

	if (suggestions.length === 0) {
		return null;
	}

	return (
		<div
			className={`mention-dropdown thread-scroll ${className} ${suggestionsClassName}`}
			style={{ ...style, ...suggestionStyle }}
		>
			{suggestions.map((suggestion, index) => {
				const focused = index === (mentionState?.selectedIndex || 0);

				if (renderSuggestion) {
					const query = mentionState?.query || '';
					const highlightedDisplay = suggestion.display.replace(
						new RegExp(`(${query})`, 'gi'),
						'<mark>$1</mark>'
					);

					return (
						<div
							key={suggestion.id}
							onClick={() => handleSelect(suggestion)}
							onMouseEnter={() => onMouseEnter?.(index)}
						>
							{renderSuggestion(
								suggestion,
								query,
								<span dangerouslySetInnerHTML={{ __html: highlightedDisplay }} />,
								index,
								focused
							)}
						</div>
					);
				}

				return (
					<div
						key={suggestion.id}
						className={`mention-item ${focused ? "selected" : ""}`}
						onClick={() => handleSelect(suggestion)}
						onMouseEnter={() => onMouseEnter?.(index)}
					>
						<div className="mention-item-name">{suggestion.display}</div>
					</div>
				);
			})}
		</div>
	);
}
