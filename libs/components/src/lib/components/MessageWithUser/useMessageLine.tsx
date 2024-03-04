import { useMemo } from "react";


// TODO: refactor this to sender function
const mentionRegex = /(@\S+?)\s/g;


export function useMessageLine(line: string) {
    const matches = useMemo(() => line.match(mentionRegex) || [], [line]);

    const mentions = useMemo(() => {
        let lastIndex = 0;
        return matches.map((match, i) => {
          const startIndex = line.indexOf(match, lastIndex);
          const endIndex = startIndex + match.length;
          const nonMatchText = line.substring(lastIndex, startIndex);
          lastIndex = endIndex;
    
          return {
            nonMatchText,
            startIndex,
            endIndex
          };
        });
      }, [line, matches]);

    return {
        mentions
    }
}