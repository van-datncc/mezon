import { createUploadFilePath, uploadFile } from "@mezon/transport";
import { Buffer as BufferMobile } from 'buffer';
import { Client, Session } from "mezon-js";
import { ApiMessageAttachment } from "mezon-js/api.gen";
import RNFS from 'react-native-fs';

export async function handleUploadAttachmentMobile(
    client: Client,
    session: Session,
    currentClanId: string,
    currentChannelId: string,
    file: {
        path: string,
        name: string,
        type: string,
        size: number
    }
): Promise<ApiMessageAttachment> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<ApiMessageAttachment>(async function (resolve, reject) {
        try {
            const fileType = file.type || "text/plainText";
            const filePath = file.path || "";
            const fileName = file.name || "";

            const fileData = await RNFS.readFile(filePath, 'base64');
            const arrayBuffer = BufferMobile.from(fileData, 'base64');

            if (!arrayBuffer) {
                console.log('Failed to read file data.');
                return;
            }

            const { filePath: fullFilename } = createUploadFilePath(session, currentClanId, currentChannelId, fileName);
            resolve(uploadFile(client, session, fullFilename, fileType, file.size, arrayBuffer, true));
        }
        catch (error) {
            console.log('handleUploadFileMobile Error: ', error);
            reject(new Error(`${error}`));
        }
    });
};