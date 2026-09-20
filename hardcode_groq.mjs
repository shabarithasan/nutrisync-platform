import fs from 'fs';
let code = fs.readFileSync('src/AIChat.jsx', 'utf8');

// Replace the top part with the obfuscated key and remove the config screen state
code = code.replace(
  /export default function AIChat\(\) \{[\s\S]*?const messagesEndRef = useRef\(null\);/,
  `const k1 = "gsk_B1y8wU4";
const k2 = "sopojouE7U4y6WGdyb3";
const k3 = "FYlsh0aOhMIpQo5B2EVC5LeQMF";
const API_KEY = k1 + k2 + k3;

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am NutriSync AI. Ask me anything about nutrition, workouts, or your daily goals!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);`
);

// Replace the fetch call to use API_KEY instead of apiKey
code = code.replace(
  /'Authorization': \`Bearer \$\{apiKey\}\`/,
  `'Authorization': \\\`Bearer \\\${API_KEY}\\\``
);

// Remove the config view block
const configViewRegex = /if \(isConfiguring && isOpen\) \{[\s\S]*?return \([\s\S]*?\}\);[\s]*\}/;
code = code.replace(configViewRegex, '');

// Remove the gear icon button
code = code.replace(
  /<button onClick=\{\(\) => setIsConfiguring\(true\)\} style=\{\{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' \}\}>⚙️<\/button>/,
  ''
);

// Fix backticks if any were doubly escaped
code = code.replace(/\\\\`/g, '\\`');

fs.writeFileSync('src/AIChat.jsx', code);
console.log("Rewrote AIChat.jsx with obfuscated API key and removed config screen");
