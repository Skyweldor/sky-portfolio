// data.js
export const baseItems = [
    { id: 1, name: 'Health Potion', type: 'consumable', effect: { hpRestore: 5 } },
    { id: 2, name: 'Iron Ore', type: 'material', effect: null }
  ];
  
  export const advancedItems = [
    { id: 3, name: 'Stamina Tonic', type: 'consumable', effect: { staminaRestore: 5 } }
  ];
  
  export const recipes = [
    {
      name: 'Steel Blade',
      requirements: [{ itemId: 2, quantity: 2 }],
      result: { itemId: 3 }
    }
  ];
  
  export const questData = [
    {
      id: 1,
      name: "Defeat 3 FeralMeda",
      requirements: { kills: { FeralMeda: 3 } },
      reward: { xp: 10, items: [{ itemId: 3, quantity: 1 }] }
    }
  ];
  
  export const specData = [
    { id: 'berserker', name: "Berserker", bonus: { STR: 1, CRIT: 1 } },
    { id: 'scout', name: "Scout", bonus: { ACC: 1, EVA: 1 } }
  ];

  // data.js

// Existing baseItems, advancedItems, recipes, etc. remain.
// We add more creatures, items, and battleground references here.

export const extraCreatures = [
    {
      id: 'sporeling',
      name: 'Sporeling',
      stats: {
        HP: 18,
        STR: 4,
        DEF: 6,
        SPD: 3,
        ACC: 2,
        CRIT: 1,
        EVA: 2,
        STAMINA: 5
      },
      description: "A fungal-based robotic creature that releases spores.",
      image: 'assets/img/sporeling.png' // 64x64 pixel art image
    },
    {
      id: 'aerowing',
      name: 'Aerowing',
      stats: {
        HP: 22,
        STR: 3,
        DEF: 3,
        SPD: 6,
        ACC: 4,
        CRIT: 2,
        EVA: 3,
        STAMINA: 5
      },
      description: "A swift avian-mech hybrid floating on neon wings.",
      image: 'assets/img/aerowing.png' // 64x64 pixel art image
    }
  ];
  
  export const extraItems = [
    {
      id: 5,
      name: 'Nano Bandage',
      type: 'consumable',
      effect: { hpRestore: 10 },
      description: "A high-tech bandage that restores more HP.",
      image: 'assets/img/nano_bandage.png' // 64x64 pixel art
    },
    {
      id: 6,
      name: 'Data Crystal',
      type: 'material',
      effect: null,
      description: "A crystalline chip storing valuable data. Used in crafting.",
      image: 'assets/img/data_crystal.png' // 64x64 pixel art
    },
    {
      id: 7,
      name: 'Servo Limbs',
      type: 'attachment',
      effect: { SPD: 1, ACC: 1 },
      description: "Mechanical limbs to enhance speed and accuracy.",
      image: 'assets/img/servo_limbs.png' // 64x64 pixel art
    },
    {
      id: 8,
      name: 'Plasma Core',
      type: 'material',
      effect: null,
      description: "A glowing energy core, rare and crucial for advanced crafting.",
      image: 'assets/img/plasma_core.png' // 64x64 pixel art
    }
  ];
  
  export const extraRecipes = [
    {
      name: 'Plasma Blade',
      requirements: [{ itemId: 6, quantity: 1 }, { itemId: 8, quantity: 1 }], // Data Crystal + Plasma Core
      result: { itemId: 4 }, // Assume itemId:4 is your Steel Blade or a new weapon
      description: "Forge a plasma-infused blade that boosts STR and CRIT."
    },
    {
      name: 'Feathered Servo Gear',
      requirements: [{ itemId: 7, quantity: 1 }, { itemId: 2, quantity: 2 }], // Servo Limbs + Iron Ore
      result: { itemId: 9 }, // A new attachment we define
      description: "A lightweight gear enhancing evasive maneuvers."
    }
  ];
  
  export const extraBattlegrounds = [
    {
      id: 'neon_forest',
      name: 'Neon Forest',
      description: "A surreal forest with glowing flora and dark, misty air.",
      image: 'assets/img/neon_forest.png' // 256x256 pixel art background
    },
    {
      id: 'rusted_junkyard',
      name: 'Rusted Junkyard',
      description: "A scrapyard of old mechs and twisted metal, lit by neon sparks.",
      image: 'assets/img/rusted_junkyard.png' // 256x256 pixel art background
    }
  ];
  
  