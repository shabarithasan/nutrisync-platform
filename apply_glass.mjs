import fs from 'fs';

let css = fs.readFileSync('src/styles.css', 'utf8');

const glassCss = `
/* Liquid Glass & MacOS Styling Override */
:root {
  --card: rgba(255, 255, 255, 0.6);
  --line: rgba(255, 255, 255, 0.4);
}
.dark {
  --card: rgba(0, 0, 0, 0.5);
  --line: rgba(255, 255, 255, 0.1);
}

.app {
  background: radial-gradient(circle at top right, #e0f2fe, transparent 60%),
              radial-gradient(circle at bottom left, #fdf4ff, transparent 60%),
              #f8fafc !important;
  background-image: radial-gradient(var(--line) 1px, transparent 1px) !important;
  background-size: 32px 32px, 32px 32px, 32px 32px !important;
}
.dark .app {
  background: radial-gradient(circle at top right, #1e1b4b, transparent 60%),
              radial-gradient(circle at bottom left, #064e3b, transparent 60%),
              #0f172a !important;
  background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) !important;
}

.panel, .kpis article, .dt-card, .profile-card, .water-card, .auth-card {
  backdrop-filter: blur(24px) saturate(1.2) !important;
  -webkit-backdrop-filter: blur(24px) saturate(1.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  background: var(--card) !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1) !important;
}

.dark .panel, .dark .kpis article, .dark .dt-card, .dark .profile-card, .dark .water-card, .dark .auth-card {
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
}

/* Hide Sidebar and expand content for MacOS Dock */
.side {
  display: none !important;
}
.content {
  margin-left: 0 !important;
  width: 100% !important;
  padding-bottom: 120px !important;
}
@media (min-width: 1050px) {
  .content {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
}
`;

fs.writeFileSync('src/styles.css', css + glassCss);
console.log('Appended liquid glass styling to styles.css');
