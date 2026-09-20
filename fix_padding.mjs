import fs from 'fs';

let css = fs.readFileSync('src/styles.css', 'utf8');

css += `\n
/* Fix left dock overlap */
.content {
  padding-left: 110px !important;
  box-sizing: border-box !important;
}
@media (min-width: 1050px) {
  .content {
    padding-left: 120px !important;
  }
}
@media (max-width: 768px) {
  .content {
    padding-left: 80px !important;
  }
}
`;

fs.writeFileSync('src/styles.css', css);
console.log('Fixed padding in styles.css');
