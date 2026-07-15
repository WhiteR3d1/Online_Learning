/* ============================================================
   บทเรียนออนไลน์ HTML5 (CAI) — ตรรกะการทำงาน (JavaScript)
   ครอบคลุม: เนื้อหาแบบหน่วย/บทเรียน, สื่อหลากหลาย, แบบทดสอบก่อน-
   ระหว่าง-หลังเรียน + แบบฝึกหัด, เฉลยทันที, ติดตามความก้าวหน้า,
   บันทึกลง Google Sheet, และโหมดผู้ดูแลระบบ
============================================================ */

/* ============================================================
   CONFIG
============================================================ */
const GAS_URL = "https://script.google.com/macros/s/AKfycbwMDmFrVKxOlm6vxteOd6eW4pvBjp-EIEnG2nYANfR4XeGxaV-kWbGaMcuYErLiJ_zt/exec";
const YOUTUBE_EMBED = "https://www.youtube.com/embed/jj_kb6ZiPS0?rel=0";
const ADMIN_CODE = "admin1234";   // รหัสผู้ดูแลระบบ (เปลี่ยนได้ตามต้องการ)

/* ============================================================
   STATE
============================================================ */
let role = "student";
let student = { name: "" };
let scores = { pre: null, mid: null, post: null };
let unlocked = false;
let leaderboardData = [];
let progress = null;                 // ความก้าวหน้าของผู้เรียน (เก็บใน localStorage)
let exerciseState = {};              // สถานะการทำแบบฝึกหัดรายบท (ชั่วคราว)

/* ============================================================
   QUESTION BANK — ก่อน/หลังเรียน (10 ข้อ) พร้อมเฉลยอธิบาย
============================================================ */
const QUESTIONS = [
  { q:"ข้อใดคือความหมายของ “เว็บไซต์ (Website)” ที่ถูกต้องที่สุด",
    options:["โปรแกรมสำหรับตกแต่งรูปภาพ","กลุ่มของหน้าเว็บเพจที่เชื่อมโยงกันภายใต้ชื่อโดเมนเดียวกัน","อุปกรณ์ที่ใช้เชื่อมต่ออินเทอร์เน็ต","ภาษาที่ใช้เขียนโปรแกรมคอมพิวเตอร์"], a:1,
    ex:"เว็บไซต์ = กลุ่มของเว็บเพจหลายหน้าที่เชื่อมโยงกันภายใต้ชื่อโดเมนเดียวกัน" },
  { q:"องค์ประกอบใดต่อไปนี้ “ไม่ใช่” องค์ประกอบหลักของเว็บไซต์",
    options:["ส่วนหัว (Header)","ส่วนเนื้อหา (Content)","ส่วนท้าย (Footer)","หน่วยประมวลผลกลาง (CPU)"], a:3,
    ex:"CPU เป็นฮาร์ดแวร์ ไม่ใช่องค์ประกอบของหน้าเว็บ (Header/Content/Footer)" },
  { q:"หน้าแรกของเว็บไซต์ที่ผู้ใช้พบเป็นหน้าแรกเรียกว่าอะไร",
    options:["Homepage (โฮมเพจ)","Sitemap","Server","Hyperlink"], a:0,
    ex:"หน้าแรกของเว็บไซต์เรียกว่า โฮมเพจ (Homepage)" },
  { q:"HTML ย่อมาจากคำใด",
    options:["High Text Machine Language","Hyper Text Markup Language","Home Tool Markup Language","Hyperlink Text Marking Logic"], a:1,
    ex:"HTML = Hyper Text Markup Language (ภาษามาร์กอัปข้อความหลายมิติ)" },
  { q:"หน้าที่หลักของภาษา HTML5 คือข้อใด",
    options:["ใช้คำนวณตัวเลขทางคณิตศาสตร์","ใช้กำหนดโครงสร้างและแสดงเนื้อหาของหน้าเว็บ","ใช้จัดการฐานข้อมูลขนาดใหญ่","ใช้ป้องกันไวรัสคอมพิวเตอร์"], a:1,
    ex:"HTML5 ใช้กำหนดโครงสร้างและแสดงเนื้อหาของหน้าเว็บ" },
  { q:"แท็ก (Tag) HTML5 ใดใช้สำหรับกำหนด “เมนูนำทาง” ของเว็บไซต์",
    options:["<footer>","<article>","<nav>","<section>"], a:2,
    ex:"<nav> ใช้กำหนดส่วนเมนูนำทางของเว็บ" },
  { q:"แท็กใดเป็นแท็กเริ่มต้นที่บอกว่าเอกสารนี้เป็นเอกสาร HTML",
    options:["<html>","<body>","<title>","<div>"], a:0,
    ex:"<html> เป็นแท็กเริ่มต้นที่ครอบเอกสาร HTML ทั้งหมด" },
  { q:"ส่วนหัวด้านบนสุดของหน้าเว็บที่มักใส่โลโก้และชื่อเว็บ เรียกว่าส่วนใด",
    options:["Footer","Header","Sidebar","Content"], a:1,
    ex:"ส่วนหัวด้านบน = Header มักใส่โลโก้และชื่อเว็บ" },
  { q:"เว็บไซต์ประเภทใดที่เนื้อหาสามารถเปลี่ยนแปลงและโต้ตอบกับผู้ใช้ได้",
    options:["เว็บไซต์แบบคงที่ (Static)","เว็บไซต์แบบพลวัต (Dynamic)","เว็บไซต์แบบกระดาษ","เว็บไซต์แบบออฟไลน์"], a:1,
    ex:"เว็บแบบ Dynamic (พลวัต) เนื้อหาเปลี่ยนแปลงและโต้ตอบผู้ใช้ได้" },
  { q:"การจัดวางองค์ประกอบต่าง ๆ ของหน้าเว็บให้เป็นระเบียบสวยงาม เรียกว่าอะไร",
    options:["การเขียนโปรแกรม (Coding)","การจัดวางเลย์เอาต์ (Layout)","การอัปโหลด (Upload)","การเชื่อมโยง (Linking)"], a:1,
    ex:"การจัดวางองค์ประกอบหน้าเว็บ = การจัดเลย์เอาต์ (Layout)" },
];

/* ============================================================
   QUESTION BANK — ระหว่างเรียน (5 ข้อ)
============================================================ */
const MID_QUESTIONS = [
  { q:"เว็บเพจ (Web Page) กับ เว็บไซต์ (Website) แตกต่างกันอย่างไร",
    options:["เหมือนกันทุกประการ","เว็บเพจคือ 1 หน้า ส่วนเว็บไซต์คือกลุ่มของหลายเว็บเพจ","เว็บไซต์คือ 1 หน้า","ทั้งสองเป็นอุปกรณ์"], a:1,
    ex:"เว็บเพจ = 1 หน้า, เว็บไซต์ = กลุ่มของเว็บเพจหลายหน้ารวมกัน" },
  { q:"ส่วนใดของเว็บทำหน้าที่เป็นเมนูเชื่อมโยงไปยังหน้าอื่น ๆ",
    options:["Header","Navigation","Footer","Content"], a:1,
    ex:"Navigation (เมนูนำทาง) ใช้เชื่อมโยงไปยังหน้าอื่น ๆ" },
  { q:"เว็บขายสินค้าออนไลน์จัดเป็นเว็บประเภทใดตามวัตถุประสงค์",
    options:["เว็บอีคอมเมิร์ซ (E-commerce)","เว็บข่าว","บล็อกส่วนตัว","เว็บคงที่"], a:0,
    ex:"เว็บขายสินค้าออนไลน์ = เว็บอีคอมเมิร์ซ (E-commerce)" },
  { q:"HTML5 จัดเป็นภาษาประเภทใด",
    options:["ภาษามาร์กอัป (Markup Language)","ระบบปฏิบัติการ","โปรแกรมฐานข้อมูล","ภาษาคำนวณบัญชี"], a:0,
    ex:"HTML5 เป็นภาษามาร์กอัปสำหรับกำหนดโครงสร้างหน้าเว็บ" },
  { q:"แท็กใดใช้สำหรับแทรกรูปภาพลงในหน้าเว็บ",
    options:["<img>","<p>","<h1>","<nav>"], a:0,
    ex:"<img> ใช้สำหรับแทรกรูปภาพลงในหน้าเว็บ" },
];

