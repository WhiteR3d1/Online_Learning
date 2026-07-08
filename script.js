/* ============================================================
   บทเรียนออนไลน์ HTML5 — ตรรกะการทำงาน (JavaScript)
============================================================ */

/* ============================================================
   CONFIG
============================================================ */
const GAS_URL = "https://script.google.com/macros/s/AKfycbwDXf-_SA_7ThWujUe1OfXT1fE0yEIpS-y61wLvnPkdvt1EeROs-t2mx5on52-xOTecaw/exec";
const YOUTUBE_EMBED = "https://www.youtube.com/embed/jj_kb6ZiPS0";

/* ============================================================
   STATE
============================================================ */
let student = { name: "" };
let scores = { pre: null, post: null };
let unlocked = false;
let leaderboardData = [];

/* ============================================================
   QUESTION BANK (10) — about website design with HTML5
============================================================ */
const QUESTIONS = [
  { q: "ข้อใดคือความหมายของ “เว็บไซต์ (Website)” ที่ถูกต้องที่สุด",
    options: ["โปรแกรมสำหรับตกแต่งรูปภาพ","กลุ่มของหน้าเว็บเพจที่เชื่อมโยงกันภายใต้ชื่อโดเมนเดียวกัน","อุปกรณ์ที่ใช้เชื่อมต่ออินเทอร์เน็ต","ภาษาที่ใช้เขียนโปรแกรมคอมพิวเตอร์"], a:1 },
  { q: "องค์ประกอบใดต่อไปนี้ “ไม่ใช่” องค์ประกอบหลักของเว็บไซต์",
    options: ["ส่วนหัว (Header)","ส่วนเนื้อหา (Content)","ส่วนท้าย (Footer)","หน่วยประมวลผลกลาง (CPU)"], a:3 },
  { q: "หน้าแรกของเว็บไซต์ที่ผู้ใช้พบเป็นหน้าแรกเรียกว่าอะไร",
    options: ["Homepage (โฮมเพจ)","Sitemap","Server","Hyperlink"], a:0 },
  { q: "HTML ย่อมาจากคำใด",
    options: ["High Text Machine Language","Hyper Text Markup Language","Home Tool Markup Language","Hyperlink Text Marking Logic"], a:1 },
  { q: "หน้าที่หลักของภาษา HTML5 คือข้อใด",
    options: ["ใช้คำนวณตัวเลขทางคณิตศาสตร์","ใช้กำหนดโครงสร้างและแสดงเนื้อหาของหน้าเว็บ","ใช้จัดการฐานข้อมูลขนาดใหญ่","ใช้ป้องกันไวรัสคอมพิวเตอร์"], a:1 },
  { q: "แท็ก (Tag) HTML5 ใดใช้สำหรับกำหนด “เมนูนำทาง” ของเว็บไซต์",
    options: ["<footer>","<article>","<nav>","<section>"], a:2 },
  { q: "แท็กใดเป็นแท็กเริ่มต้นที่บอกว่าเอกสารนี้เป็นเอกสาร HTML",
    options: ["<html>","<body>","<title>","<div>"], a:0 },
  { q: "ส่วนหัวด้านบนสุดของหน้าเว็บที่มักใส่โลโก้และชื่อเว็บ เรียกว่าส่วนใด",
    options: ["Footer","Header","Sidebar","Content"], a:1 },
  { q: "เว็บไซต์ประเภทใดที่เนื้อหาสามารถเปลี่ยนแปลงและโต้ตอบกับผู้ใช้ได้",
    options: ["เว็บไซต์แบบคงที่ (Static)","เว็บไซต์แบบพลวัต (Dynamic)","เว็บไซต์แบบกระดาษ","เว็บไซต์แบบออฟไลน์"], a:1 },
  { q: "การจัดวางองค์ประกอบต่าง ๆ ของหน้าเว็บให้เป็นระเบียบสวยงาม เรียกว่าอะไร",
    options: ["การเขียนโปรแกรม (Coding)","การจัดวางเลย์เอาต์ (Layout)","การอัปโหลด (Upload)","การเชื่อมโยง (Linking)"], a:1 },
];

