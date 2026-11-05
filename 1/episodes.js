/* 기후변화와 환경생태 Ⅰ 기후와 환경생태의 특성 — 소단원별 이야기 세 편
   01 콘월의 야자수 / 02 녹는 얼음, 짙어지는 구름 / 03 실잠자리가 북쪽으로 온 까닭
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("cce-1");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function v(name) { return window.cssVar(name); }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function paper(ctx, W, H) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = v("--panel"); ctx.fillRect(0, 0, W, H); }
function text(ctx, s, x, y, o) {
  o = o || {};
  ctx.font = (o.w || "500") + " " + (o.s || 12) + "px " + FONT;
  ctx.fillStyle = o.c || v("--ink"); ctx.textAlign = o.a || "left";
  ctx.fillText(s, x, y);
}
function segWire(id, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () {
      btns.forEach(function (x) { x.classList.toggle("on", x === b); });
      onPick(b.getAttribute("data-v"));
    });
  });
}
/* 무대 그림 도구 */
var K = window.sthKit, KC = K.C;
function motion(id) {
  var st = { on: !K.REDUCE }, b = $(id);
  function lab() { if (b) b.textContent = st.on ? "⏸ 움직임 멈추기" : "▶ 움직임 보기"; }
  if (b) { b.type = "button"; b.addEventListener("click", function () { st.on = !st.on; lab(); }); }
  lab(); return st;
}
function rd(id, html) { var e = $(id); if (e) e.innerHTML = html; }
function kv(k, val, c, sub) { return "<span class='k'>" + k + "</span><span class='v " + (c || "") + "'>" + val + "</span>" + (sub ? "<span class='sub'>" + sub + "</span>" : ""); }
function okp(good, s) { return "<span class='ok " + (good ? "g" : "r") + "'>" + s + "</span>"; }
function clipRect(ctx, g) { ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip(); }
/* ---- 스튜디오 블록 모형 도구 (밝은 바탕) ---- */
var LC = K.LT;
function zEll(ctx, x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.2832); }
/* 땅 블록 옆면(띠 [아래, 위, 색]) + 윗면 */
function zSlab(ctx, I, zg, bands, topFill, n) {
  ["front", "right"].forEach(function (sd, k) { I.face(ctx, sd, function (Lw) { bands.forEach(function (b) { ctx.fillStyle = k ? K.tint(b[2], .84) : b[2]; ctx.fillRect(0, b[0], Lw, b[1] - b[0]); }); }); });
  I.top(ctx, function () { return zg; }, topFill, n || 20);
  I.edges(ctx, zg, zg);
}
var zSOIL = [[0, 6, "#7c818a"], [6, 13, "#9a7650"], [13, 18, "#5a3d26"]];
/* 흰 카드 오른쪽 판 */
function zCard(ctx, x, w, H, title, rows, tip, big, y0) {
  K.card(ctx, x, 0, w, H, title);
  var x0 = x + 18, x1 = x + w - 18, y = y0 || 58;
  if (big) { K.t(ctx, big[0], x0, y + 8, { s: 26, w: "900", c: big[1] }); y += 44; }
  rows.forEach(function (r) { K.row(ctx, r[0], r[1], x0, x1, y, r[2]); if (r[3] != null) { K.bar(ctx, x0, y + 8, x1 - x0, r[3], r[2]); y += 14; } y += 28; });
  if (tip) K.tip(ctx, tip[0], x0 - 4, H - 46, x1 - x0 + 8, tip[1]);
  return y;
}
/* 기상 관측 백엽상 미니어처 */
function zStation(ctx, ox, oy, s) {
  var I = K.iso({ ox: ox, oy: oy, s: s, L: 120, D: 90 });
  zSlab(ctx, I, 18, zSOIL, function (j) { return j % 2 ? "#8cc46a" : "#84bd62"; }, 12);
  [[40, 30], [70, 30], [40, 60], [70, 60]].forEach(function (q) { K.line(ctx, I.P(q[0], q[1], 18), I.P(q[0], q[1], 70), "#868e96", 2); });
  I.box(ctx, 36, 26, 70, 74, 64, 104, "#ffffff", "#eef1f5", "#cfd5de");
  for (var k = 0; k < 4; k++) K.line(ctx, I.P(36, 64, 76 + k * 7), I.P(74, 64, 76 + k * 7), "#b9c0cc", 1);
  I.quad(ctx, I.P(32, 22, 106), I.P(78, 22, 106), I.P(78, 68, 106), I.P(32, 68, 106), "#f8f9fa", "#adb5bd");
  I.tree(ctx, 104, 16, 18, 1.1); I.tree(ctx, 12, 78, 18, .9);
  return I;
}

