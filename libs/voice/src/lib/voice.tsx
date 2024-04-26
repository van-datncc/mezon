import styles from './voice.module.scss';

/* eslint-disable-next-line */
export interface VoiceProps {}

export function Voice(props: VoiceProps) {
	return (
		<div className={styles['container']}>
			<h1>Welcome to Voice!</h1>
		</div>
	);
}

export default Voice;
