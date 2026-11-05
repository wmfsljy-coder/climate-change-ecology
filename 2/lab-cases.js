/* 기후변화와 환경생태 Ⅱ 기후위기와 환경생태 변화 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

var K = window.sthKit, LT = K.LT;
/* 흰 판정 카드: big = [글, 색], rows = [[이름, 값, 색]], tip = [글, 좋음] */
function vcard(ctx, x, w, h, title, big, rows, tip) {
  K.card(ctx, x, 0, w, h, title);
  var x0 = x + 18, x1 = x + w - 18, y = 70;
  if (big) { K.t(ctx, big[0], x0, y, { s: 28, w: "900", c: big[1] }); y += 38; }
  rows.forEach(function (r) { K.row(ctx, r[0], r[1], x0, x1, y, r[2]); y += 28; });
  if (tip) K.tip(ctx, tip[0], x0 - 4, h - 46, x1 - x0 + 8, tip[1]);
}
window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 해수면 상승 → 방조제 */
  {
    id: "c1", about: "01", tag: "해수면 상승", title: "2100년까지 버틸 방조제", short: "방조제 높이",
    who: "🏗️", name: "해안 도시 방재과",
    say: "“우리 도시 방조제를 새로 짓습니다. 지금 가장 높은 만조 때 바닷물은 기준면에서 <b>2.0 m</b>, 태풍 때 해일이 여기에 <b>1.2 m</b>를 더합니다. 2100년까지 버텨야 하니 <b>해수면 상승</b>도 넣어야 해요. 최악의 경로(SSP5-8.5)에도 넘치지 않되, 필요한 높이보다 <b>0.3 m</b> 넘게 높이면 예산이 모자랍니다.”",
    predict: {
      q: "2100년에 대비한 방조제를 설계할 때 가장 알맞은 생각은?",
      options: ["㉠ 지금의 만조 높이에만 맞추면 된다", "㉡ 만조 + 해일 + 앞으로의 해수면 상승까지 더해야 한다", "㉢ 해수면 상승은 떠 있는 얼음 때문이라 무시해도 된다"],
      answer: 1
    },
    task: "시나리오를 확인하고 방조제 높이를 정하세요. <b>SSP5-8.5</b>에서 넘치지 않고, 필요한 높이보다 0.3 m 넘게 높지 않아야 합니다.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, sc = "s5", wall = 3.0;
      var RISE = { s1: 0.72, s5: 1.1 }, NM = { s1: "SSP1-2.6", s5: "SSP5-8.5" };
      function need() { return 2.0 + 1.2 + RISE[sc]; }
      function draw() {
        H.paper(ctx, W, cv.H);
        /* 바닷가 블록: 왼쪽 바다, 가운데 방조제, 오른쪽 도시(1 m = 20 단위) */
        var I = K.iso({ ox: 196, oy: 96, s: 0.74, L: 320, D: 150 }), M = 20, XW = 170, water = need(), ok = wall >= need() - 1e-9 && wall <= need() + 0.3 + 1e-9, over = water > wall;
        var fc = I.P(160, 75, 0); K.studio(ctx, 0, 0, 560, cv.H, { x: fc.x + 8, y: fc.y + 26, rx: 230, ry: 34 });
        ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, 560, cv.H, 14); ctx.clip();
        function gz(u) { return u < XW ? 4 : M; }
        I.face(ctx, "front", function (Lw) { I.profile(ctx, "front", gz, 0); ctx.fillStyle = "#7a5c3e"; ctx.fill(); });
        I.face(ctx, "right", function (Lw) { ctx.fillStyle = "#5e4530"; ctx.fillRect(0, 0, Lw, M); });
        I.plane(ctx, M, "#8cc46a", null, XW + 16, 320, 0, 150);
        I.water(ctx, water * M, function (u, sd) { return sd === "front" ? (u < XW ? 4 : (over ? M : 999)) : (over ? M : 999); }, { surface: false, top: "rgba(70,160,230,.6)" });
        I.plane(ctx, water * M, "rgba(80,170,235,.62)", "rgba(255,255,255,.7)", 0, over ? 320 : XW, 0, 150);
        I.box(ctx, XW, 0, 0, XW + 16, 150, wall * M, "#dee2e6", "#adb5bd", "#868e96");
        [[214, 30], [250, 80], [290, 40], [230, 118], [280, 112]].forEach(function (h, k) { I.house(ctx, h[0], h[1], M, 16, 14, 12 + (k % 2) * 8, k % 2 ? "#c92a2a" : "#e8590c"); });
        I.face(ctx, "front", function (Lw) {
          [[2.0, "#f59f00"], [3.2, "#e8590c"], [water, "#e03131"]].forEach(function (l) { ctx.strokeStyle = l[1]; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(0, l[0] * M); ctx.lineTo(XW, l[0] * M); ctx.stroke(); ctx.setLineDash([]); });
        });
        I.edges(ctx, M, M);
        ctx.restore();
        var BX = [0, 560];
        I.label(ctx, 0, 150, 2.0 * M, "만조 2.0 m", -20, 26, "#ffe8cc", BX);
        I.label(ctx, 60, 150, 3.2 * M, "+ 해일 1.2 m", -40, 6, "#ffd8a8", BX);
        I.label(ctx, 120, 150, water * M, "+ 해수면 " + RISE[sc] + " m (" + NM[sc] + ")", -60, -24, "#ffc9c9", BX);
        I.label(ctx, XW + 8, 0, wall * M, "방조제 " + wall.toFixed(1) + " m", 30, -26, ok ? "#c3f5dc" : "#ffc9c9", BX);
        K.bigText(ctx, over ? "바닷물이 넘친다" : "도시는 안전", 16, 36, 22, over ? "#ff9a7a" : "#7ee0a0");
        K.warn(ctx, 548, cv.H - 12, "⚠ 높이는 과장", "right");
        vcard(ctx, 572, W - 572, cv.H, "2100년 방조제 설계", [wall.toFixed(1) + " m", ok ? LT.green : LT.red], [["필요한 높이", need().toFixed(2) + " m", LT.ink], ["여유", (wall - need() >= 0 ? "+" : "") + (wall - need()).toFixed(2) + " m", ok ? LT.green : LT.orange], ["시나리오", NM[sc], LT.blue]], [ok ? "알맞은 높이" : (over ? "너무 낮음" : "지나치게 높음"), ok]);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "2100년 시나리오", value: "s5", options: [{ v: "s1", t: "SSP1-2.6 (+0.72 m)" }, { v: "s5", t: "SSP5-8.5 (+1.1 m)" }], onPick: function (x) { sc = x; draw(); api.changed(); } });
      api.slider({ label: "방조제 높이", min: 2.0, max: 5.0, step: 0.1, value: 3.0, fmt: function (x) { return x.toFixed(1) + " m"; }, onInput: function (x) { wall = Math.round(x * 10) / 10; draw(); api.changed(); } });
      api.info("해수면 상승 전망은 우리나라 주변 바다의 2100년 값입니다(우리 바다 전망 자료 기준이라 IPCC 세계 평균 범위와 다를 수 있음). 해수면이 오르면 같은 해일도 더 높은 곳까지 올라옵니다.");
      draw();
      return {
        judge: function () {
          var n = 2.0 + 1.2 + RISE.s5;
          if (sc !== "s5") return { ok: false, msg: "최악의 경로에도 버텨야 합니다. 시나리오를 SSP5-8.5로 두고 확인하세요." };
          if (wall >= n - 1e-9 && wall <= n + 0.3 + 1e-9) return { ok: true, msg: "방조제 " + wall.toFixed(1) + " m — 2100년 최악의 경로에서도 넘치지 않고 예산 안입니다." };
          return { ok: false, msg: "방조제 " + wall.toFixed(1) + " m — " + (wall < n ? "해일이 넘칩니다." : "필요보다 너무 높아 예산을 넘깁니다.") };
        }
      };
    },
    hints: ["필요한 높이 = 만조 2.0 + 해일 1.2 + 해수면 상승.", "SSP5-8.5 에서는 2.0 + 1.2 + 1.1 = 4.3 m입니다."],
    solution: "시나리오 <b>SSP5-8.5</b>에서 방조제 <b>4.3~4.6 m</b>.",
    why: "해수면 상승은 그 자체로 땅을 잠기게 할 뿐 아니라, 태풍 해일이 시작하는 <b>바닥 높이</b>를 올려 같은 태풍도 더 큰 피해를 줍니다. 그래서 해안 시설은 앞으로 수십 년의 해수면 상승까지 넣어 설계합니다.<br>" +
      "어느 시나리오를 기준으로 삼을지는 비용과 위험 사이의 선택입니다. 감축에 성공해 SSP1-2.6을 따르면 필요한 높이가 약 0.4 m 낮아집니다. ※ 만조·해일 높이는 가상의 값입니다."
  },

  /* ------------------------------------------------------------------ 2. 극한 호우 → 배수관 */
  {
    id: "c2", about: "02", tag: "극한 기상", title: "더 세진 비를 받아낼 빗물관", short: "빗물관 설계",
    who: "🌧️", name: "도시 하수도 설계팀",
    say: "“지금 빗물관은 시간당 <b>100 mm</b> 비에 맞춰 설계되어 있어요. 이 도시는 2100년까지 기온이 <b>3 ℃</b> 오를 것으로 봅니다. 기온 1 ℃마다 공기가 품을 수 있는 수증기가 약 <b>7%</b> 늘어 가장 센 비도 그만큼 세진다고 할 때, 새 빗물관의 처리 용량을 정해 주세요. 너무 크게 지으면 도로를 두 번 파야 할 만큼 공사비가 늘어요(필요량보다 10% 넘게 크면 안 됨).”",
    predict: {
      q: "기온이 3 ℃ 오르면 가장 센 비의 세기는 대략 어떻게 될까요?",
      options: ["㉠ 변하지 않는다", "㉡ 약 20% 넘게 세진다", "㉢ 3배가 된다"],
      answer: 1
    },
    task: "빗물관 처리 용량을 정하세요. 2100년의 가장 센 비를 받아내되, 필요량보다 10% 넘게 크지 않게.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, cap = 100;
      function need() { return 100 * Math.pow(1.07, 3); }
      function draw() {
        H.paper(ctx, W, cv.H);
        /* 땅속에 묻힌 세 빗물관(원통). 관의 단면 넓이 ∝ 처리 용량 */
        var okc = cap >= need() && cap <= need() * 1.1;
        K.studio(ctx, 0, 0, 560, cv.H, null);
        ctx.fillStyle = "#a08468"; ctx.fillRect(20, 120, 520, cv.H - 140);
        var sg = ctx.createLinearGradient(0, 108, 0, 128); sg.addColorStop(0, "#868e96"); sg.addColorStop(1, "#6c757d"); ctx.fillStyle = sg; ctx.fillRect(20, 108, 520, 14);
        var R0 = K.rng(4); ctx.fillStyle = "rgba(255,255,255,.2)"; for (var q = 0; q < 160; q++) ctx.fillRect(20 + R0() * 520, 124 + R0() * (cv.H - 148), 2, 2);
        [["지금 설계", 100, "#adb5bd"], ["2100년 필요", need(), "#ff8787"], ["새 빗물관", cap, okc ? "#69db7c" : "#ffc078"]].forEach(function (b, k) {
          var cx = 110 + k * 170, cy = 190, r = 26 * Math.sqrt(b[1] / 100);
          var pg = ctx.createLinearGradient(cx - r, 0, cx + r, 0); pg.addColorStop(0, "#495057"); pg.addColorStop(.5, "#ced4da"); pg.addColorStop(1, "#495057");
          ctx.fillStyle = pg; ctx.fillRect(cx - r, cy - 10, 2 * r, 40); ctx.beginPath(); ctx.ellipse(cx, cy + 30, r, r * .45, 0, 0, Math.PI); ctx.fill();
          ctx.fillStyle = "#343a40"; ctx.beginPath(); ctx.ellipse(cx, cy - 10, r, r * .45, 0, 0, 6.2832); ctx.fill();
          ctx.fillStyle = b[2]; ctx.beginPath(); ctx.ellipse(cx, cy - 10, r * .82, r * .37, 0, 0, 6.2832); ctx.fill();
          K.t(ctx, Math.round(b[1]) + " mm/h", cx, cy - r * .45 - 20, { s: 13, w: "900", a: "center", c: "#ffffff" });
          K.t(ctx, b[0], cx, cv.H - 26, { s: 12, w: "900", a: "center", c: "#ffffff" });
        });
        for (q = 0; q < 26; q++) { var rx = 30 + (q * 41) % 500, ry = 20 + (q * 23) % 70; K.line(ctx, { x: rx, y: ry }, { x: rx - 4, y: ry + 12 }, "#4dabf7", 1.6); }
        K.bigText(ctx, "여유 " + ((cap / need() - 1) * 100).toFixed(0) + "%", 16, 34, 22, okc ? "#7ee0a0" : "#ffffff");
        vcard(ctx, 572, W - 572, cv.H, "더 세진 비 받아내기", [cap + " mm/h", okc ? LT.green : LT.red], [["2100년 필요", Math.round(need()) + " mm/h", LT.red], ["계산", "100 × 1.07³", LT.ink], ["참고: 2022년 서울", "141.5 mm/h", LT.mute]], [okc ? "필요량 이상 · 여유 10% 안" : (cap < need() ? "용량이 모자람" : "지나치게 큼"), okc]);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "새 빗물관의 처리 용량 (시간당 mm)", min: 80, max: 180, step: 1, value: 100, fmt: function (x) { return x + " mm/h"; }, onInput: function (x) { cap = x; draw(); api.changed(); } });
      api.info("7%가 세 번 겹치므로 1.07 × 1.07 × 1.07 배입니다. 늘어난 양이 다시 늘어나는 복리 구조입니다.");
      draw();
      return {
        judge: function () {
          var n = need();
          if (cap >= n && cap <= n * 1.1) return { ok: true, msg: cap + " mm/h — 2100년 약 " + n.toFixed(1) + " mm/h의 비를 받아내고 공사비도 알맞습니다." };
          return { ok: false, msg: cap + " mm/h — " + (cap < n ? "2100년의 폭우를 감당하지 못합니다." : "필요보다 너무 커 공사비가 과합니다.") };
        }
      };
    },
    hints: ["100 × 1.07³을 계산하세요.", "약 122.5 mm/h. 그보다 크고 약 134.8 mm/h보다 작게."],
    solution: "처리 용량 <b>123~134 mm/h</b>.",
    why: "기온이 오르면 공기가 품을 수 있는 수증기가 1 ℃에 약 6~7% 늘어 <b>극한 호우</b>의 재료가 많아집니다. 3 ℃면 20% 넘게 세집니다. 실제로 2022년 서울의 시간당 141.5 mm처럼 기존 설계 기준을 넘는 비가 이미 내리고 있어, 도시는 빗물 저류 시설과 투수성 포장 같은 <b>적응</b> 대책도 함께 씁니다.<br>※ 가장 센 비가 포화 수증기량과 같은 비율로 세진다는 것은 단순화한 가정입니다."
  },

  /* ------------------------------------------------------------------ 3. 매개 감염병 → 고지대 말라리아 */
  {
    id: "c3", about: "04", tag: "곤충 매개 감염병", title: "산으로 올라오는 말라리아", short: "고지대 말라리아",
    who: "🦟", name: "고원 마을 보건소",
    say: "“적도 부근 고원의 우리 마을은 해발 <b>1,700 m</b> 라 서늘해서 말라리아가 거의 없었어요. 이 모형에서는 연평균 기온이 <b>18 ℃</b> 이상인 곳에서만 말라리아가 퍼진다고 할게요. 해안은 연평균 27 ℃, 높이 1 km마다 6.5 ℃씩 낮아집니다. 우리 마을이 <b>아직 안전한 가장 큰 기온 상승</b>은 얼마일까요? 대비를 시작할 기준으로 쓰려고요.”",
    predict: {
      q: "기온이 오르면 말라리아가 퍼지는 지역은 산에서 어떻게 변할까요?",
      options: ["㉠ 더 높은 곳까지 올라간다", "㉡ 더 낮은 곳으로 내려간다", "㉢ 기온과 관계없다"],
      answer: 0
    },
    task: "기온 상승을 조절해, 위험 지역의 윗경계가 마을 <b>바로 아래</b>(마을은 아직 안전)에 오는 가장 큰 값을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, dT = 0, TOWN = 1700;
      function top(d) { return (27 + d - 18) / 6.5 * 1000; }
      function draw() {
        H.paper(ctx, W, cv.H);
        /* 적도 고원의 산 블록: 위험 지역(빨강) 윗경계 아래로 말라리아 모기가 산다(1 m = 0.045 단위) */
        var I = K.iso({ ox: 250, oy: 112, s: 0.72, L: 300, D: 220 }), ZK = 0.045, ZB = 10, t = Math.min(top(dT), 2900), zt = ZB + t * ZK, safe = top(dT) < TOWN;
        function mz(x, y) { var dx = (x - 160) / 135, dy = (y - 105) / 108, r = Math.sqrt(dx * dx + dy * dy); return ZB + 2900 * ZK * Math.pow(Math.max(0, 1 - r), 1.15); }
        K.studio(ctx, 0, 0, 540, cv.H, { x: 250, y: 262, rx: 220, ry: 30 });
        ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, 540, cv.H, 14); ctx.clip();
        ["front", "right"].forEach(function (sd, k) { I.face(ctx, sd, function (Lw) { I.profile(ctx, sd, function (u) { return sd === "front" ? mz(u, I.D) : mz(I.L, u); }, 0); ctx.fillStyle = k ? "#5e4530" : "#6e5238"; ctx.fill(); }); });
        I.field(ctx, mz, function (x, y, z, lt) { if (Math.abs(z - zt) < 1.4) return K.tint("#e03131", lt); if (z < zt) return K.tint("#e8a07a", lt); return (z - ZB) / ZK > 2400 ? K.tint("#9c8b78", lt) : K.tint("#5f9e45", lt); }, 34, 34);
        var vz = ZB + TOWN * ZK, vh = [];
        [0.6, 0.9].forEach(function (a) { for (var r = 0; r <= 1.2; r += 0.01) { var x = 160 + 135 * r * Math.cos(a), y = 105 + 108 * r * Math.sin(a); if (mz(x, y) <= vz) { vh.push([x, y]); break; } } });
        vh.forEach(function (p) { I.house(ctx, p[0] - 6, p[1] - 5, mz(p[0], p[1]), 12, 10, 9, "#1c7ed6"); });
        var R1 = K.rng(9); for (var q = 0; q < 10; q++) { var mx = 20 + R1() * 260, my = 120 + R1() * 90; if (mz(mx, my) > zt) continue; var mp = I.P(mx, my, mz(mx, my) + 14); ctx.strokeStyle = "#343a40"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(mp.x - 4, mp.y); ctx.lineTo(mp.x + 4, mp.y); ctx.stroke(); ctx.fillStyle = "rgba(220,230,240,.9)"; ctx.beginPath(); ctx.ellipse(mp.x - 1, mp.y - 3, 3, 1.4, -.5, 0, 6.2832); ctx.fill(); }
        ctx.restore();
        var BX = [0, 540];
        if (vh.length) I.label(ctx, vh[0][0], vh[0][1], vz + 10, "고지대 마을 1,700 m", 50, -30, safe ? "#c3f5dc" : "#ffc9c9", BX);
        I.label(ctx, 160, 105, mz(160, 105), "정상 약 2,900 m", 40, -10, "#e8ecff", BX);
        K.bigText(ctx, "마을 " + (safe ? "안전" : "위험"), 16, 36, 24, safe ? "#7ee0a0" : "#ff9a7a");
        K.warn(ctx, 528, cv.H - 12, "⚠ 산의 높이는 과장", "right");
        vcard(ctx, 552, W - 552, cv.H, "말라리아 위험 지역", ["+" + dT.toFixed(1) + " ℃", LT.orange], [["위험 지역 윗경계", Math.round(top(dT)).toLocaleString() + " m", LT.red], ["마을 높이", "1,700 m", LT.blue], ["18 ℃가 되는 높이", "(27 + 상승 − 18) ÷ 6.5 km", LT.mute]], [safe ? "마을은 아직 위험 지역 밖" : "마을이 위험 지역에 들어감", safe]);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "기온 상승", min: 0, max: 4, step: 0.1, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " ℃"; }, onInput: function (x) { dT = x; draw(); api.changed(); } });
      api.info("18 ℃가 되는 높이 = (해안 기온 − 18) ÷ 6.5 km. 기온이 1 ℃ 오르면 그 높이가 약 154 m 올라갑니다.");
      draw();
      return {
        judge: function () {
          var t = top(dT), gap = TOWN - t;
          if (gap > 0 && gap <= 60) return { ok: true, msg: "+" + dT.toFixed(1) + " ℃ → 윗경계 " + Math.round(t) + " m. 마을 바로 아래까지 왔습니다 — 이때부터 대비해야 합니다." };
          return { ok: false, msg: "+" + dT.toFixed(1) + " ℃ → 윗경계 " + Math.round(t) + " m — " + (gap <= 0 ? "이미 마을이 위험 지역에 들어갔습니다." : "아직 마을보다 한참 아래입니다. 더 큰 값도 안전할 수 있습니다.") };
        }
      };
    },
    hints: ["지금 윗경계는 (27 − 18) ÷ 6.5 ≈ 1.385 km.", "1,700 m까지 약 315 m 남았습니다. 1 ℃에 154 m씩 올라가니 약 2 ℃가 한계입니다."],
    solution: "기온 상승 <b>+1.7 ~ +2.0 ℃</b> (윗경계 약 1,650~1,690 m).",
    why: "기온이 오르면 모기와 말라리아 원충이 살 수 있는 범위가 <b>고위도</b>뿐 아니라 <b>높은 곳</b>으로 넓어집니다. 실제로 에티오피아와 콜롬비아의 고원에서는 따뜻한 해에 말라리아가 더 높은 곳까지 나타났다는 연구(2014년)가 있습니다. 그동안 말라리아가 없던 곳의 주민은 면역이 없어 피해가 더 클 수 있습니다.<br>※ 18 ℃ 기준과 기온 감률은 수업용 모형 값입니다."
  }
  ]
});
})();
