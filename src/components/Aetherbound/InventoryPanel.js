import React from 'react';
import styles from './AetherboundGame.module.css';

export function InventoryPanel({ inventory, onUseItem, onClose, playerParts, onAttachPart }) {
  // Filter parts from inventory (type: 'part')
  const parts = inventory.filter(item => item.type === 'part');

  return (
    <div className={styles.panelContent}>
      <h2>Inventory</h2>
      <p>Manage your items and equip parts.</p>

      <h3>Items</h3>
      <ul className={styles.inventoryList}>
        {inventory.filter(i => i.type !== 'part').map((invItem, i) => (
          <li key={i} className={styles.inventoryItem}>
            {invItem.name} x{invItem.quantity}
            {invItem.type === 'consumable' && (
              <button className={styles.actionButton} onClick={() => onUseItem(invItem.id)}>Use</button>
            )}
          </li>
        ))}
      </ul>

      <h3>Parts</h3>
      <ul className={styles.inventoryList}>
        {parts.map((part, i) => (
          <li key={i} className={styles.inventoryItem}>
            {part.name} x{part.quantity}
            <button className={styles.actionButton} onClick={() => onAttachPart(part)}>Attach</button>
          </li>
        ))}
      </ul>

      <h3>Equipped Parts</h3>
      <p>Head: {playerParts.head?.name || 'Empty'}</p>
      <p>Torso: {playerParts.torso?.name || 'Empty'}</p>
      <p>Left Arm: {playerParts.leftArm?.name || 'Empty'}</p>
      <p>Right Arm: {playerParts.rightArm?.name || 'Empty'}</p>
      <p>Legs: {playerParts.legs?.name || 'Empty'}</p>

      <button className={styles.actionButton} onClick={onClose}>Close</button>
    </div>
  );
}
