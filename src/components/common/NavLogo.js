import React from "react";
import styles from "./NavLogo.module.css";

/**
 * Brand wordmark for the navbar.
 *
 * `showSubsidiary` scopes the "Interactive" sub-line to SynthCity DigiLabs
 * Interactive routes only. Every other route shows the parent wordmark alone.
 * `isGameMode` is unrelated — it only boosts the glow inside the Aetherbound HUD.
 */
export const NavLogo = ({ isGameMode, showSubsidiary = false, visible = true }) => {
    const containerClasses = [
        styles.logoContainer,
        isGameMode ? styles.gameMode : '',
        visible ? styles.visible : styles.hidden
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <span className={styles.title}>SynthCity DigiLabs</span>
            {showSubsidiary && (
                <>
                    <span className={styles.underline}></span>
                    <span className={styles.interactive}>Interactive</span>
                </>
            )}
        </div>
    );
};
