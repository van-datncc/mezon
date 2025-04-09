import { RequestInput } from '@mezon/utils';
import { useCallback, useState } from 'react';

export interface HistoryItem {
	valueTextInput: string;
	content: string;
	mentionRaw: any[];
}

export interface UseUndoRedoHistoryProps {
	updateDraft: (draftContent: Partial<RequestInput>) => void;
	draftRequest: RequestInput | null | undefined;
}

export const useUndoRedoHistory = ({ updateDraft, draftRequest }: UseUndoRedoHistoryProps) => {
	const [undoHistory, setUndoHistory] = useState<HistoryItem[]>([]);
	const [redoHistory, setRedoHistory] = useState<HistoryItem[]>([]);

	const addToUndoHistory = useCallback(() => {
		if (!draftRequest) return;

		setUndoHistory((prevUndoHistory) => [
			...prevUndoHistory,
			{
				valueTextInput: draftRequest.valueTextInput || '',
				content: draftRequest.content || '',
				mentionRaw: draftRequest.mentionRaw || []
			}
		]);

		setRedoHistory([]);
	}, [draftRequest]);

	const undo = useCallback(() => {
		if (undoHistory.length > 0) {
			const { valueTextInput, content, mentionRaw } = undoHistory[undoHistory.length - 1];

			setRedoHistory((prevRedoHistory) => [
				{
					valueTextInput: draftRequest?.valueTextInput || '',
					content: draftRequest?.content || '',
					mentionRaw: draftRequest?.mentionRaw || []
				},
				...prevRedoHistory
			]);

			setUndoHistory((prevUndoHistory) => prevUndoHistory.slice(0, prevUndoHistory.length - 1));

			updateDraft({
				valueTextInput,
				content,
				mentionRaw
			});
		}
	}, [undoHistory, draftRequest, updateDraft]);

	const redo = useCallback(() => {
		if (redoHistory.length > 0) {
			const { valueTextInput, content, mentionRaw } = redoHistory[0];

			setUndoHistory((prevUndoHistory) => [
				...prevUndoHistory,
				{
					valueTextInput: draftRequest?.valueTextInput || '',
					content: draftRequest?.content || '',
					mentionRaw: draftRequest?.mentionRaw || []
				}
			]);

			setRedoHistory((prevRedoHistory) => prevRedoHistory.slice(1));

			updateDraft({
				valueTextInput,
				content,
				mentionRaw
			});
		}
	}, [redoHistory, draftRequest, updateDraft]);

	const handleUndoRedoShortcut = useCallback(
		(event: React.KeyboardEvent) => {
			const { key, ctrlKey, metaKey } = event;

			if ((ctrlKey || metaKey) && (key === 'z' || key === 'Z')) {
				event.preventDefault();
				undo();
			} else if ((ctrlKey || metaKey) && (key === 'y' || key === 'Y')) {
				event.preventDefault();
				redo();
			}
		},
		[undo, redo]
	);

	return {
		undoHistory,
		redoHistory,
		addToUndoHistory,
		undo,
		redo,
		handleUndoRedoShortcut
	};
};
