import { Colors, size } from "@mezon/mobile-ui";
import { codeBlockRegex, codeBlockRegexGlobal, emojiRegex, markdownDefaultUrlRegex, markdownUrlRegex, mentionRegexSplit } from "../../../../../app/utils/helpers";
import { View, Text } from "react-native";
import { openUrl } from "react-native-markdown-display";
import { IEmojiImage, getSrcEmoji } from "@mezon/utils";
import FastImage from "react-native-fast-image";
import { UsersClanEntity } from "@mezon/store-mobile";

/**
 * Todo: move to helper
*/
export const EDITED_FLAG = 'edited-flag';
/**
 * custom style for markdown
 * react-native-markdown-display/src/lib/styles.js to see more
*/
export const markdownStyles = {
    body: {
        color: Colors.tertiary,
        fontSize: size.medium
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    text: {
        fontSize: size.medium
    },
    code_block: {
        color: Colors.textGray,
        backgroundColor: Colors.bgCharcoal,
        paddingVertical: 1,
        borderColor: Colors.black,
        borderRadius: 5,
    },
    code_inline: {
        color: Colors.textGray,
        backgroundColor: Colors.bgCharcoal,
        paddingVertical: 1,
        borderColor: Colors.black,
        borderRadius: 5,
        fontSize: size.small
    },
    fence: {
        color: Colors.textGray,
        backgroundColor: Colors.bgCharcoal,
        paddingVertical: 5,
        borderColor: Colors.black,
        borderRadius: 5,
        fontSize: size.small
    },
    link: {
        color: Colors.textLink,
        textDecorationLine: 'none'
    },
    iconEmojiInMessage: {
		width: size.s_18,
		height: size.s_18,
	},
    editedText: {
		fontSize: size.small,
		color: Colors.gray72,
	},
    mention: {
        fontSize: size.medium,
		color: Colors.textGray,
        backgroundColor: Colors.bgMention,
    },
};

/**
 * custom render if you need
 * react-native-markdown-display/src/lib/renderRules.js to see more
 */
export const renderRulesCustom = {
    code_inline: (node, children, parent, styles, inheritedStyles = {}) => (
        <View>
          <Text key={node.key} style={[inheritedStyles, styles.code_inline, {bottom: -5}]}>
            {node.content}
          </Text>
        </View>
    ),
    link: (node, children, parent, styles, onLinkPress) => {
        const payload = node?.attributes?.href;
        const content = node?.children[0]?.content;
        if (payload === EDITED_FLAG) {
            return (
                <Text
                    key={node.key}
                    style={[styles.editedText]}
                    >
                    {content}
                </Text>
            )
        }

        if (payload.startsWith('@') || payload.startsWith('#')) {
            return (
                <Text
                    key={node.key}
                    style={[styles.mention]}
                    onPress={() => openUrl(node.attributes.href, onLinkPress)}
                    >
                    {content}
                </Text>
            )
        }

        return (
            <Text
              key={node.key}
              style={[styles.link]}
              onPress={() => openUrl(node.attributes.href, onLinkPress)}>
              {children}
            </Text>
        )
    },
    image: (
        node,
        children,
        parent,
        styles,
        allowedImageHandlers,
        defaultImageHandler,
    ) => {
        const {src} = node.attributes;
        return (
            <View key={node.key} style={{padding: 1}}>
                <FastImage source={{ uri: src }} style={styles.iconEmojiInMessage} resizeMode={'contain'} />
            </View>
        );
    },
    fence: (node, children, parent, styles, inheritedStyles = {}) => {
        // we trim new lines off the end of code blocks because the parser sends an extra one.
        let {content} = node;
        const sourceInfo = node?.sourceInfo;
        if (
          typeof node.content === 'string' &&
          node.content.charAt(node.content.length - 1) === '\n'
        ) {
          content = node.content.substring(0, node.content.length - 1);
        }

        //Note: Handle lost text when ```
        if (sourceInfo) {
            const textContent = sourceInfo.split(' ');
            if (textContent[textContent.length - 1].includes(EDITED_FLAG)) {
                textContent.pop();
            }
            content = '```' + textContent.join(' ');
            return (
                <Text key={node.key} style={{color: Colors.tertiary}}>
                    {content}
                </Text>
            )
        }
    
        return (
          <Text key={node.key} style={[inheritedStyles, styles.fence]}>
            {content}
          </Text>
        );
    },
}

/**
 * helper for markdown
*/
export const formatUrls = (text: string) => {
    const formattedString = text.replace(markdownUrlRegex, (match) => {
        if (markdownDefaultUrlRegex.test(match)) {
            return match;
        } else {
            return `[${match}](${match})`;
        }
    });

    return formattedString;
}

export const formatEmoji = (text: string, emojiImages: IEmojiImage[] = []) => {
    let newText = text.trim();
    newText = newText.replace(emojiRegex, (match) => {
        const srcEmoji = getSrcEmoji(match, emojiImages);
        return srcEmoji ? `![${match}](${srcEmoji})` : match;
    });

    return newText;
};

export const formatBlockCode = (text: string) => {
    const addNewlinesToCodeBlock = (block) => {
        if (!block.startsWith('```\n')) {
            block = block.replace(/^```/, '```\n');
        }
        if (!block.endsWith('\n```')) {
            block = block.replace(/```$/, '\n```');
        }
        return '\n' + block + '\n';
    };
    return text.replace(codeBlockRegexGlobal, addNewlinesToCodeBlock);
}
