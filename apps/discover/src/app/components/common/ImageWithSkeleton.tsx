import React, { useState } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    skeletonClassName?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
    src,
    alt,
    className = '',
    skeletonClassName = '',
    onLoad,
    onError,
    ...rest
}) => {
    const [loading, setLoading] = useState(true);

    return (
        <div className="relative w-full h-full">
            {loading && (
                <div className={`absolute inset-0 skeleton ${skeletonClassName}`} />
            )}
            <img
                src={src}
                alt={alt}
                className={`${className} ${loading ? 'invisible' : ''}`}
                onLoad={e => {
                    setLoading(false);
                    onLoad && onLoad(e);
                }}
                onError={onError}
                {...rest}
            />
        </div>
    );
};

export default ImageWithSkeleton; 