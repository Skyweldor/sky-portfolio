export function performAttack(player, enemy) {
    const updatedPlayer = { ...player, stats: { ...player.stats } };
    const updatedEnemy = { ...enemy, stats: { ...enemy.stats } };

    let resultText = '';

    const baseDamage = updatedPlayer.stats.STR - (updatedEnemy.stats.DEF / 2);
    let dmg = Math.max(1, baseDamage);

    const critChance = updatedPlayer.stats.CRIT / 10;
    if (Math.random() < critChance) {
        dmg *= 2;
    }

    const hitChance = updatedPlayer.stats.ACC / Math.max(1, updatedEnemy.stats.EVA);
    if (Math.random() > hitChance) {
        dmg = 0; // Missed
    }

    updatedEnemy.stats.HP -= dmg;
    resultText += `You attacked ${updatedEnemy.name} for ${dmg} damage!\n`;

    if (updatedEnemy.stats.HP > 0) {
        // Enemy attacks back if alive
        const enemyBaseDmg = updatedEnemy.stats.STR - (updatedPlayer.stats.DEF / 2);
        let enemyDmg = Math.max(1, enemyBaseDmg);

        const enemyCritChance = updatedEnemy.stats.CRIT / 10;
        if (Math.random() < enemyCritChance) {
            enemyDmg *= 2;
        }

        const enemyHitChance = updatedEnemy.stats.ACC / Math.max(1, updatedPlayer.stats.EVA);
        if (Math.random() > enemyHitChance) {
            enemyDmg = 0;
        }

        updatedPlayer.stats.HP -= enemyDmg;
        resultText += `${updatedEnemy.name} attacked you for ${enemyDmg} damage!`;
    } else {
        resultText += `\nYou defeated ${updatedEnemy.name}! Earned 5 XP.`;
    }

    return { updatedPlayer, updatedEnemy, resultText };
}