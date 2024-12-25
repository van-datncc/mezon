import React from 'react';
import { MessageAudio } from '../../MessageWithUser/MessageAudio/MessageAudio';

type AudioRecorderUIProps = {
	isRecording: boolean;
	seconds: number;
	audioUrl: string;
	onStopRecording: () => void;
	onSendRecording: () => void;
	onResetRecording: () => void;
};

export const AudioRecorderUI: React.FC<AudioRecorderUIProps> = React.memo(
	({ isRecording, seconds, audioUrl, onStopRecording, onSendRecording, onResetRecording }) => (
		<div style={{ paddingBottom: '10px', fontFamily: 'Arial, sans-serif' }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					padding: '10px',
					borderRadius: '5px',
					color: 'white',
					width: '400px'
				}}
			>
				<button
					onClick={onResetRecording}
					style={{
						backgroundColor: 'white',
						color: '#505cdc',
						border: 'none',
						borderRadius: '50%',
						width: '30px',
						height: '30px',
						cursor: 'pointer'
					}}
				>
					✖
				</button>

				<div
					style={{
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '10px'
					}}
				>
					{isRecording ? (
						<span>{new Date(seconds * 1000).toISOString().substring(14, 19)}</span>
					) : audioUrl ? (
						<MessageAudio audioUrl={audioUrl} />
					) : null}

					{isRecording && (
						<button
							onClick={onStopRecording}
							style={{
								backgroundColor: 'white',
								color: '#505cdc',
								border: 'none',
								borderRadius: '50%',
								width: '30px',
								height: '30px',
								cursor: 'pointer'
							}}
						>
							⏹
						</button>
					)}
				</div>

				<button
					onClick={onSendRecording}
					style={{
						backgroundColor: 'white',
						color: '#505cdc',
						border: 'none',
						borderRadius: '50%',
						width: '30px',
						height: '30px',
						cursor: 'pointer'
					}}
				>
					➤
				</button>
			</div>
		</div>
	)
);
