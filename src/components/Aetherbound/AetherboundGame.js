import React, { useState, useEffect, useRef } from 'react';
import { NavBar } from '../NavBar';
import { creatures } from './creatures';
import { parts as allParts } from './parts';
import styles from './AetherboundGame.module.css';
import { baseItems, advancedItems, recipes, questData, specData } from './data';
import { InventoryPanel } from './InventoryPanel';
import { TownPanel } from './TownPanel';
import { TrainingOverlay } from './TrainingOverlay';

import protoMedaImg from '../../assets/img/Aetherbound/creatures/protoMeda.png';
import feralMedaImg from '../../assets/img/Aetherbound/creatures/feralMeda.png';
import battlegroundImg from '../../assets/img/Aetherbound/backgrounds/rusted_junkyard.png';

import { performAttack } from './logic/performAttack';



function AetherboundGame() {
  const [playerCreature, setPlayerCreature] = useState({
    ...creatures.protoMeda,
    equipment: { weapon: null, armor: null },
    stats: { ...creatures.protoMeda.stats, STAMINA: 5 } // Ensure stamina defined
  });

  const [enemy, setEnemy] = useState({
    ...creatures.feralMeda,
    stats: { ...creatures.feralMeda.stats, STAMINA: 5 } // give enemy stamina too
  });

  const [log, setLog] = useState([]);
  const combatLogRef = useRef(null);

  const [attachedParts, setAttachedParts] = useState([]); // Not used directly now
  const [playerParts, setPlayerParts] = useState({
    head: null,
    torso: null,
    leftArm: null,
    rightArm: null,
    legs: null
  });

  const [showInventory, setShowInventory] = useState(false);
  const [showTown, setShowTown] = useState(false);
  const [showTraining, setShowTraining] = useState(false);

  const [inventory, setInventory] = useState([
    ...baseItems.map(it => ({ ...it, quantity: 1 })),
    // Add some part items for testing
    { id: 101, name: 'Steel Claws', type: 'part', quantity: 1, effect: { STR: 1 }, description: 'Claws to increase STR' },
    { id: 102, name: 'Servo Legs', type: 'part', quantity: 1, effect: { SPD: 1 }, description: 'Legs to increase speed' }
  ]);

  // After defining inventory, run a useEffect or a function to merge slot info:
  useEffect(() => {
    const updatedInv = inventory.map(item => {
      if (item.type === 'part') {
        // find corresponding part in allParts
        const partEntry = Object.values(allParts).find(p => p.name === item.name);
        if (partEntry) {
          return { ...item, slot: partEntry.slot };
        }
      }
      return item;
    });
    setInventory(updatedInv);
  }, []);

  const [chosenSpec, setChosenSpec] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [acceptedQuests, setAcceptedQuests] = useState([]);
  const shopItems = [{ id: 201, name: 'Stamina Tonic', type: 'consumable', effect: { staminaRestore: 5 }, quantity: 1 }];

  const [globalXP, setGlobalXP] = useState(10);
  const [xpAllocations, setXpAllocations] = useState({ STR: 0, DEF: 0, SPD: 0, ACC: 0, CRIT: 0, EVA: 0 });

  useEffect(() => {
    if (combatLogRef.current) {
      combatLogRef.current.scrollTop = combatLogRef.current.scrollHeight;
    }
  }, [log]);

  const maxHP = 20;
  const enemyMaxHP = 20;
  const maxStamina = 5;

  const playerHPPercent = (playerCreature.stats.HP / maxHP) * 100;
  const playerStaminaPercent = (playerCreature.stats.STAMINA / maxStamina) * 100;
  const enemyHPPercent = (enemy.stats.HP / enemyMaxHP) * 100;
  const enemyStaminaPercent = (enemy.stats.STAMINA / maxStamina) * 100;

  const openInventory = () => {
    setShowTown(false);
    setShowTraining(false);
    setShowInventory(true);
  };

  const openTown = () => {
    setShowInventory(false);
    setShowTraining(false);
    setShowTown(true);
  };

  const openTraining = () => {
    setShowInventory(false);
    setShowTown(false);
    setShowTraining(true);
  };

  const totalXPSpent = Object.values(xpAllocations).reduce((sum, v) => sum + v, 0);
  const onIncrementXP = (stat, amt) => {
    const newTotal = totalXPSpent + amt;
    if (newTotal <= globalXP) {
      setXpAllocations(prev => ({ ...prev, [stat]: prev[stat] + amt }));
    } else {
      setLog(prev => [...prev, `Not enough XP to add ${amt} to ${stat.toUpperCase()}!`]);
    }
  };

  const onApplyXP = () => {
    if (totalXPSpent > globalXP) {
      setLog(prev => [...prev, "Not enough XP to allocate!"]);
      return;
    }
    const updatedCreature = { ...playerCreature, stats: { ...playerCreature.stats } };
    for (const stat in xpAllocations) {
      updatedCreature.stats[stat] += xpAllocations[stat];
    }
    setPlayerCreature(updatedCreature);
    setGlobalXP(globalXP - totalXPSpent);
    setXpAllocations({ STR: 0, DEF: 0, SPD: 0, ACC: 0, CRIT: 0, EVA: 0 });
    setLog(prev => [...prev, "XP allocated successfully!"]);
  };

  function handleAttack() {
    if (playerCreature.stats.STAMINA <= 0) {
      setLog(prev => [...prev, "You're too tired to attack!"]);
      return;
    }

    const updatedPlayer = { ...playerCreature, stats: { ...playerCreature.stats } };
    updatedPlayer.stats.STAMINA = Math.max(0, updatedPlayer.stats.STAMINA - 1);
    setPlayerCreature(updatedPlayer);

    const { updatedPlayer: afterAttackPlayer, updatedEnemy, resultText } = performAttack(updatedPlayer, enemy);
    setPlayerCreature(afterAttackPlayer);
    setEnemy(updatedEnemy);
    setLog(prev => [...prev, resultText]);

    if (updatedEnemy.stats.HP <= 0) {
      setGlobalXP(prevXP => prevXP + 5);
      // Reset enemy:
      setEnemy({ ...creatures.feralMeda, stats: { ...creatures.feralMeda.stats, STAMINA: 5, HP: maxHP } });
    }

    if (afterAttackPlayer.stats.HP <= 0) {
      setLog(prev => [...prev, "You were defeated! Returning to town..."]);
      setShowTown(true);
      setShowInventory(false);
      setShowTraining(false);
    }
  }

  const handleUseItem = (itemId) => {
    const index = inventory.findIndex(i => i.id === itemId);
    if (index === -1) return;
    const item = inventory[index];
    let updatedInventory = [...inventory];

    if (item.type === 'consumable') {
      let logMsg = `Used ${item.name}.`;
      if (item.effect?.hpRestore) {
        const restoredHP = Math.min(maxHP, playerCreature.stats.HP + item.effect.hpRestore);
        setPlayerCreature(prev => ({ ...prev, stats: { ...prev.stats, HP: restoredHP } }));
        logMsg += ` Restored ${item.effect.hpRestore} HP!`;
      }
      if (item.effect?.staminaRestore) {
        const restoredStamina = Math.min(maxStamina, (playerCreature.stats.STAMINA || 0) + item.effect.staminaRestore);
        setPlayerCreature(prev => ({ ...prev, stats: { ...prev.stats, STAMINA: restoredStamina } }));
        logMsg += ` Restored ${item.effect.staminaRestore} Stamina!`;
      }

      if (item.quantity > 1) {
        updatedInventory[index].quantity -= 1;
      } else {
        updatedInventory.splice(index, 1);
      }

      setInventory(updatedInventory);
      setLog(prev => [...prev, logMsg]);
    } else if (item.type === 'weapon') {
      setPlayerCreature(prev => ({ ...prev, equipment: { ...prev.equipment, weapon: item } }));
      setLog(prev => [...prev, `Equipped ${item.name}!`]);
    }
  };

  const onAcceptQuest = (quest) => {
    if (!acceptedQuests.includes(quest.id)) {
      setAcceptedQuests([...acceptedQuests, quest.id]);
      setLog(prev => [...prev, `Accepted quest: ${quest.name}.`]);
    }
  };

  const onClaimQuest = (quest) => {
    if (!completedQuests.includes(quest.id)) {
      setCompletedQuests([...completedQuests, quest.id]);
      setLog(prev => [...prev, `Quest ${quest.name} completed! Gained rewards.`]);
      // Add quest reward logic if needed
    }
  };

  const onChooseSpec = (specId) => {
    const chosen = specData.find(s => s.id === specId);
    if (chosen) {
      setChosenSpec(specId);
      setLog(prev => [...prev, `Chosen specialization: ${chosen.name}.`]);
    }
  };

  const onTrain = (stat, cost) => {
    setLog(prev => [...prev, `Attempted to train ${stat} for ${cost} XP in Town overlay.`]);
  };

  const onBuyItem = (item) => {
    const updatedInv = [...inventory];
    const existingIndex = updatedInv.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      updatedInv[existingIndex].quantity += 1;
    } else {
      updatedInv.push({ ...item, quantity: 1 });
    }
    setInventory(updatedInv);
    setLog(prev => [...prev, `Bought ${item.name} successfully! Added to inventory.`]);
  };

  const onAttachPart = (partItem) => {
    // partItem should have a slot property
    const slot = partItem.slot;
    if (!slot) {
      setLog(prev => [...prev, `${partItem.name} cannot be attached (no slot specified).`]);
      return;
    }

    // Check if slot is free
    if (playerParts[slot]) {
      setLog(prev => [...prev, `${slot} slot is already occupied by ${playerParts[slot].name}. Remove it first.`]);
      return;
    }

    // Check inventory quantity
    const index = inventory.findIndex(i => i.id === partItem.id);
    if (index === -1 || inventory[index].quantity < 1) {
      setLog(prev => [...prev, `No ${partItem.name} available in inventory to attach.`]);
      return;
    }

    // Attach part
    setPlayerParts(prev => ({ ...prev, [slot]: partItem }));
    setLog(prev => [...prev, `Attached ${partItem.name} to ${slot}`]);

    // Reduce quantity by 1 in inventory
    const updatedInv = [...inventory];
    updatedInv[index].quantity -= 1;
    if (updatedInv[index].quantity <= 0) {
      updatedInv.splice(index, 1);
    }
    setInventory(updatedInv);
  };

  // Display parts in main screen side columns:
  // We'll show playerParts in left side: head, torso, leftArm, rightArm, legs
  const playerPartList = [playerParts.head, playerParts.torso, playerParts.leftArm, playerParts.rightArm, playerParts.legs];
  // For enemy, no actual attach logic yet, just placeholders:
  const enemyPartList = [null, null, null, null, null];

  return (
    <div className={styles.aetherboundLayout}>
      <NavBar
        isGameMode={true}
        onToggleInventory={openInventory}
        onToggleTown={openTown}
        onToggleTraining={openTraining}
        globalXP={globalXP}
      />

      <div className={styles.mainContent} style={{ display: 'flex', gap: '20px' }}>
        {/* Player Parts Column (5 slots) */}
        <div className={`${styles.sideColumn}`}>
          {playerPartList.map((p, i) => (
            <div key={i} className={`${styles.partIcon} ${p ? 'attached' : ''}`}>
              {p ? p.name : ''}
            </div>
          ))}
        </div>

        {/* Player Column */}
        <div className={`${styles.aetherboundColumn} ${styles.playerColumn}`}>
          <div className={styles.entityName}>
            <span>{playerCreature.name}</span>
          </div>
          <div className={styles.barRow}>
            <div className={styles.hpBarContainer}>
              <div className={styles.hpBarFill} style={{ width: `${playerHPPercent}%` }}></div>
            </div>
            <div className={styles.staminaBarContainer}>
              <div className={styles.staminaBarFill} style={{ width: `${playerStaminaPercent}%` }}></div>
            </div>
          </div>
          <img src={protoMedaImg} alt={playerCreature.name} className={styles.columnImage} />
          <div className={styles.actionsArea}>
            <button className={styles.actionButton} onClick={handleAttack}>Attack</button>
          </div>
        </div>

        {/* Middle Column (Battleground + Log) */}
        <div className={`${styles.aetherboundColumn} ${styles.middleColumn}`}>
          <div style={{ border: '1px solid var(--color-primary)', borderRadius: '8px', boxShadow: 'var(--glow-primary)', overflow: 'hidden', marginBottom: '20px' }}>
            <img src={battlegroundImg} alt="Battleground" style={{ width: '100%', display: 'block' }} />
          </div>
          <div className={styles.combatLog} ref={combatLogRef}>
            {log.map((entry, i) => (
              <p key={i} className={styles.logEntry}>{entry}</p>
            ))}
          </div>
        </div>

        {/* Enemy Column */}
        <div className={`${styles.aetherboundColumn} ${styles.enemyColumn}`}>
          <div className={styles.entityName}>
            <span>{playerCreature.name}</span>
          </div>
          <div className={styles.barRow}>
            <div className={styles.hpBarContainer}>
              <div className={styles.hpBarFill} style={{ width: `${enemyHPPercent}%` }}></div>
            </div>
            <div className={styles.staminaBarContainer}>
              <div className={styles.staminaBarFill} style={{ width: `${enemyStaminaPercent}%` }}></div>
            </div>
          </div>
          <img src={feralMedaImg} alt={enemy.name} className={styles.columnImage} />
        </div>

        {/* Enemy Parts Column (5 slots) */}
        <div className={`${styles.sideColumn}`}>
          {enemyPartList.map((p, i) => (
            <div key={i} className={styles.partIcon}>
              {/* Enemy currently no parts attached */}
            </div>
          ))}
        </div>
      </div>

      {/* Overlays */}
      {showInventory && (
        <div className={`${styles.overlayPanel} ${styles.inventoryPanel} ${styles.visible}`}>
          <InventoryPanel
            inventory={inventory}
            onUseItem={handleUseItem}
            onClose={() => setShowInventory(false)}
            playerParts={playerParts} // <-- Ensure this is passed
            onAttachPart={onAttachPart} // <-- Ensure this is passed
          />
        </div>
      )}


      {showTown && (
        <div className={`${styles.overlayPanel} ${styles.townPanel} ${styles.visible}`}>
          <TownPanel
            onClose={() => setShowTown(false)}
            quests={questData}
            completedQuests={completedQuests}
            onAcceptQuest={onAcceptQuest}
            onClaimQuest={onClaimQuest}
            specializations={specData}
            chosenSpec={chosenSpec}
            onChooseSpec={onChooseSpec}
            onTrain={onTrain}
            onBuyItem={onBuyItem}
            shopItems={shopItems} // ensure this is passed!
          />

        </div>
      )}

      {showTraining && (
        <div className={`${styles.overlayPanel} ${styles.visible}`}>
          <TrainingOverlay
            globalXP={globalXP}
            xpAllocations={xpAllocations}
            onIncrementXP={onIncrementXP}
            onApplyXP={onApplyXP}
            onClose={() => setShowTraining(false)}
          />
        </div>
      )}
    </div>
  );
}

export default AetherboundGame;