/* ============================================================
   CONTENT TABS (8)
============================================================ */
const TABS = {
1:{icon:"🌐",title:"ความหมายของเว็บไซต์",html:`
  <p><b>เว็บไซต์ (Website)</b> คือ กลุ่มของหน้าเว็บเพจ (Web Page) หลาย ๆ หน้าที่มีความเกี่ยวข้องกัน และถูกเชื่อมโยง (Link) เข้าด้วยกัน จัดเก็บไว้บนเครื่องเซิร์ฟเวอร์ (Web Server) ภายใต้ชื่อโดเมน (Domain Name) เดียวกัน เพื่อให้ผู้ใช้เข้าถึงข้อมูลผ่านเครือข่ายอินเทอร์เน็ตได้</p>
  <ul class="list-disc pl-6 mt-3 space-y-1 text-slate-600">
    <li>เข้าถึงได้ผ่านโปรแกรมเว็บเบราว์เซอร์ เช่น Chrome, Edge</li>
    <li>มีที่อยู่เว็บ (URL) สำหรับเรียกดู เช่น www.example.com</li>
    <li>หน้าแรกของเว็บไซต์เรียกว่า <b>โฮมเพจ (Homepage)</b></li>
  </ul>`},
2:{icon:"🧩",title:"องค์ประกอบของเว็บไซต์",video:true,html:`
  <p>เว็บไซต์ที่ดีมักประกอบด้วยส่วนสำคัญดังนี้</p>
  <div class="grid sm:grid-cols-2 gap-3 mt-3">
    <div class="rounded-2xl bg-brand-50 p-4">🔝 <b>ส่วนหัว (Header)</b><br><span class="text-sm text-slate-600">โลโก้ ชื่อเว็บ แบนเนอร์</span></div>
    <div class="rounded-2xl bg-brand-50 p-4">🧭 <b>เมนูนำทาง (Navigation)</b><br><span class="text-sm text-slate-600">ลิงก์ไปยังหน้าต่าง ๆ</span></div>
    <div class="rounded-2xl bg-brand-50 p-4">📄 <b>ส่วนเนื้อหา (Content)</b><br><span class="text-sm text-slate-600">ข้อความ รูปภาพ วิดีโอ</span></div>
    <div class="rounded-2xl bg-brand-50 p-4">🔻 <b>ส่วนท้าย (Footer)</b><br><span class="text-sm text-slate-600">ลิขสิทธิ์ ติดต่อ ลิงก์</span></div>
  </div>
  <p class="mt-4 font-semibold text-brand-700">🎬 วิดีโอสื่อการเรียนรู้</p>`},
3:{icon:"🗂️",title:"ประเภทของเว็บไซต์",html:`
  <p>เว็บไซต์แบ่งตามลักษณะการทำงานได้เป็น 2 ประเภทหลัก และตามวัตถุประสงค์อีกหลายแบบ</p>
  <div class="grid sm:grid-cols-2 gap-3 mt-3">
    <div class="rounded-2xl border border-brand-100 p-4">📌 <b>เว็บไซต์แบบคงที่ (Static)</b><br><span class="text-sm text-slate-600">เนื้อหาตายตัว ไม่เปลี่ยนแปลง แก้ไขต้องเขียนโค้ดใหม่</span></div>
    <div class="rounded-2xl border border-brand-100 p-4">⚡ <b>เว็บไซต์แบบพลวัต (Dynamic)</b><br><span class="text-sm text-slate-600">เนื้อหาเปลี่ยนแปลงและโต้ตอบผู้ใช้ได้ เชื่อมฐานข้อมูล</span></div>
  </div>
  <p class="mt-3 text-slate-600">ตามวัตถุประสงค์ เช่น เว็บข่าว 📰, เว็บการศึกษา 🎓, เว็บอีคอมเมิร์ซ 🛒, เว็บองค์กร 🏢, บล็อกส่วนตัว ✍️</p>`},
4:{icon:"📘",title:"ความหมายของภาษา HTML5",html:`
  <p><b>HTML5</b> (Hyper Text Markup Language เวอร์ชัน 5) คือ ภาษามาร์กอัป (Markup Language) รุ่นล่าสุดที่ใช้สำหรับสร้างและกำหนดโครงสร้างของหน้าเว็บเพจ</p>
  <ul class="list-disc pl-6 mt-3 space-y-1 text-slate-600">
    <li>เป็นภาษาพื้นฐานที่เว็บเบราว์เซอร์ทุกตัวเข้าใจ</li>
    <li>รองรับมัลติมีเดีย เช่น เสียง วิดีโอ ได้โดยตรง (&lt;audio&gt;, &lt;video&gt;)</li>
    <li>มีแท็กเชิงความหมาย (Semantic Tags) ทำให้โครงสร้างชัดเจน</li>
  </ul>`},
5:{icon:"🛠️",title:"หน้าที่ของภาษา HTML5",html:`
  <p>HTML5 มีหน้าที่สำคัญในการสร้างเว็บไซต์ ดังนี้</p>
  <div class="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
    <div class="rounded-2xl bg-brand-50 p-4">🏗️ กำหนด<b>โครงสร้าง</b>ของหน้าเว็บ</div>
    <div class="rounded-2xl bg-brand-50 p-4">✍️ แสดง<b>ข้อความ</b>และหัวเรื่อง</div>
    <div class="rounded-2xl bg-brand-50 p-4">🖼️ แทรก<b>รูปภาพ เสียง วิดีโอ</b></div>
    <div class="rounded-2xl bg-brand-50 p-4">🔗 สร้าง<b>ลิงก์เชื่อมโยง</b>ระหว่างหน้า</div>
    <div class="rounded-2xl bg-brand-50 p-4">📋 สร้าง<b>ตารางและฟอร์ม</b>รับข้อมูล</div>
    <div class="rounded-2xl bg-brand-50 p-4">🧭 จัดกลุ่มเนื้อหาด้วย<b>Semantic Tags</b></div>
  </div>`},
6:{icon:"🏗️",title:"โครงสร้างของเว็บไซต์ (HTML5)",html:`
  <p>โครงสร้างพื้นฐานของเอกสาร HTML5 ประกอบด้วยแท็กหลักดังนี้</p>
  <pre class="mt-3 rounded-2xl bg-slate-900 text-emerald-300 text-sm p-4 overflow-x-auto"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;ชื่อเว็บ&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;header&gt;ส่วนหัว&lt;/header&gt;
    &lt;nav&gt;เมนู&lt;/nav&gt;
    &lt;section&gt;เนื้อหา&lt;/section&gt;
    &lt;footer&gt;ส่วนท้าย&lt;/footer&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>`},
7:{icon:"📐",title:"การออกแบบโครงสร้างหน้าเว็บไซต์",html:`
  <p>การออกแบบโครงสร้าง (Wireframe / Layout) คือการวางแผนตำแหน่งของแต่ละส่วนก่อนลงมือเขียนโค้ด</p>
  <div class="mt-3 rounded-2xl border-2 border-dashed border-brand-200 p-4">
    <div class="rounded-xl bg-brand-600 text-white text-center py-2 font-semibold">Header (ส่วนหัว)</div>
    <div class="rounded-xl bg-brand-400 text-white text-center py-1 my-2 font-semibold">Navigation (เมนู)</div>
    <div class="grid grid-cols-3 gap-2">
      <div class="rounded-xl bg-brand-100 text-brand-700 text-center py-8 font-semibold">Sidebar</div>
      <div class="col-span-2 rounded-xl bg-brand-50 text-brand-700 text-center py-8 font-semibold">Content (เนื้อหา)</div>
    </div>
    <div class="rounded-xl bg-slate-600 text-white text-center py-2 mt-2 font-semibold">Footer (ส่วนท้าย)</div>
  </div>`},
8:{icon:"🎨",title:"การจัดวางองค์ประกอบของเว็บไซต์",html:`
  <p>การจัดวางองค์ประกอบ (Layout) ที่ดี ช่วยให้เว็บสวยงาม อ่านง่าย และใช้งานสะดวก มีหลักการดังนี้</p>
  <ul class="list-disc pl-6 mt-3 space-y-1 text-slate-600">
    <li>⚖️ <b>ความสมดุล (Balance)</b> จัดวางองค์ประกอบให้ดูสมดุลทั้งซ้าย–ขวา</li>
    <li>🎯 <b>จุดเด่น (Emphasis)</b> เน้นส่วนสำคัญด้วยสี ขนาด ตำแหน่ง</li>
    <li>📏 <b>ระยะห่าง (Spacing)</b> เว้นช่องว่างให้โปร่งโล่ง อ่านสบายตา</li>
    <li>🔁 <b>ความสม่ำเสมอ (Consistency)</b> ใช้สีและฟอนต์ให้เป็นแนวเดียวกัน</li>
    <li>📱 <b>Responsive</b> แสดงผลได้ดีทุกขนาดหน้าจอ</li>
  </ul>`},
};

