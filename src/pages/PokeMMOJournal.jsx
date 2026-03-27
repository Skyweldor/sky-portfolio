import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import styles from './PokeMMOJournal.module.css';

const PokeMMOJournal = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <div className={styles.wrapper}>
        {/* Back link */}
        <div className={styles.backLinkRow}>
          <Link to="/blog" className={styles.backLink}>
            &larr; Back to Blog
          </Link>
        </div>

        {/* ==================== HEADER ==================== */}
        <header className={styles.blogHeader}>
          <div className={styles.blogName}>&#9670; PokeMMO Journal</div>
          <h1 className={styles.postTitle}>
            First Steps in Kanto:<br />Humbled by a Weedle
          </h1>
          <div className={styles.postMeta}>
            <span className={styles.postDate}>Entry 001 &mdash; March 2026</span>
            <span className={styles.tag}>Kanto</span>
            <span className={styles.tag}>Badges: 1</span>
            <span className={styles.tag}>Beginner</span>
          </div>
        </header>

        {/* ==================== BODY ==================== */}
        <div className={styles.postBody}>
          <p className={styles.dropCap}>
            There is a particular kind of arrogance that comes with being a Pokémon veteran. You've played the games before — maybe many times. You know the routes, you remember the gyms, you understand type matchups in your sleep. So when you fire up PokeMMO for the first time and step out of Pallet Town with a Squirtle at your side, you feel ready. Comfortable, even.
          </p>

          <p>Viridian Forest had other plans.</p>

          <div className={styles.sectionLabel}>The Humbling</div>

          <p>
            It happened fast. A wild Weedle — level 9, nothing remarkable — appeared in the tall grass. I'd seen Weedle a hundred times before. Low-level bug, weak stats, generally something you one-shot and move on from. What I didn't know, and had no reason to expect, is that PokeMMO reworks Pokémon learnsets. This Weedle had <strong>Bug Bite</strong> — 60 base power, STAB, and enough punch at that point in the game to put my Squirtle down before I could process what was happening.
          </p>

          {/* Battle log */}
          <div className={styles.battleLog}>
            <div className={styles.logLine}>Wild WEEDLE appeared!</div>
            <div className={styles.logHighlight}>Go! SQUIRTLE!</div>
            <div className={styles.logLine}>&gt; SQUIRTLE used Bubble...</div>
            <div className={styles.logLine}>Wild WEEDLE used BUG BITE!</div>
            <div className={styles.logDamage}>It's super effective!</div>
            <div className={styles.logDamage}>SQUIRTLE fainted.</div>
            <div className={styles.logLine}>&nbsp;</div>
            <div className={styles.logLine}>...oh.</div>
          </div>

          <p>
            The lesson was immediate and delivered without sympathy: <em>PokeMMO is not FireRed</em>. The familiar shell is there — the routes, the towns, the music, the pixel art — but underneath it the game has been reworked in ways that quietly punish assumptions. Wild Pokémon can carry moves from higher levels. Learnsets are altered. Gym leaders have stronger teams. The engine is familiar, but the game is new.
          </p>

          <p>
            I respect it, honestly. Nothing reawakens your attention to a game you think you already know like getting flattened by something that should have been trivial.
          </p>

          <div className={styles.sectionLabel}>The Team Takes Shape</div>

          <p>
            Before reaching Pewter City, the roster started coming together piece by piece. Squirtle — my starter, a reliable Water-type tank with a move in Bite at level 18 that will eventually let him threaten Psychic-types — was the foundation. Then came a <strong>Pidgey</strong> on Route 2, caught at level 7. Unremarkable at that stage, but Pidgey's Bug resistance (quarter damage from Bug-type moves) made it immediately useful as a Viridian Forest answer. And its line eventually becomes fast, which matters.
          </p>

          <p>Then — partly out of spite for what had happened to me — I caught a Weedle of my own.</p>

          <p>
            I let it reach level 9 before evolving it, specifically so it could learn Bug Bite. As a Beedrill it came out of Kakuna already knowing <strong>Twineedle</strong> as a starting move — PokeMMO's updated version of the classic learnset — so the evolution gave me a Bug-type attacker with two STAB moves and genuine offensive presence before Pewter City. With Swarm as its ability, a pinched Beedrill hits hard.
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutLabel}>&#9632; Journal Note</div>
            <p>Twineedle has a 20% chance per hit to inflict poison — two hits means roughly 36% combined. Against certain gym trainers this has already won battles that looked close on paper.</p>
          </div>

          <p>
            The real surprise of the early game came at <strong>Mt. Moon</strong>, where I caught an <strong>Onix</strong>. At level 8 it already has Stealth Rock — an entry hazard that becomes quietly devastating as the game goes on — and its Rock Head ability means no recoil damage. It's an Onix, so the ceiling feels limited at first glance, but for right now it absorbs hits and sets up hazards and that is genuinely useful. Squirtle, meanwhile, had evolved into Wartortle by the time we cleared Mt. Moon, which felt like a small milestone worth marking.
          </p>

          <div className={styles.sectionLabel}>Brock</div>

          <p>
            The first gym was, in fairness, designed to be straightforward for a Water starter. Brock's Geodude and Onix buckle to Water Gun and later Water Pulse without much drama. The Boulder Badge brought the level cap up to 26 and, critically, unlocked the <strong>Running Shoes</strong> — handed over by a man in glasses just east of Pewter City, who stops you as you try to leave. A small quality-of-life moment, but a welcome one after every route feeling slightly too slow.
          </p>

          <p>One badge. Route 3 cleared. Mt. Moon navigated. Cerulean City reached.</p>

          <div className={styles.sectionLabel}>Current Party</div>

          {/* Team grid */}
          <div className={styles.teamGrid}>
            <div className={styles.pokeCard} data-type="water">
              <div className={styles.pokeName}>Wartortle</div>
              <div className={styles.pokeLevel}>Lv. 19</div>
              <div className={styles.typeBadges}>
                <span className={`${styles.typeBadge} ${styles.typeWater}`}>Water</span>
              </div>
              <div className={styles.pokeAbility}>Torrent</div>
            </div>

            <div className={styles.pokeCard} data-type="bug">
              <div className={styles.pokeName}>Beedrill</div>
              <div className={styles.pokeLevel}>Lv. 12</div>
              <div className={styles.typeBadges}>
                <span className={`${styles.typeBadge} ${styles.typeBug}`}>Bug</span>
                <span className={`${styles.typeBadge} ${styles.typePoison}`}>Poison</span>
              </div>
              <div className={styles.pokeAbility}>Swarm</div>
            </div>

            <div className={styles.pokeCard} data-type="flying">
              <div className={styles.pokeName}>Pidgey</div>
              <div className={styles.pokeLevel}>Lv. 10</div>
              <div className={styles.typeBadges}>
                <span className={`${styles.typeBadge} ${styles.typeNormal}`}>Normal</span>
                <span className={`${styles.typeBadge} ${styles.typeFlying}`}>Flying</span>
              </div>
              <div className={styles.pokeAbility}>Tangled Feet</div>
            </div>

            <div className={styles.pokeCard} data-type="rock">
              <div className={styles.pokeName}>Onix</div>
              <div className={styles.pokeLevel}>Lv. 8</div>
              <div className={styles.typeBadges}>
                <span className={`${styles.typeBadge} ${styles.typeRock}`}>Rock</span>
                <span className={`${styles.typeBadge} ${styles.typeGround}`}>Ground</span>
              </div>
              <div className={styles.pokeAbility}>Rock Head</div>
            </div>
          </div>

          <div className={styles.sectionLabel}>What PokeMMO Actually Is</div>

          <p>
            For anyone reading this who hasn't tried it: PokeMMO is a fan-made MMO that runs on the ROMs of FireRed, Emerald, Platinum, HeartGold, and Black — five regions, all accessible on a single character, with a shared player-driven economy, a level cap system tied to gym badges, and a breeding mechanic where the parents are <em>consumed</em> to create the offspring. That last part is deliberate. It creates perpetual demand, keeps the market moving, and makes every well-bred Pokémon worth something.
          </p>

          <p>
            There is no fast-forward button. No speed multiplier. If you're coming from emulators where 4x speed is a keystroke away, that adjustment is real. The trade-off is that the world is populated — there are other trainers running the same routes, other players visible in towns, a functioning economy where Safari Zone items and rare catches have actual value. It feels like something, in a way that a solo emulator playthrough eventually stops feeling like.
          </p>

          <p>
            Cerulean City awaits. Misty's Starmie is reportedly no pushover in PokeMMO's reworked version. I imagine I'll find out the hard way.
          </p>
        </div>

        {/* ==================== FOOTER ==================== */}
        <footer className={styles.postFooter}>
          <div>
            <div className={styles.nextLabel}>Up next &mdash;</div>
            <div className={styles.nextHint}>Cerulean City &amp; the Misty Problem</div>
          </div>
          <div className={styles.badgeCount}>
            &#9632; 1 / 8 BADGES
            <span>Kanto</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PokeMMOJournal;
