
import re
with open('src/main.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

match = re.search(r'<svg viewBox=\'0 0 700 230\'.*?</section>', code, re.DOTALL)
if not match:
    match = re.search(r'<svg viewBox="0 0 700 230".*?</section>', code, re.DOTALL)

if match:
    print('Match found!', len(match.group(0)))
else:
    print('Match not found!')
    idx = code.find('<svg viewBox')
    print('Index:', idx)

