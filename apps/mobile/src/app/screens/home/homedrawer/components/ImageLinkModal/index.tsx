import { Block } from "@mezon/mobile-ui";
import { memo } from "react";
import { RenderImageChat } from "../RenderImageChat";

interface ILinkImageListProps {
  imageLinks: string[];
  onOpenLinkImage: (url: string) => void;
  onLongPressImage: () => void;
}

export const LinkImageList = memo((props: ILinkImageListProps) => {
  const { imageLinks, onLongPressImage, onOpenLinkImage } = props;

  const onPressImage = ({ url }: { url: string }) => {
    onOpenLinkImage(url);
  }

  return (
    <Block>
      {imageLinks.map((link, index) => {
        return (
          <RenderImageChat
            disable={false}
            image={{ url: link }}
            key={`${link}_${index}`}
            onPress={onPressImage}
            onLongPress={onLongPressImage}
          />
        )
      })}
    </Block>
  )
})