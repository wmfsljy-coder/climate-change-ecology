/* 기후변화와 환경생태 Ⅲ 기후위기에 대응하는 우리의 노력 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

var K = window.sthKit, LT = K.LT;
function vcard(ctx, x, w, h, title, big, rows, tip, y0) {
  K.card(ctx, x, 0, w, h, title);
  var x0 = x + 18, x1 = x + w - 18, y = y0 || 70;
  if (big) { K.t(ctx, big[0], x0, y, { s: 26, w: "900", c: big[1] }); y += 36; }
  rows.forEach(function (r) { K.row(ctx, r[0], r[1], x0, x1, y, r[2]); y += 26; });
  if (tip) K.tip(ctx, tip[0], x0 - 4, h - 46, x1 - x0 + 8, tip[1]);
}
function cyl(ctx, cx, y, r, h, c0, c1) {
  var g = ctx.createLinearGradient(cx - r, 0, cx + r, 0); g.addColorStop(0, c1); g.addColorStop(.42, c0); g.addColorStop(1, c1);
  ctx.fillStyle = g; ctx.fillRect(cx - r, y, 2 * r, h); ctx.beginPath(); ctx.ellipse(cx, y + h, r, r * .35, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = c0; ctx.beginPath(); ctx.ellipse(cx, y, r, r * .35, 0, 0, 6.2832); ctx.fill();
}
window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 산호 복원 */
  {
    id: "c1", about: "01", tag: "산호의 백화 · 복원", title: "산호 정원사의 계획", short: "산호 복원",
    who: "🪸", name: "산호 복원 연구소",
    say: "“대규모 백화가 요즘처럼 <b>6년마다</b> 온다면 산호초는 처음의 절반쯤(약 30%)밖에 유지하지 못해요. 우리 연구소는 바다 속 묘목장에서 키운 산호 조각을 해마다 옮겨 심습니다. 마지막 20년 평균 덮임률을 <b>40% 이상</b>으로 지키되, 인력과 예산을 아끼려면 <b>가장 적게</b> 심어야 해요(45% 넘게는 필요 없음).”",
    predict: {
      q: "백화가 자주 오는 바다에서 산호를 옮겨 심으면 어떻게 될까요?",
      options: ["㉠ 심어 봐야 소용없다", "㉡ 백화 사이 회복을 앞당겨 평균 덮임률을 끌어올린다", "㉢ 한 번만 심으면 백화가 다시 오지 않는다"],
      answer: 1
    },
    task: "해마다 옮겨 심는 양을 조절해 마지막 20년 평균 덮임률 <b>40~45%</b>를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, p = 0;
      function sim(q) { var C = 60, tr = [60], s = 0, c = 0; for (var y = 1; y <= 60; y++) { C = Math.min(60, C + 0.25 * C * (1 - C / 60) + q); if (y % 6 === 0) C *= 0.5; tr.push(C); if (y > 40) { s += C; c++; } } return { tr: tr, avg: s / c }; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var r = sim(p), ok = r.avg >= 40 && r.avg <= 45;
        K.studio(ctx, 0, 0, 620, cv.H, null);
        K.bigText(ctx, "마지막 20년 평균 " + r.avg.toFixed(1) + "%", 16, 34, 20, ok ? "#7ee0a0" : "#ffffff");
        K.t(ctx, "6년마다 대규모 백화 · 해마다 옮겨 심기 +" + p.toFixed(1) + " %p", 604, 28, { s: 11.5, w: "800", a: "right", c: LT.mute });
        var g = K.chart(ctx, { x: 4, y: 44, w: 612, h: cv.H - 48, pl: 40, pb: 28, pt: 8, pr: 14, x0: 0, x1: 60, y0: 0, y1: 60, xt: 6, yt: 2, light: true, xf: function (v) { return v + "년"; }, yf: function (v) { return v + "%"; } });
        ctx.fillStyle = "rgba(28,126,214,.08)"; ctx.fillRect(g.X(40), g.T, g.X(60) - g.X(40), g.B - g.T);
        K.plot(ctx, g, r.tr.map(function (c, y) { return [y, c]; }), LT.orange, { w: 2.8, light: true });
        K.line(ctx, { x: g.X(40), y: g.Y(r.avg) }, { x: g.X(60), y: g.Y(r.avg) }, ok ? LT.green : LT.yellow, 1.6, [6, 5]);
        vcard(ctx, 632, W - 632, cv.H, "산호 정원사의 계획", null, [["해마다 옮겨 심기", "+" + p.toFixed(1) + " %p", LT.blue], ["마지막 20년 평균", r.avg.toFixed(1) + "%", ok ? LT.green : LT.red]], [ok ? "목표 40~45% 달성" : (r.avg < 40 ? "아직 모자람" : "지나치게 많음"), ok], 166);
        /* 산호 묘목장 미니어처: 바닥 틀에 매단 산호 조각 */
        var I = K.iso({ ox: 766, oy: 60, s: 0.5, L: 170, D: 110 });
        ["front", "right"].forEach(function (sd, j) { I.face(ctx, sd, function (Lw) { ctx.fillStyle = j ? "#c9b48a" : "#e0cc9e"; ctx.fillRect(0, 0, Lw, 8); var wg = ctx.createLinearGradient(0, 40, 0, 8); wg.addColorStop(0, "rgba(70,170,230,.75)"); wg.addColorStop(1, "rgba(20,90,160,.85)"); ctx.fillStyle = wg; ctx.fillRect(0, 8, Lw, 34); }); });
        I.plane(ctx, 8, "#e9d8a6", null);
        for (var q = 0; q < 4; q++) { K.line(ctx, I.P(20 + q * 40, 20, 8), I.P(20 + q * 40, 20, 30), "#868e96", 1.6); K.line(ctx, I.P(20 + q * 40, 90, 8), I.P(20 + q * 40, 90, 30), "#868e96", 1.6); K.line(ctx, I.P(20 + q * 40, 20, 30), I.P(20 + q * 40, 90, 30), "#adb5bd", 1.4); }
        var nC = Math.round(4 + p * 4); for (q = 0; q < nC; q++) { var pp = I.P(20 + (q % 4) * 40, 26 + Math.floor(q / 4) * 14, 28); K.planet(ctx, pp.x, pp.y, 4, ["#ff8787", "#ffa94d", "#b197fc", "#63e6be"][q % 4], "#5c2a2a"); }
        I.plane(ctx, 42, "rgba(120,200,255,.28)", "rgba(255,255,255,.6)");
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "해마다 옮겨 심는 산호 (덮임률 %p)", min: 0, max: 6, step: 0.5, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " %p"; }, onInput: function (x) { p = x; draw(); api.changed(); } });
      api.info("백화 간격은 6년으로 고정되어 있습니다. 심은 산호는 자연 회복에 더해집니다.");
      draw();
      return {
        judge: function () {
          var a = sim(p).avg;
          if (a >= 40 && a <= 45) return { ok: true, msg: "+" + p.toFixed(1) + " %p → 평균 " + a.toFixed(1) + "% — 적은 노력으로 산호초를 지켜 냅니다." };
          return { ok: false, msg: "+" + p.toFixed(1) + " %p → 평균 " + a.toFixed(1) + "% — " + (a < 40 ? "아직 부족합니다." : "필요보다 많이 심고 있습니다.") };
        }
      };
    },
    hints: ["심지 않으면 약 30%. 0.5 %p씩 올려 보세요.", "평균이 40%를 처음 넘는 값이 가장 적은 노력입니다."],
    solution: "해마다 <b>+2.0 ~ +2.5 %p</b>를 옮겨 심으면 평균 40~45%입니다.",
    why: "산호 옮겨 심기는 백화 사이의 <b>회복 기간을 줄여</b> 주는 적응 대책입니다. 그러나 이 모형에서도 심는 양을 아무리 늘려도 50%를 넘기 어렵습니다. 백화를 부르는 수온 상승 자체를 줄이지 않으면 복원만으로는 산호초를 되돌릴 수 없습니다.<br>" +
      "실제로 호주·미국 플로리다 등에서 산호 묘목장과 이식이 진행되고 있지만, 과학자들은 온실 기체 감축이 함께 가야 한다고 강조합니다. ※ 이식 효과는 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 2. 가뭄 대비 저수지 */
  {
    id: "c2", about: "02", tag: "기후 재해 · 가뭄", title: "마른 날을 버틸 저수지", short: "저수지 크기",
    who: "💧", name: "섬마을 물 관리소",
    say: "“우리 섬은 하루에 물 <b>2,000 t</b>을 씁니다. 비가 오면 저수지가 가득 차지만, 지금까지 가장 길었던 마른 날은 <b>13일</b>이었어요. 기온이 2 ℃ 오른 미래에는 가장 긴 마른 날이 <b>16일</b>로 늘고, 저수지 물의 증발이 1 ℃에 약 7%씩 늘어나니, 계산을 쉽게 하려고 필요한 물 전체를 그만큼(2 ℃면 14%) 늘려 잡기로 해요. 미래의 가뭄을 버틸 저수지 용량을 정해 주세요. 너무 크게 지으면(필요량보다 10% 넘게) 예산이 모자랍니다.”",
    predict: {
      q: "기온이 오르면 섬에 필요한 저수지 용량은 어떻게 될까요?",
      options: ["㉠ 연 강수량이 같으니 그대로다", "㉡ 마른 날이 길어지고 증발이 늘어 더 커져야 한다", "㉢ 비가 세게 오니 작아져도 된다"],
      answer: 1
    },
    task: "저수지 용량을 조절해 <b>기온 +2 ℃</b> 미래의 가장 긴 마른 날을 버티게 하세요(필요량의 110% 이하).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, cap = 26000;
      function need() { return 16 * 2000 * (1 + 0.07 * 2); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var n = need(), okr = cap >= n && cap <= n * 1.1;
        K.studio(ctx, 0, 0, 560, cv.H, null);
        K.bigText(ctx, "여유 " + ((cap / n - 1) * 100).toFixed(0) + "%", 16, 34, 22, okr ? "#7ee0a0" : "#ffffff");
        /* 세 저수지 블록: 물 높이 ∝ 저수량 */
        [["지금 필요 (13일)", 26000, "#adb5bd"], ["미래 필요 (16일, 증발 +14%)", n, "#ff8787"], ["새 저수지", cap, okr ? "#69db7c" : "#ffc078"]].forEach(function (b, k) {
          var I = K.iso({ ox: 96 + k * 176, oy: 150, s: 0.62, L: 120, D: 90 }), lv = 6 + b[1] / 60000 * 70;
          ["front", "right"].forEach(function (sd, j) { I.face(ctx, sd, function (Lw) { ctx.fillStyle = j ? "#5e4530" : "#6e5238"; ctx.fillRect(0, 0, Lw, 6); ctx.fillStyle = j ? "#868e96" : "#adb5bd"; ctx.fillRect(0, 6, Lw, 80); var wg = ctx.createLinearGradient(0, lv, 0, 6); wg.addColorStop(0, "rgba(77,171,247,.95)"); wg.addColorStop(1, "rgba(24,100,171,.95)"); ctx.fillStyle = wg; ctx.fillRect(6, 6, Lw - 12, lv - 6); }); });
          I.plane(ctx, lv, "rgba(116,192,252,.9)", "rgba(255,255,255,.7)", 6, 114, 6, 84);
          I.quad(ctx, I.P(0, 0, 86), I.P(120, 0, 86), I.P(120, 90, 86), I.P(0, 90, 86), null, b[2]);
          var tp = I.P(60, 45, 90); K.t(ctx, Math.round(b[1]).toLocaleString() + " t", tp.x, tp.y - 10, { s: 13, w: "900", a: "center", c: LT.ink });
          var bt = I.P(120, 90, 0); K.t(ctx, b[0], I.P(60, 90, 0).x, bt.y + 22, { s: 11, w: "900", a: "center", c: k === 2 ? (okr ? LT.green : LT.orange) : LT.mute });
        });
        vcard(ctx, 572, W - 572, cv.H, "마른 날을 버틸 저수지", [cap.toLocaleString() + " t", okr ? LT.green : LT.red], [["미래 필요량", Math.round(n).toLocaleString() + " t", LT.red], ["계산", "16일 × 2,000 t × 1.14", LT.ink]], [okr ? "필요량 이상 · 여유 10% 안" : (cap < n ? "물이 모자람" : "지나치게 큼"), okr]);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "저수지 용량", min: 20000, max: 60000, step: 1000, value: 26000, fmt: function (x) { return x.toLocaleString() + " t"; }, onInput: function (x) { cap = x; draw(); api.changed(); } });
      api.info("필요량 = 마른 날 수 × 하루 사용량 × (1 + 증발 증가율).");
      draw();
      return {
        judge: function () {
          var n = need();
          if (cap >= n && cap <= n * 1.1) return { ok: true, msg: cap.toLocaleString() + " t — 미래의 16일 가뭄을 버티고 예산도 지켰습니다." };
          return { ok: false, msg: cap.toLocaleString() + " t — " + (cap < n ? "미래의 가뭄에 물이 바닥납니다." : "필요보다 너무 커 예산을 넘깁니다.") };
        }
      };
    },
    hints: ["16 × 2,000 = 32,000 t에 증발 증가 14%를 더하세요.", "32,000 × 1.14 = 36,480 t. 그 이상, 약 40,100 t 이하."],
    solution: "용량 <b>37,000~40,000 t</b>.",
    why: "기온이 오르면 연 강수량이 비슷해도 <b>비가 오지 않는 날이 길어지고</b>, 저수지와 흙의 물이 더 빨리 증발합니다. 그래서 가뭄 대비 시설은 과거 기록이 아니라 <b>미래 기후</b>에 맞춰 설계해야 합니다. 빗물 재이용, 물을 아끼는 농법, 해수 담수화도 함께 쓰이는 대응입니다.<br>※ 마른 날 수와 증발 증가율은 수업용 가정입니다."
  },

  /* ------------------------------------------------------------------ 3. 늦게 시작한 감축 */
  {
    id: "c3", about: "04", tag: "탄소예산 · 국제 사회", title: "5년 늦게 출발한 세계", short: "늦은 감축",
    who: "⏱️", name: "기후 총회 사무국",
    say: "“1.5 ℃ 탄소예산은 2020년 기준 약 <b>500 Gt</b>. 해마다 같은 비율로 줄이기 시작하면 8%면 충분했어요. 그런데 세계가 <b>5년 동안 해마다 40 Gt을 그대로</b> 내보낸 뒤 2025년에야 감축을 시작한다면요? 예산을 넘지 않는 <b>가장 느린</b> 감축률을 찾아 총회에 보고해 주세요.”",
    predict: {
      q: "감축 시작이 5년 늦어지면 해마다 줄여야 하는 비율은?",
      options: ["㉠ 8% 그대로다", "㉡ 조금만(8.5% 정도) 늘어난다", "㉢ 크게(10% 이상) 늘어난다"],
      answer: 2
    },
    task: "시작 연도를 <b>2025년</b>에 두고, 예산을 넘지 않는 가장 느린 감축률(최소값에서 0.5%p 안)을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, start = 2025, r = 0.08;
      function left() { return 500 - 40 * (start - 2020); }
      function minR() { return 40 / left(); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var Y0 = 2020, YEARS = 50, pts = [], cum = 40 * (start - 2020) + 40 / r, ok = start === 2025 && r >= minR() - 1e-9 && r <= minR() + 0.005 + 1e-9;
        K.studio(ctx, 0, 0, 620, cv.H, null);
        K.bigText(ctx, "누적 " + Math.round(cum) + " Gt", 16, 34, 22, cum <= 500 + 1e-6 ? "#7ee0a0" : "#ff9a7a");
        K.t(ctx, start + "년부터 해마다 " + (r * 100).toFixed(1) + "%씩 줄이기 (Gt CO₂/년)", 604, 28, { s: 11.5, w: "800", a: "right", c: LT.mute });
        var g = K.chart(ctx, { x: 4, y: 44, w: 612, h: cv.H - 48, pl: 40, pb: 28, pt: 8, pr: 14, x0: Y0, x1: Y0 + YEARS, y0: 0, y1: 45, xt: 5, yt: 3, light: true, xf: function (v) { return String(Math.round(v)); }, yf: function (v) { return String(Math.round(v)); } });
        for (var y = Y0; y <= Y0 + YEARS; y += 0.5) pts.push([y, y < start ? 40 : 40 * Math.pow(1 - r, y - start)]);
        ctx.beginPath(); ctx.moveTo(g.X(Y0), g.Y(0)); pts.forEach(function (p) { ctx.lineTo(g.X(p[0]), g.Y(p[1])); }); ctx.lineTo(g.X(Y0 + YEARS), g.Y(0)); ctx.closePath(); ctx.fillStyle = "rgba(232,89,12,.22)"; ctx.fill();
        K.plot(ctx, g, pts, LT.orange, { w: 2.8, light: true });
        K.line(ctx, { x: g.X(start), y: g.T }, { x: g.X(start), y: g.B }, LT.violet, 1.4, [4, 4]); K.t(ctx, "감축 시작 " + start, g.X(start) + 6, g.T + 14, { s: 11, w: "900", c: LT.violet });
        vcard(ctx, 632, W - 632, cv.H, "남은 탄소예산 500 Gt", null, [["시작 연도", start + "년", LT.violet], ["감축률", (r * 100).toFixed(1) + " %/년", LT.blue], ["필요한 최소", (minR() * 100).toFixed(1) + " %", LT.mute]], [ok ? "예산 안에서 멈춤" : (cum > 500 ? "예산을 넘음" : "조건을 다시 보세요"), ok], 160);
        var frac = Math.min(1, cum / 500), cx = 766, by0 = 54, bh = 72;
        ctx.fillStyle = "rgba(200,225,250,.4)"; ctx.fillRect(cx - 30, by0, 60, bh);
        if (frac > 0) cyl(ctx, cx, by0 + bh - bh * frac, 27, bh * frac, cum > 500 ? "#ff8787" : "#ffa94d", cum > 500 ? "#a61e1e" : "#c2410c");
        ctx.strokeStyle = "rgba(80,100,130,.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 30, by0); ctx.lineTo(cx - 30, by0 + bh); ctx.ellipse(cx, by0 + bh, 30, 10.5, 0, Math.PI, 0, true); ctx.lineTo(cx + 30, by0); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, by0, 30, 10.5, 0, 0, 6.2832); ctx.stroke();
        K.t(ctx, Math.round(frac * 100) + "%", cx + 42, by0 + bh - bh * frac + 4, { s: 12, w: "900", c: LT.ink });
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "감축 시작 연도", value: 2025, options: [{ v: 2020, t: "2020년" }, { v: 2025, t: "2025년" }, { v: 2030, t: "2030년" }], onPick: function (x) { start = +x; draw(); api.changed(); } });
      api.slider({ label: "해마다 줄이는 비율", min: 0.03, max: 0.25, step: 0.001, value: 0.08, fmt: function (x) { return (x * 100).toFixed(1) + " %"; }, onInput: function (x) { r = Math.round(x * 1000) / 1000; draw(); api.changed(); } });
      api.info("감축을 시작한 뒤의 누적 배출은 40 ÷ r에서 멈춥니다. 시작 전까지 쓴 만큼 예산이 줄어듭니다.");
      draw();
      return {
        judge: function () {
          var m = minR(), cum = 40 * (start - 2020) + 40 / r;
          if (start !== 2025) return { ok: false, msg: "사무국이 물은 것은 2025년에 시작하는 경우입니다. 시작 연도를 2025년으로 두세요." };
          if (r >= m - 1e-9 && r <= m + 0.005 + 1e-9) return { ok: true, msg: "2025년 시작 · 해마다 " + (r * 100).toFixed(1) + "% → 누적 " + Math.round(cum) + " Gt. 5년 늦으면 필요한 속도가 8% → 약 13%로 뜁니다." };
          return { ok: false, msg: "해마다 " + (r * 100).toFixed(1) + "% → 누적 " + Math.round(cum) + " Gt — " + (cum > 500 ? "예산을 넘습니다." : "예산은 지키지만 필요보다 훨씬 빠릅니다(최소값에서 0.5%p 안으로).") };
        }
      };
    },
    hints: ["5년 동안 40 × 5 = 200 Gt을 먼저 썼습니다. 남은 예산은 300 Gt.", "40 ÷ r ≤ 300 → r ≥ 약 13.3%."],
    solution: "2025년 시작 · 해마다 <b>약 13.4~13.8%</b>.",
    why: "탄소예산은 은행 잔고와 같습니다. 줄이기를 미루는 동안에도 잔고는 계속 빠져나가, 남은 기간에 훨씬 가파르게 줄여야 합니다. 2020년에 시작하면 해마다 8%, 2025년이면 약 13%, 2030년이면 40%까지 뛰어오릅니다.<br>" +
      "그래서 파리 협정은 ‘가능한 한 빨리 배출 정점을 지나 감축’할 것을 요구하고, 모든 나라가 5년마다 더 높은 목표를 내도록 합니다. ※ 해마다 같은 비율로 줄인다는 단순화한 계산입니다."
  }
  ]
});
})();
