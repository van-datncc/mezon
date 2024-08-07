type AboutMeProps = {
	createTime?: string;
};

const AboutMe = ({ createTime }: AboutMeProps) => {
	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', options);
	};

	return (
		<div className="flex flex-col gap-[20px]">
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold">Member Since</p>
				<span className="text-sm font-normal">{formatDate(createTime || '')}</span>
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold">Note</p>
				<textarea
					name=""
					id=""
					rows={2}
					placeholder="Click to add a note"
					className="w-full p-1 bg-bgLightSearchHover rounded-[3px] text-sm font-normal dark:bg-bgSearchHover focus-visible:outline-none dark:focus-visible:bg-[#161819] focus-visible:bg-bgLightTertiary"
				></textarea>
			</div>
		</div>
	);
};

export default AboutMe;
