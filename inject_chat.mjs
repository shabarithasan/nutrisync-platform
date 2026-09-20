import fs from 'fs';

let main = fs.readFileSync('src/main.jsx', 'utf8');

// Inject import
if (!main.includes('import AIChat')) {
  main = "import AIChat from './AIChat.jsx';\n" + main;
}

// Inject into App component
// Before: <LiveSensors /></div>}
// After: <LiveSensors /><AIChat /></div>}
if (main.includes('<LiveSensors /></div>}') && !main.includes('<AIChat />')) {
  main = main.replace(
    '<LiveSensors /></div>}',
    '<LiveSensors /><AIChat /></div>}'
  );
} else if (main.includes('{loading&&<LoadingOverlay/>}') && !main.includes('<AIChat />')) {
  main = main.replace(
    '{loading&&<LoadingOverlay/>}</div>}',
    '{loading&&<LoadingOverlay/>}<AIChat /></div>}'
  );
}

fs.writeFileSync('src/main.jsx', main);
console.log('Injected AIChat into main.jsx');
