const fs = require('fs');
['src/components/Charts.tsx', 'src/components/ScannerPanel.tsx', 'src/components/Widgets.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import type \{.*?\} from \'.*?\'\;/g, '');
  code = code.replace(/import type .*?;/g, '');
  code = code.replace(/import \{ type [^}]+ \} from \'.*?\';/g, match => match.replace('type ', ''));
  fs.writeFileSync(file, code);
});

