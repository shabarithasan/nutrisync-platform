import fs from 'fs';

let css = fs.readFileSync('src/styles.css', 'utf8');

const modernCss = `
/* Modern Component Overrides (21st.dev style) */

/* 1. Subtle Dot Background for the whole app */
.app {
  background-image: radial-gradient(var(--line) 1px, transparent 1px) !important;
  background-size: 32px 32px !important;
  background-color: var(--bg) !important;
}
.dark .app {
  background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) !important;
}

/* 2. Magic Sweep Button Animation for primary actions */
@keyframes sweep {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}
button.primary {
  position: relative;
  overflow: hidden;
}
button.primary::after {
  content: "";
  position: absolute;
  top: 0; left: -100%;
  width: 40%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  transform: skewX(-20deg);
  animation: sweep 4s infinite;
  pointer-events: none;
}

/* 3. Staggered Fade & Slide Up Animations for Dashboard Cards */
@keyframes slideUpCard {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.hero-card {
  animation: slideUpCard 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
.kpis article {
  animation: slideUpCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
.kpis article:nth-child(1) { animation-delay: 0.1s; }
.kpis article:nth-child(2) { animation-delay: 0.2s; }
.kpis article:nth-child(3) { animation-delay: 0.3s; }

.dt-grid > div {
  animation: slideUpCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
.dt-grid > div:nth-child(1) { animation-delay: 0.15s; }
.dt-grid > div:nth-child(2) { animation-delay: 0.20s; }
.dt-grid > div:nth-child(3) { animation-delay: 0.25s; }
.dt-grid > div:nth-child(4) { animation-delay: 0.30s; }
.dt-grid > div:nth-child(5) { animation-delay: 0.35s; }
.dt-grid > div:nth-child(6) { animation-delay: 0.40s; }
.dt-grid > div:nth-child(7) { animation-delay: 0.45s; }
.dt-grid > div:nth-child(8) { animation-delay: 0.50s; }

/* 4. Animated Progress Bar Fills (Grows from 0 on load) */
@keyframes fillWidth {
  from { width: 0 !important; }
}
.dt-fill {
  animation: fillWidth 1.2s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  animation-delay: 0.4s;
}

/* 5. Glowing pulse on the active track pills */
@keyframes softPulse {
  0% { box-shadow: 0 0 0 0 var(--mint); }
  70% { box-shadow: 0 0 0 10px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
.pill {
  animation: softPulse 2s infinite;
}

/* 6. Hover pop effect on dt-icons */
.dt-card:hover .dt-icon {
  transform: scale(1.15) rotate(-5deg);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.dt-icon {
  display: inline-block;
  transition: transform 0.3s;
}
`;

fs.writeFileSync('src/styles.css', css + modernCss);
console.log("Appended 21st.dev modern component features to CSS!");
