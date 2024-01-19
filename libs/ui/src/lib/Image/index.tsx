import { Img, ImgProps } from 'react-image'
import VisibilitySensor from 'react-visibility-sensor'

export type ImageProps = ImgProps & {
    src: string
    alt: string
    width?: number
    height?: number
    placeholder?: string
    blurDataURL?: string
};

function Image(params: ImageProps) {
    return (
        <VisibilitySensor>
            <Img {...params} />
        </VisibilitySensor>
    )
}

export default Image