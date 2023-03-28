import styles from './Header.module.scss';

const Header = () => {
    return (
        <div className={styles.container}>
            <span className={styles.content}>Cocktails app</span>
        </div>
    )
};

export default Header;