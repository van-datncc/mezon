import { Icons } from '@mezon/ui';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface IPreClassProps {
	children?: any;
	isInPinMsg?: boolean;
}

const PreClass = ({ children, isInPinMsg }: IPreClassProps) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, [copied]);

	return (
		<pre
			className={`pre dark:text-white text-colorTextLightMode bg-bgLightSecondary dark:bg-bgSecondary border border-[#E3E5E8] dark:border-[#1E1F22] ${isInPinMsg ? 'flex items-start' : ''}`}
		>
			<CopyToClipboard text={children.props.children} onCopy={() => setCopied(true)}>
				<button className="icon copy-icon">{copied ? <Icons.PasteIcon /> : <Icons.CopyIcon />}</button>
			</CopyToClipboard>
			<code className={`code ${isInPinMsg ? 'pin-msg-markdown' : ''}`}>{children.props.children?.toString()?.split('```')}</code>
		</pre>
	);
};

export default PreClass;
