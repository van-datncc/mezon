import styles from './transport.module.scss';

/* eslint-disable-next-line */
export interface TransportProps {}

export function Transport(props: TransportProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Transport!</h1>
    </div>
  );
}

export default Transport;
