import fs from 'fs';
let css = fs.readFileSync('src/styles.css', 'utf8');

css += `\n
/* Interactive hover for report list */
.report-list article {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.report-list article:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important;
}
.dark .report-list article:hover {
  box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important;
}
`;

fs.writeFileSync('src/styles.css', css);
console.log('Added interactive hover states to Reports page cards.');