/* ============================================================
   INFOGRAPHIC & ANIMATION (สื่อ)
============================================================ */
const INFOGRAPHIC_LAYOUT = `
  <div class="infographic mt-4 rounded-2xl border border-brand-100 p-3 bg-white">
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพองค์ประกอบเว็บไซต์">
      <g class="ig-block">
        <rect x="10" y="10" width="400" height="46" rx="10" fill="#2563eb"/>
        <text x="210" y="38" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">Header (ส่วนหัว)</text>
      </g>
      <g class="ig-block">
        <rect x="10" y="63" width="400" height="30" rx="8" fill="#06b6d4"/>
        <text x="210" y="83" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">Navigation (เมนูนำทาง)</text>
      </g>
      <g class="ig-block">
        <rect x="10" y="100" width="120" height="140" rx="8" fill="#bfdbfe"/>
        <text x="70" y="175" text-anchor="middle" fill="#1e40af" font-size="13" font-weight="700">Sidebar</text>
      </g>
      <g class="ig-block">
        <rect x="138" y="100" width="272" height="140" rx="8" fill="#eff6ff" stroke="#bfdbfe"/>
        <text x="274" y="175" text-anchor="middle" fill="#1d4ed8" font-size="14" font-weight="700">Content (ส่วนเนื้อหา)</text>
      </g>
      <g class="ig-block">
        <rect x="10" y="247" width="400" height="34" rx="8" fill="#475569"/>
        <text x="210" y="269" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">Footer (ส่วนท้าย)</text>
      </g>
    </svg>
    <p class="text-center text-xs text-slate-400 mt-2">🖼️ อินโฟกราฟิก: โครงสร้างองค์ประกอบของหน้าเว็บไซต์</p>
  </div>`;

const ANIM_STRUCTURE = `
  <div class="stack-anim mt-4 rounded-2xl bg-slate-900 p-4 text-sm overflow-x-auto">
    <div class="tag-row text-slate-400">&lt;!DOCTYPE html&gt;</div>
    <div class="tag-row text-sky-300">&lt;html&gt;</div>
    <div class="tag-row text-emerald-300 pl-4">&lt;head&gt; &lt;title&gt;ชื่อเว็บ&lt;/title&gt; &lt;/head&gt;</div>
    <div class="tag-row text-amber-300 pl-4">&lt;body&gt; ... เนื้อหา ... &lt;/body&gt;</div>
    <div class="tag-row text-sky-300">&lt;/html&gt;</div>
  </div>
  <p class="text-center text-xs text-slate-400 mt-2">🎞️ แอนิเมชัน: แท็กแต่ละส่วนของโครงสร้าง HTML5 ค่อย ๆ ปรากฏขึ้นทีละบรรทัด</p>`;

