import React from 'react';
import styles from './AetherboundGame.module.css';

export function TrainingOverlay({ globalXP, xpAllocations, onIncrementXP, onApplyXP, onClose }) {
  return (
    <div className={styles.panelContent}>
      <h2>Training Hall</h2>
      <p>Spend your XP here to improve stats. Current XP: {globalXP}</p>
      {Object.keys(xpAllocations).map(stat => (
        <div key={stat} style={{display:'flex', alignItems:'center', marginBottom:'10px'}}>
          <strong style={{minWidth:'50px', textAlign:'right', marginRight:'10px'}}>{stat.toUpperCase()}:</strong> {xpAllocations[stat]}
          <div style={{display:'inline-flex', gap:'5px', marginLeft:'10px'}}>
            {[1,5,10,100].map(amt => (
              <button 
                key={amt} 
                className={styles.actionButton} 
                onClick={() => onIncrementXP(stat, amt)}
              >+{amt}</button>
            ))}
          </div>
        </div>
      ))}
      <button 
        className={styles.actionButton} 
        onClick={onApplyXP}
        style={{marginTop:'20px'}}
      >
        Apply XP
      </button>
      <button className={styles.actionButton} onClick={onClose} style={{marginLeft:'20px'}}>Close</button>
    </div>
  );
}
