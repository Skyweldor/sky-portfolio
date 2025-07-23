import React from 'react';
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p className={styles.copyright}>© 2023 by JairDreams. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
