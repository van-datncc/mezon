import { useMemo } from "react";


// TODO: refactor this to sender function
const mentionRegex = /(@\S+?)\s/g;

export type ILineMention = {
    nonMatchText:  string;
    matchedText: string;
    startIndex: number;
    endIndex: number;
}

export type IMessageLine = {
    mentions: ILineMention[]
}

export function useMessageLine(line: string): IMessageLine {
    const matches = useMemo(() => line.match(mentionRegex) || [], [line]);

    const mentions = useMemo(() => {
        let lastIndex = 0;
        return matches.map((match, i) => {
          const startIndex = line.indexOf(match, lastIndex);
          const endIndex = startIndex + match.length;
          const nonMatchText = line.substring(lastIndex, startIndex);
          const matchedText = line.substring(startIndex, endIndex);
          lastIndex = endIndex;
    
          return {
            nonMatchText,
            matchedText,
            startIndex,
            endIndex
          };
        });
      }, [line, matches]);

    return {
        mentions
    }
}