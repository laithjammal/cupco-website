/* Kestrel Flight Academy. No build step. GSAP and ScrollTrigger are vendored in assets/vendor. */
(function(){
'use strict';

/* ---------------- Config: edit these ---------------- */
var CONFIG = {
  FORM_ENDPOINT: '',                                 /* Formspree (or similar) POST URL. Blank = open the visitor's email app instead. */
  CONTACT_EMAIL: 'enquiries@kestrelflight.example',  /* Replace with the school's real address. */
  CONTACT_PHONE: '',                                 /* e.g. '+61 2 0000 0000'. Blank hides the phone line. */
  HOURLY_RATE: null                                  /* e.g. 285. When set, the planner also shows a minimum flying cost. */
};

var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasGsap = !!(window.gsap && window.ScrollTrigger);
var $ = function(s, r){ return (r||document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

if(!hasGsap || reduce){ document.documentElement.classList.remove('motion'); }
if(hasGsap){ gsap.registerPlugin(ScrollTrigger); }

/* ---------------- Contact lines ---------------- */
(function(){
  var phone = $('#phoneLink'), email = $('#emailLink');
  if(CONFIG.CONTACT_PHONE){
    phone.href = 'tel:' + CONFIG.CONTACT_PHONE.replace(/[^+\d]/g,'');
    $('#phoneText').textContent = CONFIG.CONTACT_PHONE;
  } else { phone.hidden = true; }
  email.href = 'mailto:' + CONFIG.CONTACT_EMAIL;
  $('#emailText').textContent = CONFIG.CONTACT_EMAIL;
  $('#footContact').textContent = CONFIG.CONTACT_EMAIL;
})();

/* ---------------- Nav ---------------- */
(function(){
  var nav = $('#nav'), btn = $('#menuBtn'), menu = $('#menu');
  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(function(e){ nav.classList.toggle('is-solid', !e[0].isIntersecting); }).observe(sentinel);

  function setMenu(open){
    menu.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.firstElementChild.firstElementChild.setAttribute('href', open ? '#i-x' : '#i-list');
    nav.classList.toggle('is-solid', open || nav.classList.contains('is-solid'));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function(){ setMenu(!menu.classList.contains('is-open')); });
  $$('a', menu).forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setMenu(false); });
})();

/* ---------------- Sky scenes (canvas) ----------------
   Motivation: the page sells flying, so the background is a live sky.
   One rAF loop, drawing only the scenes currently on screen. */
(function(){
  var PAL = {
    dusk:{ stops:[[0,'#080D1C'],[.5,'#1D3560'],[.82,'#B25A38'],[1,'#FF9A55']], sun:[.74,.86,'rgba(255,170,100,.55)'], cloud:'255,214,190' },
    day: { stops:[[0,'#12406F'],[.55,'#2F7BB8'],[1,'#BCDCF2']], sun:[.78,.2,'rgba(255,255,255,.35)'], cloud:'255,255,255' }
  };
  var scenes = [], mx = 0, my = 0, tmx = 0, tmy = 0, running = false;

  function rnd(seed){ return function(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  function sprite(rgb){
    var c = document.createElement('canvas'); c.width = 520; c.height = 220;
    var g = c.getContext('2d'), r = rnd(42);
    for(var i = 0; i < 16; i++){
      var x = 90 + r()*340, y = 80 + r()*70, rad = 40 + r()*60;
      var gr = g.createRadialGradient(x,y,0,x,y,rad);
      gr.addColorStop(0,'rgba('+rgb+',.55)'); gr.addColorStop(1,'rgba('+rgb+',0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x,y,rad,0,7); g.fill();
    }
    return c;
  }

  function Scene(canvas){
    var key = canvas.getAttribute('data-sky'), pal = PAL[key] || PAL.dusk;
    this.c = canvas; this.pal = pal; this.g = canvas.getContext('2d');
    this.spr = sprite(pal.cloud); this.visible = false; this.w = 0; this.h = 0; this.dpr = 1;
    var r = rnd(key === 'day' ? 7 : 11);
    this.layers = [0,1,2].map(function(i){
      var n = 4 + i;
      return { depth:.35 + i*.35, speed:6 + i*9, alpha:.35 + i*.22, scale:.7 + i*.45, y:.52 + i*.14, items:Array.apply(null,Array(n)).map(function(){ return { o:r(), dy:(r()-.5)*.08 }; }) };
    });
    var self = this;
    new ResizeObserver(function(){ self.resize(); }).observe(canvas);
    new IntersectionObserver(function(e){ self.visible = e[0].isIntersecting; kick(); }).observe(canvas);
    this.resize();
  }
  Scene.prototype.resize = function(){
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.w = this.c.clientWidth; this.h = this.c.clientHeight;
    this.c.width = Math.max(1, this.w * this.dpr); this.c.height = Math.max(1, this.h * this.dpr);
    this.draw(performance.now()/1000);
  };
  Scene.prototype.draw = function(t){
    var g = this.g, w = this.w, h = this.h, p = this.pal;
    g.setTransform(this.dpr,0,0,this.dpr,0,0);
    var gr = g.createLinearGradient(0,0,0,h);
    p.stops.forEach(function(s){ gr.addColorStop(s[0], s[1]); });
    g.fillStyle = gr; g.fillRect(0,0,w,h);
    var sx = w*p.sun[0] - mx*10, sy = h*p.sun[1] - my*6, sr = Math.max(w,h)*.5;
    var sg = g.createRadialGradient(sx,sy,0,sx,sy,sr);
    sg.addColorStop(0,p.sun[2]); sg.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle = sg; g.fillRect(0,0,w,h);
    var spr = this.spr, sw = spr.width, sh = spr.height;
    for(var i = 0; i < this.layers.length; i++){
      var L = this.layers[i], dw = sw * L.scale, dh = sh * L.scale, span = w + dw;
      g.globalAlpha = L.alpha;
      for(var j = 0; j < L.items.length; j++){
        var it = L.items[j];
        var x = ((it.o * span + t * L.speed) % span) - dw - mx * 40 * L.depth;
        var y = h * (L.y + it.dy) - dh/2 - my * 18 * L.depth;
        g.drawImage(spr, x, y, dw, dh);
      }
    }
    g.globalAlpha = 1;
  };

  function frame(now){
    mx += (tmx - mx) * .05; my += (tmy - my) * .05;
    var any = false, t = now/1000;
    for(var i = 0; i < scenes.length; i++){ if(scenes[i].visible){ scenes[i].draw(t); any = true; } }
    if(any && !reduce && !document.hidden){ requestAnimationFrame(frame); } else { running = false; }
  }
  function kick(){ if(!running && !reduce){ running = true; requestAnimationFrame(frame); } }

  window.addEventListener('pointermove', function(e){
    if(e.pointerType === 'touch') return;
    tmx = e.clientX / innerWidth - .5; tmy = e.clientY / innerHeight - .5;
  }, { passive:true });
  document.addEventListener('visibilitychange', kick);

  $$('canvas[data-sky]').forEach(function(c){ scenes.push(new Scene(c)); });
})();

/* ---------------- Optional videos ----------------
   Drop assets/media/hero.mp4 and assets/media/lesson.mp4 in place and they fade in over the sky. */
var lessonVideo = null;
(function(){
  $$('video[data-src]').forEach(function(v){
    var loaded = false;
    function load(){
      if(loaded) return; loaded = true;
      v.addEventListener('canplay', function(){
        v.classList.add('is-ready');
        if(v.id === 'lessonVideo'){ lessonVideo = v; $('#playBtn').hidden = false; }
        if(!reduce) v.play().catch(function(){});
      }, { once:true });
      v.src = v.getAttribute('data-src');
    }
    new IntersectionObserver(function(e){
      if(e[0].isIntersecting){ load(); if(v.classList.contains('is-ready') && !reduce) v.play().catch(function(){}); }
      else if(!v.paused){ v.pause(); }
    }, { rootMargin:'200px' }).observe(v);
  });
  var pb = $('#playBtn');
  pb.addEventListener('click', function(){
    if(!lessonVideo) return;
    var on = pb.getAttribute('aria-pressed') !== 'true';
    pb.setAttribute('aria-pressed', String(on));
    lessonVideo.muted = !on;
    pb.lastElementChild.textContent = on ? 'Mute' : 'Play with sound';
    pb.firstElementChild.firstElementChild.setAttribute('href', on ? '#i-pause' : '#i-play');
    if(on) lessonVideo.play().catch(function(){});
  });
})();

/* ---------------- Courses ---------------- */
(function(){
  var data = [
    { name:'Trial flight', desc:'A real lesson with a qualified instructor. You handle the controls from the moment you take off.',
      big:'1', unit:'flight', who:'Anyone curious about flying', get:'A logged flight and a clear idea of your next step', after:'Carry on into any licence below' },
    { name:'Recreational licence', desc:'The quickest way to fly solo and take a passenger up. Ideal if you want to fly for the love of it.',
      big:'25', unit:'hours minimum', who:'Weekend and local flyers', get:'Your Recreational Pilot Licence', after:'Add a navigation endorsement to go further' },
    { name:'Private licence', desc:'More range, more freedom and a foundation for every rating that follows.',
      big:'40', unit:'hours minimum', who:'Pilots who want to travel by air', get:'Your Private Pilot Licence', after:'Build towards night and instrument ratings' },
    { name:'Commercial licence', desc:'The licence you need to be paid to fly. The first serious step into a flying career.',
      big:'150', unit:'hours minimum', who:'Future professional pilots', get:'Your Commercial Pilot Licence', after:'Instructing, charter and airline pathways' },
    { name:'Instrument rating', desc:'Learn to fly by reference to your instruments, so cloud and low visibility stop being a limit.',
      big:'IFR', unit:'rating', who:'Licensed pilots', get:'The ability to fly in cloud and poor visibility', after:'Safer, more reliable flying and commercial work' }
  ];
  var tabs = $('#tabs'), panel = $('#panel'), cur = 0;

  data.forEach(function(d, i){
    var b = document.createElement('button');
    b.className = 'tab'; b.setAttribute('role','tab'); b.id = 'tab' + i;
    b.setAttribute('aria-controls','panel'); b.setAttribute('aria-selected', String(i === 0)); b.tabIndex = i === 0 ? 0 : -1;
    b.innerHTML = '<span>' + d.name + '</span><svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg>';
    b.addEventListener('click', function(){ select(i, true); });
    b.addEventListener('keydown', function(e){
      var n = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
      if(n){ e.preventDefault(); select((cur + n + data.length) % data.length, true); $$('.tab')[cur].focus(); }
    });
    tabs.appendChild(b);
  });
  panel.setAttribute('aria-labelledby', 'tab0');

  function render(i, animate){
    var d = data[i];
    panel.innerHTML =
      '<div class="panel-big">' + d.big + '</div><p class="mono" style="color:var(--soft);font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;margin-top:8px">' + d.unit + '</p>' +
      '<h3 style="margin-top:28px">' + d.name + '</h3><p class="panel-desc">' + d.desc + '</p>' +
      '<dl class="panel-facts"><div class="fact"><dt>Best for</dt><dd>' + d.who + '</dd></div><div class="fact"><dt>You earn</dt><dd>' + d.get + '</dd></div><div class="fact" style="grid-column:1/-1"><dt>What comes next</dt><dd>' + d.after + '</dd></div></dl>' +
      '<a class="btn btn-primary" href="#book">Book a trial flight <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg></a>';
    if(animate && hasGsap && !reduce){
      gsap.from(panel.children, { y:18, opacity:0, duration:.6, stagger:.05, ease:'expo.out', overwrite:true });
    }
  }
  function select(i, animate){
    cur = i;
    $$('.tab').forEach(function(t, k){ t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    panel.setAttribute('aria-labelledby', 'tab' + i);
    render(i, animate);
  }
  render(0, false);
})();

/* ---------------- Planner ---------------- */
(function(){
  var course = $('#estCourse'), hrs = $('#estHours'), out = $('#estHoursOut'), weeks = $('#estWeeks'), note = $('#estNote');
  var shown = { v: parseInt(weeks.textContent, 10) || 0 };
  var base = note.textContent;
  function update(){
    var min = +course.value, per = +hrs.value, w = Math.ceil(min / per);
    out.textContent = per;
    if(hasGsap && !reduce){
      gsap.to(shown, { v:w, duration:.6, ease:'expo.out', overwrite:true, onUpdate:function(){ weeks.textContent = Math.round(shown.v); } });
    } else { weeks.textContent = w; }
    note.textContent = CONFIG.HOURLY_RATE
      ? 'Minimum flying cost from $' + Math.round(min * CONFIG.HOURLY_RATE).toLocaleString('en-AU') + '. ' + base
      : base;
  }
  course.addEventListener('change', update);
  hrs.addEventListener('input', update);
  update();
})();

/* ---------------- Form ---------------- */
(function(){
  var form = $('#enquiry');
  function val(id){ return $(id).value.trim(); }
  function fail(inputId, errId, msg){
    var el = $(inputId); $(errId).textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if(msg) el.setAttribute('aria-describedby', errId.slice(1)); else el.removeAttribute('aria-describedby');
    return !msg;
  }
  function done(msg){
    $('#formBody').hidden = true; $('#formDone').hidden = false; $('#doneMsg').textContent = msg;
  }
  function mailto(p){
    var body = 'Name: ' + p.name + '\nEmail: ' + p.email + '\nPhone: ' + (p.phone || '-') + '\nInterested in: ' + p.course + '\n\n' + (p.message || '');
    window.location.href = 'mailto:' + CONFIG.CONTACT_EMAIL + '?subject=' + encodeURIComponent('Enquiry: ' + p.course + ' (' + p.name + ')') + '&body=' + encodeURIComponent(body);
    done('Your email app should have opened with the details filled in. Press send and an instructor will reply within one business day.');
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var ok1 = fail('#fName', '#eName', val('#fName') ? '' : 'Please enter your name.');
    var ok2 = fail('#fEmail', '#eEmail', /^\S+@\S+\.\S+$/.test(val('#fEmail')) ? '' : 'Please enter a valid email address.');
    if(!(ok1 && ok2)){ (ok1 ? $('#fEmail') : $('#fName')).focus(); return; }
    var p = { name:val('#fName'), email:val('#fEmail'), phone:val('#fPhone'), course:$('#fCourse').value, message:val('#fMsg') };
    if(!CONFIG.FORM_ENDPOINT){ mailto(p); return; }
    var btn = $('#submitBtn'); btn.disabled = true; btn.textContent = 'Sending...';
    fetch(CONFIG.FORM_ENDPOINT, {
      method:'POST', headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
      body: JSON.stringify({ name:p.name, email:p.email, phone:p.phone, course:p.course, message:p.message, _replyto:p.email, _subject:'Enquiry: ' + p.course + ' (' + p.name + ')' })
    }).then(function(r){
      if(!r.ok) throw new Error('HTTP ' + r.status);
      if(window.gtag){ window.gtag('event','generate_lead'); }
      done('An instructor will be in touch within one business day.');
    }).catch(function(err){
      console.warn('Form endpoint failed, falling back to email:', err);
      btn.disabled = false; btn.textContent = 'Book a trial flight';
      mailto(p);
    });
  });
})();

/* ---------------- Motion (GSAP) ---------------- */
if(!hasGsap){ return; }

/* Attitude indicator: follows the cursor, drifts on its own when idle or on touch. */
(function(){
  var h = $('#aiHorizon'); if(!h) return;
  var bank = $('#aiBank'), pitch = $('#aiPitch');
  gsap.set(h, { svgOrigin:'120 120' });
  var rollTo = gsap.quickTo(h, 'rotation', { duration:.8, ease:'power3' });
  var pitchTo = gsap.quickTo(h, 'y', { duration:.8, ease:'power3' });
  var st = { r:0, p:0 }, idle;
  function apply(){
    rollTo(st.r); pitchTo(st.p);
    bank.textContent = Math.round(-st.r); pitch.textContent = Math.round(-st.p / 1.5);
  }
  if(reduce){ apply(); return; }
  var auto = gsap.timeline({ repeat:-1, yoyo:true, onUpdate:apply })
    .to(st, { r:16, p:-10, duration:3.2, ease:'sine.inOut' })
    .to(st, { r:-20, p:12, duration:4, ease:'sine.inOut' });
  window.addEventListener('pointermove', function(e){
    if(e.pointerType === 'touch') return;
    auto.pause();
    st.r = -(e.clientX / innerWidth - .5) * 70;
    st.p = (e.clientY / innerHeight - .5) * 50;
    apply();
    clearTimeout(idle); idle = setTimeout(function(){ auto.play(); }, 3000);
  }, { passive:true });
})();

/* Magnetic primary CTA. Feedback on hover, nothing else. */
if(!reduce && matchMedia('(hover:hover)').matches){
  $$('[data-magnet]').forEach(function(el){
    var xTo = gsap.quickTo(el, 'x', { duration:.5, ease:'power3' }), yTo = gsap.quickTo(el, 'y', { duration:.5, ease:'power3' });
    el.addEventListener('pointermove', function(e){
      var r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width/2) * .22); yTo((e.clientY - r.top - r.height/2) * .3);
    });
    el.addEventListener('pointerleave', function(){ xTo(0); yTo(0); });
  });
}

/* Hero entrance and scroll reveals: establish hierarchy in reading order. */
if(!reduce){
  gsap.fromTo('[data-hero]', { y:36, opacity:0 }, { y:0, opacity:1, duration:1.1, stagger:.12, ease:'expo.out', delay:.1 });
  ScrollTrigger.batch('[data-reveal]', {
    start:'top 88%', once:true,
    onEnter:function(b){ gsap.fromTo(b, { y:28, opacity:0 }, { y:0, opacity:1, duration:.9, ease:'expo.out', stagger:.08, overwrite:true }); }
  });
  $$('[data-count]').forEach(function(el){
    var end = +el.getAttribute('data-count'), o = { v:0 };
    el.textContent = '0';
    ScrollTrigger.create({ trigger:el, start:'top 90%', once:true, onEnter:function(){
      gsap.to(o, { v:end, duration:1.6, ease:'power3.out', onUpdate:function(){ el.textContent = Math.round(o.v); } });
    }});
  });
}

/* Pathway: pinned horizontal pan. The plane and line show how far along the licence road you are. */
var mm = gsap.matchMedia();
mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function(){
  var sec = $('#pathway'), track = $('#panTrack'), live = $('#panLive'), plane = $('#panPlane');
  var miles = $$('.milestone', track);
  function dist(){ return Math.max(0, track.scrollWidth - window.innerWidth); }
  gsap.to(track, {
    x:function(){ return -dist(); }, ease:'none',
    scrollTrigger:{
      trigger:sec, start:'top top', end:function(){ return '+=' + dist(); },
      pin:true, scrub:1, invalidateOnRefresh:true,
      onUpdate:function(self){
        var W = track.scrollWidth, px = self.progress * W;
        gsap.set(live, { scaleX:self.progress });
        gsap.set(plane, { x:px });
        miles.forEach(function(m){ m.classList.toggle('is-hit', m.offsetLeft + 10 <= px); });
      }
    }
  });
  return function(){ gsap.set([track, live, plane], { clearProps:'all' }); miles.forEach(function(m){ m.classList.remove('is-hit'); }); };
});

/* Video zoom: the frame opens to full bleed as you arrive, so the scene takes over the page. */
mm.add('(prefers-reduced-motion: no-preference)', function(){
  var small = window.matchMedia('(max-width: 899px)').matches;
  var tl = gsap.timeline({ scrollTrigger:{ trigger:'#lesson', start:'top top', end:'+=75%', pin:true, scrub:true } });
  tl.fromTo('#zoomFrame', { clipPath: small ? 'inset(10% 5% round 20px)' : 'inset(14% 20% round 24px)' }, { clipPath:'inset(0% 0% round 0px)', ease:'none', duration:1 }, 0)
    .fromTo('#zoomCopy', { opacity:0, y:50 }, { opacity:1, y:0, ease:'none', duration:.6 }, .4);
});
mm.add('(prefers-reduced-motion: reduce)', function(){
  gsap.set('#zoomFrame', { clipPath:'inset(0% 0% round 0px)' });
});

window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
})();
