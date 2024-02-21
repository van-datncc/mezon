export type LinkProps = {
	href: string;
	active?: boolean;
	children?: React.ReactElement | string;
};

function Link(params: LinkProps) {
	return (
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		<a {...params} />
	);
}

export default Link;
