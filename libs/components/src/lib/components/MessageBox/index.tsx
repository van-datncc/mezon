import { IMessage } from '@mezon/utils';
import {
  useCallback,
  FocusEvent,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import * as Icons from '../Icons';

export type MessageBoxProps = {
  onSend: (mes: IMessagePayload) => void;
};

export type IMessagePayload = IMessage & {
  channelId: string;
};

function MessageBox(props: MessageBoxProps) {
  const [content, setContent] = useState('');
  const { onSend } = props;
  const handleSend = useCallback(() => {
    if (!content) {
      return;
    }
    onSend({
      content: { content },
      id: '',
      channel_id: '',
      body: { text: '' },
      channelId: '',
    });
    setContent('');
  }, [onSend, content]);

  const handleInputChanged = useCallback((event: ChangeEvent | FocusEvent) => {
    const target = event.target as HTMLInputElement;
    setContent(target.value);
  }, []);

  const handleSubmitted = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      handleSend();
    },
    [handleSend],
  );
  return (
    <>
      <div className="self-stretch h-14 px-4 mb-[16px] mt-[16px] flex-col justify-end items-start gap-2 flex">
        <form
          onSubmit={handleSubmitted}
          className="self-stretch p-4 bg-neutral-950 rounded-lg justify-start gap-2 inline-flex items-center"
        >
          <Icons.AddCircle />
          <div
            className="grow  self-stretch justify-start items-center gap-2 flex"
            onSubmit={handleSubmitted}
          >
            <input
              type="text"
              placeholder="Write your thoughts here..."
              className="grow  text-white text-sm  font-['Manrope'] placeholder-[#AEAEAE] border-none outline-none bg-transparent w-full"
              id="message"
              onBlur={handleInputChanged}
              onChange={handleInputChanged}
              value={content}
              autoComplete='off'
            />
          </div>
          <Icons.Gif />
          <Icons.Help />
        </form>
      </div>
    </>
  );
}

export default MessageBox;
