(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Header: bordo allo scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  var toggleLabel = toggle.querySelector('.sr-only');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggleLabel.textContent = open ? toggle.dataset.close : toggle.dataset.open;
    nav.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- Reveal allo scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!hasIO || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    // Piccolo sfasamento tra elementi fratelli (es. le card)
    reveals.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains('reveal');
      });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------- Video in lazy load ---------- */
  var videos = document.querySelectorAll('.lazy-video');

  function loadVideo(video) {
    if (video.dataset.loaded) return;
    video.querySelectorAll('source[data-src]').forEach(function (s) {
      s.src = s.dataset.src;
    });
    video.load();
    video.dataset.loaded = '1';
  }

  if (reduceMotion) {
    // Niente autoplay: il video resta fermo sul poster, avviabile a mano
    videos.forEach(function (v) {
      v.controls = true;
      v.preload = 'none';
      loadVideo(v);
    });
  } else if (hasIO) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          loadVideo(v);
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: '200px 0px' });
    videos.forEach(function (v) { videoObserver.observe(v); });
  } else {
    videos.forEach(function (v) { loadVideo(v); v.autoplay = true; v.play(); });
  }

  /* ---------- WhatsApp flottante dopo l'hero ---------- */
  var waFloat = document.querySelector('.wa-float');
  var hero = document.getElementById('hero');
  var contact = document.getElementById('contatti');
  if (waFloat && hero && hasIO) {
    // Visibile dopo l'hero, nascosto nella sezione contatti (che ha già il suo pulsante)
    var inView = { hero: true, contatti: false };
    var waObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { inView[entry.target.id] = entry.isIntersecting; });
      waFloat.classList.toggle('is-visible', !inView.hero && !inView.contatti);
    }, { threshold: 0 });
    waObserver.observe(hero);
    if (contact) waObserver.observe(contact);
  } else if (waFloat) {
    waFloat.classList.add('is-visible');
  }

  /* ---------- Compositore messaggio WhatsApp ---------- */
  var form = document.getElementById('composer');
  var i18nEl = document.getElementById('composer-i18n');
  if (form && i18nEl) {
    var t = JSON.parse(i18nEl.textContent);
    var preview = document.getElementById('composer-preview');
    var send = document.getElementById('composer-send');

    var joinList = function (items) {
      if (items.length < 2) return items.join('');
      return items.slice(0, -1).join(', ') + t.and + items[items.length - 1];
    };
    var checked = function (name) {
      return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (i) {
        return i.value.toLowerCase();
      });
    };

    var update = function () {
      var lines = [t.greet];
      var pet = form.querySelector('input[name="pet"]:checked');
      var name = form.elements.petname.value.trim();
      if (pet) lines.push(t.pet[pet.value] + (name ? t.named.replace('{name}', name) : '') + '.');
      var needs = checked('need');
      if (needs.length) lines.push(t.need.replace('{list}', joinList(needs)));
      var when = checked('when');
      if (when.length) lines.push(t.when.replace('{list}', joinList(when)));
      var msg = lines.join('\n');
      preview.textContent = msg;
      send.href = 'https://wa.me/' + t.number + '?text=' + encodeURIComponent(msg);
    };

    form.addEventListener('change', update);
    form.addEventListener('input', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); send.click(); });
    update();
  }

  /* ---------- Micro-interazioni ---------- */
  // Nito e Lola fanno "miao!"
  document.querySelectorAll('.tag[data-say]').forEach(function (tag) {
    tag.addEventListener('click', function () {
      var old = tag.querySelector('.say');
      if (old) old.remove();
      var bubble = document.createElement('span');
      bubble.className = 'say';
      bubble.setAttribute('aria-hidden', 'true');
      bubble.textContent = tag.dataset.say;
      tag.appendChild(bubble);
      tag.classList.remove('is-wiggle');
      void tag.offsetWidth;
      tag.classList.add('is-wiggle');
      setTimeout(function () { bubble.remove(); }, 1500);
    });
  });

  // Cuoricini sulla foto dell'hero
  var heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto && !reduceMotion) {
    heroPhoto.addEventListener('click', function (e) {
      var rect = heroPhoto.getBoundingClientRect();
      var x = e.clientX ? e.clientX - rect.left : rect.width / 2;
      var y = e.clientY ? e.clientY - rect.top : rect.height / 2;
      for (var i = 0; i < 5; i++) {
        var h = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        h.setAttribute('class', 'pop-heart');
        h.setAttribute('aria-hidden', 'true');
        h.innerHTML = '<use href="#i-heart"/>';
        h.style.left = x + (Math.random() * 40 - 20) + 'px';
        h.style.top = y + 'px';
        h.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
        h.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg');
        h.style.animationDelay = (i * 70) + 'ms';
        heroPhoto.appendChild(h);
        setTimeout(h.remove.bind(h), 1400 + i * 70);
      }
    });
  }
})();