/* ============================================================
   LESSONS (8 บท) — เรียงจากง่ายไปยาก
============================================================ */
const LESSONS = {
1:{icon:"🌐", title:"บทที่ 1 ความหมายของเว็บไซต์",
   body:`
     <p><b>เว็บไซต์ (Website)</b> คือ กลุ่มของหน้าเว็บเพจ (Web Page) หลาย ๆ หน้าที่เกี่ยวข้องกันและถูกเชื่อมโยง (Link) เข้าด้วยกัน จัดเก็บบนเครื่องเซิร์ฟเวอร์ (Web Server) ภายใต้ชื่อโดเมน (Domain Name) เดียวกัน เพื่อให้ผู้ใช้เข้าถึงผ่านอินเทอร์เน็ตได้</p>
     <ul class="list-disc pl-6 mt-3 space-y-1 text-slate-600">
       <li>เข้าถึงผ่านเว็บเบราว์เซอร์ เช่น Chrome, Edge</li>
       <li>มีที่อยู่เว็บ (URL) เช่น www.example.com</li>
       <li>หน้าแรกของเว็บไซต์เรียกว่า <b>โฮมเพจ (Homepage)</b></li>
     </ul>`,
   think:"ถ้าร้านขายของในชุมชนอยากให้คนทั้งประเทศรู้จักและสั่งซื้อสินค้าได้ตลอด 24 ชั่วโมง เว็บไซต์จะช่วยได้อย่างไร?",
   career:"อาชีพผู้ประกอบการ/ช่างเทคนิคคอมพิวเตอร์ สามารถสร้างเว็บไซต์ร้านค้าออนไลน์เพื่อโฆษณาและขายสินค้าให้ลูกค้าทั่วประเทศ",
   exercise:[
     {q:"เว็บเพจกับเว็บไซต์ต่างกันอย่างไร", options:["เหมือนกันทุกอย่าง","เว็บเพจคือ 1 หน้า ส่วนเว็บไซต์คือหลายเว็บเพจรวมกัน","เว็บไซต์คือ 1 หน้า","เป็นโปรแกรมทั้งคู่"], a:1, ex:"เว็บเพจ = 1 หน้า, เว็บไซต์ = กลุ่มของเว็บเพจหลายหน้า"},
     {q:"หน้าแรกของเว็บไซต์เรียกว่าอะไร", options:["โฮมเพจ (Homepage)","ฟุตเตอร์","เซิร์ฟเวอร์","โดเมน"], a:0, ex:"หน้าแรก = โฮมเพจ (Homepage)"},
   ]},
2:{icon:"🧩", title:"บทที่ 2 องค์ประกอบของเว็บไซต์", video:true, extra:INFOGRAPHIC_LAYOUT,
   body:`
     <p>เว็บไซต์ที่ดีมักประกอบด้วยส่วนสำคัญดังนี้</p>
     <div class="grid sm:grid-cols-2 gap-3 mt-3">
       <div class="rounded-2xl bg-brand-50 p-4">🔝 <b>ส่วนหัว (Header)</b><br><span class="text-sm text-slate-600">โลโก้ ชื่อเว็บ แบนเนอร์</span></div>
       <div class="rounded-2xl bg-brand-50 p-4">🧭 <b>เมนูนำทาง (Navigation)</b><br><span class="text-sm text-slate-600">ลิงก์ไปยังหน้าต่าง ๆ</span></div>
       <div class="rounded-2xl bg-brand-50 p-4">📄 <b>ส่วนเนื้อหา (Content)</b><br><span class="text-sm text-slate-600">ข้อความ รูปภาพ วิดีโอ</span></div>
       <div class="rounded-2xl bg-brand-50 p-4">🔻 <b>ส่วนท้าย (Footer)</b><br><span class="text-sm text-slate-600">ลิขสิทธิ์ ติดต่อ ลิงก์</span></div>
     </div>`,
   think:"ถ้าเว็บไซต์ไม่มีเมนูนำทาง (Navigation) ผู้ใช้จะเจอปัญหาอะไรบ้างในการใช้งาน?",
   career:"นักออกแบบเว็บ (Web Designer) ต้องจัดวางองค์ประกอบเหล่านี้ให้ครบและใช้งานง่าย เพื่อให้ลูกค้าประทับใจ",
   exercise:[
     {q:"ส่วนใดของเว็บมักวางโลโก้และชื่อเว็บ", options:["Header","Footer","Content","Sidebar"], a:0, ex:"Header = ส่วนหัว วางโลโก้/ชื่อเว็บ"},
     {q:"เมนูนำทาง (Navigation) มีหน้าที่อะไร", options:["ตกแต่งสีสัน","เชื่อมโยงไปยังหน้าต่าง ๆ","เก็บฐานข้อมูล","เล่นเพลง"], a:1, ex:"Navigation ใช้เชื่อมไปยังหน้าอื่น ๆ ของเว็บ"},
   ]},
3:{icon:"🗂️", title:"บทที่ 3 ประเภทของเว็บไซต์",
   body:`
     <p>เว็บไซต์แบ่งตามลักษณะการทำงานได้ 2 ประเภทหลัก</p>
     <div class="grid sm:grid-cols-2 gap-3 mt-3">
       <div class="rounded-2xl border border-brand-100 p-4">📌 <b>แบบคงที่ (Static)</b><br><span class="text-sm text-slate-600">เนื้อหาตายตัว แก้ไขต้องเขียนโค้ดใหม่</span></div>
       <div class="rounded-2xl border border-brand-100 p-4">⚡ <b>แบบพลวัต (Dynamic)</b><br><span class="text-sm text-slate-600">เนื้อหาเปลี่ยนแปลง/โต้ตอบผู้ใช้ได้ เชื่อมฐานข้อมูล</span></div>
     </div>
     <p class="mt-3 text-slate-600">ตามวัตถุประสงค์ เช่น เว็บข่าว 📰, เว็บการศึกษา 🎓, เว็บอีคอมเมิร์ซ 🛒, เว็บองค์กร 🏢, บล็อก ✍️</p>`,
   think:"เว็บไซต์ของโรงเรียนที่มีระบบเช็กเกรดออนไลน์ ควรเป็นแบบ Static หรือ Dynamic เพราะอะไร?",
   career:"ผู้พัฒนาเว็บ (Web Developer) เลือกประเภทเว็บให้เหมาะกับงาน เช่น เว็บร้านค้าต้องเป็น Dynamic เพื่ออัปเดตสินค้าได้",
   exercise:[
     {q:"เว็บแบบใดโต้ตอบผู้ใช้และเชื่อมฐานข้อมูลได้", options:["Static","Dynamic","กระดาษ","ออฟไลน์"], a:1, ex:"Dynamic (พลวัต) โต้ตอบและเชื่อมฐานข้อมูลได้"},
     {q:"เว็บขายของออนไลน์จัดเป็นประเภทใดตามวัตถุประสงค์", options:["อีคอมเมิร์ซ","เว็บข่าว","บล็อก","เว็บองค์กร"], a:0, ex:"ขายสินค้า = อีคอมเมิร์ซ (E-commerce)"},
   ]},
4:{icon:"📘", title:"บทที่ 4 ความหมายของภาษา HTML5",
   body:`
     <p><b>HTML5</b> (Hyper Text Markup Language เวอร์ชัน 5) คือ ภาษามาร์กอัป (Markup Language) รุ่นล่าสุดที่ใช้สร้างและกำหนดโครงสร้างของหน้าเว็บเพจ</p>
     <ul class="list-disc pl-6 mt-3 space-y-1 text-slate-600">
       <li>เป็นภาษาพื้นฐานที่เบราว์เซอร์ทุกตัวเข้าใจ</li>
       <li>รองรับมัลติมีเดียโดยตรง (&lt;audio&gt;, &lt;video&gt;)</li>
       <li>มีแท็กเชิงความหมาย (Semantic Tags) ทำให้โครงสร้างชัดเจน</li>
     </ul>`,
   think:"ทำไมภาษา HTML จึงถูกพัฒนาเรื่อยมาจนถึงเวอร์ชัน 5? การอัปเดตช่วยผู้สร้างเว็บอย่างไร?",
   career:"โปรแกรมเมอร์เว็บใช้ HTML5 เป็นพื้นฐานในการสร้างทุกเว็บไซต์ ก่อนต่อยอดด้วย CSS และ JavaScript",
   exercise:[
     {q:"HTML ย่อมาจากคำใด", options:["Hyper Text Markup Language","High Tech Modern Language","Home Tool Markup Language","Hyper Transfer Machine Link"], a:0, ex:"HTML = Hyper Text Markup Language"},
     {q:"HTML5 เป็นภาษาประเภทใด", options:["ภาษามาร์กอัป (Markup)","ระบบปฏิบัติการ","โปรแกรมฐานข้อมูล","ภาษาคำนวณ"], a:0, ex:"HTML เป็นภาษามาร์กอัปสำหรับกำหนดโครงสร้างหน้าเว็บ"},
   ]},
5:{icon:"🛠️", title:"บทที่ 5 หน้าที่ของภาษา HTML5",
   body:`
     <p>HTML5 มีหน้าที่สำคัญในการสร้างเว็บไซต์ ดังนี้</p>
     <div class="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
       <div class="rounded-2xl bg-brand-50 p-4">🏗️ กำหนด<b>โครงสร้าง</b>ของหน้าเว็บ</div>
       <div class="rounded-2xl bg-brand-50 p-4">✍️ แสดง<b>ข้อความ</b>และหัวเรื่อง</div>
       <div class="rounded-2xl bg-brand-50 p-4">🖼️ แทรก<b>รูปภาพ เสียง วิดีโอ</b></div>
       <div class="rounded-2xl bg-brand-50 p-4">🔗 สร้าง<b>ลิงก์เชื่อมโยง</b>ระหว่างหน้า</div>
       <div class="rounded-2xl bg-brand-50 p-4">📋 สร้าง<b>ตารางและฟอร์ม</b>รับข้อมูล</div>
       <div class="rounded-2xl bg-brand-50 p-4">🧭 จัดกลุ่มเนื้อหาด้วย<b>Semantic Tags</b></div>
     </div>`,
   think:"ถ้าต้องทำแบบฟอร์มรับสมัครนักเรียนออนไลน์ HTML5 จะช่วยเราสร้างช่องกรอกข้อมูลได้อย่างไร?",
   career:"ช่างเทคนิคเว็บใช้แท็ก HTML5 สร้างฟอร์มติดต่อ ฟอร์มสั่งซื้อ หรือแบบสอบถามให้กับหน่วยงานต่าง ๆ",
   exercise:[
     {q:"ข้อใดเป็นหน้าที่ของ HTML5", options:["กำหนดโครงสร้างและแสดงเนื้อหาเว็บ","ป้องกันไวรัส","คำนวณบัญชี","ตัดต่อวิดีโอ"], a:0, ex:"HTML5 กำหนดโครงสร้างและแสดงเนื้อหาของหน้าเว็บ"},
     {q:"แท็กใดใช้แทรกรูปภาพ", options:["<img>","<p>","<h1>","<ul>"], a:0, ex:"<img> ใช้แทรกรูปภาพ"},
   ]},
6:{icon:"🏗️", title:"บทที่ 6 โครงสร้างของเว็บไซต์ (HTML5)", extra:ANIM_STRUCTURE,
   body:`
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
&lt;/html&gt;</code></pre>`,
   think:"เพราะเหตุใดทุกเอกสาร HTML จึงต้องเริ่มด้วย &lt;!DOCTYPE html&gt; เสมอ?",
   career:"เว็บโปรแกรมเมอร์ต้องเขียนโครงสร้างนี้ให้ถูกต้องทุกครั้ง เพื่อให้เบราว์เซอร์แสดงผลได้ถูกต้อง",
   exercise:[
     {q:"แท็กใดครอบเนื้อหาที่แสดงบนหน้าจอทั้งหมด", options:["<head>","<body>","<title>","<meta>"], a:1, ex:"<body> เก็บเนื้อหาที่แสดงผลบนหน้าจอ"},
     {q:"บรรทัด <!DOCTYPE html> ใช้บอกอะไร", options:["ประเภทเอกสารเป็น HTML5","ชื่อเว็บ","สีพื้นหลัง","ขนาดตัวอักษร"], a:0, ex:"<!DOCTYPE html> ประกาศว่าเอกสารนี้เป็น HTML5"},
   ]},
7:{icon:"📐", title:"บทที่ 7 การออกแบบโครงสร้างหน้าเว็บไซต์",
   body:`
     <p>การออกแบบโครงสร้าง (Wireframe / Layout) คือการวางแผนตำแหน่งของแต่ละส่วนก่อนลงมือเขียนโค้ด</p>
     <div class="mt-3 rounded-2xl border-2 border-dashed border-brand-200 p-4">
       <div class="rounded-xl bg-brand-600 text-white text-center py-2 font-semibold">Header (ส่วนหัว)</div>
       <div class="rounded-xl bg-brand-400 text-white text-center py-1 my-2 font-semibold">Navigation (เมนู)</div>
       <div class="grid grid-cols-3 gap-2">
         <div class="rounded-xl bg-brand-100 text-brand-700 text-center py-8 font-semibold">Sidebar</div>
         <div class="col-span-2 rounded-xl bg-brand-50 text-brand-700 text-center py-8 font-semibold">Content</div>
       </div>
       <div class="rounded-xl bg-slate-600 text-white text-center py-2 mt-2 font-semibold">Footer (ส่วนท้าย)</div>
     </div>`,
   think:"ก่อนสร้างเว็บจริง ทำไมเราจึงควรร่างโครงสร้าง (Wireframe) บนกระดาษหรือโปรแกรมก่อน?",
   career:"UX/UI Designer จะออกแบบ Wireframe เพื่อสื่อสารกับทีมและลูกค้าก่อนพัฒนาเว็บจริง ช่วยลดการแก้งานซ้ำ",
   exercise:[
     {q:"การวางแผนตำแหน่งองค์ประกอบก่อนเขียนโค้ดเรียกว่า", options:["Wireframe/Layout","Debug","Upload","Hosting"], a:0, ex:"การร่างตำแหน่งองค์ประกอบ = Wireframe/Layout"},
     {q:"ในโครงสร้างหน้าเว็บทั่วไป Footer อยู่ตำแหน่งใด", options:["บนสุด","ล่างสุด","กลางหน้า","ซ้ายมือ"], a:1, ex:"Footer อยู่ล่างสุดของหน้าเว็บ"},
   ]},
8:{icon:"🎨", title:"บทที่ 8 การจัดวางองค์ประกอบของเว็บไซต์",
   body:`
     <p>การจัดวางองค์ประกอบ (Layout) ที่ดี ช่วยให้เว็บสวยงาม อ่านง่าย ใช้งานสะดวก มีหลักการดังนี้</p>
     <ul class="list-disc pl-6 mt-3 space-y-1 text-slate-600">
       <li>⚖️ <b>ความสมดุล (Balance)</b> จัดวางให้สมดุลซ้าย–ขวา</li>
       <li>🎯 <b>จุดเด่น (Emphasis)</b> เน้นส่วนสำคัญด้วยสี ขนาด ตำแหน่ง</li>
       <li>📏 <b>ระยะห่าง (Spacing)</b> เว้นช่องว่างให้อ่านสบายตา</li>
       <li>🔁 <b>ความสม่ำเสมอ (Consistency)</b> ใช้สีและฟอนต์แนวเดียวกัน</li>
       <li>📱 <b>Responsive</b> แสดงผลได้ดีทุกขนาดหน้าจอ</li>
     </ul>`,
   think:"เว็บที่ใช้สีฉูดฉาดหลายสีและตัวอักษรหลายแบบปนกัน จะส่งผลต่อผู้อ่านอย่างไร?",
   career:"Graphic/Web Designer ใช้หลักการจัดวางเหล่านี้ออกแบบหน้าเว็บให้แบรนด์ดูมืออาชีพและน่าเชื่อถือ",
   exercise:[
     {q:"หลักการที่เว้นช่องว่างให้อ่านสบายตาเรียกว่า", options:["Spacing (ระยะห่าง)","Bug","Loop","Server"], a:0, ex:"การเว้นช่องว่าง = Spacing (ระยะห่าง)"},
     {q:"การออกแบบที่แสดงผลดีทุกขนาดหน้าจอเรียกว่า", options:["Responsive","Static","Offline","Compile"], a:0, ex:"แสดงผลดีทุกจอ = Responsive Design"},
   ]},
};

