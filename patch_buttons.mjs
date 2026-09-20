import fs from 'fs';

let html = fs.readFileSync('public/landing.html', 'utf8');

// Remove the previous interceptor script from head
html = html.replace(/<script>\s*\(function\(\)\s*\{\s*var LOGIN_URL[\s\S]*?\}\)\(\);\s*<\/script>/g, '');

const script = `
<script>
  window.LOGIN_URL = 'https://nutrisync-platform.onrender.com/login';
  window.forceLogin = function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    window.location.href = window.LOGIN_URL;
    return false;
  };
  
  function patchAllButtons() {
    var anchors = document.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      var txt = (a.textContent || '').trim();
      if (txt === 'Log in / Sign up') {
        if (!a.dataset.patched) {
          a.dataset.patched = 'true';
          a.addEventListener('mousedown', window.forceLogin, true);
          a.addEventListener('pointerdown', window.forceLogin, true);
          a.addEventListener('click', window.forceLogin, true);
          a.onclick = window.forceLogin;
        }
      }
    }
  }

  // Observe all DOM changes to catch buttons as soon as Framer renders them
  new MutationObserver(patchAllButtons).observe(document.documentElement, {childList: true, subtree: true});
  
  // Fallback interval
  setInterval(patchAllButtons, 500);
</script>
`;

html = html.replace('<head>', '<head>\n' + script);

fs.writeFileSync('public/landing.html', html);
console.log('Script updated with MutationObserver and dataset attribute.');
