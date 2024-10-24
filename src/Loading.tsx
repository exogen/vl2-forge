import styles from "./Loading.module.css";

export function Loading() {
  return (
    <div className={styles.LoadingBackdrop}>
      <div className={styles.LoadingText}>Loading…</div>
    </div>
  );
}
