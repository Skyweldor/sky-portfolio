import React, { createContext, useContext, useState, useCallback } from 'react';
import styles from './ModelDebugPanel.module.css';

/* ── Default values matching current PokemonModelViewer ── */
const DEFAULTS = {
  // Layout
  gridColumns: 3,
  gridGap: 36,
  rosterMaxWidth: 900,
  showTitleBar: false,
  showInfoStrip: true,
  overlayOpacity: 99,
  cardBorderRadius: 8,
  // Canvas
  height: 240,
  bgColor: '#000a19',
  // Camera
  cameraX: 0,
  cameraY: 1.5,
  cameraZ: 3,
  fov: 60,
  // Model
  modelScale: 0.65,
  rotateSpeed: 0.35,
  // Lighting
  ambientIntensity: 0.4,
  dirIntensity: 0.9,
  dirX: 3,
  dirY: 4,
  dirZ: 2,
  rimIntensity: 1.2,
  rimX: -2,
  rimY: 1,
  rimZ: -2,
  // Orbit
  enableZoom: false,
  minPolar: 0,
  maxPolar: 180,
};

const DebugContext = createContext({ settings: DEFAULTS, active: false });

export const useModelDebug = () => useContext(DebugContext);

/* ============================================================
   Provider — wraps the page
   ============================================================ */
export const ModelDebugProvider = ({ children }) => {
  const [active, setActive] = useState(false);
  const [settings, setSettings] = useState({ ...DEFAULTS });

  const update = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setSettings({ ...DEFAULTS });
  }, []);

  const exportSettings = useCallback(() => {
    const output = JSON.stringify(settings, null, 2);
    navigator.clipboard.writeText(output).then(() => {
      alert('Settings copied to clipboard!');
    });
  }, [settings]);

  return (
    <DebugContext.Provider value={{ settings, active }}>
      {children}

      {/* Toggle button */}
      <button
        className={styles.toggleBtn}
        onClick={() => setActive((a) => !a)}
        title="Toggle debug panel"
      >
        {active ? '✕' : '⚙'}
      </button>

      {/* Debug panel */}
      {active && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>MODEL DEBUG</span>
            <div className={styles.headerActions}>
              <button className={styles.actionBtn} onClick={reset}>
                RESET
              </button>
              <button className={styles.actionBtn} onClick={exportSettings}>
                EXPORT
              </button>
            </div>
          </div>

          <div className={styles.panelBody}>
            {/* ── Layout ── */}
            <Section title="LAYOUT">
              <Slider label="Columns" k="gridColumns" min={1} max={4} step={1} value={settings.gridColumns} onChange={update} />
              <Slider label="Gap" k="gridGap" min={0} max={80} step={4} value={settings.gridGap} onChange={update} unit="px" />
              <Slider label="Max W" k="rosterMaxWidth" min={600} max={1800} step={50} value={settings.rosterMaxWidth} onChange={update} unit="px" />
              <Slider label="Radius" k="cardBorderRadius" min={0} max={24} step={1} value={settings.cardBorderRadius} onChange={update} unit="px" />
              <Toggle label="Title Bar" k="showTitleBar" value={settings.showTitleBar} onChange={update} />
              <Toggle label="Name Strip" k="showInfoStrip" value={settings.showInfoStrip} onChange={update} />
              <Slider label="Overlay α" k="overlayOpacity" min={50} max={100} step={1} value={settings.overlayOpacity} onChange={update} unit="%" />
            </Section>

            {/* ── Canvas ── */}
            <Section title="CANVAS">
              <Slider label="Height" k="height" min={200} max={700} step={10} value={settings.height} onChange={update} unit="px" />
              <Slider label="BG" k="bgColor" type="color" value={settings.bgColor} onChange={update} />
            </Section>

            {/* ── Camera ── */}
            <Section title="CAMERA">
              <Slider label="X" k="cameraX" min={-10} max={10} step={0.1} value={settings.cameraX} onChange={update} />
              <Slider label="Y" k="cameraY" min={-10} max={10} step={0.1} value={settings.cameraY} onChange={update} />
              <Slider label="Z" k="cameraZ" min={0.5} max={15} step={0.1} value={settings.cameraZ} onChange={update} />
              <Slider label="FOV" k="fov" min={10} max={120} step={1} value={settings.fov} onChange={update} unit="°" />
            </Section>

            {/* ── Model ── */}
            <Section title="MODEL">
              <Slider label="Scale" k="modelScale" min={0.1} max={5} step={0.05} value={settings.modelScale} onChange={update} unit="×" />
              <Slider label="Rotate" k="rotateSpeed" min={0} max={3} step={0.05} value={settings.rotateSpeed} onChange={update} />
            </Section>

            {/* ── Lighting ── */}
            <Section title="LIGHTING">
              <Slider label="Ambient" k="ambientIntensity" min={0} max={3} step={0.05} value={settings.ambientIntensity} onChange={update} />
              <Slider label="Dir Int" k="dirIntensity" min={0} max={5} step={0.1} value={settings.dirIntensity} onChange={update} />
              <Slider label="Dir X" k="dirX" min={-10} max={10} step={0.5} value={settings.dirX} onChange={update} />
              <Slider label="Dir Y" k="dirY" min={-10} max={10} step={0.5} value={settings.dirY} onChange={update} />
              <Slider label="Dir Z" k="dirZ" min={-10} max={10} step={0.5} value={settings.dirZ} onChange={update} />
              <Slider label="Rim Int" k="rimIntensity" min={0} max={5} step={0.1} value={settings.rimIntensity} onChange={update} />
              <Slider label="Rim X" k="rimX" min={-10} max={10} step={0.5} value={settings.rimX} onChange={update} />
              <Slider label="Rim Y" k="rimY" min={-10} max={10} step={0.5} value={settings.rimY} onChange={update} />
              <Slider label="Rim Z" k="rimZ" min={-10} max={10} step={0.5} value={settings.rimZ} onChange={update} />
            </Section>

            {/* ── Controls ── */}
            <Section title="ORBIT">
              <Toggle label="Zoom" k="enableZoom" value={settings.enableZoom} onChange={update} />
              <Slider label="Min Polar" k="minPolar" min={0} max={180} step={1} value={settings.minPolar} onChange={update} unit="°" />
              <Slider label="Max Polar" k="maxPolar" min={0} max={180} step={1} value={settings.maxPolar} onChange={update} unit="°" />
            </Section>
          </div>
        </div>
      )}
    </DebugContext.Provider>
  );
};

/* ── Reusable sub-components ── */

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>// {title}</div>
      {children}
    </div>
  );
}

function Slider({ label, k, min, max, step, value, onChange, unit, type }) {
  if (type === 'color') {
    return (
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(k, e.target.value)}
          className={styles.colorInput}
        />
        <span className={styles.val}>{value}</span>
      </div>
    );
  }
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(k, parseFloat(e.target.value))}
        className={styles.slider}
      />
      <span className={styles.val}>
        {typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}
        {unit || ''}
      </span>
    </div>
  );
}

function Toggle({ label, k, value, onChange }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <button
        className={`${styles.toggleSwitch} ${value ? styles.on : ''}`}
        onClick={() => onChange(k, !value)}
      >
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}

export default ModelDebugProvider;
