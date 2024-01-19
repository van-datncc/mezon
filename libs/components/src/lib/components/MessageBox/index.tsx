import { IMessage } from "@mezon/utils";
import { useCallback, FocusEvent, useState, ChangeEvent, FormEvent } from "react";

export type MessageBoxProps = {
    onSend: (mes: IMessagePayload) => void;
};

export type IMessagePayload = IMessage & {
    channelId: string;
};

function MessageBox(props: MessageBoxProps) {
    const [content, setContent] = useState("");

    const { onSend } = props;

    const handleSend = useCallback(
        () => {
            if (!content) {
                return;
            }
            onSend({
                content: {},
                id: "",
                channel_id: "",
                body: { text: '' },
                channelId: ''
            });
            setContent("");
        },
        [onSend, content]
    );

    const handleInputChanged = useCallback((event: ChangeEvent | FocusEvent) => {
        const target = event.target as HTMLInputElement;
        setContent(target.value);
    }, []);

    const handleSubmitted = useCallback((event: FormEvent) => {
        event.preventDefault();
        handleSend();
    }, [handleSend]);

    return (
        <div className="flex items-center justify-between p-4 bg-bgSecondary dark:bg-gray-900">
            <form className="flex items-center justify-between flex-grow" onSubmit={handleSubmitted}>
                <textarea
                    id="message"
                    className="flex-grow p-2.5 text-sm text-white bg-bgPrimary rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                    onBlur={handleInputChanged}
                    onChange={handleInputChanged}
                    value={content}
                >
                </textarea>
                <button
                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg focus:ring focus:ring-blue-300 dark:bg-blue-600"
                    type="submit"
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default MessageBox;
