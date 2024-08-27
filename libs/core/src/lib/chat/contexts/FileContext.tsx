import React, { createContext, useContext, useState } from 'react';

interface FileContextType {
	attachmentFiles: Record<string, File[]>;
	addFiles: (channelId: string, files: File[]) => void;
	getFiles: (channelId: string) => File[];
	resetFiles: (channelId: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [attachmentFiles, setAttachmentFiles] = useState<Record<string, File[]>>({});

	const addFiles = (channelId: string, files: File[]) => {
		setAttachmentFiles((prev) => {
			const existingFiles = prev[channelId] || [];
			const updatedFiles = [...existingFiles, ...files];
			return {
				...prev,
				[channelId]: updatedFiles,
			};
		});
	};

	const getFiles = (channelId: string) => {
		return attachmentFiles[channelId] || [];
	};

	const resetFiles = (channelId: string) => {
		setAttachmentFiles((prev) => {
			const updatedFiles = { ...prev };
			delete updatedFiles[channelId];
			return updatedFiles;
		});
	};

	return <FileContext.Provider value={{ attachmentFiles, addFiles, getFiles, resetFiles }}>{children}</FileContext.Provider>;
};

const useFileContext = () => {
	const context = useContext(FileContext);
	if (!context) {
		throw new Error('useFileContext must be used within a FileProvider');
	}
	return context;
};

export { FileProvider, useFileContext };
