import fs from 'fs';
let main = fs.readFileSync('src/main.jsx', 'utf8');

if (!main.includes('import BMIGauge')) {
  main = "import BMIGauge from './BMIGauge.jsx';\n" + main;
}

main = main.replace(
  'calculator:<NutritionCalculator profile={profile}/>',
  'calculator:<><BMIGauge profile={profile}/><NutritionCalculator profile={profile}/></>'
);

fs.writeFileSync('src/main.jsx', main);
console.log('BMIGauge injected');
