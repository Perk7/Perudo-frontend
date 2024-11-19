import styles from './styles.module.scss';

export default function NotFound() {

    return (
        <div className={styles.mainBlock}>
            <h1 className={styles.errorMainTitle}>
                <strong>404 - Not Found</strong>
                <strong>Страница не найдена</strong>
            </h1>
        </div>
    );
}