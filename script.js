(function () {
  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  // ---- Compte à rebours jusqu'au 25 décembre
  var el = document.getElementById('countdown');
  var now = new Date();
  var noel = new Date(now.getFullYear(), 11, 25);
  var days = Math.ceil((noel - now) / 86400000);
  if (days > 1) el.textContent = 'Noël dans ' + days + ' jours';
  else if (days === 1) el.textContent = 'Noël demain';
  else if (days === 0) el.textContent = 'Joyeux Noël';
  if (calme) return;

  // ---- Apparition au scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });

  // ---- Barre de progression
  var bar = document.querySelector('.progress');
  function progress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
  }
  window.addEventListener('scroll', progress, { passive: true });
  progress();

  // ---- Mosaïque : les images suivent la souris
  var hero = document.querySelector('.hero');
  var mosaic = document.querySelector('.mosaic');
  hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    mosaic.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    mosaic.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  hero.addEventListener('mouseleave', function () {
    mosaic.style.setProperty('--mx', 0);
    mosaic.style.setProperty('--my', 0);
  });

  // ---- Images des cadeaux : effet 3D qui penche vers la souris
  document.querySelectorAll('.gift__visual').forEach(function (box) {
    var img = box.querySelector('img');
    box.addEventListener('mousemove', function (e) {
      var r = box.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = 'rotateY(' + (x * 18) + 'deg) rotateX(' + (-y * 18) + 'deg) scale(1.05)';
    });
    box.addEventListener('mouseleave', function () { img.style.transform = ''; });
  });

  // ---- Neige
  var cv = document.getElementById('snow');
  var ctx = cv.getContext('2d');
  var W, H, flakes = [];
  function size() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  size();
  window.addEventListener('resize', size);
  var count = W < 700 ? 40 : 80;
  for (var i = 0; i < count; i++) {
    flakes.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.8 + 1, v: Math.random() * 0.8 + 0.4,
      d: Math.random() * Math.PI * 2
    });
  }
  function neige() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(150, 160, 175, 0.75)';
    flakes.forEach(function (f) {
      f.d += 0.01;
      f.y += f.v;
      f.x += Math.sin(f.d) * 0.6;
      if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(neige);
  }
  neige();
})();