/* ============================================================
   GAME PAIRS
============================================================ */
const GAME_PAIRS = [
  { tag:"<header>", desc:"ส่วนหัวของเว็บ" },
  { tag:"<nav>",    desc:"เมนูนำทาง" },
  { tag:"<footer>", desc:"ส่วนท้ายของเว็บ" },
  { tag:"<img>",    desc:"แทรกรูปภาพ" },
  { tag:"<video>",  desc:"แทรกวิดีโอ" },
  { tag:"<a>",      desc:"สร้างลิงก์เชื่อมโยง" },
];

/* ============================================================
   HELPERS
============================================================ */
const $ = (id) => document.getElementById(id);
function showLoading(t="กำลังประมวลผล...") { $("loadingText").textContent=t; $("loadingOverlay").classList.remove("hidden"); $("loadingOverlay").classList.add("flex"); }
function hideLoading() { $("loadingOverlay").classList.add("hidden"); $("loadingOverlay").classList.remove("flex"); }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }

/* ============================================================
   LOGIN / LOGOUT
============================================================ */
function doLogin(){
  const name = $("loginName").value.trim();
  if(name.length < 3){
    Swal.fire({icon:"warning",title:"กรุณากรอกชื่อ–นามสกุล",text:"โปรดกรอกชื่อและนามสกุลของผู้เรียนก่อนเข้าสู่บทเรียน",confirmButtonColor:"#2563eb"});
    return;
  }
  student.name = name;
  scores = {pre:null, post:null};
  unlocked = false;
  quizState = null;
  $("sideUser").textContent = name;
  $("mobileUser").textContent = name;
  Swal.fire({icon:"success",title:"เข้าสู่ระบบสำเร็จ!",text:"ยินดีต้อนรับ "+name,timer:1400,showConfirmButton:false});
  $("loginScreen").classList.add("hidden");
  $("appScreen").classList.remove("hidden");
  setLocks();
  goto("home");
  renderTabs();
}
function doLogout(){
  Swal.fire({title:"ออกจากระบบ?",text:"ข้อมูลการเรียนในรอบนี้จะถูกล้าง",icon:"question",showCancelButton:true,confirmButtonColor:"#ef4444",cancelButtonColor:"#94a3b8",confirmButtonText:"ออกจากระบบ",cancelButtonText:"ยกเลิก"})
  .then(r=>{ if(r.isConfirmed){
    abortActiveQuiz();
    $("appScreen").classList.add("hidden");
    $("loginScreen").classList.remove("hidden");
    $("loginName").value="";
    loadLeaderboard();
    if(window.innerWidth<768) closeSidebar();
  }});
}

