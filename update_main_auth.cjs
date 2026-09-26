const fs = require('fs');
let code = fs.readFileSync('src/main.jsx', 'utf8');

const newAuthPage = `
const AuthPage = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-cream lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-[1700px] flex-col lg:h-screen lg:flex-row">
        {/* Brand / visual side */}
        <div className="relative h-[340px] flex-shrink-0 sm:h-[420px] lg:h-full lg:w-[55%] xl:w-[57%]">
          <BrandPanel />
        </div>

        {/* Form side */}
        <div className="min-h-0 flex-1 lg:h-full">
          <LoginForm onAuth={onAuth} />
        </div>
      </div>
    </div>
  );
};`;

code = code.replace(/const AuthPage=\(\{onAuth\}\)=>\{[\s\S]*?<\/div><\/div>\};/, newAuthPage);
fs.writeFileSync('src/main.jsx', code);
