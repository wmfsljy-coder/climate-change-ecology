/* 기후변화와 환경생태 Ⅰ 기후와 환경생태의 특성 — 응용 실험실
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
/* 원뿔 산 블록: 높이 함수 zOf, 색 colOf(x, y, z, 밝기) */
function mountain(ctx, I, zOf, colOf, n) {
  ["front", "right"].forEach(function (sd, k) {
    I.face(ctx, sd, function (Lw) {
      I.profile(ctx, sd, function (u) { return sd === "front" ? zOf(u, I.D) : zOf(I.L, u); }, 0); ctx.save(); ctx.clip();
      var g = ctx.createLinearGradient(0, 0, 0, 60); g.addColorStop(0, k ? "#5e4530" : "#6e5238"); g.addColorStop(1, k ? "#8a7258" : "#a08468");
      ctx.fillStyle = g; ctx.fillRect(0, 0, Lw, 400); ctx.restore();
    });
  });
  I.shade(ctx, "right", function (u) { return zOf(I.L, u); });
  I.field(ctx, zOf, colOf, n || 34, n || 34);
  I.edges(ctx, zOf(I.L, I.D), zOf(I.L, I.D));
}

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 기후인자: 고도 */
  {
    id: "c1", about: "01", tag: "기후인자 · 고도", title: "적도의 ‘늘 봄’ 도시", short: "고도와 기온",
    who: "🏔️", name: "신도시 설계 위원회",
    say: "“적도 바로 옆 해안은 1년 내내 연평균 <b>27 ℃</b>로 무덥습니다. 그런데 위원회는 연평균 <b>18~20 ℃</b>, 늘 봄 같은 새 도시를 원해요. 위도는 바꿀 수 없으니 <b>도시를 세울 높이</b>를 정해 주세요. 이 지역은 높이 1 km마다 기온이 약 <b>6.5 ℃</b> 낮아집니다.”",
    predict: {
      q: "적도 근처에 있는 아프리카 킬리만자로산(약 5,900 m) 꼭대기에는 무엇이 있을까요?",
      options: ["㉠ 적도니까 열대 우림이 꼭대기까지 덮여 있다", "㉡ 높이 올라갈수록 기온이 낮아져 꼭대기에는 빙하와 눈이 있다", "㉢ 태양에 가까워져 사막처럼 뜨겁다"],
      answer: 1
    },
    task: "도시를 세울 높이를 조절해 연평균 기온 <b>18~20 ℃</b>를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, h = 0;
      function T(m) { return 27 - 6.5 * m / 1000; }
      /* 적도 해안에서 솔은 산 블록(높이 1 m = 0.036 단위). 도시는 그 높이의 비탈에 선다 */
      var IM = K.iso({ ox: 250, oy: 116, s: 0.72, L: 300, D: 220 }), ZK = 0.036, ZB = 12;
      function mz(x, y) { var dx = (x - 160) / 130, dy = (y - 100) / 105, r = Math.sqrt(dx * dx + dy * dy); return ZB + 3800 * ZK * Math.pow(Math.max(0, 1 - r), 1.1); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var t = T(h), ok = t >= 18 && t <= 20, zh = ZB + h * ZK;
        K.studio(ctx, 0, 0, 520, cv.H, { x: 250, y: 262, rx: 220, ry: 30 });
        ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, 520, cv.H, 14); ctx.clip();
        mountain(ctx, IM, mz, function (x, y, z, lt) {
          var m = (z - ZB) / ZK;
          if (h > 0 && Math.abs(z - zh) < 2.2) return K.tint("#f08c00", lt);
          if (m > 3300) return K.tint("#f4f7fb", lt);
          if (m > 2600) return K.tint("#9c8b78", lt);
          if (m > 1600) return K.tint("#5f8f46", lt);
          return z <= ZB + .5 ? K.tint("#d9c99a", lt) : K.tint("#3f8f3a", lt);
        }, 36);
        /* 도시: 앞쪽 비탈에서 높이가 zh 인 곳 */
        var hs = [];
        [0.55, 0.85, 1.15].forEach(function (a) { for (var r = 0; r <= 1.3; r += 0.01) { var x = 160 + 130 * r * Math.cos(a), y = 100 + 105 * r * Math.sin(a); if (x > IM.L - 4 || y > IM.D - 4 || mz(x, y) <= zh) { hs.push([Math.min(x, IM.L - 12), Math.min(y, IM.D - 12)]); break; } } });
        hs.sort(function (p, q) { return (p[0] + p[1]) - (q[0] + q[1]); }).forEach(function (p) { IM.house(ctx, p[0] - 6, p[1] - 5, mz(p[0], p[1]), 12, 10, 9, "#e8590c"); IM.house(ctx, p[0] + 8, p[1] - 2, mz(p[0] + 8, p[1]), 9, 8, 13, "#c92a2a"); });
        ctx.restore();
        if (hs.length) IM.label(ctx, hs[hs.length - 1][0], hs[hs.length - 1][1], zh + 10, "새 도시 " + h.toLocaleString() + " m", 60, -30, "#ffe8cc", [0, 520]);
        IM.label(ctx, 160, 100, mz(160, 100), "정상 약 3,800 m · 눈", 50, -10, "#e8ecff", [0, 520]);
        IM.label(ctx, 20, 210, ZB, "해안 0 m · 27 ℃", -10, 30, "#ffe8cc", [0, 520]);
        K.bigText(ctx, t.toFixed(1) + " ℃", 16, 38, 26, ok ? "#7ee0a0" : "#ffffff");
        K.warn(ctx, 508, cv.H - 12, "⚠ 산의 높이는 과장", "right");
        vcard(ctx, 532, W - 532, cv.H, "새 도시의 기후", [t.toFixed(1) + " ℃", ok ? LT.green : LT.red], [["도시의 높이", h.toLocaleString() + " m", LT.blue], ["해안(0 m)과의 차이", "−" + (27 - t).toFixed(1) + " ℃", LT.ink], ["기온 감률", "1 km마다 6.5 ℃", LT.mute]], [ok ? "늘 봄 같은 18~20 ℃" : (t > 20 ? "아직 덥습니다" : "너무 서늘합니다"), ok]);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "도시를 세울 높이", min: 0, max: 4000, step: 50, value: 0, fmt: function (x) { return x.toLocaleString() + " m"; },
        onInput: function (x) { h = x; draw(); api.changed(); } });
      api.info("같은 위도라도 <b>고도</b>라는 기후인자가 기온을 바꿉니다. 기온 차이 ÷ 6.5 ℃ = 올라가야 할 높이(km).");
      draw();
      return {
        judge: function () {
          var t = T(h);
          if (t >= 18 && t <= 20) return { ok: true, msg: h.toLocaleString() + " m · 연평균 " + t.toFixed(1) + " ℃ — 적도에서도 늘 봄 같은 도시가 됩니다." };
          return { ok: false, msg: h.toLocaleString() + " m · 연평균 " + t.toFixed(1) + " ℃ — " + (t > 20 ? "아직 덥습니다. 더 높이 올라가세요." : "너무 높아 서늘합니다.") };
        }
      };
    },
    hints: [
      "해안보다 7~9 ℃ 낮아야 합니다.",
      "7 ÷ 6.5 ≈ 1.08 km, 9 ÷ 6.5 ≈ 1.38 km 사이의 높이를 고르세요."
    ],
    solution: "높이 <b>약 1,100~1,350 m</b>에 세우면 연평균 18~20 ℃가 됩니다.",
    why: "기후는 위도만으로 정해지지 않습니다. <b>고도</b>가 높아지면 공기가 희박해지고 지표에서 멀어져 기온이 낮아집니다. 그래서 적도 가까이에 있는 킬리만자로산 꼭대기에도 빙하가 있고, 적도 부근 고원에는 1년 내내 선선한 도시가 발달합니다.<br>" +
      "콘월에서는 <b>해류와 수륙 분포</b>, 이곳에서는 <b>고도</b> — 모두 기후요소(기온)를 바꾸는 기후인자입니다. ※ 1 km에 6.5 ℃는 평균적인 값으로, 실제 기온 감률은 장소와 날씨에 따라 다릅니다."
  },

  /* ------------------------------------------------------------------ 2. 음의 되먹임: 데이지 행성 */
  {
    id: "c2", about: "02", tag: "되먹임 · 생물권", title: "데이지 행성의 온도 조절", short: "데이지 행성",
    who: "🌼", name: "행성 생태 모형 연구실",
    say: "“가상의 ‘데이지 행성’에는 햇빛을 잘 반사하는 <b>흰 데이지</b>가 자랍니다. 그런데 태양이 <b>20% 더 밝아졌어요.</b> 행성의 평균 기온을 생물이 살기 좋은 <b>20~25 ℃</b>로 되돌리려면 흰 데이지가 행성 표면을 얼마나 덮어야 할까요?”",
    predict: {
      q: "행성이 더워질수록 흰 데이지가 더 잘 퍼진다면, 흰 데이지는 행성 기온에 어떤 되먹임을 일으킬까요?",
      options: ["㉠ 흰 데이지가 햇빛을 반사해 기온을 낮추는 음의 되먹임", "㉡ 흰 데이지가 햇빛을 흡수해 기온을 더 올리는 양의 되먹임", "㉢ 식물은 기온에 아무 영향을 주지 못한다"],
      answer: 0
    },
    task: "흰 데이지 면적을 조절해 밝아진 태양 아래에서 행성 기온 <b>20~25 ℃</b>를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, w = 0, L = 1.2;
      function alb(x) { return 0.3 + 0.4 * x / 100; }
      function T(x) { return 288 * Math.pow(L * (1 - alb(x)) / 0.7, 0.25) - 273; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 300, cy = 146, R = 104, t = T(w), ok = t >= 20 && t <= 25, i;
        K.studio(ctx, 0, 0, 520, cv.H, { x: cx, y: cy + R + 14, rx: 120, ry: 16 });
        K.sun(ctx, 60, 70, 16);
        [[90, 80], [96, 110], [84, 140]].forEach(function (q, k) { K.arrow(ctx, { x: q[0], y: q[1] }, { x: cx - R * .85, y: cy - 40 + k * 40 }, "#f59f00", 2.4, 9); });
        /* 입체 행성: 더울수록 붉게 */
        var warm = Math.max(0, Math.min(1, (t - 10) / 25));
        K.planet(ctx, cx, cy, R, warm > .6 ? "#e8775a" : (warm > .35 ? "#c9a46c" : "#8fbf6a"), warm > .6 ? "#6b2515" : "#3d4f22");
        /* 흰 데이지(보이는 반구에 황금각으로 고루 흩어 둔다) */
        var n = Math.round(w / 100 * 90);
        for (i = 0; i < 90; i++) {
          var zz = 1 - 2 * (i + .5) / 90, rr = Math.sqrt(1 - zz * zz), a = i * 2.39996, px = cx + R * rr * Math.cos(a) * .96, py = cy + R * zz * .96, front = rr * Math.sin(a);
          if (i >= n || front < -0.1) continue;
          var sc = 0.6 + 0.4 * Math.max(0, Math.sin(a) * rr + .4);
          ctx.fillStyle = "#ffffff"; for (var k = 0; k < 6; k++) { var pa = k / 6 * 6.2832; ctx.beginPath(); ctx.ellipse(px + Math.cos(pa) * 3.6 * sc, py + Math.sin(pa) * 3.6 * sc, 2.8 * sc, 1.5 * sc, pa, 0, 6.2832); ctx.fill(); }
          ctx.fillStyle = "#ffd43b"; ctx.beginPath(); ctx.arc(px, py, 1.8 * sc, 0, 6.2832); ctx.fill();
        }
        K.bigText(ctx, t.toFixed(1) + " ℃", 16, 38, 26, ok ? "#7ee0a0" : "#ffffff");
        K.bigText(ctx, "20% 더 밝아진 태양", 16, cv.H - 18, 15, "#ffd35a");
        K.pill(ctx, "흰 데이지 " + w + "%", cx, cy + R + 40, { a: "center", s: 12, c: "#ffffff", box: [0, 520] });
        vcard(ctx, 532, W - 532, cv.H, "행성의 에너지 장부", [t.toFixed(1) + " ℃", ok ? LT.green : LT.red], [["행성 반사율", Math.round(alb(w) * 100) + "%", LT.blue], ["흰 데이지 면적", w + "%", LT.teal], ["태양이 밝아지기 전", "15.0 ℃", LT.mute]], [ok ? "생물이 살기 좋은 20~25 ℃" : (t > 25 ? "아직 너무 덥습니다" : "너무 추워졌습니다"), ok]);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "흰 데이지가 덮은 면적", min: 0, max: 100, step: 1, value: 0, fmt: function (x) { return x + "%"; },
        onInput: function (x) { w = x; draw(); api.changed(); } });
      api.info("흰 꽃은 햇빛을 반사해 행성의 <b>반사율</b>을 높입니다. 반사율이 높을수록 흡수하는 에너지가 줄어 기온이 내려갑니다.");
      draw();
      return {
        judge: function () {
          var t = T(w);
          if (t >= 20 && t <= 25) return { ok: true, msg: "흰 데이지 " + w + "% · 반사율 " + Math.round(alb(w) * 100) + "% · " + t.toFixed(1) + " ℃ — 생물이 행성의 기온을 살기 좋은 범위로 붙잡았습니다." };
          return { ok: false, msg: "흰 데이지 " + w + "% · " + t.toFixed(1) + " ℃ — " + (t > 25 ? "아직 너무 덥습니다." : "너무 많이 덮어 추워졌습니다.") };
        }
      };
    },
    hints: [
      "데이지가 하나도 없으면 28 ℃가 넘습니다. 조금씩 늘려 보세요.",
      "반사율이 약 33~37%가 되면 됩니다. 데이지 1%마다 반사율이 0.4%p 오릅니다."
    ],
    solution: "흰 데이지 <b>약 8~18%</b>면 20~25 ℃가 됩니다.",
    why: "이 모형은 과학자 러브록과 왓슨이 1983년에 발표한 ‘데이지 행성’ 모형을 단순하게 바꾼 것입니다. 행성이 더워지면 흰 데이지가 늘고, 흰 데이지가 햇빛을 반사해 행성을 식히니 <b>음의 되먹임</b>입니다.<br>" +
      "생물권이 기권의 에너지 흐름을 바꾸어 기후시스템을 안정하게 만드는 예입니다. 실제 지구에서도 식물의 광합성이 이산화 탄소를 흡수하는 것처럼 생물권이 되먹임 고리에 참여합니다. ※ 기온 계산은 복사 평형을 단순화한 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 3. 서식지 이동: 산 위로 */
  {
    id: "c3", about: "03", tag: "생태계 영향 · 서식지", title: "산꼭대기로 밀려나는 구상나무", short: "구상나무",
    who: "🌲", name: "국립공원 연구원",
    say: "“우리나라 고유종인 <b>구상나무</b>는 한라산의 높은 곳에 삽니다. 이 모형에서는 해발 <b>1,400 m</b> 위부터 정상(약 <b>1,950 m</b>)까지 자란다고 할게요. 기온이 오르면 서식지의 아랫경계가 산 위로 올라갑니다. 서식할 수 있는 높이 폭이 지금의 <b>40~60%</b>로 줄어드는 기온 상승은 얼마일까요? 보호 계획의 기준으로 삼으려 합니다.”",
    predict: {
      q: "기온이 오를 때, 산 위에 사는 생물이 평지 생물보다 더 위험한 까닭은?",
      options: ["㉠ 산 위 생물은 더위를 전혀 견디지 못해서", "㉡ 서식지가 위로 옮겨 가다 정상에 닿으면 더 갈 곳이 없어서", "㉢ 산 위에는 기온 상승이 일어나지 않아서"],
      answer: 1
    },
    task: "기온 상승을 조절해 구상나무 서식 폭이 지금의 <b>40~60%</b>가 되는 값을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, dT = 0, TOP = 1950, LOW0 = 1400;
      function low(d) { return LOW0 + d / 6.5 * 1000; }
      function frac(d) { return Math.max(0, (TOP - low(d)) / (TOP - LOW0)); }
      /* 한라산 블록(높이 1 m = 0.07 단위), 구상나무는 아랫경계 위에만 선다 */
      var IH = K.iso({ ox: 250, oy: 112, s: 0.72, L: 300, D: 220 }), ZK = 0.07, ZB = 10;
      function hz(x, y) { var dx = (x - 160) / 140, dy = (y - 104) / 110, r = Math.sqrt(dx * dx + dy * dy); return ZB + TOP * ZK * Math.pow(Math.max(0, 1 - r), 1.25); }
      var FIR = (function () { var R = K.rng(21), out = [], n = 0; while (out.length < 160 && n < 6000) { n++; var x = 10 + R() * 280, y = 10 + R() * 200; out.push([x, y]); } return out.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); }); })();
      function draw() {
        H.paper(ctx, W, cv.H);
        var L = Math.min(low(dT), TOP), f = frac(dT), ok = f >= 0.4 && f <= 0.6, zl = ZB + L * ZK, z0 = ZB + LOW0 * ZK;
        K.studio(ctx, 0, 0, 520, cv.H, { x: 250, y: 262, rx: 220, ry: 30 });
        ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, 520, cv.H, 14); ctx.clip();
        mountain(ctx, IH, hz, function (x, y, z, lt) {
          if (Math.abs(z - zl) < 1.6) return K.tint("#e8590c", lt);
          if (dT > 0 && Math.abs(z - z0) < 1.2) return K.tint("#adb5bd", lt);
          if (z >= zl) return K.tint("#2f6b3a", lt);
          return z > ZB + 600 * ZK ? K.tint("#7fae55", lt) : K.tint("#9cc26a", lt);
        }, 36);
        FIR.forEach(function (p) { var z = hz(p[0], p[1]); if (z >= zl + 1 && z > ZB + 2) IH.tree(ctx, p[0], p[1], z, .62); });
        ctx.restore();
        var BX = [0, 520];
        if (L < TOP) IH.label(ctx, 160, 104 + 110 * (1 - Math.pow((zl - ZB) / (TOP * ZK), 1 / 1.25)), zl, "새 아랫경계 " + Math.round(L).toLocaleString() + " m", 60, 46, "#ffd8a8", BX);
        if (dT > 0) IH.label(ctx, 160 - 140 * (1 - Math.pow((z0 - ZB) / (TOP * ZK), 1 / 1.25)) * .9, 104, z0, "지금 아랫경계 1,400 m", -40, 50, "#e8ecff", BX);
        IH.label(ctx, 160, 104, hz(160, 104), "정상 약 1,950 m", 40, -14, "#e8ecff", BX);
        K.bigText(ctx, "서식 폭 " + Math.round(f * 100) + "%", 16, 38, 24, ok ? "#7ee0a0" : "#ffffff");
        K.warn(ctx, 508, cv.H - 12, "⚠ 산의 높이는 과장", "right");
        vcard(ctx, 532, W - 532, cv.H, "구상나무 서식지", ["+" + dT.toFixed(1) + " ℃", LT.orange], [["새 아랫경계", Math.round(L).toLocaleString() + " m", LT.orange], ["서식할 수 있는 폭", Math.round(TOP - L) + " m", LT.green], ["지금의 폭과 비교", Math.round(f * 100) + "%", ok ? LT.green : LT.red]], [ok ? "서식지가 절반쯤으로 줄어듦" : (f > 0.6 ? "아직 절반보다 넉넉함" : "너무 많이 줄었음"), ok]);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "기온 상승", min: 0, max: 4, step: 0.1, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " ℃"; },
        onInput: function (x) { dT = x; draw(); api.changed(); } });
      api.info("높이 1 km마다 기온이 약 6.5 ℃ 낮아진다고 하면, 기온이 1 ℃ 오를 때 같은 기온의 높이는 약 <b>154 m</b> 위로 올라갑니다.");
      draw();
      return {
        judge: function () {
          var f = frac(dT);
          if (f >= 0.4 && f <= 0.6) return { ok: true, msg: "+" + dT.toFixed(1) + " ℃ → 아랫경계 " + Math.round(low(dT)).toLocaleString() + " m, 서식 폭 " + Math.round(f * 100) + "% — 서식지가 절반쯤으로 줄어듭니다." };
          return { ok: false, msg: "+" + dT.toFixed(1) + " ℃ → 서식 폭 " + Math.round(f * 100) + "% — " + (f > 0.6 ? "아직 절반보다 넉넉합니다." : "너무 많이 줄었습니다.") };
        }
      };
    },
    hints: [
      "지금 서식 폭은 1,950 − 1,400 = 550 m. 그 절반은 약 275 m입니다.",
      "아랫경계가 약 220~330 m 올라가야 합니다. 기온 1 ℃에 약 154 m씩 올라갑니다."
    ],
    solution: "기온 상승 <b>약 +1.5 ~ +2.1 ℃</b>에서 서식 폭이 40~60%가 됩니다.",
    why: "기온이 오르면 서식지는 <b>북쪽(고위도)</b>뿐 아니라 <b>위쪽(고지대)</b>으로도 옮겨 갑니다. 평지 생물은 북쪽으로 옮겨 갈 수 있지만, 산꼭대기에 사는 생물은 정상에 닿으면 갈 곳이 없어 사라질 위험이 큽니다.<br>" +
      "실제로 한라산의 구상나무 숲은 최근 수십 년 동안 크게 줄어 기후변화의 영향을 받는 대표 사례로 꼽힙니다(가뭄·태풍·겨울철 적설 변화 등도 함께 원인으로 연구됩니다). ※ 서식 높이와 기온 감률은 수업용 모형 값입니다."
  }
  ]
});
})();
