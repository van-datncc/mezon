interface PasswordRequirementProps {
	met: boolean;
	text: string;
}

function PasswordRequirement({ met, text }: PasswordRequirementProps) {
	return (
		<li className={`flex items-center gap-1 ${met ? 'text-green-500' : 'text-gray-500'}`}>
			{met ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M20 6 9 17l-5-5" />
				</svg>
			) : (
				<span className="w-3.5 h-3.5" />
			)}
			<span>{text}</span>
		</li>
	);
}

interface PasswordRequirementsProps {
	password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
	const requirements = [
		{ met: password.length >= 8, text: 'At least 8 characters' },
		{ met: /[A-Z]/.test(password), text: 'at least 1 uppercase letter' },
		{ met: /[a-z]/.test(password), text: 'at least 1 lowercase letter' },
		{ met: /[0-9]/.test(password), text: 'at least 1 number' },
		{ met: /[^A-Za-z0-9]/.test(password), text: 'at least 1 special character' }
	];

	return (
		<div className="text-sm text-gray-500 mt-2">
			<div>
				<p className="text-black">Password must have:</p> {requirements.map((req) => req.text).join(', ')}
			</div>
		</div>
	);
}
