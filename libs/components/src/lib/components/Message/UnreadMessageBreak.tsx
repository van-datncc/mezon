import styles from './Message.module.scss';

console.log(styles);

export default function UnreadMessageBreak() {
	return (
		<div className={styles.UnreadMessage}>
			<div className={styles.LinePart}></div>
			<span className={styles.LineText}>New</span>
			<div className={styles.LinePart}></div>
		</div>
	);
}
