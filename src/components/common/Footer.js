import React from 'react';
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p className={styles.copyright}>© 2026 SynthCity DigiLabs. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
