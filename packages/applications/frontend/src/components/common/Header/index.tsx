import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";

const Header = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <a href="/">
                <span className={styles.content}>{t("header.label")}</span>
            </a>
        </div>
    )
};

export default Header;