/* ============================================================
   NAVIGATION + LOCKS
============================================================ */
function setLocks(){
  document.querySelectorAll(".nav-btn").forEach(b=>{
    const t=b.dataset.target;
    if(["content","posttest","game","result"].includes(t)){
      if(unlocked){ b.classList.remove("locked"); const l=b.querySelector(".lock-ic"); if(l) l.remove(); }
      else b.classList.add("locked");
    }
  });
}
function goto(target){
  if(["content","posttest","game","result"].includes(target) && !unlocked){
    Swal.fire({icon:"info",title:"ยังเข้าไม่ได้ 🔒",text:"กรุณาทำแบบทดสอบก่อนเรียนให้เสร็จก่อน จึงจะเข้าส่วนนี้ได้",confirmButtonColor:"#2563eb"});
    goto("pretest"); return;
  }
  // หยุดตัวจับเวลา/รีเซ็ตแบบทดสอบที่ค้างอยู่ ก่อนเปลี่ยนหน้า (แก้บั๊ก timer ค้าง)
  abortActiveQuiz();
  document.querySelectorAll(".app-sec").forEach(s=>s.classList.add("hidden"));
  const sec=$("sec-"+target); sec.classList.remove("hidden"); sec.classList.add("fade-in");
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.target===target));
  if(target==="result") renderResult();
  if(target==="game") buildGame();
  window.scrollTo({top:0,behavior:"smooth"});
  if(window.innerWidth<768) closeSidebar();
}
function toggleSidebar(){ $("sidebar").classList.toggle("-translate-x-full"); $("sidebarBg").classList.toggle("hidden"); }
function closeSidebar(){ $("sidebar").classList.add("-translate-x-full"); $("sidebarBg").classList.add("hidden"); }

