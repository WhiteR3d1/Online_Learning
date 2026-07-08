/************************************************************
 * บทเรียนออนไลน์ HTML5 — Google Apps Script (Backend)
 * เชื่อมต่อกับ Google Sheet เพื่อบันทึกคะแนนและพัฒนาการ
 * ---------------------------------------------------------
 * วิธีติดตั้ง:
 * 1) เปิด Google Sheet (id ด้านล่าง) แล้วไปที่ Extensions > Apps Script
 * 2) วางโค้ดนี้ทั้งหมด บันทึก
 * 3) รันฟังก์ชัน setupSheet 1 ครั้ง เพื่อสร้างหัวคอลัมน์
 * 4) Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5) นำ URL /exec ที่ได้ ไปใส่ในตัวแปร GAS_URL ของหน้าเว็บ
 ************************************************************/

var SHEET_ID   = "1B7bOgndN_PrS2MGw_0jvL6IKK8ofaal17bok4GZs2Vc";
var SHEET_NAME = "ผลการเรียน";

var HEADERS = [
  "วันที่-เวลา",
  "ชื่อ-นามสกุล",
  "คะแนนก่อนเรียน",
  "คะแนนหลังเรียน",
  "ผลต่าง",
  "ระดับคุณภาพ"
];

/**
 * สร้างชีตและหัวคอลัมน์ (รันครั้งเดียวตอนติดตั้ง)
 */
function setupSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  // จัดรูปแบบหัวตาราง
  var head = sheet.getRange(1, 1, 1, HEADERS.length);
  head.setFontWeight("bold")
      .setBackground("#2563eb")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

/**
 * ดึงหรือสร้างชีตปลายทาง
 */
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
 * POST — บันทึกข้อมูลผู้เรียน 1 รายการ
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
    var name    = data.name    || "";
    var pre     = (data.pre  === undefined || data.pre  === null) ? "" : data.pre;
    var post    = (data.post === undefined || data.post === null) ? "" : data.post;
    var diff    = (data.diff === undefined || data.diff === null) ? (Number(post) - Number(pre)) : data.diff;
    var quality = data.quality || "";

    sheet.appendRow([timestamp, name, pre, post, diff, quality]);

    return jsonOutput_({ status: "success", message: "บันทึกข้อมูลสำเร็จ" });
  } catch (err) {
    return jsonOutput_({ status: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET — ส่งข้อมูล Leaderboard (เรียงตามคะแนนหลังเรียนมากสุด)
 * เรียกด้วย: ?action=leaderboard
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "leaderboard";
    if (action === "leaderboard") {
      var sheet = getSheet_();
      var last = sheet.getLastRow();
      if (last < 2) return jsonOutput_([]);

      var values = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
      var rows = values.map(function (r) {
        return {
          timestamp: r[0],
          name:      r[1],
          pre:       r[2],
          post:      r[3],
          diff:      r[4],
          quality:   r[5]
        };
      });

      // เรียงตามคะแนนหลังเรียนมากไปน้อย
      rows.sort(function (a, b) { return (Number(b.post) || 0) - (Number(a.post) || 0); });

      return jsonOutput_(rows);
    }
    return jsonOutput_({ status: "error", message: "unknown action" });
  } catch (err) {
    return jsonOutput_({ status: "error", message: String(err) });
  }
}

/**
 * ส่งออกเป็น JSON
 */
function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