const UNITS = [
  { id:1, title:"หน่วยที่ 1 : ความรู้เบื้องต้นเกี่ยวกับเว็บไซต์", icon:"🌐", lessons:[1,2,3] },
  { id:2, title:"หน่วยที่ 2 : ภาษา HTML5",                        icon:"📘", lessons:[4,5,6] },
  { id:3, title:"หน่วยที่ 3 : การออกแบบและจัดวางเว็บไซต์",        icon:"🎨", lessons:[7,8] },
];

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
function totalLessons(){ return Object.keys(LESSONS).length; }

/* ============================================================
   PROGRESS (localStorage)
============================================================ */
function progKey(name){ return "cai_progress_" + name.trim().toLowerCase(); }
function blankProgress(name){
  const lessons={};
  Object.keys(LESSONS).forEach(id=>{ lessons[id]={viewed:false, exercise:null}; });
  return { name, pretest:{done:false,score:null}, lessons, mid:{done:false,score:null}, posttest:{done:false,score:null}, updatedAt:null };
}
function loadProgress(name){
  try{ const raw=localStorage.getItem(progKey(name)); if(raw){ const p=JSON.parse(raw);
    // เติมฟิลด์ที่อาจขาด
    const base=blankProgress(name); base.name=name;
    base.pretest=p.pretest||base.pretest; base.mid=p.mid||base.mid; base.posttest=p.posttest||base.posttest;
    Object.keys(LESSONS).forEach(id=>{ if(p.lessons&&p.lessons[id]) base.lessons[id]={viewed:!!p.lessons[id].viewed, exercise:(p.lessons[id].exercise??null)}; });
    return base;
  } }catch(e){}
  return blankProgress(name);
}
function saveProgress(){ if(!progress) return; progress.updatedAt=new Date().toISOString(); try{ localStorage.setItem(progKey(progress.name), JSON.stringify(progress)); }catch(e){} }

function countDone(){
  let done=0;
  if(progress.pretest.done) done++;
  Object.keys(LESSONS).forEach(id=>{ if(progress.lessons[id].viewed) done++; if(progress.lessons[id].exercise!==null) done++; });
  if(progress.mid.done) done++;
  if(progress.posttest.done) done++;
  return done;
}
function totalSteps(){ return 1 + totalLessons()*2 + 1 + 1; } // pretest + (view+exercise)*8 + mid + post
function progressPct(){ return Math.round(countDone()/totalSteps()*100); }
function overallStatus(){
  if(progress.posttest.done) return "done";
  if(countDone()>0) return "prog";
  return "none";
}
function statusInfo(code){
  if(code==="done") return {label:"เรียนจบ", cls:"st-done", emoji:"✅"};
  if(code==="prog") return {label:"กำลังเรียน", cls:"st-prog", emoji:"📖"};
  return {label:"ยังไม่เรียน", cls:"st-none", emoji:"⭕"};
}
function unitStatus(unit){
  const ls=unit.lessons;
  const viewed=ls.filter(id=>progress.lessons[id].viewed).length;
  const exDone=ls.filter(id=>progress.lessons[id].exercise!==null).length;
  if(viewed===0 && exDone===0) return "none";
  if(viewed===ls.length && exDone===ls.length) return "done";
  return "prog";
}
function updateProgressUI(){
  if(!progress) return;
  const pct=progressPct(); const st=statusInfo(overallStatus());
  const sb=$("sideProgBar"), sp=$("sideProgPct"), ss=$("sideStatus");
  if(sb) sb.style.width=pct+"%";
  if(sp) sp.textContent=pct+"%";
  if(ss) ss.textContent="สถานะ: "+st.label;
  const hb=$("homeProgBar"), hp=$("homeProgPct"), badge=$("homeStatusBadge");
  if(hb) hb.style.width=pct+"%";
  if(hp) hp.textContent=pct+"%";
  if(badge){ badge.textContent=st.emoji+" "+st.label; badge.className="px-4 py-1.5 rounded-full text-sm font-bold "+st.cls; }
}

/* ============================================================
   LOGIN / LOGOUT / ROLE
============================================================ */
function setRole(r){
  role=r;
  $("roleStudentBtn").classList.toggle("active", r==="student");
  $("roleAdminBtn").classList.toggle("active", r==="admin");
  $("studentForm").classList.toggle("hidden", r!=="student");
  $("adminForm").classList.toggle("hidden", r!=="admin");
}
function doLogin(){
  const name = $("loginName").value.trim();
  if(name.length < 3){
    Swal.fire({icon:"warning",title:"กรุณากรอกชื่อ–นามสกุล",text:"โปรดกรอกชื่อและนามสกุลของผู้เรียนก่อนเข้าสู่บทเรียน",confirmButtonColor:"#2563eb"});
    return;
  }
  student.name = name;
  progress = loadProgress(name);
  scores = { pre:progress.pretest.score, mid:progress.mid.score, post:progress.posttest.score };
  unlocked = progress.pretest.done;
  quizState = null;
  $("sideUser").textContent = name;
  $("mobileUser").textContent = name;
  $("loginScreen").classList.add("hidden");
  $("appScreen").classList.remove("hidden");
  $("helpFab").classList.remove("hidden");
  setLocks();
  renderContent();
  goto("home");
  const returning = progress.updatedAt ? "ยินดีต้อนรับกลับมา" : "ยินดีต้อนรับ";
  Swal.fire({icon:"success",title:"เข้าสู่ระบบสำเร็จ!",text:returning+" "+name,timer:1400,showConfirmButton:false});
}
function doLogout(){
  Swal.fire({title:"ออกจากระบบ?",text:"ความก้าวหน้าถูกบันทึกไว้แล้ว เมื่อเข้าใหม่ด้วยชื่อเดิมจะเรียนต่อได้",icon:"question",showCancelButton:true,confirmButtonColor:"#ef4444",cancelButtonColor:"#94a3b8",confirmButtonText:"ออกจากระบบ",cancelButtonText:"ยกเลิก"})
  .then(r=>{ if(r.isConfirmed){
    abortActiveQuiz();
    $("appScreen").classList.add("hidden");
    $("helpFab").classList.add("hidden");
    $("loginScreen").classList.remove("hidden");
    $("loginName").value="";
    setRole("student");
    loadLeaderboard();
    if(window.innerWidth<768) closeSidebar();
  }});
}

/* ---- Admin ---- */
function doAdminLogin(){
  const code=$("adminCode").value.trim();
  if(code!==ADMIN_CODE){
    Swal.fire({icon:"error",title:"รหัสไม่ถูกต้อง",text:"กรุณาตรวจสอบรหัสผู้ดูแลระบบอีกครั้ง",confirmButtonColor:"#2563eb"});
    return;
  }
  $("adminCode").value="";
  $("loginScreen").classList.add("hidden");
  $("adminScreen").classList.remove("hidden");
  loadAdmin();
}
function adminLogout(){
  $("adminScreen").classList.add("hidden");
  $("loginScreen").classList.remove("hidden");
  setRole("student");
  loadLeaderboard();
}

/* ============================================================
   NAVIGATION + LOCKS
============================================================ */
function setLocks(){
  document.querySelectorAll(".nav-btn").forEach(b=>{
    const t=b.dataset.target;
    if(["content","midtest","posttest","game","result"].includes(t)){
      if(unlocked){ b.classList.remove("locked"); const l=b.querySelector(".lock-ic"); if(l) l.remove(); }
      else b.classList.add("locked");
    }
  });
}
function goto(target){
  if(["content","midtest","posttest","game","result"].includes(target) && !unlocked){
    Swal.fire({icon:"info",title:"ยังเข้าไม่ได้ 🔒",text:"กรุณาทำแบบทดสอบก่อนเรียนให้เสร็จก่อน จึงจะเข้าส่วนนี้ได้",confirmButtonColor:"#2563eb"});
    goto("pretest"); return;
  }
  abortActiveQuiz();
  document.querySelectorAll(".app-sec").forEach(s=>s.classList.add("hidden"));
  const sec=$("sec-"+target); sec.classList.remove("hidden"); sec.classList.add("fade-in");
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.target===target));
  if(target==="home") renderHome();
  if(target==="result") renderResult();
  if(target==="game") buildGame();
  window.scrollTo({top:0,behavior:"smooth"});
  if(window.innerWidth<768) closeSidebar();
}
function toggleSidebar(){ $("sidebar").classList.toggle("-translate-x-full"); $("sidebarBg").classList.toggle("hidden"); }
function closeSidebar(){ $("sidebar").classList.add("-translate-x-full"); $("sidebarBg").classList.add("hidden"); }