/* ============================================================
   CONTENT TABS
============================================================ */
function renderTabs(){ showTab(1, document.querySelector(".tab-btn")); }
function showTab(n, el){
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
  if(el) el.classList.add("active");
  const t=TABS[n];
  let vid = t.video ? `<div class="mt-3 rounded-2xl overflow-hidden shadow-soft aspect-video"><iframe class="w-full h-full" src="${YOUTUBE_EMBED}" title="วิดีโอสื่อการเรียนรู้" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>` : "";
  $("tabWrap").innerHTML = `
    <div class="shine-card fade-in rounded-xl2 bg-white border border-brand-100 shadow-soft p-6 md:p-8">
      <div class="flex items-center gap-3 mb-4">
        <div class="text-4xl float">${t.icon}</div>
        <h3 class="text-xl md:text-2xl font-extrabold text-slate-800">${t.title}</h3>
      </div>
      <div class="text-slate-700 leading-relaxed">${t.html}${vid}</div>
    </div>`;
}

/* ============================================================
   QUIZ ENGINE (pre / post)
============================================================ */
let quizState = null;

/* หยุดตัวจับเวลาและล้างสถานะแบบทดสอบที่กำลังทำอยู่ พร้อมคืนหน้า intro */
function abortActiveQuiz(){
  if(!quizState) return;
  clearInterval(quizState.timer);
  const mode = quizState.mode;
  quizState = null;
  if(mode==="pre"){
    $("pretestQuiz").classList.add("hidden");
    $("pretestQuiz").innerHTML = "";
    $("pretestIntro").classList.remove("hidden");
  } else {
    $("posttestQuiz").classList.add("hidden");
    $("posttestQuiz").innerHTML = "";
    $("posttestIntro").classList.remove("hidden");
  }
}

function startQuiz(mode){
  // เผื่อมีตัวจับเวลาเก่าค้างอยู่
  if(quizState){ clearInterval(quizState.timer); }
  let qs = QUESTIONS.map((item)=>{
    if(mode==="post"){
      // สลับลำดับตัวเลือก แต่ยังคงติดตามคำตอบที่ถูก
      const idx = item.options.map((_,i)=>i);
      const sIdx = shuffle(idx);
      const newOpts = sIdx.map(i=>item.options[i]);
      const newA = sIdx.indexOf(item.a);
      return {q:item.q, options:newOpts, a:newA};
    }
    return {q:item.q, options:[...item.options], a:item.a};
  });
  quizState = { mode, qs, cur:0, score:0, answered:false, timer:null, timeLeft:20 };
  if(mode==="pre"){ $("pretestIntro").classList.add("hidden"); $("pretestQuiz").classList.remove("hidden"); }
  else { $("posttestIntro").classList.add("hidden"); $("posttestQuiz").classList.remove("hidden"); }
  renderQuestion();
}
function quizContainer(){ return quizState.mode==="pre" ? $("pretestQuiz") : $("posttestQuiz"); }

