import React from 'react';
import styles from './AetherboundGame.module.css';

export function TownPanel({ onClose, quests, completedQuests, onAcceptQuest, onClaimQuest, specializations, chosenSpec, onChooseSpec, onBuyItem, shopItems }) {
    return (
        <div className={styles.panelContent}>
            <h2>Town</h2>
            <p>Welcome to the bustling Town Hub!</p>

            <h3>Shop</h3>
            {shopItems.map((item, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                    {item.name} ({item.type})
                    <button className={styles.actionButton} style={{ marginLeft: '10px' }} onClick={() => onBuyItem(item)}>Buy</button>
                </div>
            ))}

            <h3>Quests</h3>
            {quests.map(q => (
                <div key={q.id} style={{ marginBottom: '10px' }}>
                    <strong>{q.name}</strong>
                    <p>Requirements: Defeat {q.requirements.kills.FeralMeda} FeralMeda</p>
                    {!completedQuests.includes(q.id) ? (
                        <>
                            <button className={styles.actionButton} onClick={() => onAcceptQuest(q)}>Accept</button>
                            <button className={styles.actionButton} style={{ marginLeft: '10px' }} onClick={() => onClaimQuest(q)}>Claim Reward</button>
                        </>
                    ) : <p>Completed</p>}
                </div>
            ))}

            <h3>Specializations</h3>
            {specializations.map(spec => (
                <div key={spec.id} style={{ marginBottom: '10px' }}>
                    <strong>{spec.name}</strong>: {spec.description}
                    {chosenSpec === spec.id ? <span> (Chosen)</span> : (
                        <button className={styles.actionButton} style={{ marginLeft: '10px' }} onClick={() => onChooseSpec(spec.id)}>Choose</button>
                    )}
                </div>
            ))}

            <button className={styles.actionButton} onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
        </div>
    );
}