/* ============================================================
   HOME / DASHBOARD
============================================================ */
function renderHome(){
  updateProgressUI();
  // checklist
  const lessonsViewed = Object.keys(LESSONS).filter(id=>progress.lessons[id].viewed).length;
  const exDone = Object.keys(LESSONS).filter(id=>progress.lessons[id].exercise!==null).length;
  const items = [
    { ok:progress.pretest.done, label:"ทำแบบทดสอบก่อนเรียน", extra:progress.pretest.done?`(${progress.pretest.score}/10)`:"" },
    { ok:lessonsViewed===totalLessons(), label:`เรียนเนื้อหาครบทุกบท`, extra:`(${lessonsViewed}/${totalLessons()})` },
    { ok:exDone===totalLessons(), label:`ทำแบบฝึกหัดท้ายบท`, extra:`(${exDone}/${totalLessons()})` },
    { ok:progress.mid.done, label:"ทำแบบทดสอบระหว่างเรียน", extra:progress.mid.done?`(${progress.mid.score}/5)`:"" },
    { ok:progress.posttest.done, label:"ทำแบบทดสอบหลังเรียน", extra:progress.posttest.done?`(${progress.posttest.score}/10)`:"" },
  ];
  $("homeChecklist").innerHTML = items.map(it=>`
    <div class="flex items-center gap-3 rounded-2xl border ${it.ok?'border-emerald-200 bg-emerald-50':'border-slate-200 bg-slate-50'} px-4 py-3">
      <span class="text-xl">${it.ok?'✅':'⭕'}</span>
      <span class="font-medium ${it.ok?'text-emerald-700':'text-slate-600'}">${it.label} <span class="text-xs text-slate-400">${it.extra}</span></span>
    </div>`).join("");
  // unit cards
  $("homeUnits").innerHTML = UNITS.map(u=>{
    const st=statusInfo(unitStatus(u));
    return `<div class="lift rounded-xl2 bg-white border border-brand-100 shadow-soft p-5">
      <div class="text-3xl">${u.icon}</div>
      <p class="font-bold mt-2 text-slate-700 text-sm leading-snug">${esc(u.title)}</p>
      <span class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${st.cls}">${st.emoji} ${st.label}</span>
      <button onclick="goto('content'); setTimeout(()=>openUnit(${u.id}),150)" class="mt-3 w-full rounded-2xl bg-brand-50 text-brand-700 font-bold py-2 text-sm hover:bg-brand-100">เข้าเรียน</button>
    </div>`;
  }).join("");
}

/* ============================================================
   CONTENT (UNITS / LESSONS)
============================================================ */
function renderContent(){
  let html = `<div class="mb-5 rounded-xl2 bg-white border border-brand-100 shadow-soft p-5 flex items-center gap-3">
    <span class="text-3xl">📚</span>
    <div><h2 class="text-lg font-extrabold text-slate-800">เนื้อหาความรู้</h2>
    <p class="text-xs text-slate-400">เรียนทีละบทจากง่ายไปยาก • เปิดบทเรียนเพื่อดูสื่อ อ่านเนื้อหา และทำแบบฝึกหัดท้ายบท</p></div></div>`;

  UNITS.forEach(u=>{
    html += `<div class="rounded-xl2 bg-white border border-brand-100 shadow-soft mb-4 overflow-hidden">
      <button onclick="toggleUnitAccordion(${u.id})" class="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-brand-50/60 transition">
        <span class="flex items-center gap-3"><span class="text-2xl">${u.icon}</span><span class="font-extrabold text-slate-800">${esc(u.title)}</span></span>
        <span id="unitStatus-${u.id}" class="text-xs"></span>
      </button>
      <div id="unitBody-${u.id}" class="accordion-body px-5">
        <div class="pb-4 space-y-3">`;
    u.lessons.forEach(lid=>{
      const L=LESSONS[lid];
      html += `
        <div id="lesson-${lid}" class="lesson-item rounded-2xl border border-brand-100">
          <button onclick="openLesson(${lid})" class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
            <span class="flex items-center gap-3"><span class="text-xl">${L.icon}</span><span class="font-bold text-slate-700">${esc(L.title)}</span></span>
            <span class="lesson-check text-slate-300 text-lg">${progress.lessons[lid].viewed?'✅':'○'}</span>
          </button>
          <div id="lbody-${lid}" class="accordion-body px-4">${lessonBodyHTML(lid)}</div>
        </div>`;
    });
    html += `</div></div></div>`;
  });

  html += `<div class="mt-6 grid sm:grid-cols-2 gap-3">
    <button onclick="goto('midtest')" class="lift rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-6 py-3 shadow-soft">🧭 ทำแบบทดสอบระหว่างเรียน</button>
    <button onclick="goto('posttest')" class="lift rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-6 py-3 shadow-soft">✅ ทำแบบทดสอบหลังเรียน</button>
  </div>`;

  $("contentWrap").innerHTML = html;
  UNITS.forEach(u=>updateUnitStatusLabel(u.id));
}
function lessonBodyHTML(lid){
  const L=LESSONS[lid];
  let media = `<div class="text-slate-700 leading-relaxed pt-1">${L.body}</div>`;
  if(L.extra) media += L.extra;
  if(L.video){
    media += `<div class="mt-4 rounded-2xl overflow-hidden shadow-soft aspect-video">
      <iframe class="w-full h-full" src="${YOUTUBE_EMBED}" title="วิดีโอสื่อการเรียนรู้" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
      <p class="text-center text-xs text-slate-400 mt-2">🎬 วิดีโอสื่อการเรียนรู้ — กดเล่น หยุด ย้อนกลับ และปรับความเร็วได้จากแถบควบคุมของวิดีโอ</p>`;
  }
  // think box
  media += `<div class="think-box rounded-2xl p-4 mt-4">
    <p class="font-bold text-amber-700">💡 คำถามชวนคิด</p>
    <p class="text-slate-700 mt-1">${esc(L.think)}</p>
  </div>`;
  // career box
  media += `<div class="career-box rounded-2xl p-4 mt-3">
    <p class="font-bold text-cyan-700">💼 การประยุกต์ใช้ในงานอาชีพ</p>
    <p class="text-slate-700 mt-1">${esc(L.career)}</p>
  </div>`;
  // exercise
  media += exerciseHTML(lid);
  return `<div class="pb-4">${media}</div>`;
}
function exerciseHTML(lid){
  const L=LESSONS[lid];
  let h=`<div class="mt-4 rounded-2xl border-2 border-brand-100 p-4">
    <p class="font-bold text-brand-700 mb-3">✏️ แบบฝึกหัดท้ายบท (${L.exercise.length} ข้อ) — มีเฉลยทันที</p>`;
  L.exercise.forEach((q,qi)=>{
    h+=`<div class="ex-q mb-4" data-lid="${lid}" data-qi="${qi}">
      <p class="font-semibold text-slate-700 mb-2">${qi+1}. ${esc(q.q)}</p>
      <div class="space-y-2">
        ${q.options.map((op,oi)=>`
          <button onclick="answerExercise(${lid},${qi},${oi},this)" class="ex-opt w-full text-left rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-brand-400 transition">
            <span class="font-bold text-brand-600 mr-2">${String.fromCharCode(65+oi)}</span>${esc(op)}
          </button>`).join("")}
      </div>
      <div class="ex-fb hidden mt-2 rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-700"></div>
    </div>`;
  });
  h+=`</div>`;
  return h;
}
function toggleUnitAccordion(uid){
  const body=$("unitBody-"+uid);
  body.classList.toggle("open");
}
function openUnit(uid){
  const body=$("unitBody-"+uid);
  if(!body.classList.contains("open")) body.classList.add("open");
  body.scrollIntoView({behavior:"smooth", block:"start"});
}
function openLesson(lid){
  const body=$("lbody-"+lid);
  const opening=!body.classList.contains("open");
  body.classList.toggle("open");
  if(opening){
    // ทำเครื่องหมายว่าเปิดอ่านแล้ว
    if(!progress.lessons[lid].viewed){
      progress.lessons[lid].viewed=true;
      saveProgress();
      const chk=document.querySelector(`#lesson-${lid} .lesson-check`);
      if(chk){ chk.textContent="✅"; chk.classList.remove("text-slate-300"); }
      UNITS.forEach(u=>{ if(u.lessons.includes(lid)) updateUnitStatusLabel(u.id); });
      updateProgressUI();
    }
    setTimeout(()=>body.scrollIntoView({behavior:"smooth", block:"nearest"}),120);
  }
}
function updateUnitStatusLabel(uid){
  const u=UNITS.find(x=>x.id===uid); if(!u) return;
  const el=$("unitStatus-"+uid); if(!el) return;
  const st=statusInfo(unitStatus(u));
  const viewed=u.lessons.filter(id=>progress.lessons[id].viewed).length;
  el.innerHTML=`<span class="px-3 py-1 rounded-full font-bold ${st.cls}">${st.emoji} ${st.label}</span> <span class="text-slate-400 ml-1">${viewed}/${u.lessons.length} บท</span>`;
}