function renderQuestion(){
  const s = quizState;
  const item = s.qs[s.cur];
  s.answered=false; s.timeLeft=20;
  const c = quizContainer();
  c.innerHTML = `
    <div class="shine-card fade-in rounded-xl2 bg-white border border-brand-100 shadow-soft p-6 md:p-8">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-bold text-brand-700">ข้อ ${s.cur+1} / ${s.qs.length}</span>
        <span class="text-sm font-bold text-red-500">⏱️ <span id="qTime">20</span> วิ</span>
      </div>
      <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
        <div id="qBar" class="timer-bar h-full bg-emerald-500 rounded-full" style="width:100%"></div>
      </div>
      <h3 class="text-lg md:text-xl font-bold text-slate-800 mb-5">${esc(item.q)}</h3>
      <div id="qOpts" class="space-y-3">
        ${item.options.map((op,i)=>`
          <button onclick="answer(${i})" data-i="${i}"
            class="opt-btn lift w-full text-left rounded-2xl border-2 border-brand-100 bg-white hover:border-brand-400 px-5 py-3.5 font-medium text-slate-700 shadow-sm flex items-center gap-3">
            <span class="flex-none w-8 h-8 rounded-full bg-brand-50 text-brand-700 font-bold grid place-items-center">${String.fromCharCode(65+i)}</span>
            <span>${esc(op)}</span>
          </button>`).join("")}
      </div>
      <div id="qNextWrap" class="mt-5 hidden text-right">
        <button id="qNext" onclick="nextQuestion()" class="lift rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 text-white font-bold px-8 py-3 shadow-soft"></button>
      </div>
    </div>`;
  startTimer();
}
function startTimer(){
  const s = quizState;
  clearInterval(s.timer);
  s.timer = setInterval(()=>{
    // ป้องกันตัวจับเวลาเก่าที่ค้าง (ถ้ามีการเริ่มแบบทดสอบใหม่หรือเปลี่ยนหน้า)
    if(quizState !== s){ clearInterval(s.timer); return; }
    s.timeLeft--;
    const bar=$("qBar"), tt=$("qTime");
    if(tt) tt.textContent=s.timeLeft;
    if(bar){ bar.style.width=(s.timeLeft/20*100)+"%"; if(s.timeLeft<=7) bar.classList.replace("bg-emerald-500","bg-red-500"); }
    if(s.timeLeft<=0){ clearInterval(s.timer); if(!s.answered) answer(-1,true); }
  },1000);
}
function answer(i, timeout=false){
  const s = quizState;
  if(!s || s.answered) return;
  s.answered=true; clearInterval(s.timer);
  const item=s.qs[s.cur];
  const btns=document.querySelectorAll("#qOpts .opt-btn");
  btns.forEach(b=>{ b.setAttribute("disabled",""); b.classList.add("cursor-default","pointer-events-none");
    const bi=parseInt(b.dataset.i);
    if(bi===item.a){ b.classList.remove("border-brand-100"); b.classList.add("border-emerald-500","bg-emerald-50"); }
    if(bi===i && i!==item.a){ b.classList.remove("border-brand-100"); b.classList.add("border-red-400","bg-red-50"); }
  });
  if(i===item.a){ s.score++; }
  // ปุ่มไปข้อถัดไป
  const last = s.cur===s.qs.length-1;
  $("qNextWrap").classList.remove("hidden");
  $("qNext").textContent = last ? "ดูผลคะแนน 🎉" : "ข้อถัดไป ➡";
  if(timeout){
    Swal.fire({icon:"info",title:"หมดเวลา!",text:"ข้อนี้ใช้เวลาเกิน 20 วินาที",timer:1200,showConfirmButton:false});
  }
}
function nextQuestion(){
  const s=quizState;
  if(!s) return;
  if(s.cur < s.qs.length-1){ s.cur++; renderQuestion(); }
  else finishQuiz();
}
function finishQuiz(){
  const s=quizState;
  if(!s) return;
  clearInterval(s.timer);
  scores[s.mode]=s.score;
  const mode = s.mode, sc = s.score;
  quizState = null;
  if(mode==="pre"){
    unlocked=true; setLocks();
    $("pretestQuiz").classList.add("hidden"); $("pretestQuiz").innerHTML=""; $("pretestIntro").classList.remove("hidden");
    Swal.fire({icon:"success",title:"ทำแบบทดสอบก่อนเรียนเสร็จแล้ว!",html:`คุณได้ <b>${sc}/10</b> คะแนน<br>ตอนนี้ปลดล็อกเนื้อหาทั้งหมดแล้ว 🎉`,confirmButtonColor:"#2563eb",confirmButtonText:"ไปเรียนเนื้อหา 📚"})
    .then(()=>{ goto("content"); });
  } else {
    $("posttestQuiz").classList.add("hidden"); $("posttestQuiz").innerHTML=""; $("posttestIntro").classList.remove("hidden");
    Swal.fire({icon:"success",title:"ทำแบบทดสอบหลังเรียนเสร็จแล้ว!",html:`คุณได้ <b>${sc}/10</b> คะแนน`,confirmButtonColor:"#2563eb",confirmButtonText:"ดูผลพัฒนาการ 📊"})
    .then(()=>{ saveResult().then(()=>goto("result")); });
  }
}

