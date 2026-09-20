import fs from 'fs';
let css = fs.readFileSync('src/styles.css', 'utf8');

css += `\n
/* Holographic Parallax Sensor Tilt */
.panel, .dt-card, .hero-card {
  transform: perspective(1000px) rotateX(var(--rot-x, 0deg)) rotateY(var(--rot-y, 0deg));
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}
/* Ensure hover states override parallax slightly, or add to it */
.dt-card:hover {
  transform: perspective(1000px) rotateX(var(--rot-x, 0deg)) rotateY(var(--rot-y, 0deg)) translateY(-4px) scale(1.02);
}
`;

fs.writeFileSync('src/styles.css', css);
console.log('Added holographic parallax CSS!');