/* ---- Lesson exercise engine ---- */
function answerExercise(lid, qi, oi, btn){
  const key=lid+"-"+qi;
  if(!exerciseState[lid]) exerciseState[lid]={answered:{}, correct:0};
  const st=exerciseState[lid];
  if(st.answered[qi]) return;
  st.answered[qi]=true;
  const L=LESSONS[lid]; const q=L.exercise[qi];
  const wrap=btn.closest(".ex-q");
  const opts=wrap.querySelectorAll(".ex-opt");
  opts.forEach((b,idx)=>{ b.classList.add("pointer-events-none");
    if(idx===q.a) b.classList.add("correct");
    if(idx===oi && oi!==q.a) b.classList.add("wrong");
  });
  if(oi===q.a) st.correct++;
  const fb=wrap.querySelector(".ex-fb");
  fb.classList.remove("hidden");
  fb.innerHTML=(oi===q.a?"✅ <b class='text-emerald-600'>ถูกต้อง!</b> ":"❌ <b class='text-red-500'>ยังไม่ถูก</b> ")+esc(q.ex);
  // ตรวจว่าทำครบทุกข้อในบทหรือยัง
  if(Object.keys(st.answered).length===L.exercise.length){
    progress.lessons[lid].exercise=st.correct;
    saveProgress();
    UNITS.forEach(u=>{ if(u.lessons.includes(lid)) updateUnitStatusLabel(u.id); });
    updateProgressUI();
    Swal.fire({icon:"success",title:"ทำแบบฝึกหัดครบแล้ว!",html:`บทนี้คุณตอบถูก <b>${st.correct}/${L.exercise.length}</b> ข้อ`,timer:1500,showConfirmButton:false});
  }
}

/* ============================================================
   QUIZ ENGINE (pre / mid / post) — พร้อมเฉลยทันที
============================================================ */
let quizState = null;
const QUIZ_CFG = {
  pre:  { src:()=>QUESTIONS,     container:"pretestQuiz",  intro:"pretestIntro",  shuffleOpts:false },
  mid:  { src:()=>MID_QUESTIONS, container:"midtestQuiz",  intro:"midtestIntro",  shuffleOpts:false },
  post: { src:()=>QUESTIONS,     container:"posttestQuiz", intro:"posttestIntro", shuffleOpts:true  },
};

function abortActiveQuiz(){
  if(!quizState) return;
  clearInterval(quizState.timer);
  const cfg=QUIZ_CFG[quizState.mode];
  quizState=null;
  $(cfg.container).classList.add("hidden");
  $(cfg.container).innerHTML="";
  $(cfg.intro).classList.remove("hidden");
}
function startQuiz(mode){
  if(quizState){ clearInterval(quizState.timer); }
  const cfg=QUIZ_CFG[mode];
  const qs=cfg.src().map(item=>{
    if(cfg.shuffleOpts){
      const idx=item.options.map((_,i)=>i);
      const sIdx=shuffle(idx);
      return { q:item.q, options:sIdx.map(i=>item.options[i]), a:sIdx.indexOf(item.a), ex:item.ex };
    }
    return { q:item.q, options:[...item.options], a:item.a, ex:item.ex };
  });
  quizState={ mode, qs, cur:0, score:0, answered:false, timer:null, timeLeft:20 };
  $(cfg.intro).classList.add("hidden");
  $(cfg.container).classList.remove("hidden");
  renderQuestion();
}
function renderQuestion(){
  const s=quizState; const item=s.qs[s.cur];
  s.answered=false; s.timeLeft=20;
  $(QUIZ_CFG[s.mode].container).innerHTML=`
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
      <div id="qFeedback" class="hidden mt-4 rounded-2xl px-5 py-4 text-sm"></div>
      <div id="qNextWrap" class="mt-5 hidden text-right">
        <button id="qNext" onclick="nextQuestion()" class="lift rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 text-white font-bold px-8 py-3 shadow-soft"></button>
      </div>
    </div>`;
  startTimer();
}
function startTimer(){
  const s=quizState;
  clearInterval(s.timer);
  s.timer=setInterval(()=>{
    if(quizState!==s){ clearInterval(s.timer); return; }
    s.timeLeft--;
    const bar=$("qBar"), tt=$("qTime");
    if(tt) tt.textContent=s.timeLeft;
    if(bar){ bar.style.width=(s.timeLeft/20*100)+"%"; if(s.timeLeft<=7) bar.classList.replace("bg-emerald-500","bg-red-500"); }
    if(s.timeLeft<=0){ clearInterval(s.timer); if(!s.answered) answer(-1,true); }
  },1000);
}
function answer(i, timeout=false){
  const s=quizState;
  if(!s || s.answered) return;
  s.answered=true; clearInterval(s.timer);
  const item=s.qs[s.cur];
  document.querySelectorAll("#qOpts .opt-btn").forEach(b=>{
    b.setAttribute("disabled",""); b.classList.add("cursor-default","pointer-events-none");
    const bi=parseInt(b.dataset.i);
    if(bi===item.a){ b.classList.remove("border-brand-100"); b.classList.add("border-emerald-500","bg-emerald-50"); }
    if(bi===i && i!==item.a){ b.classList.remove("border-brand-100"); b.classList.add("border-red-400","bg-red-50"); }
  });
  if(i===item.a) s.score++;
  // เฉลยทันที (Feedback)
  const correct=(i===item.a);
  const fb=$("qFeedback");
  fb.classList.remove("hidden");
  fb.classList.add(correct?"bg-emerald-50":"bg-red-50");
  const correctText=esc(item.options[item.a]);
  fb.innerHTML = (correct
      ? `<b class="text-emerald-600">✅ ตอบถูกต้อง!</b> `
      : `<b class="text-red-500">❌ ${timeout?'หมดเวลา':'ยังไม่ถูก'}</b> — คำตอบที่ถูกคือ <b>${correctText}</b><br>`)
    + `<span class="text-slate-600">💡 ${esc(item.ex)}</span>`;
  const last=s.cur===s.qs.length-1;
  $("qNextWrap").classList.remove("hidden");
  $("qNext").textContent=last?"ดูผลคะแนน 🎉":"ข้อถัดไป ➡";
}
function nextQuestion(){
  const s=quizState;
  if(!s) return;
  if(s.cur<s.qs.length-1){ s.cur++; renderQuestion(); }
  else finishQuiz();
}
function finishQuiz(){
  const s=quizState;
  if(!s) return;
  clearInterval(s.timer);
  const mode=s.mode, sc=s.score, total=s.qs.length;
  quizState=null;
  const cfg=QUIZ_CFG[mode];
  $(cfg.container).classList.add("hidden"); $(cfg.container).innerHTML="";
  $(cfg.intro).classList.remove("hidden");

  if(mode==="pre"){
    scores.pre=sc; progress.pretest={done:true,score:sc}; saveProgress();
    unlocked=true; setLocks();
    saveProgressToSheet();
    Swal.fire({icon:"success",title:"ทำแบบทดสอบก่อนเรียนเสร็จแล้ว!",html:`คุณได้ <b>${sc}/${total}</b> คะแนน<br>ปลดล็อกเนื้อหาทั้งหมดแล้ว 🎉`,confirmButtonColor:"#2563eb",confirmButtonText:"ไปเรียนเนื้อหา 📚"})
    .then(()=>{ renderContent(); goto("content"); });
  } else if(mode==="mid"){
    scores.mid=sc; progress.mid={done:true,score:sc}; saveProgress(); updateProgressUI();
    saveProgressToSheet();
    Swal.fire({icon:"success",title:"ทำแบบทดสอบระหว่างเรียนเสร็จแล้ว!",html:`คุณได้ <b>${sc}/${total}</b> คะแนน<br>ทำซ้ำได้ตลอด เพื่อทบทวนความเข้าใจ`,confirmButtonColor:"#2563eb",confirmButtonText:"เรียนต่อ 📚"})
    .then(()=>{ goto("content"); });
  } else {
    scores.post=sc; progress.posttest={done:true,score:sc}; saveProgress(); updateProgressUI();
    Swal.fire({icon:"success",title:"ทำแบบทดสอบหลังเรียนเสร็จแล้ว!",html:`คุณได้ <b>${sc}/${total}</b> คะแนน`,confirmButtonColor:"#2563eb",confirmButtonText:"ดูรายงานผล 📊"})
    .then(()=>{ saveProgressToSheet().then(()=>goto("result")); });
  }
}