/* ============================================================
   RESULT + QUALITY LEVEL
============================================================ */
function qualityLevel(score){
  const p = score/10*100;
  if(p>=80) return {t:"ดีมาก",e:"🌟",c:"text-emerald-600 bg-emerald-50"};
  if(p>=70) return {t:"ดี",e:"😃",c:"text-brand-600 bg-brand-50"};
  if(p>=60) return {t:"ปานกลาง",e:"🙂",c:"text-amber-600 bg-amber-50"};
  if(p>=50) return {t:"พอใช้",e:"😐",c:"text-orange-600 bg-orange-50"};
  return {t:"ควรปรับปรุง",e:"💪",c:"text-red-600 bg-red-50"};
}
function renderResult(){
  if(scores.pre===null || scores.post===null){
    $("resultBody").innerHTML = `<div class="text-slate-500">ยังทำแบบทดสอบไม่ครบ<br>กรุณาทำ${scores.pre===null?"แบบทดสอบก่อนเรียน":"แบบทดสอบหลังเรียน"}ให้เสร็จก่อน</div>`;
    return;
  }
  const diff = scores.post - scores.pre;
  const q = qualityLevel(scores.post);
  let dev, devColor, devEmo;
  if(diff>0){ dev=`พัฒนาขึ้น +${diff} คะแนน`; devColor="text-emerald-600 bg-emerald-50"; devEmo="📈"; }
  else if(diff===0){ dev="คะแนนเท่าเดิม"; devColor="text-amber-600 bg-amber-50"; devEmo="➡️"; }
  else { dev=`ลดลง ${diff} คะแนน`; devColor="text-red-600 bg-red-50"; devEmo="📉"; }
  $("resultBody").innerHTML = `
    <div class="grid sm:grid-cols-2 gap-4">
      <div class="lift rounded-xl2 border-2 border-brand-100 p-6">
        <p class="text-slate-500">📝 คะแนนก่อนเรียน</p>
        <p class="text-4xl font-extrabold text-brand-600 mt-1">${scores.pre}<span class="text-lg text-slate-400">/10</span></p>
      </div>
      <div class="lift rounded-xl2 border-2 border-emerald-100 p-6">
        <p class="text-slate-500">✅ คะแนนหลังเรียน</p>
        <p class="text-4xl font-extrabold text-emerald-600 mt-1">${scores.post}<span class="text-lg text-slate-400">/10</span></p>
      </div>
    </div>
    <div class="mt-4 grid sm:grid-cols-2 gap-4">
      <div class="rounded-xl2 p-5 ${devColor}"><p class="font-semibold">${devEmo} พัฒนาการ</p><p class="text-2xl font-extrabold mt-1">${dev}</p></div>
      <div class="rounded-xl2 p-5 ${q.c}"><p class="font-semibold">${q.e} ระดับคุณภาพ (หลังเรียน)</p><p class="text-2xl font-extrabold mt-1">${q.t}</p></div>
    </div>
    <div class="mt-6">
      <div class="flex items-center gap-3 mb-2 text-sm text-slate-500"><span>เปรียบเทียบคะแนน</span></div>
      <div class="space-y-3">
        <div><div class="flex justify-between text-xs mb-1"><span>ก่อนเรียน</span><span>${scores.pre}/10</span></div><div class="h-4 bg-slate-100 rounded-full"><div class="h-full bg-brand-500 rounded-full" style="width:${scores.pre*10}%"></div></div></div>
        <div><div class="flex justify-between text-xs mb-1"><span>หลังเรียน</span><span>${scores.post}/10</span></div><div class="h-4 bg-slate-100 rounded-full"><div class="h-full bg-emerald-500 rounded-full" style="width:${scores.post*10}%"></div></div></div>
      </div>
    </div>
    <p class="mt-6 text-slate-500 text-sm">👤 ผู้เรียน: <b class="text-slate-700">${esc(student.name)}</b> — ข้อมูลถูกบันทึกอัตโนมัติเรียบร้อยแล้ว ✅</p>
    <button onclick="loadLeaderboard()" class="lift mt-3 rounded-2xl bg-brand-50 text-brand-700 font-bold px-6 py-2.5 hover:bg-brand-100">🔄 อัปเดตกระดานผู้นำ</button>`;
}

