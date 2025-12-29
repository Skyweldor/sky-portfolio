import React from "react";
import styles from "./NavLogo.module.css";

export const NavLogo = ({ isGameMode, visible = true }) => {
    const containerClasses = [
        styles.logoContainer,
        isGameMode ? styles.gameMode : '',
        visible ? styles.visible : styles.hidden
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <span className={styles.title}>SynthCity DigiLabs</span>
            <span className={styles.underline}></span>
            <span className={styles.interactive}>Interactive</span>
        </div>
    );
};
