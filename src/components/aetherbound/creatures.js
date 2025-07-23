// creatures.js
export const creatures = {
  protoMeda: {
    name: "ProtoMeda",
    stats: {
      HP: 20,
      STR: 5,
      DEF: 5,
      SPD: 4,
      ACC: 3,
      CRIT: 2,
      EVA: 2,
      STAMINA: 5  // Ensure STAMINA is defined here
    }
  },
  feralMeda: {
    name: "FeralMeda",
    stats: {
      HP: 15,
      STR: 4,
      DEF: 2,
      SPD: 3,
      ACC: 2,
      CRIT: 1,
      EVA: 1,
      STAMINA: 0
    }
  }
};

// Example: Defining a single creature's evolution line as a JS object
// This could be placed in a separate `creatures.js` file and imported where needed.

const hydroCrustaceanLine = {
  name: "HydroCrustacean", // Name of the creature line, optional
  stages: {
    baby: {
      name: "Hydro-Nibble",
      stats: {
        hp: 10,
        attack: 2,
        defense: 1,
        speed: 3,
        accuracy: 2,
        evasion: 1
      },
      sprite: "assets/sprites/hydro_nibble_baby.png",
      evolveCondition: { xp: 10 } // Needs 10 XP to evolve
    },
    rookie: {
      name: "Hydro-Pincher",
      stats: {
        hp: 20,
        attack: 4,
        defense: 2,
        speed: 4,
        accuracy: 3,
        evasion: 2
      },
      sprite: "assets/sprites/hydro_pincher_rookie.png",
      evolveCondition: { xp: 30 } // Needs 30 XP total to evolve
    },
    champion: {
      name: "Hydro-Clasp",
      stats: {
        hp: 30,
        attack: 6,
        defense: 3,
        speed: 5,
        accuracy: 4,
        evasion: 3
      },
      sprite: "assets/sprites/hydro_clasp_champion.png",
      evolveCondition: { xp: 60 } // Needs 60 XP total to evolve
    },
    ultimate: {
      name: "Hydro-Sheller",
      stats: {
        hp: 45,
        attack: 8,
        defense: 5,
        speed: 6,
        accuracy: 5,
        evasion: 4
      },
      sprite: "assets/sprites/hydro_sheller_ultimate.png",
      evolveCondition: { xp: 100 } // Needs 100 XP total to evolve
    },
    mega: {
      name: "Hydro-Subcrusher",
      stats: {
        hp: 60,
        attack: 10,
        defense: 7,
        speed: 7,
        accuracy: 6,
        evasion: 5
      },
      sprite: "assets/sprites/hydro_subcrusher_mega.png",
      evolveCondition: null // Mega might be final stage, no evolve
    }
  }
};

// Export for use in other parts of the code
export default hydroCrustaceanLine;

