import fs from 'fs';

let main = fs.readFileSync('src/main.jsx', 'utf8');

// Inject import if not exists
if (!main.includes('import LiveSensors')) {
  main = "import LiveSensors from './LiveSensors.jsx';\n" + main;
}

// Inject into App component
// Currently the App component returns:
// return <div className={dark?'app dark':'app'}><div style={{...}}>...</div><main className="content">{content}</main>{loading&&<LoadingOverlay/>}</div>}
// We can just append <LiveSensors /> before the closing </div> of App.
const injectionPoint = '{loading&&<LoadingOverlay/>}</div>}';
if (main.includes(injectionPoint) && !main.includes('<LiveSensors />')) {
  main = main.replace(
    '{loading&&<LoadingOverlay/>}</div>}',
    '{loading&&<LoadingOverlay/>}<LiveSensors /></div>}'
  );
  
  // Also we can add global CSS for the holographic tilt on cards!
  // I'll do that in styles.css
}

fs.writeFileSync('src/main.jsx', main);
console.log('Injected LiveSensors into main.jsx');
