const fs = require('fs');
['src/components/Charts.tsx', 'src/components/ScannerPanel.tsx', 'src/components/Widgets.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/..\/..\/utils\/cn/g, '../utils/cn');
  code = code.replace(/..\/..\/data\/dashboardData/g, '../utils/dashboardData');
  fs.writeFileSync(file, code);
});