/* ============================================================
   GAME (matching)
============================================================ */
let gameSel = null, gameMatched = 0;
function buildGame(){
  gameSel=null; gameMatched=0;
  const left = shuffle(GAME_PAIRS);
  const right = shuffle(GAME_PAIRS);
  $("gameTotal").textContent = GAME_PAIRS.length;
  $("gameScore").textContent = 0;
  $("gameLeft").innerHTML = left.map(p=>`
    <button class="match-card w-full rounded-2xl border-2 border-brand-200 bg-brand-50 px-4 py-4 font-mono font-bold text-brand-700 shadow-sm"
      data-key="${esc(p.tag)}" data-side="L" onclick="pick(this)">${esc(p.tag)}</button>`).join("");
  $("gameRight").innerHTML = right.map(p=>`
    <button class="match-card w-full rounded-2xl border-2 border-accent-400 bg-cyan-50 px-4 py-4 font-semibold text-slate-700 shadow-sm"
      data-key="${esc(p.tag)}" data-side="R" onclick="pick(this)">${esc(p.desc)}</button>`).join("");
}
function pick(el){
  if(el.classList.contains("matched")) return;
  if(!gameSel){ gameSel=el; el.classList.add("selected"); return; }
  if(gameSel===el){ el.classList.remove("selected"); gameSel=null; return; }
  if(gameSel.dataset.side===el.dataset.side){ gameSel.classList.remove("selected"); gameSel=el; el.classList.add("selected"); return; }
  // เปรียบเทียบคู่
  if(gameSel.dataset.key===el.dataset.key){
    gameSel.classList.add("matched"); el.classList.add("matched");
    gameSel.classList.remove("selected");
    gameMatched++; $("gameScore").textContent=gameMatched;
    if(gameMatched===GAME_PAIRS.length){
      Swal.fire({icon:"success",title:"เก่งมาก! 🎉",text:"จับคู่ครบทุกข้อแล้ว",confirmButtonColor:"#2563eb"});
    }
    gameSel=null;
  } else {
    const a=gameSel, b=el;
    a.classList.add("border-red-400"); b.classList.add("border-red-400");
    a.classList.remove("selected");
    setTimeout(()=>{ a.classList.remove("border-red-400"); b.classList.remove("border-red-400"); },600);
    gameSel=null;
  }
}

/* ============================================================
   SAVE TO GOOGLE APPS SCRIPT
============================================================ */
async function saveResult(){
  const diff = scores.post - scores.pre;
  const q = qualityLevel(scores.post);
  const payload = {
    name: student.name,
    pre: scores.pre,
    post: scores.post,
    diff: diff,
    quality: q.t
  };
  showLoading("💾 กำลังบันทึกข้อมูลลงชีต...");
  try{
    await fetch(GAS_URL, {
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify(payload)
    });
    hideLoading();
    Swal.fire({icon:"success",title:"บันทึกข้อมูลสำเร็จ ✅",text:"บันทึกคะแนนและพัฒนาการเรียบร้อยแล้ว",timer:1600,showConfirmButton:false});
  }catch(e){
    hideLoading();
    Swal.fire({icon:"error",title:"บันทึกไม่สำเร็จ",text:"เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่",confirmButtonColor:"#2563eb"});
  }
  loadLeaderboard();
}

/* ============================================================
   LEADERBOARD
============================================================ */
async function loadLeaderboard(){
  $("lbBody").innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400">⏳ กำลังโหลดข้อมูล...</td></tr>`;
  try{
    const res = await fetch(GAS_URL + "?action=leaderboard", {method:"GET"});
    const data = await res.json();
    leaderboardData = Array.isArray(data) ? data : (data.rows || []);
  }catch(e){
    leaderboardData = [];
  }
  renderLeaderboard();
}
function renderLeaderboard(){
  const term = ($("lbSearch").value || "").trim().toLowerCase();
  let rows = [...leaderboardData];
  // เรียงตามคะแนนหลังเรียนมากไปน้อย
  rows.sort((a,b)=> (Number(b.post)||0) - (Number(a.post)||0));
  if(term) rows = rows.filter(r=> String(r.name||"").toLowerCase().includes(term));
  if(!rows.length){
    $("lbBody").innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400">${term?"ไม่พบรายชื่อที่ค้นหา":"ยังไม่มีข้อมูล — เริ่มทำแบบทดสอบเพื่อขึ้นกระดานผู้นำ!"}</td></tr>`;
    return;
  }
  const medal = ["🥇","🥈","🥉"];
  $("lbBody").innerHTML = rows.map((r,i)=>{
    const rank = i+1;
    const badge = rank<=3 ? medal[rank-1] : `<span class="inline-grid place-items-center w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold">${rank}</span>`;
    return `<tr class="border-b border-slate-50 hover:bg-brand-50/40 transition">
      <td class="py-3 px-2 text-lg">${badge}</td>
      <td class="py-3 px-2 font-semibold text-slate-700">${esc(r.name||"-")}</td>
      <td class="py-3 px-2 text-center text-slate-500">${r.pre??"-"}</td>
      <td class="py-3 px-2 text-center font-bold text-emerald-600">${r.post??"-"}</td>
      <td class="py-3 px-2 text-center"><span class="px-2 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">${r.quality||"-"}</span></td>
    </tr>`;
  }).join("");
}

/* ============================================================
   INIT
============================================================ */
window.addEventListener("DOMContentLoaded", loadLeaderboard);
