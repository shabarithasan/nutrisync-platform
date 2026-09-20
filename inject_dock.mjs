import fs from 'fs';

let main = fs.readFileSync('src/main.jsx', 'utf8');

if (!main.includes('import MacOSDock')) {
  main = main.replace(
    'import React,{', 
    'import React,{useEffect,useState,useCallback,useRef} from "react";\nimport MacOSDock from "./MacOSDock.jsx";\n//'
  );
  // Wait, the original source says: import React,{useState,useEffect} from 'react'
  main = main.replace(
    "import React,{useState,useEffect} from 'react';",
    "import React,{useState,useEffect} from 'react';\nimport MacOSDock from './MacOSDock.jsx';"
  );
}

const dockAppsStr = `[
  { id: 'overview', name: 'Dashboard', icon: 'https://cdn.21st.dev/assets/mirror/99/9963f31f43cd77b0c28981ba7bac04db749a5749019f554d1afb75225a3e9151.png' },
  { id: 'progress', name: 'Progress', icon: 'https://cdn.21st.dev/assets/mirror/11/11d8587bae8852b8232d1f37e318c4b0fbbd2b0f2b61c71a79dbae327b4fa0c1.webp' },
  { id: 'water', name: 'Water Tracker', icon: 'https://cdn.21st.dev/assets/mirror/d5/d558230225bb0dd1897db6c7cf0d03b29506eef8078fe25313c48cd8f72d05ad.png' },
  { id: 'scan', name: 'Food Scanner', icon: 'https://cdn.21st.dev/assets/mirror/45/45c61147b702b2765802969df55878aa5f69e27abe656174339dc661d0f9a31d.png' },
  { id: 'reports', name: 'Reports', icon: 'https://cdn.21st.dev/assets/mirror/cb/cbfa4e5db383bbb86683edc2f7d309e9fd7000d07833f6449837be51b77558fa.png' },
  { id: 'calculator', name: 'Calculator', icon: 'https://cdn.21st.dev/assets/mirror/96/9639bd0ec3bae0b56bd8812f61c39d72123c6de272922e5bc7f3a24264112953.png' }
]`;

if (!main.includes('<MacOSDock')) {
  main = main.replace(
    "<Sidebar {...{page,setPage,dark,setDark,onLogout:()=>{setAuth(null);sessionStorage.removeItem('nts-auth')}}}/>",
    `<div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',zIndex:999}}><MacOSDock apps={${dockAppsStr}} onAppClick={setPage} openApps={[page]} /></div><Sidebar {...{page,setPage,dark,setDark,onLogout:()=>{setAuth(null);sessionStorage.removeItem('nts-auth')}}}/>`
  );
}

fs.writeFileSync('src/main.jsx', main);
console.log('Updated main.jsx with MacOSDock');
