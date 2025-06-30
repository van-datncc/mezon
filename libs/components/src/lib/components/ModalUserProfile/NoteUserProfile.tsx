function NoteUserProfile() {
	return (
		<div className="flex flex-col">
			<div className="font-bold tracking-wider text-xs mb-1 pt-2">NOTE</div>
			<input
				placeholder="Click to add a note"
				className={`font-[400] px-[16px] rounded-lg bg-input-theme outline-none text-[14px] w-full border-theme-primary text-theme-primary h-[36px]`}
				type="text"
			/>
		</div>
	);
}

export default NoteUserProfile;
