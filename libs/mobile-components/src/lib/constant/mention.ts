export const mentionRegex = /(?<=\s|^)(@\[[^\]]+\]|<#([\p{L}\d\s-]+)>)(?=\s|$)/gu;
export const mentionUserPattern = /@\[[^\]]*\]/g;
export const mentionHashtagPattern = /<#([^>]*)>/g;
export const mentionRegexSplit = /(@\[[^\]]+\]|<#(?:[\p{L}\d\s-]+)>|:\w+:)/gu;
