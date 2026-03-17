/* Clan O'Mahony - site.js */

(function() {
  // Browser detection for CSS classes (modern version without jQuery.browser)
  var data = [
    {str: navigator.userAgent, sub: 'Chrome', ver: 'Chrome', name: 'chrome'},
    {str: navigator.vendor, sub: 'Apple', ver: 'Version', name: 'safari'},
    {prop: window.opera, ver: 'Opera', name: 'opera'},
    {str: navigator.userAgent, sub: 'Firefox', ver: 'Firefox', name: 'firefox'},
    {str: navigator.userAgent, sub: 'MSIE', ver: 'MSIE', name: 'ie'}
  ];
  for (var n = 0; n < data.length; n++) {
    if ((data[n].str && data[n].str.indexOf(data[n].sub) !== -1) || data[n].prop) {
      var v = function(s) {
        var i = s.indexOf(data[n].ver);
        return (i !== -1) ? parseInt(s.substring(i + data[n].ver.length + 1)) : '';
      };
      document.documentElement.className += ' ' + data[n].name + ' ' + data[n].name + v(navigator.userAgent);
      break;
    }
  }
})();

document.addEventListener('DOMContentLoaded', function() {

  // Process hmenu and vmenu - build span wrappers for top-level items
  var menuItems = document.querySelectorAll('ul.hmenu > li:not(.hmenu-li-separator), ul.vmenu > li:not(.vmenu-separator)');
  menuItems.forEach(function(val) {
    var spans = val.querySelectorAll(':scope > span');
    if (spans.length === 0) return;
    var tSpan = val.querySelector('span.t');
    if (!tSpan) return;
    var link = val.querySelector(':scope > a');
    if (link) {
      var newSpan = document.createElement('span');
      newSpan.className = 't';
      newSpan.textContent = tSpan.textContent;
      link.appendChild(newSpan);
    }
    spans.forEach(function(s) { s.remove(); });
  });

  // VMenu: click on #-links toggles submenu
  document.querySelectorAll('ul.vmenu a[href="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var vmenu = this.closest('.vmenu');
      if (vmenu) vmenu.querySelectorAll('.active').forEach(function(el) { el.classList.remove('active'); });
      this.classList.add('active');
      var next = this.nextElementSibling;
      if (next) next.classList.add('active');
      var parentUl = this.closest('ul.vmenu ul');
      if (parentUl) {
        parentUl.classList.add('active');
        var prev = parentUl.previousElementSibling;
        if (prev) prev.classList.add('active');
      }
      var parentLis = [];
      var el = this.parentElement;
      while (el && !el.classList.contains('vmenu')) {
        if (el.tagName === 'LI') el.classList.add('active');
        el = el.parentElement;
      }
    });
  });

  // HMenu: prevent default on # links
  document.querySelectorAll('ul.hmenu a[href="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) { e.preventDefault(); });
  });

  // Button hover effects
  document.querySelectorAll('.button-wrapper').forEach(function(wrapper) {
    var btn = wrapper.querySelector('.button, input.button');
    if (!btn) return;
    btn.addEventListener('mouseover', function() { wrapper.classList.add('hover'); });
    btn.addEventListener('mouseout', function() { wrapper.classList.remove('hover'); if (!btn.classList.contains('active')) wrapper.classList.remove('active'); });
    btn.addEventListener('mousedown', function() { wrapper.classList.remove('hover'); if (!btn.classList.contains('active')) wrapper.classList.add('active'); });
    btn.addEventListener('mouseup', function() { if (!btn.classList.contains('active')) wrapper.classList.remove('active'); });
  });

  // Layout height equalization
  var c = document.querySelector('div.content');
  if (c && c.parentElement) {
    var updateHeight = function() {
      c.style.height = 'auto';
      var r = window.innerHeight - document.getElementById('main').offsetHeight;
      if (r > 0) c.style.height = (r + c.offsetHeight) + 'px';
    };
    window.addEventListener('resize', updateHeight);
    updateHeight();
  }

  // Simple coinslider replacement for static site
  initSlideshow();

});

function initSlideshow() {
  var container = document.getElementById('vslider_optionscontainer');
  if (!container) return;
  var slider = document.getElementById('vslider_options');
  if (!slider) return;

  var slides = slider.querySelectorAll('a');
  if (slides.length === 0) return;

  var current = 0;
  var total = slides.length;

  // Hide all slides, show first
  slides.forEach(function(s, i) {
    s.style.display = i === 0 ? 'block' : 'none';
    s.style.position = 'relative';
  });

  // Create navigation dots
  var btnContainer = document.createElement('div');
  btnContainer.className = 'cs-buttons';
  for (var i = 0; i < total; i++) {
    var btn = document.createElement('a');
    btn.href = '#';
    btn.setAttribute('data-index', i);
    if (i === 0) btn.className = 'cs-active';
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      goTo(parseInt(this.getAttribute('data-index')));
    });
    btnContainer.appendChild(btn);
  }
  container.appendChild(btnContainer);

  // Create prev/next
  var prev = document.createElement('a');
  prev.className = 'cs-prev'; prev.href = '#'; prev.innerHTML = '&#8249;';
  prev.addEventListener('click', function(e) { e.preventDefault(); goTo((current - 1 + total) % total); });

  var next = document.createElement('a');
  next.className = 'cs-next'; next.href = '#'; next.innerHTML = '&#8250;';
  next.addEventListener('click', function(e) { e.preventDefault(); goTo((current + 1) % total); });

  slider.appendChild(prev);
  slider.appendChild(next);

  function goTo(idx) {
    slides[current].style.display = 'none';
    btnContainer.children[current].className = '';
    current = idx;
    slides[current].style.display = 'block';
    btnContainer.children[current].className = 'cs-active';
  }

  // Auto advance
  setInterval(function() { goTo((current + 1) % total); }, 8000);
}