/* ============================================================
   RESULT / REPORT
============================================================ */
function qualityLevel(score){
  const p=score/10*100;
  if(p>=80) return {t:"ดีมาก",e:"🌟",c:"text-emerald-600 bg-emerald-50"};
  if(p>=70) return {t:"ดี",e:"😃",c:"text-brand-600 bg-brand-50"};
  if(p>=60) return {t:"ปานกลาง",e:"🙂",c:"text-amber-600 bg-amber-50"};
  if(p>=50) return {t:"พอใช้",e:"😐",c:"text-orange-600 bg-orange-50"};
  return {t:"ควรปรับปรุง",e:"💪",c:"text-red-600 bg-red-50"};
}
function renderResult(){
  updateProgressUI();
  const pre=progress.pretest.score, post=progress.posttest.score, mid=progress.mid.score;
  if(pre===null || post===null){
    $("resultBody").innerHTML=`<div class="text-slate-500">ยังทำแบบทดสอบไม่ครบ<br>กรุณาทำ${pre===null?"แบบทดสอบก่อนเรียน":"แบบทดสอบหลังเรียน"}ให้เสร็จก่อน</div>
      <button onclick="goto('${pre===null?'pretest':'posttest'}')" class="lift mt-4 rounded-2xl bg-brand-600 text-white font-bold px-6 py-2.5">ไปทำแบบทดสอบ</button>`;
    return;
  }
  const diff=post-pre; const q=qualityLevel(post);
  let dev,devColor,devEmo;
  if(diff>0){ dev=`พัฒนาขึ้น +${diff} คะแนน`; devColor="text-emerald-600 bg-emerald-50"; devEmo="📈"; }
  else if(diff===0){ dev="คะแนนเท่าเดิม"; devColor="text-amber-600 bg-amber-50"; devEmo="➡️"; }
  else { dev=`ลดลง ${diff} คะแนน`; devColor="text-red-600 bg-red-50"; devEmo="📉"; }
  const st=statusInfo(overallStatus());

  $("resultBody").innerHTML=`
    <div class="grid sm:grid-cols-3 gap-4">
      <div class="lift rounded-xl2 border-2 border-brand-100 p-5"><p class="text-slate-500 text-sm">📝 ก่อนเรียน</p><p class="text-3xl font-extrabold text-brand-600 mt-1">${pre}<span class="text-base text-slate-400">/10</span></p></div>
      <div class="lift rounded-xl2 border-2 border-amber-100 p-5"><p class="text-slate-500 text-sm">🧭 ระหว่างเรียน</p><p class="text-3xl font-extrabold text-amber-600 mt-1">${mid===null?'–':mid}<span class="text-base text-slate-400">${mid===null?'':'/5'}</span></p></div>
      <div class="lift rounded-xl2 border-2 border-emerald-100 p-5"><p class="text-slate-500 text-sm">✅ หลังเรียน</p><p class="text-3xl font-extrabold text-emerald-600 mt-1">${post}<span class="text-base text-slate-400">/10</span></p></div>
    </div>
    <div class="mt-4 grid sm:grid-cols-3 gap-4">
      <div class="rounded-xl2 p-5 ${devColor}"><p class="font-semibold text-sm">${devEmo} พัฒนาการ</p><p class="text-xl font-extrabold mt-1">${dev}</p></div>
      <div class="rounded-xl2 p-5 ${q.c}"><p class="font-semibold text-sm">${q.e} ระดับคุณภาพ</p><p class="text-xl font-extrabold mt-1">${q.t}</p></div>
      <div class="rounded-xl2 p-5 ${st.cls}"><p class="font-semibold text-sm">${st.emoji} สถานะการเรียน</p><p class="text-xl font-extrabold mt-1">${st.label}</p></div>
    </div>
    <div class="mt-6">
      <p class="text-sm text-slate-500 mb-2">เปรียบเทียบคะแนนก่อน–หลังเรียน</p>
      <div class="space-y-3">
        <div><div class="flex justify-between text-xs mb-1"><span>ก่อนเรียน</span><span>${pre}/10</span></div><div class="h-4 bg-slate-100 rounded-full"><div class="h-full bg-brand-500 rounded-full" style="width:${pre*10}%"></div></div></div>
        <div><div class="flex justify-between text-xs mb-1"><span>หลังเรียน</span><span>${post}/10</span></div><div class="h-4 bg-slate-100 rounded-full"><div class="h-full bg-emerald-500 rounded-full" style="width:${post*10}%"></div></div></div>
      </div>
    </div>
    <p class="mt-6 text-slate-500 text-sm">👤 ผู้เรียน: <b class="text-slate-700">${esc(student.name)}</b> — ความก้าวหน้า <b class="text-brand-600">${progressPct()}%</b> • ข้อมูลถูกบันทึกอัตโนมัติแล้ว ✅</p>
    <div class="mt-3 flex flex-wrap gap-2 justify-center">
      <button onclick="goto('posttest')" class="lift rounded-2xl bg-brand-50 text-brand-700 font-bold px-6 py-2.5 hover:bg-brand-100">🔁 ทำแบบทดสอบหลังเรียนซ้ำ</button>
      <button onclick="loadLeaderboard()" class="lift rounded-2xl bg-brand-50 text-brand-700 font-bold px-6 py-2.5 hover:bg-brand-100">🏆 อัปเดตกระดานผู้นำ</button>
    </div>`;
}

/* ============================================================
   GAME (matching)
============================================================ */
let gameSel=null, gameMatched=0;
function buildGame(){
  gameSel=null; gameMatched=0;
  const left=shuffle(GAME_PAIRS), right=shuffle(GAME_PAIRS);
  $("gameTotal").textContent=GAME_PAIRS.length;
  $("gameScore").textContent=0;
  $("gameLeft").innerHTML=left.map(p=>`
    <button class="match-card w-full rounded-2xl border-2 border-brand-200 bg-brand-50 px-4 py-4 font-mono font-bold text-brand-700 shadow-sm"
      data-key="${esc(p.tag)}" data-side="L" onclick="pick(this)">${esc(p.tag)}</button>`).join("");
  $("gameRight").innerHTML=right.map(p=>`
    <button class="match-card w-full rounded-2xl border-2 border-accent-400 bg-cyan-50 px-4 py-4 font-semibold text-slate-700 shadow-sm"
      data-key="${esc(p.tag)}" data-side="R" onclick="pick(this)">${esc(p.desc)}</button>`).join("");
}
function pick(el){
  if(el.classList.contains("matched")) return;
  if(!gameSel){ gameSel=el; el.classList.add("selected"); return; }
  if(gameSel===el){ el.classList.remove("selected"); gameSel=null; return; }
  if(gameSel.dataset.side===el.dataset.side){ gameSel.classList.remove("selected"); gameSel=el; el.classList.add("selected"); return; }
  if(gameSel.dataset.key===el.dataset.key){
    gameSel.classList.add("matched"); el.classList.add("matched"); gameSel.classList.remove("selected");
    gameMatched++; $("gameScore").textContent=gameMatched;
    if(gameMatched===GAME_PAIRS.length) Swal.fire({icon:"success",title:"เก่งมาก! 🎉",text:"จับคู่ครบทุกข้อแล้ว",confirmButtonColor:"#2563eb"});
    gameSel=null;
  } else {
    const a=gameSel, b=el;
    a.classList.add("border-red-400"); b.classList.add("border-red-400"); a.classList.remove("selected");
    setTimeout(()=>{ a.classList.remove("border-red-400"); b.classList.remove("border-red-400"); },600);
    gameSel=null;
  }
}

