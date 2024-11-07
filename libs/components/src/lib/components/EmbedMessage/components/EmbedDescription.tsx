interface EmbedDescriptionProps {
	description: string;
}

export function EmbedDescription({ description }: EmbedDescriptionProps) {
	return <div className="mt-2 text-sm text-textSecondary800 dark:text-textSecondary">{description}</div>;
}
