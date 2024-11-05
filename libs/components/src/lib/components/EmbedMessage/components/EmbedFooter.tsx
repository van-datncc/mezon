interface EmbedFooterProps {
	text?: string;
	icon_url?: string;
	timestamp?: string;
}

export function EmbedFooter({ text, icon_url, timestamp }: EmbedFooterProps) {
	return (
		<div className="mt-2 mb-4 flex items-center gap-2">
			{icon_url && <img src={icon_url} alt="Footer icon" className="w-5 h-5 rounded-full object-cover" />}
			<div className="flex gap-2 items-center text-xs text-gray-500">
				{text && <span>{text}</span>}
				{timestamp && (
					<>
						{text && <span>•</span>}
						<span>{new Date(timestamp).toLocaleDateString()}</span>
					</>
				)}
			</div>
		</div>
	);
}
