import fs from 'fs';
let c = fs.readFileSync('public/landing.html', 'utf8');
const script = `<script>
['click','mousedown','pointerdown','mouseup','pointerup'].forEach(ev => window.addEventListener(ev, function(e) {
  let el = e.target.closest('a') || e.target.closest('[data-reset="button"]');
  if (el) {
    let text = el.innerText || el.textContent || '';
    let href = el.getAttribute('href') || '';
    if (href.includes('/login') || text.includes('Log in')) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (ev === 'click' || ev === 'mouseup' || ev === 'pointerup') {
        e.preventDefault();
        window.location.href = '/login';
      }
    }
  }
}, true));
</script>`;
c = c.replace(/<script>\[.*?<\/script>/, script);
fs.writeFileSync('public/landing.html', c);
