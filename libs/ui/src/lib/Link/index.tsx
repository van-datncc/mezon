import React from 'react';

export type LinkProps = {
	readonly href: string;
	readonly active?: boolean;
	readonly children?: React.ReactElement | string;
};

function Link({ href, children, ...rest }: LinkProps) {
	const content = children || 'Link';

	return (
		<a href={href} {...rest} title={typeof content === 'string' ? content : undefined}>
			{content}
		</a>
	);
}

export default Link;
