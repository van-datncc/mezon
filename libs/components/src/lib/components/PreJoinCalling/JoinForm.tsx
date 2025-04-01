interface JoinFormProps {
	username: string;
	setUsername: (value: string) => void;
	isLoading: boolean;
	isDisabled: boolean;
	onJoin: () => void;
}

export function JoinForm({ username, setUsername, isLoading, isDisabled, onJoin }: JoinFormProps) {
	return (
		<div className="w-full flex gap-2 mb-6">
			<input
				type="text"
				placeholder="Enter name"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
			/>
			<button
				onClick={onJoin}
				disabled={isDisabled}
				className={`px-6 py-2 rounded text-white font-medium transition ${
					isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
				}`}
			>
				{isLoading ? 'Joining...' : 'Join now'}
			</button>
		</div>
	);
}
