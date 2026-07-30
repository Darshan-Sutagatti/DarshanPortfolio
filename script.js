/* ─── CANVAS PARTICLE NETWORK ─── */
(function(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], RAF;
  const PARTICLE_COUNT = 60;
  const MAX_DIST = 130;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle(){
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
  }

  Particle.prototype.update = function(){
    this.x += this.vx; this.y += this.vy;
    if(this.x < 0 || this.x > W) this.vx *= -1;
    if(this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init(){
    particles = [];
    for(let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function draw(){
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,107,43,0.5)';
      ctx.fill();
    });

    for(let i = 0; i < particles.length; i++){
      for(let j = i + 1; j < particles.length; j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < MAX_DIST){
          const opacity = (1 - dist/MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(79,142,247,' + opacity + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    RAF = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

/* ─── TYPING ANIMATION ─── */
const phrases = [
  'Building Spring Boot APIs...',
  'Securing endpoints with JWT...',
  'Writing clean Hibernate mappings...',
  'Debugging with Claude AI 🤖',
  'Riding Karnataka roads on weekends 🏍️',
  'Open to Software Engineer roles ⚡',
];
let pi = 0, ci = 0, del = false;
const tel = document.getElementById('typeEl');
function type(){
  const phrase = phrases[pi];
  const display = del ? phrase.substring(0, ci--) : phrase.substring(0, ci++);
  tel.innerHTML = display + '<span class="cur">|</span>';
  if(!del && ci > phrase.length){ del = true; setTimeout(type, 1800); return; }
  if(del && ci < 0){ del = false; pi = (pi + 1) % phrases.length; ci = 0; }
  setTimeout(type, del ? 45 : 75);
}
type();

/* ─── MOBILE MENU ─── */
const mob = document.getElementById('mob');
document.getElementById('ham').addEventListener('click', () => mob.classList.add('open'));
document.getElementById('mob-close').addEventListener('click', () => mob.classList.remove('open'));
function closeMob(){ mob.classList.remove('open'); }

/* ─── INTERSECTION OBSERVER ─── */
const rvEls = document.querySelectorAll('.rv, .rv-l, .rv-r');
const rvObs = new IntersectionObserver((entries) => {
  entries.forEach((e, idx) => {
    if(e.isIntersecting){
      const delay = (idx % 4) * 80;
      setTimeout(() => {
        e.target.classList.add('in');
        e.target.querySelectorAll('.sk-bar').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
      }, delay);
    }
  });
}, { threshold: 0.1 });
rvEls.forEach(el => rvObs.observe(el));

/* ─── BACK TO TOP ─── */
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 500));
btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
