import React, { useMemo } from "react";
import { useMessageLine } from "./useMessageLine";

type MessageLineProps = {
  line: string;
};

const MentionSpan = ({ text }: { text: string }) => (
  <span className="text-blue-500">{text}</span>
);

// TODO: refactor component for message lines
const MessageLine = ({ line }: MessageLineProps) => {
 const { mentions } = useMessageLine(line);
  const elements = useMemo(() => {
    return mentions.map(({ startIndex, endIndex, nonMatchText }, i) => {
      return (
        <React.Fragment key={i}>
          {nonMatchText && <span>{nonMatchText}</span>}
          <MentionSpan text={line.substring(startIndex, endIndex)} />
        </React.Fragment>
      );
    });
  }, [line, mentions]);

  return <div>{elements}</div>;
};

export default MessageLine;
