export function performAttack(player, enemy) {
    // Make a copy so we don't mutate directly
    const updatedPlayer = {...player, stats:{...player.stats}};
    const updatedEnemy = {...enemy, stats:{...enemy.stats}};
  
    // Simple damage calculation: Damage = STR - Enemy DEF/2 + possible CRIT
    const playerDamage = calculateDamage(updatedPlayer, updatedEnemy);
    updatedEnemy.stats.HP -= playerDamage;
  
    let resultText = `You attacked ${updatedEnemy.name} for ${playerDamage} damage!`;
  
    if (updatedEnemy.stats.HP > 0) {
      const enemyDamage = calculateDamage(updatedEnemy, updatedPlayer);
      updatedPlayer.stats.HP -= enemyDamage;
      resultText += ` Enemy attacked back for ${enemyDamage} damage!`;
    }
  
    return { updatedPlayer, updatedEnemy, resultText };
  }
  
  function calculateDamage(attacker, defender) {
    const baseDamage = attacker.stats.STR - (defender.stats.DEF / 2);
    // Ensure damage is at least 1
    let dmg = Math.max(1, baseDamage);
    
    // Chance to crit: If CRIT is > random value
    const critChance = attacker.stats.CRIT / 10; // Example: CRIT:2 => 20% chance
    if (Math.random() < critChance) {
      dmg *= 2;
    }
  
    // Chance to miss based on EVA/ACC
    // If defender's EVA > attacker ACC, reduce chance to hit
    const hitChance = attacker.stats.ACC / (defender.stats.EVA || 1);
    if (Math.random() > hitChance) {
      dmg = 0; // Missed
    }
  
    return Math.floor(dmg);
  }
  