/* ============================================================
   SAVE TO GOOGLE APPS SCRIPT
============================================================ */
async function saveProgressToSheet(){
  const pre=progress.pretest.score, mid=progress.mid.score, post=progress.posttest.score;
  const diff=(pre!==null && post!==null)? (post-pre) : "";
  const quality=(post!==null)? qualityLevel(post).t : "";
  const payload={
    name: student.name,
    pre: pre===null?"":pre,
    mid: mid===null?"":mid,
    post: post===null?"":post,
    diff: diff,
    quality: quality,
    status: statusInfo(overallStatus()).label,
    progress: progressPct()
  };
  showLoading("💾 กำลังบันทึกข้อมูลลงชีต...");
  try{
    await fetch(GAS_URL, { method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain;charset=utf-8"}, body:JSON.stringify(payload) });
    hideLoading();
    Swal.fire({icon:"success",title:"บันทึกข้อมูลสำเร็จ ✅",text:"บันทึกความก้าวหน้าและคะแนนเรียบร้อยแล้ว",timer:1500,showConfirmButton:false});
  }catch(e){
    hideLoading();
    Swal.fire({icon:"error",title:"บันทึกไม่สำเร็จ",text:"เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่",confirmButtonColor:"#2563eb"});
  }
  loadLeaderboard();
}

/* ============================================================
   LEADERBOARD
============================================================ */
async function fetchRows(){
  try{
    const res=await fetch(GAS_URL+"?action=leaderboard",{method:"GET"});
    const data=await res.json();
    return Array.isArray(data)?data:(data.rows||[]);
  }catch(e){ return []; }
}
async function loadLeaderboard(){
  const body=$("lbBody");
  if(body) body.innerHTML=`<tr><td colspan="5" class="py-6 text-center text-slate-400">⏳ กำลังโหลดข้อมูล...</td></tr>`;
  leaderboardData=await fetchRows();
  renderLeaderboard();
}
function renderLeaderboard(){
  const body=$("lbBody"); if(!body) return;
  const term=($("lbSearch").value||"").trim().toLowerCase();
  let rows=[...leaderboardData].filter(r=>r.post!=="" && r.post!=null);
  rows.sort((a,b)=>(Number(b.post)||0)-(Number(a.post)||0));
  if(term) rows=rows.filter(r=>String(r.name||"").toLowerCase().includes(term));
  if(!rows.length){
    body.innerHTML=`<tr><td colspan="5" class="py-6 text-center text-slate-400">${term?"ไม่พบรายชื่อที่ค้นหา":"ยังไม่มีข้อมูล — เริ่มทำแบบทดสอบเพื่อขึ้นกระดานผู้นำ!"}</td></tr>`;
    return;
  }
  const medal=["🥇","🥈","🥉"];
  body.innerHTML=rows.map((r,i)=>{
    const rank=i+1;
    const badge=rank<=3?medal[rank-1]:`<span class="inline-grid place-items-center w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold">${rank}</span>`;
    return `<tr class="border-b border-slate-50 hover:bg-brand-50/40 transition">
      <td class="py-3 px-2 text-lg">${badge}</td>
      <td class="py-3 px-2 font-semibold text-slate-700">${esc(r.name||"-")}</td>
      <td class="py-3 px-2 text-center text-slate-500">${r.pre??"-"}</td>
      <td class="py-3 px-2 text-center font-bold text-emerald-600">${r.post??"-"}</td>
      <td class="py-3 px-2 text-center"><span class="px-2 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">${esc(r.quality||"-")}</span></td>
    </tr>`;
  }).join("");
}

/* ============================================================
   ADMIN DASHBOARD
============================================================ */
async function loadAdmin(){
  $("adminBody").innerHTML=`<tr><td colspan="9" class="py-6 text-center text-slate-400">⏳ กำลังโหลดข้อมูล...</td></tr>`;
  leaderboardData=await fetchRows();
  renderAdmin();
}
function avg(arr){ const v=arr.filter(x=>x!=="" && x!=null && !isNaN(Number(x))).map(Number); return v.length? (v.reduce((a,b)=>a+b,0)/v.length):0; }
function renderAdmin(){
  const rows=[...leaderboardData];
  // summary
  const pres=rows.map(r=>r.pre), posts=rows.map(r=>r.post), diffs=rows.map(r=>r.diff);
  const completed=rows.filter(r=>String(r.status||"").includes("จบ")).length;
  const cards=[
    {label:"จำนวนผู้เรียน", val:rows.length, emo:"👥", c:"from-brand-500 to-accent-500"},
    {label:"เฉลี่ยก่อนเรียน", val:avg(pres).toFixed(1), emo:"📝", c:"from-slate-500 to-slate-700"},
    {label:"เฉลี่ยหลังเรียน", val:avg(posts).toFixed(1), emo:"✅", c:"from-emerald-500 to-teal-500"},
    {label:"พัฒนาการเฉลี่ย", val:"+"+avg(diffs).toFixed(1), emo:"📈", c:"from-amber-500 to-orange-500"},
    {label:"เรียนจบแล้ว", val:completed+" คน", emo:"🎓", c:"from-fuchsia-500 to-pink-500"},
  ];
  $("adminSummary").innerHTML=cards.map(c=>`
    <div class="rounded-xl2 bg-gradient-to-br ${c.c} text-white shadow-soft p-4">
      <div class="text-2xl">${c.emo}</div>
      <div class="text-2xl font-extrabold mt-1">${c.val}</div>
      <div class="text-xs opacity-90">${c.label}</div>
    </div>`).join("");
  // table
  const term=($("adminSearch").value||"").trim().toLowerCase();
  let list=[...rows];
  list.sort((a,b)=>(Number(b.post)||0)-(Number(a.post)||0));
  if(term) list=list.filter(r=>String(r.name||"").toLowerCase().includes(term));
  if(!list.length){ $("adminBody").innerHTML=`<tr><td colspan="9" class="py-6 text-center text-slate-400">${term?"ไม่พบรายชื่อ":"ยังไม่มีข้อมูลนักเรียน"}</td></tr>`; return; }
  $("adminBody").innerHTML=list.map((r,i)=>{
    const stTxt=r.status||"-";
    const stCls=String(stTxt).includes("จบ")?"st-done":(String(stTxt).includes("กำลัง")?"st-prog":"st-none");
    return `<tr class="border-b border-slate-50 hover:bg-brand-50/40">
      <td class="py-2.5 px-2 text-slate-400">${i+1}</td>
      <td class="py-2.5 px-2 font-semibold text-slate-700">${esc(r.name||"-")}</td>
      <td class="py-2.5 px-2 text-center">${r.pre??"-"}</td>
      <td class="py-2.5 px-2 text-center">${r.mid===""||r.mid==null?"-":r.mid}</td>
      <td class="py-2.5 px-2 text-center font-bold text-emerald-600">${r.post===""||r.post==null?"-":r.post}</td>
      <td class="py-2.5 px-2 text-center">${r.diff===""||r.diff==null?"-":(Number(r.diff)>0?"+"+r.diff:r.diff)}</td>
      <td class="py-2.5 px-2 text-center">${esc(r.quality||"-")}</td>
      <td class="py-2.5 px-2 text-center"><span class="px-2 py-1 rounded-full text-xs font-bold ${stCls}">${esc(stTxt)}</span></td>
      <td class="py-2.5 px-2 text-center text-xs text-slate-400">${esc(formatTime(r.timestamp))}</td>
    </tr>`;
  }).join("");
}
function formatTime(ts){
  if(!ts) return "-";
  const d=new Date(ts);
  if(isNaN(d.getTime())) return String(ts);
  const p=n=>String(n).padStart(2,"0");
  return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* ============================================================
   HELP
============================================================ */
function openHelp(){
  Swal.fire({
    title:"❓ คู่มือการใช้งาน",
    html:`<div style="text-align:left;line-height:1.9">
      <b>ขั้นตอนการเรียน</b>
      <ol style="padding-left:1.2rem;margin:.4rem 0">
        <li>ทำ <b>แบบทดสอบก่อนเรียน</b> (10 ข้อ) ให้เสร็จก่อน เพื่อปลดล็อกเนื้อหา</li>
        <li>เข้า <b>เนื้อหาความรู้</b> เรียนทีละบท เปิดดูสื่อ วิดีโอ อินโฟกราฟิก และทำ <b>แบบฝึกหัดท้ายบท</b></li>
        <li>ทำ <b>แบบทดสอบระหว่างเรียน</b> เพื่อทบทวน (ทำซ้ำได้)</li>
        <li>ทำ <b>แบบทดสอบหลังเรียน</b> แล้วดู <b>รายงานผล & พัฒนาการ</b></li>
      </ol>
      <b>เคล็ดลับ</b>
      <ul style="padding-left:1.2rem;margin:.4rem 0">
        <li>ทุกแบบทดสอบมีเวลาข้อละ 20 วินาที และมี <b>เฉลยทันที</b> หลังตอบ</li>
        <li>ความก้าวหน้าถูก <b>บันทึกอัตโนมัติ</b> — เข้าใหม่ด้วยชื่อเดิมจะเรียนต่อได้</li>
        <li>วิดีโอ <b>ปรับความเร็ว/ย้อนกลับ</b> ได้จากแถบควบคุม</li>
        <li>ใช้งานได้ทุกอุปกรณ์ — มือถือกดปุ่ม ☰ เพื่อเปิดเมนู</li>
      </ul>
    </div>`,
    confirmButtonText:"เข้าใจแล้ว 👍", confirmButtonColor:"#2563eb", width:640
  });
}

/* ============================================================
   INIT
============================================================ */
window.addEventListener("DOMContentLoaded", ()=>{ setRole("student"); loadLeaderboard(); });