/* =========================================================================
   이야기 ① 콘월의 야자수
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "p1", title: "첫 추리",
    question: "하바롭스크보다 북쪽인 콘월에서 한겨울에도 야자나무가 자라는 까닭은 무엇일까요?",
    options: ["㉠ 서윤이가 간 날의 날씨가 마침 따뜻했을 뿐이다", "㉡ 사실은 콘월이 하바롭스크보다 적도에 가깝다", "㉢ 위도 말고 바다·해류 같은 다른 요인이 겨울을 따뜻하게 만든다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 평균 기간 (날씨 → 기후) */
  (function () {
    var canvas = $("c-avg"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, N = 3650;
    function seeded(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
    function gauss(r) { var u1 = Math.max(1e-6, r()), u2 = r(); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
    var rnd = seeded(11), daily = [], pre = [0], i;
    for (i = 0; i < N; i++) daily.push(15 + 10 * Math.sin(2 * Math.PI * i / 365 - Math.PI / 2) + 3 * gauss(rnd));
    for (i = 0; i < N; i++) pre.push(pre[i] + daily[i]);
    function ma(c, w) { var h = Math.floor(w / 2), lo = Math.max(0, c - h), hi = Math.min(N - 1, c + h); return (pre[hi + 1] - pre[lo]) / (hi - lo + 1); }
    function series(w) { var s = []; for (var p = 0; p < 400; p++) s.push(ma(Math.floor(p / 400 * N), w)); return s; }
    function sd(s) { var m = s.reduce(function (a, b) { return a + b; }, 0) / s.length; return Math.sqrt(s.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / s.length); }
    var rawSd = sd(daily);
    var win = 1, got = window.sthState("avgGot") || { a: false, b: false };

    function draw() {
      var s = series(win), d = sd(s), m = s.reduce(function (a, b) { return a + b; }, 0) / s.length, p;
      ctx.clearRect(0, 0, W, H);
      var LW = 640;
      K.studio(ctx, 0, 0, LW, H, null);
      K.bigText(ctx, "변동 폭 ±" + d.toFixed(2) + " ℃", 16, 36, 24, d < 0.5 ? "#7ee0a0" : "#ffffff");
      K.bigText(ctx, win === 1 ? "매일의 기온 = 날씨" : win + "일씩 평균한 기온", 16, 60, 15, "#ffd35a");
      K.t(ctx, "━ 매일 기온", LW - 150, 30, { s: 11.5, w: "900", a: "right", c: "#8a96a8" });
      K.t(ctx, "━ " + win + "일 평균", LW - 16, 30, { s: 11.5, w: "900", a: "right", c: LC.orange });
      var g = K.chart(ctx, { x: 4, y: 70, w: LW - 8, h: H - 74, pl: 44, pb: 30, pt: 8, pr: 14, x0: 0, x1: 10, y0: -5, y1: 30, xt: 10, yt: 7, light: true, xl: "지난 시간(년)", yf: function (q) { return Math.round(q) + "℃"; } });
      clipRect(ctx, g);
      /* 평균하는 구간(창) */
      var wy = win / 365, wx0 = g.X(5 - wy / 2), wx1 = g.X(5 + wy / 2);
      ctx.fillStyle = "rgba(245,159,0,.12)"; ctx.fillRect(wx0, g.T, Math.max(2, wx1 - wx0), g.B - g.T);
      ctx.strokeStyle = "rgba(232,89,12,.6)"; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.strokeRect(wx0, g.T, Math.max(2, wx1 - wx0), g.B - g.T); ctx.setLineDash([]);
      /* 변동 폭 띠 (평균 ± 표준 편차) */
      ctx.fillStyle = "rgba(28,126,214,.10)"; ctx.fillRect(g.L, g.Y(m + d), g.R - g.L, g.Y(m - d) - g.Y(m + d));
      ctx.strokeStyle = "rgba(28,126,214,.5)"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      [m + d, m - d].forEach(function (t) { ctx.beginPath(); ctx.moveTo(g.L, g.Y(t)); ctx.lineTo(g.R, g.Y(t)); ctx.stroke(); });
      ctx.setLineDash([]);
      /* 매일의 기온 */
      ctx.strokeStyle = "rgba(90,110,140,.38)"; ctx.lineWidth = 1; ctx.beginPath();
      for (p = 0; p < 400; p++) { var xx = g.X(p / 40), yy = g.Y(daily[Math.floor(p / 400 * N)]); if (p) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
      ctx.stroke();
      K.plot(ctx, g, s.map(function (val, k) { return [k / 40, val]; }), LC.orange, { w: 2.8, light: true });
      ctx.restore();
      K.t(ctx, "평균하는 구간 " + win + "일", g.X(5), g.T + 14, { s: 11.5, w: "900", a: "center", c: LC.orange });
      /* 오른쪽: 관측소 미니어처 + 판정 카드 */
      var RX = LW + 12;
      zCard(ctx, RX, W - RX, H, "관측소 백엽상에서 잰 10년", [
        ["평균 기간", win + "일", LC.orange, Math.min(1, win / 1095)],
        ["변동 폭 σ", d.toFixed(2) + " ℃", d < 0.5 ? LC.green : LC.blue, Math.min(1, d / rawSd)]
      ], [d < 0.5 ? "계절 변화까지 지워짐" : (win < 300 ? "여름·겨울 물결이 남음" : "계절의 흔적이 남음"), d < 0.5 ? true : null], null, 196);
      zStation(ctx, RX + 124, 104, 0.66);
      K.t(ctx, "기후 = 30년 평균 (약 10,950일)", RX + 18, 290, { s: 11, w: "800", c: LC.mute });
      return d;
    }
    function update() {
      var d = draw();
      rd("avg-read", kv("평균 기간", win + "일", "y", win === 1 ? "하루하루의 기온 그대로 = 날씨" : "약 " + (win / 365).toFixed(2) + "년 · 기후는 30년(약 10,950일)") +
        kv("변동 폭 σ", d.toFixed(2) + " ℃", d < 0.5 ? "g" : "b", "매일 기온 그대로면 약 " + rawSd.toFixed(1) + " ℃") +
        okp(d < 0.5, d < 0.5 ? "계절 변화까지 지워져 거의 평평합니다" : (win < 300 ? "여름·겨울의 큰 물결이 남아 있습니다" : "아직 계절의 흔적이 남아 있습니다")));
      $("avg-info").innerHTML = win === 1
        ? "평균 기간 <b>1일</b> — 매일의 기온 그대로, 곧 <b>날씨</b>입니다. 변동 폭이 약 <b>" + rawSd.toFixed(1) + " ℃</b>로 큽니다."
        : "평균 기간 <b>" + win + "일</b> — 변동 폭 <b>" + d.toFixed(2) + " ℃</b>. " + (win < 300 ? "짧은 변동은 사라졌지만 여름·겨울의 큰 물결(계절 변화)은 남아 있습니다." : (d < 0.5 ? "계절 변화까지 지워져 거의 평평합니다. 실제 기후는 이보다 훨씬 긴 <b>30년(약 10,950일)</b> 평균을 씁니다." : "1년의 배수에서 조금 벗어나면 계절의 흔적이 다시 나타납니다."));
      var ch = false;
      if (win === 1 && !got.a) { got.a = ch = true; }
      if (win <= 400 && d < 0.5 && !got.b) { got.b = ch = true; got.w = win; }
      if (ch) { window.sthState("avgGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.b) done("m1-2b");
      if (got.a && got.b) { window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>약 <b>1년(" + (got.w || 365) + "일)</b>을 평균하면 계절 변화까지 지워집니다. 날씨는 날마다 크게 변하지만, 여러 해를 평균한 <b>기후</b>는 거의 변하지 않는 기준값이 됩니다."); ep.clear(1); }
    }
    canvas._redraw = draw;
    $("avg-w").addEventListener("input", function (e) { win = +e.target.value; $("avg-w-val").textContent = win + "일"; update(); });
    update(); mission();
  })();

  /* 장면 3 — 기후요소 · 기후인자 */
  window.sthSort({
    mount: "s1-sort",
    buckets: [
      { id: "e", label: "기후요소", sub: "기후를 나타내는 물리량" },
      { id: "f", label: "기후인자", sub: "기후요소에 영향을 주는 요인" }
    ],
    items: [
      { t: "🌡️ 기온", a: "e", why: "기후를 나타내는 대표적인 물리량입니다." },
      { t: "🌧️ 강수량", a: "e", why: "기후요소입니다." },
      { t: "💧 습도", a: "e", why: "기후요소입니다." },
      { t: "🧭 풍향", a: "e", why: "바람의 방향도 기후요소입니다." },
      { t: "🌬️ 풍속", a: "e", why: "기후요소입니다." },
      { t: "🌐 위도", a: "f", why: "위도가 낮을수록 햇빛을 많이 받아 기온이 높습니다." },
      { t: "🗺️ 수륙 분포(바다와 가까운 정도)", a: "f", why: "바다는 천천히 데워지고 식어 연교차를 줄입니다." },
      { t: "⛰️ 고도", a: "f", why: "높이 올라갈수록 기온이 낮아집니다." },
      { t: "🏔️ 지형(산맥)", a: "f", why: "산맥은 바람과 비구름을 막아 강수량을 바꿉니다." },
      { t: "🌊 해류", a: "f", why: "난류·한류는 연안의 기온을 바꿉니다.", hint: "해류는 기온을 ‘바꾸는’ 쪽일까요, 기온 ‘그 자체’일까요?" }
    ],
    onDone: function () { window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>기후요소 5개, 기후인자 5개. 콘월과 하바롭스크는 위도가 비슷하니, 다른 기후인자를 살펴야 합니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m1-3", true);

  /* 장면 4 — 기후 만들기 (아이소메트릭 블록 모형: 바다 → 해안 → 내륙, 1월 모습 + 월평균 기온 그래프) */
  (function () {
    var canvas = $("c-clim"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var lat = 50, cont = 50, cur = "none", got = window.sthState("climGot") || { a: false, b: false };
    var CUR = { warm: 6, none: 0, cold: -3 }, CN = { warm: "난류", none: "해류 없음", cold: "한류" };
    function clim() {
      var c = cont / 100, Tm = 30 - 0.5 * lat + CUR[cur] - 3 * c, A = 1.5 + 0.42 * lat * (0.15 + 0.85 * c);
      return { jan: Tm - A, jul: Tm + A, rng: 2 * A, mean: Tm };
    }
    var ph = 0, mo = motion("cl-play");
    /* ── 아이소메트릭 블록 모형: x = 서쪽 바다 → 해안 → 동쪽 내륙, y = 북(뒤) → 남(앞), 1월(겨울) 모습 ── */
    var DH = 450;                                         /* 모형 칸 높이(아래는 월평균 기온 그래프) */
    var I = K.iso({ ox: 360, oy: 95, s: 0.84, L: 620, D: 200 });
    var L = I.L, D = I.D, SL = 42, CY = 104;              /* SL 해수면 높이(그림 단위), CY 도시가 놓인 줄 */
    function climAt(c) {                                  /* clim() 과 같은 식 — c 는 내륙 쪽 비율(0~1) */
      var Tm = 30 - 0.5 * lat + CUR[cur] - 3 * c, A = 1.5 + 0.42 * lat * (0.15 + 0.85 * c);
      return { jan: Tm - A, jul: Tm + A, rng: 2 * A, mean: Tm };
    }
    function coastX(y) { return 168 + 16 * Math.sin(y / 37) + 9 * Math.sin(y / 13 + 1); }
    var XC = coastX(CY), SPAN = L - XC - 70;
    function cAt(x) { return clamp((x - XC - 22) / SPAN, 0, 1); }
    function cityX() { return XC + 22 + cont / 100 * SPAN; }
    function zOf(x, y) {
      var d = x - coastX(y);
      if (d < 0) return SL - 5 - Math.min(32, -d * 0.3) + 1.5 * Math.sin(x / 23) * Math.cos(y / 19);
      return SL + 2 + Math.min(1, d / 14) * (3 + d * 0.035 + 7 * Math.max(0, Math.sin(x / 52 + 0.6)) * (0.6 + 0.4 * Math.cos(y / 41)));
    }
    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function rgb(c, f) { f = f || 1; return "rgb(" + Math.round(clamp(c[0] * f, 0, 255)) + "," + Math.round(clamp(c[1] * f, 0, 255)) + "," + Math.round(clamp(c[2] * f, 0, 255)) + ")"; }
    var JAN = [], NJ = 40;                                /* 그릴 때마다 내륙 쪽 1월 기온을 미리 계산 */
    function janAt(x) { return JAN[Math.round(cAt(x) * NJ)]; }
    function landCol(x, y, z, light) {
      var d = x - coastX(y), base;
      if (d < 0) return rgb(mix([150, 128, 96], [96, 84, 70], clamp((SL - z) / 38, 0, 1)), light);   /* 해저 */
      var tj = janAt(x);
      if (d < 9) base = [216, 194, 142];                                                            /* 바닷가 모래 */
      else base = tj >= 4 ? [96, 168, 80] : (z > SL + 18 ? [104, 132, 74] : [120, 150, 82]);
      var snow = clamp(-tj / 16, 0, .92);
      if (snow > 0) base = mix(base, [238, 244, 250], snow);
      return rgb(base, light);
    }
    function faceZ(side) { return function (u) { return side === "front" ? zOf(u, D) : zOf(L, u); }; }
    function palm(x, y, z, sc) {
      var p = I.P(x, y, z), k; sc = sc || 1;
      ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(p.x + 4 * sc, p.y + 1, 7 * sc, 2.4 * sc, 0, 0, 6.283); ctx.fill();
      var tx = p.x + 4 * sc, ty = p.y - 22 * sc;
      ctx.strokeStyle = "#7a5a36"; ctx.lineWidth = 2.4 * sc; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(p.x - 1 * sc, p.y - 12 * sc, tx, ty); ctx.stroke();
      ctx.strokeStyle = "#2f7d32"; ctx.lineWidth = 2.6 * sc;
      for (k = 0; k < 7; k++) {
        var a = -Math.PI / 2 + (k - 3) * 0.55, ex = tx + Math.cos(a) * 11 * sc, ey = ty + Math.sin(a) * 6 * sc + 6 * sc;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * 7 * sc, ty + Math.sin(a) * 9 * sc - 2 * sc, ex, ey); ctx.stroke();
      }
      ctx.lineCap = "butt";
    }
    function snowCap(x, y, z, sc) {
      var p = I.P(x, y, z); sc = sc || 1;
      ctx.fillStyle = "rgba(250,252,255,.95)"; ctx.beginPath(); ctx.moveTo(p.x, p.y - 30 * sc); ctx.lineTo(p.x + 4.5 * sc, p.y - 24 * sc); ctx.lineTo(p.x - 4.5 * sc, p.y - 24 * sc); ctx.closePath(); ctx.fill();
    }
    var TREES = (function () {
      var R = K.rng(41), out = [], i;
      [[24, 30], [40, 150], [30, 182], [58, 60], [22, 128]].forEach(function (q) { out.push([coastX(q[1]) + q[0], q[1], 0.95]); });   /* 바닷가 줄 */
      for (i = 0; i < 80 && out.length < 31; i++) {
        var x = 190 + R() * (L - 205), y = 8 + R() * (D - 16);
        if (x - coastX(y) < 14) continue;
        out.push([x, y, 0.8 + R() * 0.3]);
      }
      return out;
    })();
    function chev(x, y, dir, col) {
      var a = I.P(x - 8, y + dir * 9, SL), b = I.P(x, y, SL), c = I.P(x + 8, y + dir * 9, SL);
      ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.stroke();
      ctx.lineCap = "butt"; ctx.lineJoin = "miter";
    }
    function drawModel(r) {
      var k, i, box = [0, W];
      for (k = 0; k <= NJ; k++) JAN[k] = climAt(k / NJ).jan;
      var seaJan = JAN[0], seaIce = seaJan <= -8;         /* 바닷가 1월이 아주 추우면 연안에 얼음이 낀다 */
      K.studio(ctx, 0, 0, W, DH, { x: I.P(L, D, 0).x - 160, y: I.P(L, D, 0).y - 24, rx: 330, ry: 52 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      var WC = cur === "warm" ? [64, 158, 206] : (cur === "cold" ? [36, 104, 196] : [52, 138, 214]);
      I.field(ctx, zOf, landCol, 62, 20, function (c, x0, y0, x1, y1, zMax, zMin) {
        if (SL > zMin + 0.2) {
          var a = I.P(x0, y0, SL), b = I.P(x1, y0, SL), cc = I.P(x1, y1, SL), d = I.P(x0, y1, SL);
          var depth = SL - zMin, col = mix(mix([120, 205, 215], WC, clamp(depth / 8, 0, 1)), [12, 52, 112], clamp((depth - 8) / 40, 0, .55));
          var iced = seaIce && x1 > coastX((y0 + y1) / 2) - 40 * clamp((-seaJan - 8) / 10, .35, 1);
          if (iced) col = [226, 238, 248];
          c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.lineTo(cc.x, cc.y); c.lineTo(d.x, d.y); c.closePath();
          c.fillStyle = rgb(col); c.fill(); c.strokeStyle = c.fillStyle; c.lineWidth = .8; c.stroke();
        }
      });
      /* 앞면·오른쪽 면: 땅속 단면 */
      ["front", "right"].forEach(function (side) {
        var zf = faceZ(side);
        I.face(ctx, side, function (Lw) {
          I.profile(ctx, side, zf, 0);
          var g = ctx.createLinearGradient(0, 0, 0, 100); g.addColorStop(0, "#5b4d40"); g.addColorStop(.6, "#8a7258"); g.addColorStop(1, "#a88a62");
          ctx.fillStyle = g; ctx.fill();
          ctx.save(); I.profile(ctx, side, zf, 0); ctx.clip();
          var R = K.rng(side === "front" ? 53 : 59);
          for (var q = 0; q < Lw * 1.4; q++) { ctx.fillStyle = R() > .5 ? "rgba(255,255,255,.16)" : "rgba(40,28,18,.25)"; ctx.fillRect(R() * Lw, R() * 100, 1.6, 1.6); }
          ctx.strokeStyle = "rgba(50,35,20,.25)"; ctx.lineWidth = 1;
          for (var y2 = 14; y2 < 100; y2 += 14) { ctx.beginPath(); ctx.moveTo(0, y2); ctx.lineTo(Lw, y2 + 2); ctx.stroke(); }
          ctx.restore();
        });
      });
      var WT = cur === "warm" ? "rgba(255,140,90,.62)" : (cur === "cold" ? "rgba(120,205,255,.62)" : "rgba(70,160,230,.55)");
      I.water(ctx, SL, function (u, side) { return faceZ(side)(u); }, { surface: false, top: WT, deep: "rgba(12,50,120,.8)" });
      I.shade(ctx, "front", function (u) { return Math.max(zOf(u, D), SL); });
      I.shade(ctx, "right", function (u) { return Math.max(zOf(L, u), SL); });
      I.edges(ctx, zOf(L, D), zOf(L, D));
      /* 해류: 난류는 북쪽(뒤)으로, 한류는 남쪽(앞)으로 */
      if (cur !== "none") {
        var up = cur === "warm", dir = up ? 1 : -1, ccol = up ? "rgba(255,150,95," : "rgba(150,225,255,";
        [42, 86, 128].forEach(function (lx, ln) {
          for (k = 0; k < 6; k++) {
            var yy = ((k * 40 + ln * 13 - dir * ph * 0.03) % (D + 40) + D + 40) % (D + 40) - 20;
            if (yy < 8 || yy > D - 14 || lx > coastX(yy) - 12) continue;
            chev(lx, yy, dir, ccol + (0.7 + 0.25 * (ln % 2)).toFixed(2) + ")");
          }
        });
      }
      /* 나무와 도시: 먼 것부터 */
      var cx = cityX(), items = [];
      TREES.forEach(function (t) { if (Math.abs(t[0] - cx) < 34 && Math.abs(t[1] - CY) < 34) return; items.push({ k: "t", x: t[0], y: t[1], s: t[2] }); });
      [[-16, -14, "#c0553f"], [6, -18, "#3f6fb5"], [-8, 6, "#d08a2e"], [12, 2, "#c0553f"]].forEach(function (h) { items.push({ k: "h", x: cx + h[0], y: CY + h[1], c: h[2] }); });
      items.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); });
      items.forEach(function (it) {
        var z = zOf(it.x, it.y);
        if (it.k === "h") { I.house(ctx, it.x, it.y, zOf(it.x + 7, it.y + 6), 14, 12, 11, it.c); return; }
        var tj = janAt(it.x);
        if (tj >= 4) palm(it.x, it.y, z, it.s);
        else { I.tree(ctx, it.x, it.y, z, it.s); if (tj < 0) snowCap(it.x, it.y, z, it.s); }
      });
      /* 해안에서 도시까지 */
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.6; ctx.beginPath();
      for (i = 0; i <= 20; i++) { var xx = XC + (cx - XC) * i / 20, pp = I.P(xx, CY + 22, zOf(xx, CY + 22) + 1.5); if (i) ctx.lineTo(pp.x, pp.y); else ctx.moveTo(pp.x, pp.y); }
      ctx.stroke(); ctx.restore();
      ctx.restore();
      /* 이름표 */
      var palmOk = r.jan >= 4 && r.rng <= 14, harsh = r.jan <= -15;
      var cz = zOf(cx, CY) + 22, cc2 = palmOk ? "#b6f5c2" : (harsh ? "#cfe6ff" : "#fff4d6");
      I.label(ctx, cx, CY, cz, "가상 도시 · 1월 " + r.jan.toFixed(1) + " ℃", I.P(cx, CY, 0).x > 560 ? -34 : 34, -62, cc2, box);
      var mp = I.P((XC + cx) / 2, CY + 22, zOf((XC + cx) / 2, CY + 22) + 2);
      if (cont > 0) K.pill(ctx, "해안에서 내륙 쪽 " + cont + "%", mp.x - 6, cont >= 60 ? mp.y + 26 : mp.y - 12, { a: "center", s: 11, c: "#ffffff", box: box });
      else K.pill(ctx, "해안 바로 옆", mp.x - 6, mp.y + 26, { a: "center", s: 11, c: "#ffffff", box: box });
      I.label(ctx, 70, 150, SL, "바다", -40, 30, "#bfe6ff", box);
      if (cur !== "none") I.label(ctx, 86, 46, SL, cur === "warm" ? "난류 ↑ 남쪽에서 올라온 따뜻한 물" : "한류 ↓ 북쪽에서 내려온 찬 물", 70, -46, cur === "warm" ? "#ffc39a" : "#bfe6ff", box);
      if (seaIce) I.label(ctx, coastX(D - 24) - 14, D - 24, SL, "연안 바다가 언다", -12, 70, "#e8f4ff", box);
      if (JAN[NJ] < 0 && JAN[0] >= 0) {
        var sx = XC + 22; for (k = 0; k <= NJ; k++) if (JAN[k] < 0) { sx = XC + 22 + k / NJ * SPAN; break; }
        I.label(ctx, sx, D, zOf(sx, D), "여기부터 1월 영하", 26, 78, "#e8f4ff", box);
      }
      /* 큰 글자 */
      var LT = lat === 0 ? "적도" : "북위 " + lat + "°";
      if (palmOk) { K.bigText(ctx, LT + "에 야자수가 자란다", 22, 46, 25, "#ffd35a"); K.bigText(ctx, "1월 " + r.jan.toFixed(1) + " ℃ · 연교차 " + r.rng.toFixed(1) + " ℃", 22, 78, 17, "#ffffff"); }
      else if (harsh) { K.bigText(ctx, "영하 " + Math.abs(r.jan).toFixed(1) + " ℃의 겨울", 22, 46, 25, "#bfe6ff"); K.bigText(ctx, (cont >= 60 ? "바다에서 먼 내륙" : (cur === "cold" ? "찬 해류가 흐르는 바닷가" : "위도가 높은 바닷가")) + " · 연교차 " + r.rng.toFixed(1) + " ℃", 22, 78, 17, "#ffffff"); }
      else { K.bigText(ctx, LT + "의 가상 도시", 22, 46, 25, "#ffffff"); K.bigText(ctx, "1월 " + r.jan.toFixed(1) + " ℃ · 연교차 " + r.rng.toFixed(1) + " ℃", 22, 78, 17, "#ffd35a"); }
      K.warn(ctx, W - 14, 30, "⚠ 높이는 과장, 거리는 줄임 · 1월의 모습", "right");
    }
    function drawChart(r) {
      var y0 = DH + 8, h = H - y0;
      K.stage(ctx, 0, y0, W, h, "lab", { seed: 9 });
      K.pill(ctx, "가상 도시의 월평균 기온", 14, y0 + 24, { s: 12.5, c: KC.blue });
      var MN = ["1월", "4월", "7월", "10월", "1월"];
      var g = K.chart(ctx, { x: 4, y: y0 + 30, w: W - 8, h: h - 34, x0: 0, x1: 12, y0: -30, y1: 40, xt: 4, yt: 7, yl: "기온(℃)", xf: function (vv) { return MN[Math.round(vv / 3)]; } });
      var pts = [];
      for (var m = 0; m <= 12.001; m += 0.25) pts.push([m, r.mean - (r.rng / 2) * Math.cos(2 * Math.PI * m / 12)]);
      clipRect(ctx, g);
      var z0 = clamp((g.Y(0) - g.T) / (g.B - g.T), 0, 1), fg = ctx.createLinearGradient(0, g.T, 0, g.B);
      fg.addColorStop(0, "rgba(255,140,90,.38)"); fg.addColorStop(z0, "rgba(255,140,90,.05)"); fg.addColorStop(z0, "rgba(127,211,255,.05)"); fg.addColorStop(1, "rgba(127,211,255,.38)");
      ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); pts.forEach(function (q) { ctx.lineTo(g.X(q[0]), g.Y(q[1])); }); ctx.lineTo(g.X(12), g.Y(0)); ctx.closePath(); ctx.fillStyle = fg; ctx.fill();
      ctx.strokeStyle = "rgba(127,211,255,.55)"; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(g.L, g.Y(0)); ctx.lineTo(g.R, g.Y(0)); ctx.stroke(); ctx.setLineDash([]);
      K.plot(ctx, g, pts, KC.orange, { w: 3 });
      ctx.restore();
      var jx = g.X(0), jy = g.Y(r.jan), ux = g.X(6), uy = g.Y(r.jul), bxr = g.X(10.6);
      K.glow(ctx, jx, jy, 4, "rgba(127,211,255,.95)", 4); K.glow(ctx, g.X(12), jy, 4, "rgba(127,211,255,.95)", 4);
      K.glow(ctx, ux, uy, 4, "rgba(255,170,120,.95)", 4);
      K.pill(ctx, "7월 " + r.jul.toFixed(1) + " ℃", ux, clamp(uy - 14, g.T + 16, g.B - 8), { a: "center", s: 11.5, c: KC.orange });
      K.pill(ctx, "1월 " + r.jan.toFixed(1) + " ℃", jx + 10, clamp(jy + 26, g.T + 16, g.B - 8), { s: 11.5, c: KC.blue });
      ctx.strokeStyle = KC.violet; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bxr - 6, jy); ctx.lineTo(bxr, jy); ctx.lineTo(bxr, uy); ctx.lineTo(bxr - 6, uy); ctx.stroke();
      K.pill(ctx, "연교차 " + r.rng.toFixed(1) + " ℃", bxr - 10, clamp((jy + uy) / 2 + 5, g.T + 16, g.B - 8), { a: "right", s: 11.5, c: KC.violet });
    }
    function draw() {
      var r = clim();
      ctx.clearRect(0, 0, W, H);
      drawModel(r);
      drawChart(r);
      return r;
    }
    function update() {
      var r = draw(), inLat = lat >= 45 && lat <= 55, ch = false;
      var palm = r.jan >= 4 && r.rng <= 14, harsh = r.jan <= -15;
      rd("cl-read", kv("1월 평균", r.jan.toFixed(1) + " ℃", r.jan < 0 ? "b" : "y") + kv("7월 평균", r.jul.toFixed(1) + " ℃", "r") +
        kv("연교차", r.rng.toFixed(1) + " ℃", "g", (lat === 0 ? "적도 0°" : "북위 " + lat + "°") + " · " + CN[cur] + " · 내륙 쪽 " + cont + "%") +
        (palm ? okp(true, "🌴 야자나무가 겨울을 날 만함") : (harsh ? okp(false, "❄️ 혹독한 겨울") : "")));
      $("cl-info").innerHTML = "바다는 육지보다 천천히 데워지고 천천히 식어 겨울을 덜 춥게, 여름을 덜 덥게 만듭니다. 난류는 연안을 데우고 한류는 식힙니다. " + (inLat ? "" : "<b>미션은 북위 45~55°에서 판정합니다.</b>");
      if (inLat && r.jan >= 4 && r.rng <= 14 && !got.a) { got.a = ch = true; got.ta = CN[cur] + ", 해안에서 " + cont + "%"; }
      if (inLat && r.jan <= -15 && r.rng >= 35 && !got.b) { got.b = ch = true; got.tb = CN[cur] + ", 해안에서 " + cont + "%"; }
      if (ch) { window.sthState("climGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-4a"); if (got.b) done("m1-4b");
      if (got.a && got.b) {
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>콘월형: " + got.ta + " / 하바롭스크형: " + got.tb + ". 같은 위도에서도 <b>해류와 수륙 분포</b>에 따라 겨울 기온이 20 ℃ 넘게 달라집니다.");
        window.sthState("climBest", "콘월형 " + got.ta + " · 하바롭스크형 " + got.tb);
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("cl-lat").addEventListener("input", function (e) { lat = +e.target.value; $("cl-lat-val").textContent = (lat === 0 ? "적도 0°" : "북위 " + lat + "°"); update(); });
    $("cl-cont").addEventListener("input", function (e) { cont = +e.target.value; $("cl-cont-val").textContent = cont === 0 ? "해안 0%" : "내륙 쪽 " + cont + "%"; update(); });
    $("cl-cont-val").textContent = "내륙 쪽 50%";
    segWire("cl-cur", function (x) { cur = x; update(); });
    K.animate(canvas, function (dt) { if (mo.on && cur !== "none") { ph += dt; draw(); } });
    update(); mission();
  })();

  /* 장면 5 — 결말 */
  function finish() { window.sthState("r1", "해결 · " + (window.sthState("climBest") || "기후인자로 두 도시 재현")); }
  function vs() {
    var p = window.sthState("p1") || "";
    $("e1-vs").innerHTML = "<b>나의 첫 추리</b> " + (p || "기록 없음") + "<br>" +
      (p.indexOf("㉢") === 0 ? "처음부터 정확했습니다. 이제 평균 기온 자료와 모형으로 증거까지 갖췄습니다." : "하루의 날씨나 위도만으로는 설명되지 않았습니다. 30년 평균(기후)과 기후인자를 함께 봐야 합니다.");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[기후변화와 환경생태 Ⅰ] 이야기 ① 콘월의 야자수",
    items: [
      { id: "w1", label: "날씨와 기후를 가르는 것", hint: "두 말의 차이를 시간 규모로 설명하고, 각각의 예를 하나씩 드세요." },
      { id: "e1b", label: "서윤이에게 보내는 답장", hint: "콘월에 야자나무가 자라는 까닭을 ‘기후인자’라는 말과 해류·수륙 분포를 넣어 두세 문장으로 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 녹는 얼음, 짙어지는 구름
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "p2", title: "연구원의 첫 가설",
    question: "북극이 지구 평균보다 훨씬 빠르게 더워지는 까닭으로 가장 그럴듯한 것은?",
    options: ["㉠ 북극에 공장이 많아 이산화 탄소를 많이 내뿜어서", "㉡ 얼음이 녹으면 햇빛을 더 흡수하게 되어 더 녹는 고리가 생겨서", "㉢ 북극이 태양과 더 가까워져서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 반사율 */
  (function () {
    var canvas = $("c-ice"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var A = 10, TOT = 14, got = window.sthState("iceGot") || { a: false, b: false, q: false };
    function absorb(a) { return (a * 0.4 + (TOT - a) * 0.94) / TOT; }
    var mo = motion("ice-play"), PH = [], spawn = 0, RP = K.rng(17);
    /* 북극해 블록: 윗면 = 해빙과 드러난 바다, 앞·오른쪽 면 = 바닷물 단면 */
    var IA = K.iso({ ox: 236, oy: 120, s: 0.8, L: 300, D: 190 }), ZS = 64, SUN = { x: 504, y: 44 }, offA = null, offK = null;
    function fieldV(u, v) { return 0.74 * (u / IA.L) + 0.26 * (v / IA.D) + 0.05 * Math.sin(u / 17 + v / 23) + 0.035 * Math.sin(u / 7 - v / 11); }
    function iceAt(u, v) { return fieldV(u, v) < A / TOT * 1.02 - 0.01; }
    function base() {
      var key = Math.round(A * 10), c = canvas;
      if (offA && offK === key && offA.width === c.width) return offA;
      var off = offA || document.createElement("canvas"), dpr = c.width / W; off.width = c.width; off.height = c.height;
      var o = off.getContext("2d"); o.setTransform(dpr, 0, 0, dpr, 0, 0); o.clearRect(0, 0, W, H);
      var fc = IA.P(IA.L / 2, IA.D / 2, 0);
      K.studio(o, 0, 0, 560, H, { x: fc.x + 10, y: fc.y + 36, rx: 250, ry: 44 });
      var ab = absorb(A);
      ["front", "right"].forEach(function (sd, k) {
        IA.face(o, sd, function (Lw) {
          var wg = o.createLinearGradient(0, ZS, 0, 0); wg.addColorStop(0, k ? "#1f6fb0" : "#2a84c6"); wg.addColorStop(1, k ? "#082a52" : "#0b3566");
          o.fillStyle = wg; o.fillRect(0, 10, Lw, ZS - 10);
          o.fillStyle = "rgba(255,140,80," + (Math.max(0, ab - .4) * .5).toFixed(3) + ")"; o.fillRect(0, ZS - 16, Lw, 16);
          o.fillStyle = k ? "#5d5146" : "#6e6052"; o.fillRect(0, 0, Lw, 10);
          var R0 = K.rng(3 + k); o.fillStyle = "rgba(255,255,255,.18)"; for (var q = 0; q < 40; q++) o.fillRect(R0() * Lw, R0() * 9, 1.6, 1.6);
          /* 물 위에 뜨는 얇은 해빙 단면 */
          var u, st = 3;
          for (u = 0; u < Lw; u += st) { var on = sd === "front" ? iceAt(u + 1, IA.D - 1) : iceAt(IA.L - 1, u + 1); if (on) { o.fillStyle = "#e9f4fb"; o.fillRect(u, ZS - 2.5, st + .4, 5.5); } }
        });
      });
      IA.shade(o, "right", function () { return ZS; });
      IA.field(o, function (x, y) { return iceAt(x, y) ? ZS + 3 : ZS; }, function (x, y, z, lt) {
        return z > ZS + 1 ? K.tint("#eef6fb", Math.min(1.08, lt)) : K.tint("#155a92", .95 + .08 * Math.sin(x / 13 + y / 9));
      }, 44, 28);
      IA.edges(o, ZS, ZS);
      offA = off; offK = key; return off;
    }
    function step(dt) {
      spawn += dt;
      while (spawn > 70) {
        spawn -= 70;
        var tu = 8 + RP() * (IA.L - 16), tv = 8 + RP() * (IA.D - 16), tp = IA.P(tu, tv, ZS + 3);
        PH.push({ x: SUN.x + (RP() - .5) * 16, y: SUN.y + (RP() - .5) * 16, tx: tp.x, ty: tp.y, ice: iceAt(tu, tv), st: 0, t: 0 });
      }
      PH.forEach(function (p) {
        p.t += dt;
        if (p.st === 0) {
          var dx = p.tx - p.x, dy = p.ty - p.y, d = Math.sqrt(dx * dx + dy * dy), sp = 0.24 * dt;
          if (d <= sp) { p.x = p.tx; p.y = p.ty; p.t = 0; p.st = RP() < (p.ice ? 0.6 : 0.06) ? 1 : 2; p.vx = (SUN.x - p.x) / 1100 + (RP() - .3) * .06; p.vy = -0.16 - RP() * .05; }
          else { p.x += dx / d * sp; p.y += dy / d * sp; }
        } else if (p.st === 1) { p.x += p.vx * dt; p.y += p.vy * dt; }
        else { p.y += 0.012 * dt; }
      });
      PH = PH.filter(function (p) { return p.st === 0 || (p.st === 1 && p.t < 900) || (p.st === 2 && p.t < 700); });
    }
    function draw() {
      var ab = absorb(A), full = absorb(TOT), fi = A / TOT;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 북극해 블록 모형 + 햇빛 알갱이 ── */
      var LW = 560;
      ctx.drawImage(base(), 0, 0, W, H);
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      K.sun(ctx, SUN.x, SUN.y, 11);
      PH.forEach(function (p) {
        if (p.st === 0) K.planet(ctx, p.x, p.y, 2.4, "#ffd43b", "#c77d00");
        else if (p.st === 1) { ctx.globalAlpha = Math.max(0, 1 - p.t / 900); K.planet(ctx, p.x, p.y, 2.4, "#ffffff", "#74c0fc"); ctx.globalAlpha = 1; }
        else { ctx.globalAlpha = Math.max(0, 1 - p.t / 700); K.glow(ctx, p.x, p.y, 2 + p.t / 160, "rgba(255,120,70,.7)", 2.4); ctx.globalAlpha = 1; }
      });
      ctx.restore();
      var BX = [0, LW];
      if (fi > 0.08) IA.label(ctx, 40, 24, ZS + 3, "해빙 · 반사율 약 60%", 70, -26, "#e8ecff", BX);
      if (fi < 0.9) IA.label(ctx, 270, 150, ZS, "드러난 바다 · 약 6%", 40, 40, "#bfe6ff", BX);
      IA.label(ctx, 0, IA.D, 34, "바닷물 단면", -30, 30, "#bfe6ff", BX);
      K.bigText(ctx, "흡수 " + Math.round(ab * 100) + " / 100", 16, 38, 24, ab > .75 ? "#ff9a7a" : "#ffffff");
      K.bigText(ctx, "해빙 " + Math.round(A * 100).toLocaleString() + "만 km²", 16, 62, 15, "#ffd35a");
      K.warn(ctx, LW - 12, H - 12, "⚠ 얼음 두께·바다 깊이는 과장", "right");
      /* ── 오른쪽: 햇빛 100이 가는 곳 ── */
      var RX = LW + 12;
      zCard(ctx, RX, W - RX, H, "햇빛 100은 어디로 갈까", [
        ["표면 얼음 비율", Math.round(fi * 100) + " %", LC.blue, fi],
        ["반사 → 우주로", Math.round((1 - ab) * 100) + "", LC.teal, 1 - ab],
        ["흡수 → 바다를 데움", Math.round(ab * 100) + "", LC.orange, ab]
      ], ["모두 얼음이면 흡수 " + Math.round(full * 100) + " → 지금 ×" + (ab / full).toFixed(2), ab / full > 1.3 ? false : null], ["흡수 " + Math.round(ab * 100), ab > .75 ? LC.red : LC.orange]);
      return ab;
    }
    function update() {
      var ab = draw(), ch = false, full = absorb(TOT);
      rd("ice-read", kv("해빙 면적", Math.round(A * 100).toLocaleString() + "만 km²", "b") +
        kv("흡수 · 반사", Math.round(ab * 100) + " · " + Math.round((1 - ab) * 100), "y", "햇빛 100 가운데") +
        kv("모두 얼음일 때보다", "× " + (ab / full).toFixed(2) + "배 흡수", "r", "반사율: 해빙 약 60% · 바닷물 약 6%"));
      $("ice-info").innerHTML = "해빙 " + A.toFixed(1) + "백만 km² → 흡수 <b>" + Math.round(ab * 100) + "</b>. 얼음이 줄수록 드러난 어두운 바다가 햇빛을 더 흡수하고, 그 열은 바다와 남은 얼음을 데웁니다.";
      if (A >= 6.9 && A <= 7.1 && !got.a) { got.a = ch = true; }
      if (A >= 3.3 && A <= 3.5 && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("iceGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.b) done("m2-2b"); if (got.q) done("m2-2c");
      if (got.a && got.b && got.q) { window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>1979년 흡수 " + Math.round(absorb(7) * 100) + " → 2012년 " + Math.round(absorb(3.4) * 100) + ". 얼음이 반으로 줄자 북극해가 흡수하는 햇빛이 약 <b>" + Math.round((absorb(3.4) / absorb(7) - 1) * 100) + "%</b> 늘었습니다."); ep.clear(1); }
    }
    canvas._redraw = draw;
    $("ice-a").addEventListener("input", function (e) { A = +e.target.value; $("ice-a-val").textContent = Math.round(A * 100).toLocaleString() + "만 km²"; update(); });
    window.sthPick({
      mount: "s2-q1",
      q: "해빙이 녹아 흡수량이 늘면, 그다음에는 무슨 일이 일어날까요?",
      options: ["바다가 더 데워져 얼음이 더 녹고, 흡수량이 또 늘어난다", "흡수량이 늘면 곧바로 얼음이 다시 언다", "해빙 면적은 기온과 관계없다"],
      answer: 0,
      why: ["결과(흡수 증가)가 원인(기온 상승·얼음 감소)을 다시 키우는 <b>양의 되먹임</b>입니다.", "더 많이 흡수하면 더 따뜻해집니다. 얼음이 다시 얼 까닭이 없습니다.", "막대가 움직이는 것을 보았지요? 얼음 면적이 흡수량을 바꾸고, 흡수량이 기온을 바꿉니다."],
      onDone: function () { got.q = true; window.sthState("iceGot", got); mission(); }
    });
    K.animate(canvas, function (dt) { if (mo.on) { step(dt); draw(); } });
    update(); mission();
  })();

  /* 장면 3 — 되먹임 조립대 */
  (function () {
    var canvas = $("c-fb"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var LOOPS = [
      { id: "wv", t: "💧 수증기 증가", g: 0.30 },
      { id: "ice", t: "🧊 해빙-반사율", g: 0.15 },
      { id: "pf", t: "🟫 영구 동토층 메테인", g: 0.05 },
      { id: "cl", t: "☁️ 낮은 구름 반사", g: -0.10 },
      { id: "pl", t: "🌿 식물 광합성", g: -0.05 }
    ];
    var on = {}, got = window.sthState("fbGot") || { a: false, b: false, s: false };
    var ctrl = $("fb-ctrl");
    LOOPS.forEach(function (L) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "btn"; b.style.margin = "4px";
      b.innerHTML = L.t + " <b>" + (L.g > 0 ? "+" : "−") + Math.abs(L.g).toFixed(2) + "</b>";
      b.addEventListener("click", function () { on[L.id] = !on[L.id]; b.classList.toggle("primary", !!on[L.id]); update(); });
      ctrl.appendChild(b);
    });
    function gain() { var g = 0; LOOPS.forEach(function (L) { if (on[L.id]) g += L.g; }); return g; }
    var mo = motion("fb-play"), ang = 0;
    function draw() {
      var g = gain(), rounds = [], add = 1, tot = 0, k;
      for (k = 0; k < 8; k++) { tot += add; rounds.push(tot); add *= g; }
      var fin = 1 / (1 - g);
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 스튜디오 바닥 위에 누운 입체 고리(도는 구슬 = 되먹임이 한 바퀴 도는 것) ── */
      var LW = 330, cx = 165, cy = 196, R = 112, RY = 52;
      var col = g > 0 ? LC.red : (g < 0 ? LC.blue : "#8a96a8"), c2 = g > 0 ? ["#ff8787", "#a61e1e"] : (g < 0 ? ["#74c0fc", "#1864ab"] : ["#ced4da", "#6b7280"]);
      K.studio(ctx, 0, 0, LW, H, { x: cx, y: cy + 24, rx: R + 30, ry: RY + 14 });
      function ringPt(a, z) { return { x: cx + R * Math.cos(a), y: cy + RY * Math.sin(a) - (z || 0) }; }
      function ringBand(a0, a1, front) {
        ctx.beginPath(); for (k = 0; k <= 40; k++) { var a = a0 + (a1 - a0) * k / 40, p = ringPt(a, 14); if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
        for (k = 40; k >= 0; k--) { var a3 = a0 + (a1 - a0) * k / 40, q = ringPt(a3, 0); ctx.lineTo(q.x, q.y); }
        ctx.closePath(); var gg = ctx.createLinearGradient(0, cy - RY - 14, 0, cy + RY); gg.addColorStop(0, front ? c2[0] : K.tint(c2[0].length === 7 ? c2[0] : "#cccccc", .8)); gg.addColorStop(1, c2[1]); ctx.fillStyle = gg; ctx.fill();
      }
      ringBand(Math.PI, 2 * Math.PI, false);
      ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy - 14, R, RY, 0, 0, 6.2832); ctx.stroke();
      var n = g === 0 ? 0 : Math.round(5 + Math.abs(g) * 30), balls = [];
      for (k = 0; k < n; k++) { var a2 = ang + k / n * 6.2832; balls.push([a2, ringPt(a2, 20)]); }
      balls.filter(function (b) { return Math.sin(b[0]) < 0; }).forEach(function (b) { K.planet(ctx, b[1].x, b[1].y, 4.2, c2[0], c2[1]); });
      ringBand(0, Math.PI, true);
      balls.filter(function (b) { return Math.sin(b[0]) >= 0; }).forEach(function (b) { K.planet(ctx, b[1].x, b[1].y, 4.6, c2[0], c2[1]); });
      for (k = 0; k < 4; k++) { var aa = k * Math.PI / 2 + Math.PI / 4, p0 = ringPt(aa - .14, 16), p1 = ringPt(aa + .14, 16); K.arrow(ctx, p0, p1, "#ffffff", 2.6, 10); }
      K.arrow(ctx, { x: 26, y: 92 }, { x: cx - 64, y: cy - RY - 2 }, LC.yellow, 3, 11);
      K.bigText(ctx, "g = " + (g >= 0 ? "+" : "−") + Math.abs(g).toFixed(2), 16, 38, 24, g > 0 ? "#ff9a7a" : (g < 0 ? "#8fd0ff" : "#ffffff"));
      K.bigText(ctx, "처음 +1 ℃ · CO₂", 16, 76, 14, "#ffd35a");
      K.t(ctx, g > 0 ? "키우는 고리 (양의 되먹임)" : (g < 0 ? "누르는 고리 (음의 되먹임)" : "켠 고리 없음"), cx, cy - 6, { s: 12.5, w: "900", a: "center", c: g ? col : LC.mute });
      K.t(ctx, "한 바퀴마다 앞 변화 × g", cx, cy + 12, { s: 11, w: "700", a: "center", c: LC.mute });
      K.t(ctx, "🌡 기온 상승", cx, cy - RY - 22, { s: 12, w: "900", a: "center", c: "#b7791f" });
      /* ── 오른쪽: 밝은 그래프 — 바퀴마다 쌓이는 기온 상승(입체 막대) ── */
      var RX = LW + 10;
      K.studio(ctx, RX, 0, W - RX, H, null);
      K.t(ctx, "바퀴마다 쌓이는 기온 상승", RX + 16, 26, { s: 12.5, w: "800", c: LC.mute });
      K.t(ctx, "┄ 처음 1 ℃", RX + 196, 26, { s: 11, w: "800", c: "#b7791f" });
      K.t(ctx, "┄ 수렴 " + fin.toFixed(2) + " ℃", RX + 270, 26, { s: 11, w: "800", c: LC.violet });
      K.tip(ctx, "최종 약 " + fin.toFixed(2) + " ℃" + (fin >= 1.9 ? " · 거의 2배" : (fin < 0.999 ? " · 더 작아짐" : "")), W - 214, 8, 200, fin >= 1.9 || fin < 0.999 ? true : null);
      var gc = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 10, h: H - 48, pl: 46, pb: 28, pt: 10, pr: 14, x0: 0, x1: 8, y0: 0, y1: 2, xt: 8, yt: 4, light: true, xf: function () { return ""; }, yf: function (vv) { return vv.toFixed(1) + "℃"; } });
      var bw = (gc.X(1) - gc.X(0)) * .5, dep = 9, c0 = g > 0 ? ["#ff8787", "#e03131", "#a61e1e"] : (g < 0 ? ["#74c0fc", "#1c7ed6", "#1864ab"] : ["#dee2e6", "#adb5bd", "#868e96"]);
      rounds.forEach(function (t, i) {
        var bx = gc.X(i + .5) - bw / 2, top = gc.Y(Math.min(t, 2));
        ctx.fillStyle = c0[1]; ctx.fillRect(bx, top, bw, gc.B - top);
        ctx.fillStyle = c0[2]; ctx.beginPath(); ctx.moveTo(bx + bw, top); ctx.lineTo(bx + bw + dep, top - dep * .6); ctx.lineTo(bx + bw + dep, gc.B - dep * .6); ctx.lineTo(bx + bw, gc.B); ctx.closePath(); ctx.fill();
        ctx.fillStyle = c0[0]; ctx.beginPath(); ctx.moveTo(bx, top); ctx.lineTo(bx + dep, top - dep * .6); ctx.lineTo(bx + bw + dep, top - dep * .6); ctx.lineTo(bx + bw, top); ctx.closePath(); ctx.fill();
        K.t(ctx, t.toFixed(2), gc.X(i + .5) + 4, top - 10, { s: 11, w: "900", a: "center", c: LC.ink });
        K.t(ctx, i === 0 ? "처음" : i + "바퀴", gc.X(i + .5), gc.B + 16, { s: 10.5, w: "700", a: "center", c: LC.mute });
      });
      ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]);
      ctx.strokeStyle = LC.yellow; ctx.beginPath(); ctx.moveTo(gc.L, gc.Y(1)); ctx.lineTo(gc.R, gc.Y(1)); ctx.stroke();
      ctx.strokeStyle = LC.violet; ctx.beginPath(); ctx.moveTo(gc.L, gc.Y(Math.min(2, fin))); ctx.lineTo(gc.R, gc.Y(Math.min(2, fin))); ctx.stroke();
      ctx.setLineDash([]);
      return { g: g, fin: fin };
    }
    function update() {
      var r = draw(), ch = false;
      rd("fb-read", kv("합친 되먹임 g", (r.g >= 0 ? "+" : "−") + Math.abs(r.g).toFixed(2), r.g > 0 ? "r" : (r.g < 0 ? "b" : "y"), "꺼진 고리는 0") +
        kv("최종 기온 상승", r.fin.toFixed(2) + " ℃", r.fin >= 1.9 ? "r" : (r.fin < 1 ? "b" : "y"), "= 처음 1 ℃ ÷ (1 − g)") +
        (r.fin >= 1.9 ? okp(true, "처음 1 ℃가 거의 2배로 커졌습니다") : (r.fin < 0.999 ? okp(true, "처음 1 ℃보다 작게 누그러졌습니다") : "")));
      var names = LOOPS.filter(function (L) { return on[L.id]; }).map(function (L) { return L.t.replace(/^\S+\s/, ""); });
      $("fb-info").innerHTML = (names.length ? "켠 고리: " + names.join(", ") + " → 합친 되먹임 <b>" + (r.g >= 0 ? "+" : "") + r.g.toFixed(2) + "</b>, 최종 기온 상승 <b>" + r.fin.toFixed(2) + " ℃</b>. " : "아직 켠 고리가 없습니다. 처음 1 ℃가 그대로입니다. ") +
        (r.g > 0 ? "결과가 원인을 키우는 <b>양의 되먹임</b> — 바퀴마다 덧붙는 양은 줄지만 합은 처음보다 커집니다." : (r.g < 0 ? "결과가 원인을 누르는 <b>음의 되먹임</b> — 변화가 처음보다 작아집니다." : ""));
      if (r.fin >= 1.9 && !got.a) { got.a = ch = true; }
      if (r.fin < 0.999 && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("fbGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-3a"); if (got.b) done("m2-3b");
      if (got.a && got.b) window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>양의 되먹임만 모으면 처음 변화가 2배가 되고, 음의 되먹임은 변화를 줄입니다.");
      if (got.s) window.sthMission("m2-3c", true, "<span class='m-tag'>미션 완료</span>초기 원인을 <b>강화</b>하면 양의 되먹임, <b>약화</b>하면 음의 되먹임입니다.");
      if (got.a && got.b && got.s) ep.clear(2);
    }
    canvas._redraw = draw;
    window.sthSort({
      mount: "s2-sort",
      buckets: [{ id: "p", label: "양의 되먹임", sub: "처음 원인을 강화" }, { id: "n", label: "음의 되먹임", sub: "처음 원인을 약화" }],
      items: [
        { t: "기온이 올라 수증기(온실 기체)가 늘고, 그 수증기가 지구 복사를 더 흡수해 기온이 더 오른다", a: "p", why: "기온 상승이 기온 상승을 부릅니다." },
        { t: "기온이 올라 구름이 늘고, 늘어난 구름이 햇빛을 더 반사해 기온 상승이 누그러진다", a: "n", why: "결과가 처음 원인(기온 상승)을 약화합니다. 기온을 처음보다 더 낮추는 것이 아니라 오름을 줄이는 것입니다." },
        { t: "영구 동토층이 녹으며 메테인이 나와 온실 효과가 커지고 기온이 더 오른다", a: "p", why: "메테인도 온실 기체입니다." },
        { t: "해빙이 녹아 어두운 바다가 드러나 햇빛 흡수가 늘고 얼음이 더 빨리 녹는다", a: "p", why: "방금 반사율 실험에서 본 고리입니다." },
        { t: "기온이 올라 산불이 잦아지고, 산불 연기 속 에어로졸이 햇빛을 반사해 기온 상승을 누그러뜨린다", a: "n", why: "에어로졸의 반사가 처음 원인(기온 상승)을 약화합니다. 다만 산불이 내는 이산화 탄소는 반대로 기온을 더 올리는 쪽(양의 되먹임)으로 작용해, 실제 산불의 효과는 두 고리를 함께 따져야 합니다.", hint: "산불 자체가 아니라, 연기 속 에어로졸이 무엇을 하는지 보세요." },
        { t: "기온이 오르고 이산화 탄소가 늘자 식물의 광합성이 활발해져 이산화 탄소를 더 흡수한다", a: "n", why: "온실 기체를 줄여 처음 원인을 약화합니다." }
      ],
      onDone: function () { got.s = true; window.sthState("fbGot", got); mission(); }
    });
    K.animate(canvas, function (dt) { var g = gain(); if (mo.on && g !== 0) { ang += dt * (0.0006 + Math.abs(g) * 0.004); draw(); } });
    update(); mission();
  })();

  /* 장면 4 — 권역 간 상호작용 */
  window.sthSort({
    mount: "s2-sph",
    buckets: [
      { id: "a", label: "생물권 ↔ 기권", sub: "대기" },
      { id: "h", label: "생물권 ↔ 수권", sub: "바다·강·지하수" },
      { id: "g", label: "생물권 ↔ 지권", sub: "암석·토양" }
    ],
    items: [
      { t: "숲의 식물이 광합성으로 대기 중 이산화 탄소를 흡수한다", a: "a", why: "생물권이 기권의 기체 조성을 바꿉니다." },
      { t: "식물의 증산 작용으로 대기에 수증기가 공급된다", a: "a", why: "잎에서 나간 수증기는 기권으로 갑니다.", hint: "수증기는 어느 권역에 들어갈까요?" },
      { t: "동물의 호흡과 생물의 분해로 이산화 탄소가 대기로 나간다", a: "a", why: "생물권 → 기권입니다." },
      { t: "바다의 식물 플랑크톤이 바닷물에 녹은 이산화 탄소를 흡수한다", a: "h", why: "수권에 녹아 있는 탄소를 생물이 흡수합니다." },
      { t: "산호와 조개가 바닷물 속 성분으로 탄산 칼슘 껍데기를 만든다", a: "h", why: "바닷물의 물질이 생물의 몸이 됩니다." },
      { t: "비료가 강으로 흘러가 녹조가 번성한다", a: "h", why: "수권의 영양 상태가 생물을 바꿉니다." },
      { t: "식물의 뿌리와 미생물이 암석을 부수고 토양을 만든다", a: "g", why: "생물에 의한 풍화 작용입니다." },
      { t: "바다 생물의 껍데기가 쌓여 석회암이 된다", a: "g", why: "생물권의 탄소가 지권에 오래 저장됩니다.", hint: "쌓여서 굳은 다음에는 어느 권역에 속할까요?" }
    ],
    onDone: function () { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>생물권은 기권·수권·지권과 에너지와 물질을 주고받으며 기후시스템의 되먹임에 참여합니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m2-4", true);

  function finish() { window.sthState("r2", "해결 · 해빙-반사율 양의 되먹임으로 북극 온난화 설명"); }
  function vs() {
    var p = window.sthState("p2") || "";
    $("e2-vs").innerHTML = "<b>나의 첫 가설</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 반사율 실험이 가설을 뒷받침했습니다." : " — 반사율 실험으로 보았듯 열쇠는 얼음과 바다의 반사율 차이였습니다.");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[기후변화와 환경생태 Ⅰ] 이야기 ② 녹는 얼음, 짙어지는 구름",
    items: [
      { id: "w2", label: "되먹임 고리 하나", hint: "양의 되먹임 또는 음의 되먹임 하나를 골라, 무엇이 무엇을 강화하거나 약화하는지 순서대로 쓰세요.", ph: "① … → ② … → ③ … → 다시 ①" },
      { id: "e2b", label: "생물권이 끼어든 되먹임", hint: "생물권이 들어간 되먹임 고리 하나를 쓰고, 생물권이 어느 권역과 무엇을 주고받는지 밝히세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 실잠자리가 북쪽으로 온 까닭
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "p3", title: "기자의 첫 추측",
    question: "남부 지방에 살던 실잠자리가 경기도에서 발견되기 시작한 까닭은?",
    options: ["㉠ 누군가 일부러 풀어놓아서", "㉡ 기온이 올라 살 수 있는 범위가 북쪽으로 넓어져서", "㉢ 경기도의 연못이 더 깨끗해져서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 서식 한계선 */
  (function () {
    var canvas = $("c-map"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var dT = 0, TH = 14.6, G = 0.8;
    function T(lat, d) { return 16.2 - G * (lat - 33.5) + d; }
    function limit(d) { return 33.5 + (16.2 + d - TH) / G; }
    /* 이름, 위도, 경도, 이름표 방향 */
    var PLACES = [["제주", 33.5, 126.53, "r"], ["부산", 35.1, 129.07, "r"], ["광주", 35.2, 126.85, "l"], ["대전", 36.35, 127.38, "r"], ["서울·경기", 37.5, 127.0, "l"], ["춘천", 37.9, 127.73, "r"], ["휴전선 부근", 38.3, 127.5, "r"]];
    /* 한반도 해안선(단순화) [경도, 위도] */
    var KOR = [[124.4, 40.2], [124.9, 39.6], [125.4, 39.4], [125.2, 38.9], [125.0, 38.3], [125.6, 38.0], [126.1, 37.75], [126.6, 37.45], [126.85, 37.0], [126.35, 36.8], [126.55, 36.3], [126.7, 35.95], [126.45, 35.45], [126.35, 34.8], [126.5, 34.35], [127.0, 34.55], [127.4, 34.5], [127.75, 34.75], [128.4, 34.85], [128.75, 35.05], [129.1, 35.1], [129.4, 35.5], [129.55, 36.05], [129.45, 36.8], [129.1, 37.55], [128.6, 38.2], [128.35, 38.6], [127.5, 39.15], [127.6, 39.6], [128.4, 40.0], [129.0, 40.6]];
    function Y(lat) { return 350 - (lat - 33) / 6 * 300; }
    function X(lon) { return 58 + (lon - 124.4) * 42; }
    function land() {
      ctx.beginPath();
      KOR.forEach(function (p, i) { if (i) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); });
      ctx.lineTo(X(129.0), -20); ctx.lineTo(X(124.4), -20); ctx.closePath();
      ctx.moveTo(X(126.95), Y(33.38)); ctx.ellipse(X(126.55), Y(33.38), 17, 6.5, -0.12, 0, 6.2832);
    }
    function dfly(x, y) {
      ctx.save(); ctx.fillStyle = "rgba(220,245,255,.55)";
      [[-0.35, -1], [0.35, -1], [-0.2, 1], [0.2, 1]].forEach(function (w) { ctx.beginPath(); ctx.ellipse(x + 2 + w[0] * 10, y + w[1] * 5, 10, 2.6, w[0] * (w[1] < 0 ? -1 : 1) * 0.9, 0, 6.2832); ctx.fill(); });
      var bg = ctx.createLinearGradient(x - 16, 0, x + 14, 0); bg.addColorStop(0, "#2f9bd6"); bg.addColorStop(1, "#3fd3a3");
      ctx.strokeStyle = bg; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 18, y + 1); ctx.lineTo(x + 10, y); ctx.stroke();
      ctx.fillStyle = "#3fd3a3"; ctx.beginPath(); ctx.arc(x + 12, y, 3, 0, 6.2832); ctx.fill(); ctx.restore();
    }
    /* 비스듬히 내려다본 입체 지도: 바다 판 위에 두께 TK 로 솟은 한반도 블록 */
    var TK = 12, MX0 = 12, MY0 = 46;
    function MXp(lon, lat) { return MX0 + 40 + (lon - 124.4) * 46 + (lat - 33) * 6; }
    function MYp(lat) { return MY0 + (39.6 - lat) / 6.6 * 250; }
    function landPath(dz) {
      ctx.beginPath();
      KOR.forEach(function (p, i) { var x = MXp(p[0], p[1]), y = MYp(p[1]) + dz; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ctx.lineTo(MXp(129.0, 40.6), MY0 - 30 + dz); ctx.lineTo(MXp(124.4, 40.2), MY0 - 30 + dz); ctx.closePath();
    }
    function jeju(dz) { ctx.beginPath(); ctx.ellipse(MXp(126.55, 33.38), MYp(33.38) + dz, 20, 7, -0.1, 0, 6.2832); }
    function draw() {
      var L = limit(dT), la;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 입체 한반도 블록 ── */
      var LW = 430;
      K.studio(ctx, 0, 0, LW, H, { x: 220, y: H - 34, rx: 200, ry: 26 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      /* 바다 판(앞면 두께) */
      var sx0 = 24, sx1 = LW - 18, sy0 = MY0 - 26, sy1 = H - 46;
      ctx.fillStyle = "#1d5f99"; ctx.fillRect(sx0, sy1, sx1 - sx0, 14);
      var sg = ctx.createLinearGradient(0, sy0, 0, sy1); sg.addColorStop(0, "#7cc4ef"); sg.addColorStop(1, "#3d93d1");
      ctx.fillStyle = sg; ctx.fillRect(sx0, sy0, sx1 - sx0, sy1 - sy0);
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      for (la = 34; la <= 39; la++) { ctx.beginPath(); ctx.moveTo(sx0, MYp(la)); ctx.lineTo(sx1, MYp(la)); ctx.stroke(); }
      ctx.setLineDash([]);
      /* 땅 옆면(아래로 두께) → 윗면 */
      ctx.fillStyle = "#6b4f32"; landPath(TK); ctx.fill(); jeju(TK); ctx.fill();
      for (var dz = TK; dz > 0; dz -= 2) { ctx.fillStyle = dz > TK * .5 ? "#7d5d3b" : "#9a7650"; landPath(dz); ctx.fill(); jeju(dz); ctx.fill(); }
      ctx.save(); landPath(0); ctx.clip();
      var yl = MYp(clamp(L, 33, 39.6));
      var tg = ctx.createLinearGradient(0, MY0 - 30, 0, H); tg.addColorStop(0, "#a9b98a"); tg.addColorStop(1, "#8fae6c");
      ctx.fillStyle = tg; ctx.fillRect(0, 0, LW, H);
      var hg = ctx.createLinearGradient(0, yl, 0, H); hg.addColorStop(0, "#5fd39c"); hg.addColorStop(1, "#2f9e6a");
      ctx.fillStyle = hg; ctx.fillRect(0, yl, LW, H - yl);
      var Rm = K.rng(4); for (var q = 0; q < 26; q++) { var mx = 60 + Rm() * 300, my = MY0 + Rm() * 200; ctx.fillStyle = "rgba(60,70,40,.18)"; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + 9, my - 10); ctx.lineTo(mx + 18, my); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      ctx.fillStyle = clamp(L, 33, 39.6) > 33.38 ? "#4fc28c" : "#a9b98a"; jeju(0); ctx.fill();
      landPath(0); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1.4; ctx.stroke();
      /* 한계선 = 붉은 반투명 칸막 */
      var cg = ctx.createLinearGradient(0, yl - 34, 0, yl); cg.addColorStop(0, "rgba(224,49,49,0)"); cg.addColorStop(1, "rgba(224,49,49,.38)");
      ctx.fillStyle = cg; ctx.fillRect(sx0, yl - 34, sx1 - sx0, 34);
      ctx.strokeStyle = "#e03131"; ctx.lineWidth = 2.6; ctx.setLineDash([9, 6]); ctx.beginPath(); ctx.moveTo(sx0, yl); ctx.lineTo(sx1, yl); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      for (la = 34; la <= 39; la++) K.t(ctx, la + "°N", LW - 22, MYp(la) - 4, { s: 10, w: "800", a: "right", c: "rgba(255,255,255,.9)" });
      dfly(LW - 64, yl - 18);
      K.pill(ctx, "한계선 북위 " + L.toFixed(2) + "°", 30, yl + 22, { s: 11.5, c: "#ffc9c9", box: [0, LW] });
      PLACES.forEach(function (p) {
        var ok = p[1] <= L, x = MXp(p[2], p[1]), y = MYp(p[1]);
        K.line(ctx, { x: x, y: y }, { x: x, y: y - 14 }, "#495057", 1.6);
        K.planet(ctx, x, y - 16, 4.4, ok ? "#69db7c" : "#ced4da", ok ? "#2b8a3e" : "#6b7280");
        K.pill(ctx, p[0] + " " + T(p[1], dT).toFixed(1) + " ℃", p[3] === "l" ? x - 10 : x + 10, y - 12, { a: p[3] === "l" ? "right" : "left", s: 11, c: ok ? "#c3f5dc" : "#e8ecff", box: [0, LW - 44] });
      });
      K.bigText(ctx, "+" + dT.toFixed(1) + " ℃", LW - 16, 38, 24, "#ffffff", "right");
      K.warn(ctx, LW - 12, H - 12, "⚠ 해안선은 단순화한 모양", "right");
      /* ── 오른쪽: 밝은 그래프 — 위도에 따른 연평균 기온 ── */
      var RX = LW + 10;
      K.studio(ctx, RX, 0, W - RX, H, null);
      K.t(ctx, "위도에 따른 연평균 기온", RX + 16, 26, { s: 12.5, w: "800", c: LC.mute });
      var km = Math.round((L - limit(0)) * 111);
      K.tip(ctx, L >= 38 ? "북위 38°를 넘었습니다" : (L >= 37.5 ? "경기도(37.5°)에 닿음 · 약 " + km + " km 북상" : "북쪽으로 약 " + km + " km"), W - 252, 8, 238, L >= 37.5 && L < 38 ? true : (L >= 38 ? false : null));
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 10, h: H - 48, pl: 44, pb: 30, pt: 10, pr: 14, x0: 33, x1: 39, y0: 10, y1: 20, xt: 6, yt: 5, light: true, xl: "위도(°N)", xf: function (vv) { return vv + "°"; }, yf: function (vv) { return vv + "℃"; } });
      clipRect(ctx, g);
      if (L > 33) { ctx.fillStyle = "rgba(15,159,118,.10)"; ctx.fillRect(g.L, g.T, Math.min(g.X(L), g.R) - g.L, g.B - g.T); }
      ctx.strokeStyle = LC.green; ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(g.L, g.Y(TH)); ctx.lineTo(g.R, g.Y(TH)); ctx.stroke(); ctx.setLineDash([]);
      K.plot(ctx, g, [[33, T(33, 0)], [39, T(39, 0)]], "#8a96a8", { w: 1.6, dash: [5, 5], glow: false });
      K.plot(ctx, g, [[33, T(33, dT)], [39, T(39, dT)]], LC.orange, { w: 3, light: true });
      ctx.restore();
      K.t(ctx, "실잠자리 월동 기준 " + TH + " ℃", g.R - 6, g.Y(TH) + 16, { s: 11, w: "800", a: "right", c: LC.green });
      K.t(ctx, "┄ 지금(평년)   ━ +" + dT.toFixed(1) + " ℃", g.L + 8, g.T + 14, { s: 11, w: "800", c: LC.orange });
      if (L >= 33 && L <= 39) {
        var lx = g.X(L);
        ctx.strokeStyle = "rgba(224,49,49,.8)"; ctx.lineWidth = 1.4; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(lx, g.Y(TH)); ctx.lineTo(lx, g.B); ctx.stroke(); ctx.setLineDash([]);
        K.planet(ctx, lx, g.Y(TH), 5, "#ff8787", "#a61e1e");
        K.t(ctx, "북위 " + L.toFixed(2) + "°", Math.min(lx + 8, g.R - 80), g.B - 10, { s: 11.5, w: "900", c: LC.red });
      }
      return L;
    }
    function update() {
      var L = draw(), km = Math.round((L - limit(0)) * 111);
      rd("map-read", kv("기온 상승", "+" + dT.toFixed(1) + " ℃", "y") + kv("서식 한계선", "북위 " + L.toFixed(2) + "°", "g", "연평균 기온 " + TH + " ℃ 선") +
        kv("북쪽으로 옮겨 간 거리", "약 " + km + " km", "b", "위도 1° ≈ 111 km") +
        (L >= 38 ? okp(false, "북위 38°를 넘었습니다") : (L >= 37.5 ? okp(true, "경기도(북위 37.5°)에 닿았습니다") : "")));
      $("map-info").innerHTML = "위도 1°마다 약 0.8 ℃ 낮아지므로, 전체 기온이 0.8 ℃ 오르면 같은 기온의 선이 북쪽으로 약 1° (약 111 km) 옮겨 갑니다. 지금 한계선은 <b>북위 " + L.toFixed(2) + "°</b>입니다.";
      if (L >= 37.5 && L < 38 && !ep.cleared(1)) {
        window.sthState("mapBest", "+" + dT.toFixed(1) + " ℃ → 한계선 북위 " + L.toFixed(2) + "°");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>기온이 <b>+" + dT.toFixed(1) + " ℃</b> 오르면 한계선이 경기도까지 올라옵니다. 실제로 우리나라 연평균 기온은 1912~2020년에 약 <b>1.6 ℃</b> 올랐습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("map-t").addEventListener("input", function (e) { dT = +e.target.value; $("map-t-val").textContent = "+" + dT.toFixed(1) + " ℃"; update(); });
    update();
    if (ep.cleared(1)) window.sthMission("m3-2", true);
  })();

  /* 장면 3 — 여섯 분야 */
  window.sthSort({
    mount: "s3-sort",
    buckets: [
      { id: "l", label: "🦋 육상 생태계" }, { id: "m", label: "🐧 해양 생태계" }, { id: "w", label: "🐸 담수 생태계" },
      { id: "f", label: "🌾 식량과 농업" }, { id: "h", label: "🏠 주거 환경" }, { id: "p", label: "🏥 건강과 보건" }
    ],
    items: [
      { t: "푸른아시아실잠자리가 2019년 이후 경기도에서도 발견된다", a: "l", why: "육상 곤충의 서식지 북상입니다.", hint: "잠자리는 알과 애벌레 시기를 물에서 보내지만, 여기서는 어른벌레의 서식지 이동을 다룹니다." },
      { t: "붉은가슴울새 등 철새가 기존 서식지에서 북쪽으로 약 500 km 옮겨 갔다", a: "l", why: "육상 생물의 분포 변화입니다." },
      { t: "2022년 남극 바다 얼음이 급격히 줄어 새끼 황제펭귄 약 1만 마리가 목숨을 잃었다", a: "m", why: "바다 얼음에 기대어 사는 해양 생태계의 피해입니다." },
      { t: "바닷물 온도가 올라 산호가 하얗게 변하는 백화 현상이 늘었다", a: "m", why: "해양 생태계의 피해입니다." },
      { t: "기온이 올라 두꺼비의 산란 시기가 빨라졌다", a: "w", why: "민물에 알을 낳는 생물의 생물 계절 변화입니다." },
      { t: "섬진강 인근에 사는 종의 분포가 달라지고 있다", a: "w", why: "강·하천 생태계의 변화입니다." },
      { t: "2023년 인도에서 폭우와 폭염이 번갈아 나타나 토마토 가격이 두 달 만에 4배로 뛰었다", a: "f", why: "농작물 생산과 가격에 미친 영향입니다." },
      { t: "2020년 소말리아에 많은 비가 내려 메뚜기 떼가 발생하고 농작물이 큰 피해를 입었다", a: "f", why: "식량과 농업의 피해입니다.", hint: "메뚜기는 곤충이지만 이 제보에서 피해를 본 것은 무엇인가요?" },
      { t: "2020년 7월 대전에 폭우가 집중되어 주택과 도로가 물에 잠겼다", a: "h", why: "짧은 시간 많은 비가 내리는 돌발 홍수로 인한 주거 피해입니다." },
      { t: "짧은 시간에 많은 비가 내리는 ‘돌발 홍수’가 늘어 도시 침수가 잦아졌다", a: "h", why: "주거 환경의 변화입니다." },
      { t: "폭염으로 온열 질환자가 늘고 사망률이 높아진다", a: "p", why: "건강과 보건 분야입니다." },
      { t: "질병을 옮기는 곤충의 서식지가 넓어져 곤충 매개 감염병이 퍼진다", a: "p", why: "모기 등 매개 곤충의 서식지 확대입니다.", hint: "곤충의 서식지가 넓어진 ‘결과’ 무엇이 문제인가요?" }
    ],
    onDone: function () { window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>기후변화의 영향은 생태계를 넘어 먹거리, 집, 건강까지 이어집니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m3-3", true);

  /* 장면 4 — 해상 도시 */
  (function () {
    var canvas = $("c-city"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var s = 10, f = 10, q = !!window.sthState("cityQ");
    function calc() { var h = 100 - s - f; return { pow: s * 100 / 30, food: f * 3, people: Math.max(0, h) * 300, h: h }; }
    function hexPath(cx, cy, R) { ctx.beginPath(); for (var k = 0; k < 6; k++) { var a = k * Math.PI / 3; if (k) ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); else ctx.moveTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); } ctx.closePath(); }
    function wedge(cx, cy, R, a0, a1) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); }
    function texture(kind, cx, cy, R) {
      var k, x, y;
      if (kind === "s") {
        var sg = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R); sg.addColorStop(0, "#26407e"); sg.addColorStop(.5, "#13244f"); sg.addColorStop(1, "#1d3772");
        ctx.fillStyle = sg; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        ctx.strokeStyle = "rgba(150,190,255,.35)"; ctx.lineWidth = 1;
        for (x = cx - R; x < cx + R; x += 13) { ctx.beginPath(); ctx.moveTo(x, cy - R); ctx.lineTo(x, cy + R); ctx.stroke(); }
        for (y = cy - R; y < cy + R; y += 9) { ctx.beginPath(); ctx.moveTo(cx - R, y); ctx.lineTo(cx + R, y); ctx.stroke(); }
        var gl = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R); gl.addColorStop(.35, "rgba(255,255,255,0)"); gl.addColorStop(.5, "rgba(255,255,255,.18)"); gl.addColorStop(.65, "rgba(255,255,255,0)");
        ctx.fillStyle = gl; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      } else if (kind === "f") {
        var fg = ctx.createLinearGradient(0, cy - R, 0, cy + R); fg.addColorStop(0, "#4b9a3e"); fg.addColorStop(1, "#2a6a2c");
        ctx.fillStyle = fg; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        ctx.strokeStyle = "rgba(185,240,140,.45)"; ctx.lineWidth = 2.2;
        for (k = -2 * R; k < 2 * R; k += 10) { ctx.beginPath(); ctx.moveTo(cx + k, cy - R); ctx.lineTo(cx + k + R, cy + R); ctx.stroke(); }
      } else {
        ctx.fillStyle = "#4c4a63"; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        var RR = K.rng(31);
        for (y = cy - R; y < cy + R; y += 16) for (x = cx - R + (Math.round((y - cy) / 16) % 2) * 8; x < cx + R; x += 17) {
          var rg = ctx.createLinearGradient(x, y, x + 12, y + 11), h = RR();
          rg.addColorStop(0, h > .5 ? "#e98a5e" : "#d9c7a5"); rg.addColorStop(1, h > .5 ? "#a4482c" : "#9a8a6e");
          ctx.fillStyle = rg; ctx.fillRect(x, y, 12, 11);
        }
      }
    }
    /* 바다 블록 위에 떠 있는 육각형 모듈(아이소메트릭) */
    var IY = K.iso({ ox: 214, oy: 92, s: 0.78, L: 290, D: 210 }), ZW = 46, ZP = 56, HC = { x: 150, y: 108 }, HR = 92;
    function hx(a, r) { return { x: HC.x + (r || HR) * Math.cos(a), y: HC.y + (r || HR) * Math.sin(a) }; }
    function drawIso() {
      var r = calc(), k, LW = 440;
      var fc = IY.P(IY.L / 2, IY.D / 2, 0);
      K.studio(ctx, 0, 0, LW, H, { x: fc.x + 6, y: fc.y + 30, rx: 220, ry: 40 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      ["front", "right"].forEach(function (sd, j) { IY.face(ctx, sd, function (Lw) { var wg = ctx.createLinearGradient(0, ZW, 0, 0); wg.addColorStop(0, j ? "#1f6fb0" : "#2a84c6"); wg.addColorStop(1, j ? "#0a2d57" : "#0d3b70"); ctx.fillStyle = wg; ctx.fillRect(0, 8, Lw, ZW - 8); ctx.fillStyle = j ? "#7a6a4e" : "#8d7b5a"; ctx.fillRect(0, 0, Lw, 8); }); });
      IY.shade(ctx, "right", function () { return ZW; });
      IY.plane(ctx, ZW, "#4aa3dc", "rgba(255,255,255,.6)");
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1;
      for (k = 0; k < 14; k++) { var wx = (k * 53) % 280, wy = (k * 37) % 200, a1 = IY.P(wx, wy, ZW), a2 = IY.P(wx + 16, wy, ZW); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.quadraticCurveTo((a1.x + a2.x) / 2, a1.y - 3, a2.x, a2.y); ctx.stroke(); }
      /* 계류줄: 모듈 꼭짓점 → 바닥 닻 */
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1.4;
      [[0, 280, 160], [2, 40, 200], [4, 70, 10], [5, 250, 20]].forEach(function (m) { var v0 = hx(m[0] * Math.PI / 3), p0 = IY.P(v0.x, v0.y, ZW), p1 = IY.P(m[1], m[2], ZW); ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); K.planet(ctx, p1.x, p1.y, 3, "#ffd43b", "#a36b00"); });
      ctx.setLineDash([]);
      /* 육각 떠받침 옆면(보이는 면만) */
      for (k = 0; k < 6; k++) {
        var aa = k * Math.PI / 3, bb = (k + 1) * Math.PI / 3, mid = (aa + bb) / 2, nx = Math.cos(mid), ny = Math.sin(mid);
        if (nx + ny <= 0) continue;
        var v1 = hx(aa), v2 = hx(bb);
        IY.quad(ctx, IY.P(v1.x, v1.y, ZW - 4), IY.P(v2.x, v2.y, ZW - 4), IY.P(v2.x, v2.y, ZP), IY.P(v1.x, v1.y, ZP), nx > ny ? "#9aa3b0" : "#c3cad6", "rgba(255,255,255,.5)");
      }
      /* 윗면 부채꼴 구역 */
      function topHex() { ctx.beginPath(); for (var q = 0; q < 6; q++) { var v = hx(q * Math.PI / 3), p = IY.P(v.x, v.y, ZP); if (q) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); } ctx.closePath(); }
      topHex(); ctx.fillStyle = "#e3e7ee"; ctx.fill();
      var a0 = -Math.PI / 2, parts = [[s, "s"], [f, "f"], [Math.max(0, r.h), "h"]], spots = [];
      ctx.save(); topHex(); ctx.clip();
      parts.forEach(function (p) {
        if (p[0] <= 0) return;
        var a1 = a0 + Math.min(p[0], 100) / 100 * Math.PI * 2, n = 18, q;
        ctx.beginPath(); var c0 = IY.P(HC.x, HC.y, ZP); ctx.moveTo(c0.x, c0.y);
        for (q = 0; q <= n; q++) { var e = hx(a0 + (a1 - a0) * q / n, HR * 1.3), pe = IY.P(e.x, e.y, ZP); ctx.lineTo(pe.x, pe.y); }
        ctx.closePath();
        ctx.fillStyle = p[1] === "s" ? "#2f5fb3" : (p[1] === "f" ? "#5fae46" : "#c9c2b4"); ctx.fill();
        ctx.save(); ctx.clip();
        ctx.strokeStyle = p[1] === "s" ? "rgba(190,215,255,.55)" : (p[1] === "f" ? "rgba(220,255,180,.6)" : "rgba(255,255,255,.4)"); ctx.lineWidth = 1;
        for (q = -100; q <= 100; q += p[1] === "s" ? 10 : 8) { var l1 = IY.P(HC.x + q, HC.y - 100, ZP), l2 = IY.P(HC.x + q, HC.y + 100, ZP); ctx.beginPath(); ctx.moveTo(l1.x, l1.y); ctx.lineTo(l2.x, l2.y); ctx.stroke(); }
        if (p[1] === "s") for (q = -100; q <= 100; q += 14) { var m1 = IY.P(HC.x - 100, HC.y + q, ZP), m2 = IY.P(HC.x + 100, HC.y + q, ZP); ctx.beginPath(); ctx.moveTo(m1.x, m1.y); ctx.lineTo(m2.x, m2.y); ctx.stroke(); }
        ctx.restore();
        var b0 = IY.P(HC.x, HC.y, ZP), b1 = hx(a0, HR), pb = IY.P(b1.x, b1.y, ZP); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(b0.x, b0.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        if (p[0] >= 6) { var am = (a0 + a1) / 2, lp = hx(am, HR * .58); spots.push([p[1], lp, p[0], a0, a1]); }
        a0 = a1;
      });
      ctx.restore();
      /* 주거 구역의 집들 */
      var hz = spots.filter(function (q) { return q[0] === "h"; })[0];
      if (hz) {
        var hs = [], Rh = K.rng(7), tries = 0, want = Math.round(hz[2] / 6);
        while (hs.length < want && tries < 400) { tries++; var ang2 = hz[3] + Rh() * (hz[4] - hz[3]), rr = HR * (.25 + Rh() * .6), pt = hx(ang2, rr); if (hs.every(function (o) { return Math.abs(o.x - pt.x) + Math.abs(o.y - pt.y) > 22; })) hs.push(pt); }
        hs.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); }).forEach(function (pt) { IY.house(ctx, pt.x - 6, pt.y - 5, ZP, 12, 10, 9, "#d9480f"); });
      }
      var fz = spots.filter(function (q) { return q[0] === "f"; })[0];
      if (fz) for (k = 0; k < Math.round(fz[2] / 8); k++) { var fa = fz[3] + (k + .5) / Math.round(fz[2] / 8) * (fz[4] - fz[3]), fp = hx(fa, HR * .7); IY.tree(ctx, fp.x, fp.y, ZP, .7); }
      ctx.restore();
      var BX = [0, LW];
      spots.forEach(function (q) { var nm = q[0] === "s" ? "☀️ 태양광 " + s + "%" : (q[0] === "f" ? "🥬 농장 " + f + "%" : "🏘️ 주거 " + Math.max(0, r.h) + "%"); var pp = IY.P(q[1].x, q[1].y, ZP + 4); K.pill(ctx, nm, pp.x, pp.y - 10, { a: "center", s: 11.5, c: "#ffffff", box: BX }); });
      IY.label(ctx, 280, 160, ZW, "바닥에 묶어 둔 계류줄", 20, 50, "#e8ecff", BX);
      IY.label(ctx, 0, IY.D, 26, "오르는 바다", -24, 30, "#bfe6ff", BX);
      if (r.h < 0) K.pill(ctx, "⚠️ 면적 합이 100%를 넘었습니다", LW / 2, H - 40, { a: "center", s: 12.5, c: "#ffc9c9", box: BX });
      K.bigText(ctx, "해상 도시 한 모듈", 16, 36, 20, "#ffffff");
      K.warn(ctx, LW - 12, H - 12, "⚠ 크기는 실제 비율이 아님", "right");
      return r;
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = drawIso(), LW = 440, RX = LW + 12, x0 = RX + 18, x1 = W - 18, TW = x1 - x0;
      K.card(ctx, RX, 0, W - RX, H, "세 가지 기준을 모두 넘겨야 합니다");
      var rows2 = [["⚡ 전력 자급률", r.pow, 200, 100, Math.round(r.pow) + "%", "기준 100%"], ["🥬 채소 자급률", r.food, 120, 60, Math.round(r.food) + "%", "기준 60%"], ["🏘️ 살 수 있는 주민", r.people, 30000, 12000, Math.round(r.people).toLocaleString() + "명", "기준 12,000명"]];
      var nOk = 0;
      rows2.forEach(function (w, k2) {
        var y = 70 + k2 * 76, ok = w[1] >= w[3]; if (ok) nOk++;
        K.row(ctx, w[0], w[4] + (ok ? " ✔" : " ✘"), x0, x1, y, ok ? LC.green : LC.red);
        K.bar(ctx, x0, y + 10, TW, clamp(w[1] / w[2], 0, 1), ok ? LC.green : LC.orange);
        var tx = x0 + TW * w[3] / w[2]; ctx.fillStyle = LC.ink; ctx.fillRect(tx - 1, y + 5, 2, 20);
        K.t(ctx, w[5], tx, y + 40, { s: 10.5, w: "700", a: "center", c: LC.mute });
      });
      K.tip(ctx, nOk === 3 && r.h >= 0 ? "에너지·식량·주거를 모두 맞춤" : "기준을 넘은 것 " + nOk + " / 3", x0 - 4, H - 46, TW + 8, nOk === 3 && r.h >= 0 ? true : null);
      return r;
    }
    function drawOld() {
      var r = calc(), k;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 바다 위 모듈 ── */
      var LW = 440, cx = 222, cy = 178, R = 120;
      K.stage(ctx, 0, 0, LW, H, "ocean", { seed: 16 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      ctx.strokeStyle = "rgba(160,220,255,.16)"; ctx.lineWidth = 1.5;
      for (var wy = 20; wy < H; wy += 22) { ctx.beginPath(); for (var wx = 0; wx <= LW; wx += 8) { var yy = wy + 3 * Math.sin(wx / 23 + wy); if (wx) ctx.lineTo(wx, yy); else ctx.moveTo(wx, yy); } ctx.stroke(); }
      /* 계류줄(바닥에 묶어 둔 줄) */
      ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.4;
      [[0, LW - 16, H - 34], [2, 16, H - 16], [4, 40, 46]].forEach(function (m) { var a = m[0] * Math.PI / 3; ctx.beginPath(); ctx.moveTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); ctx.lineTo(m[1], m[2]); ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.arc(m[1], m[2], 3, 0, 6.2832); ctx.fill(); });
      ctx.setLineDash([]);
      ctx.restore();
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; hexPath(cx, cy, R + 6); ctx.fillStyle = "#9aa3b3"; ctx.fill(); ctx.restore();
      var rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R); rim.addColorStop(0, "#e3e7ee"); rim.addColorStop(1, "#7d8696");
      hexPath(cx, cy, R + 6); ctx.fillStyle = rim; ctx.fill();
      ctx.save(); hexPath(cx, cy, R); ctx.clip();
      ctx.fillStyle = "#2b3550"; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      var a0 = -Math.PI / 2, parts = [[s, "s", "☀️ 태양광 " + s + "%"], [f, "f", "🥬 농장 " + f + "%"], [Math.max(0, r.h), "h", "🏘️ 주거 " + Math.max(0, r.h) + "%"]], labs = [];
      parts.forEach(function (p) {
        if (p[0] <= 0) return;
        var a1 = a0 + Math.min(p[0], 100) / 100 * Math.PI * 2;
        ctx.save(); wedge(cx, cy, R * 1.3, a0, a1); ctx.clip(); texture(p[1], cx, cy, R * 1.3); ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * 1.3 * Math.cos(a0), cy + R * 1.3 * Math.sin(a0)); ctx.stroke();
        if (p[0] >= 6) { var am = (a0 + a1) / 2; labs.push([p[2], cx + Math.cos(am) * R * .55, cy + Math.sin(am) * R * .55 + 4]); }
        a0 = a1;
      });
      ctx.restore();
      labs.forEach(function (q) { K.pill(ctx, q[0], q[1], q[2], { a: "center", s: 11.5, c: KC.ink }); });
      K.pill(ctx, "해상 도시 한 모듈 · 위에서 본 모습", 14, 28, { s: 13, c: KC.blue });
      K.t(ctx, "점선: 바닥에 묶어 둔 계류줄", LW - 14, H - 12, { s: 10.5, a: "right", c: KC.mute });
      if (r.h < 0) K.pill(ctx, "⚠️ 면적 합이 100%를 넘었습니다", cx, cy + 5, { a: "center", s: 12.5, c: KC.red });

      /* ── 오른쪽: 자급 계기판 ── */
      var RX = LW + 8, TW = W - RX - 36;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 17 });
      K.pill(ctx, "세 가지 기준을 모두 넘겨야 합니다", RX + 14, 28, { s: 13, c: KC.blue });
      var rows = [
        ["⚡ 전력 자급률", r.pow, 200, 100, Math.round(r.pow) + "%", "기준 100%"],
        ["🥬 채소 자급률", r.food, 120, 60, Math.round(r.food) + "%", "기준 60%"],
        ["🏘️ 살 수 있는 주민", r.people, 30000, 12000, Math.round(r.people).toLocaleString() + "명", "기준 12,000명"]
      ];
      rows.forEach(function (w, k2) {
        var y = 92 + k2 * 80, x0 = RX + 18, ok = w[1] >= w[3], fw = TW * clamp(w[1] / w[2], 0, 1), tx = x0 + TW * w[3] / w[2];
        K.pill(ctx, w[0], x0, y - 22, { s: 12, c: KC.ink });
        K.pill(ctx, w[4] + (ok ? "  ✅" : "  ✗"), RX + 18 + TW, y - 22, { a: "right", s: 13, c: ok ? KC.green : KC.red });
        ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.beginPath(); ctx.roundRect(x0, y - 6, TW, 18, 9); ctx.fill();
        if (fw > 1) {
          var bg = ctx.createLinearGradient(x0, 0, x0 + fw, 0); bg.addColorStop(0, ok ? "#1f9a74" : "#a8463a"); bg.addColorStop(1, ok ? "#5ff0c0" : "#ff9a6b");
          ctx.save(); ctx.shadowColor = ok ? KC.green : KC.orange; ctx.shadowBlur = 10; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x0, y - 6, Math.max(fw, 10), 18, 9); ctx.fill(); ctx.restore();
        }
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(tx, y - 11); ctx.lineTo(tx, y + 17); ctx.stroke(); ctx.setLineDash([]);
        K.t(ctx, w[5], tx, y + 30, { s: 10.5, a: "center", c: KC.mute });
      });
      K.t(ctx, "막대 끝 = 눈금 최댓값 (전력 200% · 채소 120% · 주민 30,000명)", RX + 18, H - 12, { s: 10.5, c: KC.dim });
      return r;
    }
    function update() {
      var r = draw(), ok = r.pow >= 100 && r.food >= 60 && r.people >= 12000 && r.h >= 0;
      $("city-info").innerHTML = "태양광 1%마다 전력 약 3.3%, 농장 1%마다 채소 3%, 남은 면적 1%마다 주민 300명이 살 수 있다고 가정했습니다. 한쪽을 늘리면 다른 쪽이 줄어듭니다.";
      if (q) done("m3-4a");
      if (ok) { done("m3-4b"); window.sthState("cityBest", "태양광 " + s + "% · 농장 " + f + "% · 주거 " + r.h + "%"); window.sthState("cityOk", 1); }
      mission();
    }
    function mission() {
      var ok = !!window.sthState("cityOk");
      if (q) done("m3-4a"); if (ok) done("m3-4b");
      if (q && ok && !ep.cleared(3)) { window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("cityBest") + " — 에너지·식량·주거를 한 모듈 안에서 맞췄습니다."); ep.clear(3); ep.clear(4); }
      else if (ep.cleared(3)) window.sthMission("m3-4", true);
    }
    canvas._redraw = draw;
    $("city-s").addEventListener("input", function (e) { s = +e.target.value; $("city-s-val").textContent = s + "%"; update(); });
    $("city-f").addEventListener("input", function (e) { f = +e.target.value; $("city-f-val").textContent = f + "%"; update(); });
    window.sthPick({
      mount: "s3-q1",
      q: "해상 도시를 바닥에 고정하지 않고 <b>물에 뜨는 구조</b>로 짓는 가장 큰 까닭은?",
      options: ["건축비가 가장 싸서", "해수면이 올라도 도시가 함께 떠올라 잠기지 않아서", "태풍이 오면 다른 곳으로 옮기기 위해서"],
      answer: 1,
      why: ["비용 때문이 아닙니다. 이 도시가 대비하는 기후변화가 무엇인지 떠올려 보세요.", "부유식 구조는 해수면 상승에 적응하는 설계입니다. 대신 태풍과 해일에 견디도록 계류(묶어 두기) 설계가 중요합니다.", "도시 전체를 옮기는 것은 현실적이지 않습니다."],
      onDone: function () { q = true; window.sthState("cityQ", 1); update(); }
    });
    update();
  })();

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("mapBest") || "") + " / 해상 도시 " + (window.sthState("cityBest") || "")); }
  function vs() {
    var p = window.sthState("p3") || "";
    $("e3-vs").innerHTML = "<b>나의 첫 추측</b> " + (p || "기록 없음") + "<br><b>서식 한계선</b> " + (window.sthState("mapBest") || "-") + "<br><b>해상 도시 설계</b> " + (window.sthState("cityBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[기후변화와 환경생태 Ⅰ] 이야기 ③ 실잠자리가 북쪽으로 온 까닭",
    items: [
      { id: "e3a", label: "기사 발표문: 우리 지역의 기후변화 사례", hint: "여섯 분야 가운데 하나를 골라 우리 지역이나 우리나라의 사례를 조사해, 언제·어디서·무엇이 달라졌는지와 기후변화와의 관계를 발표문으로 쓰세요." },
      { id: "e3b", label: "나의 해상 도시 설계 근거", hint: "태양광·농장·주거 비율을 적고, 그 비율을 고른 까닭과 해수면 상승에 어떻게 대비했는지 쓰세요." }
    ]
  });
})();

/* ========================================================================= 06 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[기후변화와 환경생태 Ⅰ] 기후와 환경생태의 특성 — 정리",
  recap: [
    { key: "r1", label: "① 콘월의 야자수" },
    { key: "r2", label: "② 녹는 얼음, 짙어지는 구름" },
    { key: "r3", label: "③ 실잠자리가 북쪽으로 온 까닭" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "세 사건을 꿰는 한 문장", hint: "야자나무, 북극 얼음, 실잠자리. 세 이야기를 ‘기후’, ‘상호작용’, ‘생태계’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 07 우리 반 */
window.sthShare({
  mount: "share", unit: "cce-1", unitLabel: "[기후변화와 환경생태 Ⅰ] 기후와 환경생태의 특성",
  rows: [
    { key: "r1", label: "① 콘월의 야자수" },
    { key: "r2", label: "② 녹는 얼음, 짙어지는 구름" },
    { key: "r3", label: "③ 실잠자리가 북쪽으로 온 까닭" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "세 사건을 꿰는 한 문장" }
});

})();
