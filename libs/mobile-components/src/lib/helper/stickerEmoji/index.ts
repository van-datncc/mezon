import { uploadFile } from "@mezon/transport";
import { Buffer as BufferMobile } from 'buffer';
import { Client, Session } from "mezon-js";
import { ApiMessageAttachment } from "mezon-js/api.gen";

interface IFile {
    uri: string;
    name: string;
    type: string;
    size: number;
    fileData: any;
}

export async function handleUploadEmoticonMobile(client: Client, session: Session, filename: string, file: IFile): Promise<ApiMessageAttachment> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<ApiMessageAttachment>(async function (resolve, reject) {
        try {
            let fileType = file.type;
            if (!fileType) {
                const fileNameParts = file.name.split('.');
                const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
                fileType = `text/${fileExtension}`;
            }

            const arrayBuffer = BufferMobile.from(file.fileData, 'base64');
            if (!arrayBuffer) {
                console.log('Failed to read file data.');
                return;
            }

            resolve(uploadFile(client, session, filename, fileType, Number(file.size) || 0, arrayBuffer, true));
        } catch (error) {
            console.log('handleUploadEmojiStickerMobile Error: ', error);
            reject(new Error(`${error}`));
        }
    });
}