window.LOGIN_URL = 'https://nutrisync-platform.onrender.com/login';
window.forceLogin = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  // Use setTimeout to run AFTER Framer finishes its internal routing/pushState
  setTimeout(function() {
    window.location.href = window.LOGIN_URL;
  }, 10);
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
