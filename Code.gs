/************************************************************
 * บทเรียนออนไลน์ HTML5 (CAI) — Google Apps Script (Backend)
 * เชื่อมต่อกับ Google Sheet เพื่อบันทึกคะแนน/ความก้าวหน้า
 * ---------------------------------------------------------
 * วิธีติดตั้ง:
 * 1) เปิด Google Sheet (id ด้านล่าง) > Extensions > Apps Script
 * 2) วางโค้ดนี้ทั้งหมด บันทึก
 * 3) รันฟังก์ชัน setupSheet 1 ครั้ง เพื่อสร้าง/รีเซ็ตหัวคอลัมน์
 * 4) Deploy > Manage deployments > (ดินสอ) Edit > Version: New version > Deploy
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    (การอัปเดตแบบ New version จะคง URL /exec เดิมไว้)
 ************************************************************/

var SHEET_ID   = "1B7bOgndN_PrS2MGw_0jvL6IKK8ofaal17bok4GZs2Vc";
var SHEET_NAME = "ผลการเรียน";

var HEADERS = [
  "วันที่-เวลา",         // 1
  "ชื่อ-นามสกุล",        // 2
  "คะแนนก่อนเรียน",      // 3
  "คะแนนระหว่างเรียน",   // 4
  "คะแนนหลังเรียน",      // 5
  "ผลต่าง",              // 6
  "ระดับคุณภาพ",         // 7
  "สถานะการเรียน",       // 8
  "ความก้าวหน้า (%)"     // 9
];

/**
 * สร้าง/รีเซ็ตชีตและหัวคอลัมน์ (รันครั้งเดียวตอนติดตั้ง หรือเมื่อเพิ่มคอลัมน์)
 */
function setupSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
       .setFontWeight("bold").setBackground("#2563eb")
       .setFontColor("#ffffff").setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * POST — บันทึก/อัปเดตข้อมูลผู้เรียน (upsert ตามชื่อ: มีอยู่แล้ว = อัปเดต, ไม่มี = เพิ่มใหม่)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
    var name    = (data.name || "").toString().trim();
    var row = [
      timestamp,
      name,
      valOrBlank_(data.pre),
      valOrBlank_(data.mid),
      valOrBlank_(data.post),
      valOrBlank_(data.diff),
      data.quality || "",
      data.status  || "",
      valOrBlank_(data.progress)
    ];

    // ค้นหาแถวที่มีชื่อนี้อยู่แล้ว (คอลัมน์ที่ 2)
    var rowIndex = findRowByName_(sheet, name);
    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return jsonOutput_({ status: "success" });
  } catch (err) {
    return jsonOutput_({ status: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET — ส่งข้อมูลผู้เรียนทั้งหมด (เรียงตามคะแนนหลังเรียนมากสุด)
 * เรียกด้วย: ?action=leaderboard
 */
function doGet(e) {
  try {
    var sheet = getSheet_();
    var last = sheet.getLastRow();
    if (last < 2) return jsonOutput_([]);

    var values = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
    var rows = values.map(function (r) {
      return {
        timestamp: r[0],
        name:      r[1],
        pre:       r[2],
        mid:       r[3],
        post:      r[4],
        diff:      r[5],
        quality:   r[6],
        status:    r[7],
        progress:  r[8]
      };
    }).filter(function (r) { return String(r.name).trim() !== ""; });

    rows.sort(function (a, b) { return (Number(b.post) || 0) - (Number(a.post) || 0); });
    return jsonOutput_(rows);
  } catch (err) {
    return jsonOutput_({ status: "error", message: String(err) });
  }
}

/* ---------- helpers ---------- */
function findRowByName_(sheet, name) {
  var last = sheet.getLastRow();
  if (last < 2 || !name) return -1;
  var names = sheet.getRange(2, 2, last - 1, 1).getValues();
  for (var i = 0; i < names.length; i++) {
    if (String(names[i][0]).trim() === name) return i + 2;
  }
  return -1;
}
function valOrBlank_(v) {
  return (v === undefined || v === null || v === "") ? "" : v;
}
function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
