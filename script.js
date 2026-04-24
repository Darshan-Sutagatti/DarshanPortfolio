
/* ── CURSOR ── */
const ring=document.getElementById('cur-ring'),dot=document.getElementById('cur-dot'),trail=document.getElementById('cur-trail');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';trail.style.left=(rx+(mx-rx)*.3)+'px';trail.style.top=(ry+(my-ry)*.3)+'px';requestAnimationFrame(loop);})();
document.querySelectorAll('a,button,.chip,.skill-card,.proj-card,.edu-row,.hob,.contact-card,.nav-cta,.stat-pill').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

/* ── CANVAS PARTICLES ── */
const cvs=document.getElementById('bgc'),ctx=cvs.getContext('2d');
let W,H;
const resize=()=>{W=cvs.width=window.innerWidth;H=cvs.height=window.innerHeight;};
resize();window.addEventListener('resize',resize);
let mPX=W/2,mPY=H/2;
document.addEventListener('mousemove',e=>{mPX=e.clientX;mPY=e.clientY;});
class Pt{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.25;this.vy=(Math.random()-.5)*.25;this.r=Math.random()*1.2+.3;this.a=Math.random()*.25+.05;this.p=Math.random()*Math.PI*2;}update(){this.x+=this.vx;this.y+=this.vy;this.p+=.015;if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();}draw(){const a=this.a*(.7+.3*Math.sin(this.p));ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(110,231,183,${a})`;ctx.fill();}}
class Hx{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.s=Math.random()*20+6;this.vy=(Math.random()*.12+.03)*(Math.random()<.5?1:-1);this.vx=(Math.random()-.5)*.06;this.a=Math.random()*.025+.006;this.rot=0;this.rs=(Math.random()-.5)*.003;}update(){this.y+=this.vy;this.x+=this.vx;this.rot+=this.rs;if(this.y>H+50)this.y=-50;if(this.y<-50)this.y=H+50;if(this.x<-50)this.x=W+50;if(this.x>W+50)this.x=-50;}draw(){ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);ctx.beginPath();for(let i=0;i<6;i++){const a=(Math.PI/3)*i-Math.PI/6;i===0?ctx.moveTo(Math.cos(a)*this.s,Math.sin(a)*this.s):ctx.lineTo(Math.cos(a)*this.s,Math.sin(a)*this.s);}ctx.closePath();ctx.strokeStyle=`rgba(110,231,183,${this.a})`;ctx.lineWidth=.5;ctx.stroke();ctx.restore();}}
const pts=Array.from({length:80},()=>new Pt()),hxs=Array.from({length:12},()=>new Hx());
function drawNet(){for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(110,231,183,${(1-d/110)*.05})`;ctx.lineWidth=.5;ctx.stroke();}}}
function drawAura(){const g=ctx.createRadialGradient(mPX,mPY,0,mPX,mPY,180);g.addColorStop(0,'rgba(110,231,183,0.035)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
(function animate(){ctx.clearRect(0,0,W,H);drawAura();hxs.forEach(h=>{h.update();h.draw();});drawNet();pts.forEach(p=>{p.update();p.draw();});requestAnimationFrame(animate);})();

/* ── SCROLL REVEAL ── */
const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('in'),i*80);});},{threshold:.07});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el=>obs.observe(el));

/* ── COUNTER ── */
function animCount(el,target,dec){const s=performance.now(),dur=2000,sfx=el.dataset.sfx||'';(function step(now){const p=Math.min((now-s)/dur,1),e2=1-Math.pow(1-p,4);el.textContent=(parseFloat(target)*e2).toFixed(dec)+sfx;if(p<1)requestAnimationFrame(step);})(s);}
let counted=false;
new IntersectionObserver(e=>{if(e[0].isIntersecting&&!counted){counted=true;document.querySelectorAll('.num').forEach(el=>animCount(el,el.dataset.val,el.dataset.val.includes('.')?1:0));}},{threshold:.3}).observe(document.querySelector('.hero-stats')||document.body);

/* ── CHIP HOVER DETAIL ── */
const hd=document.getElementById('hdetail');
document.querySelectorAll('[data-hover]').forEach(el=>{
  el.addEventListener('mouseenter',e=>{hd.textContent=el.dataset.hover;hd.classList.add('show');});
  el.addEventListener('mousemove',e=>{hd.style.left=(e.clientX+16)+'px';hd.style.top=(e.clientY-10)+'px';});
  el.addEventListener('mouseleave',()=>hd.classList.remove('show'));
});

/* ── SKILL CARD HOVER DETAIL ── */
document.querySelectorAll('[data-hover-detail]').forEach(el=>{
  el.addEventListener('mouseenter',e=>{hd.textContent=el.dataset.hoverDetail;hd.classList.add('show');});
  el.addEventListener('mousemove',e=>{hd.style.left=(e.clientX+16)+'px';hd.style.top=(e.clientY-10)+'px';});
  el.addEventListener('mouseleave',()=>hd.classList.remove('show'));
});

/* ── ROLE CYCLING on hero ── */
const roles=['Full Stack Developer','Software Engineer','IoT Builder','ECE Engineer','Problem Solver'];
let ri=0;
const roleEls=document.querySelectorAll('.role-item');
// no role bar in new design — handled by chips

/* ── NAV ACTIVE ── */
const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.nav-menu a');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-200)cur=s.id;});
  navLinks.forEach(a=>{a.style.color=a.getAttribute('href')==='#'+cur?'var(--text)':'';});
},{ passive:true });

/* ── DOWNLOAD ── */
function dlResume(e){e.preventDefault();const t=`DARSHAN SUTAGATTI\nsutagattidarshan2135@gmail.com | +91 9741645875 | Bailhongal, Karnataka\nlinkedin.com/in/darshan-sutagatti-201108269\nYouTube: @dasharides | Instagram: @darshan_sutagatti_\n\nOBJECTIVE\nSoftware Developer & Full Stack Engineer — building elegant, functional software.\nOpen to software engineering roles and internships.\n\nINTERNSHIP\nFull Stack Development Intern | JSpiders, Rajajinagar, Bengaluru | Currently Active\n\nSKILLS\nLanguages: Java, C, Embedded C\nWeb: HTML5, CSS3\nDatabase: SQL\nIoT/Hardware: ESP8266, Realtek AMB82, IoT Sensors\nTools: GitHub, Blynk App, Claude AI\nSoft Skills: Logical Thinking, Team Collaboration, Problem Solving\n\nPROJECTS\n1. IoT Crowd Management & Emergency Alert System\n   Tech: Realtek AMB82, ESP8266, IoT Sensors, Embedded C\n   - Real-time crowd density monitoring with Wi-Fi streaming\n   - Automated emergency alerts on threshold breach\n   - Remote wireless monitoring dashboard\n\n2. Digital Car Parking System using Blynk\n   Tech: ESP8266, Blynk App, IoT Sensors\n   - Live parking slot availability monitor\n   - Blynk mobile app dashboard\n   - Scalable IoT architecture\n\nEDUCATION\nB.E Electronics & Communication | Jain College of Engineering, Belagavi | CGPA 8.8 | 2026\nPUC Science | KRCES'S GGD, Bailhongal | 94.5% | 2022\nSSLC | Carmel Vidya Vikas, Bailhongal | 91.84% | 2020`;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download='Darshan_Sutagatti_Resume.txt';a.click();}