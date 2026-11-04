/* 기후변화와 환경생태 Ⅱ 기후위기와 환경생태 변화 — 소단원별 이야기 네 편
   01 녹는 땅, 차오르는 바다 / 02 2100년의 일기 예보 / 03 39만 봉군이 사라진 겨울 / 04 초록 강, 여름 모기
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("cce-2");

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
function axes(ctx, x0, y0, x1, y1) { ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); }
function segWire(id, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute("data-v")); });
  });
}
function firstPick(key) { return window.sthState(key) || ""; }
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
function flower(ctx, x, y, r, col) {
  ctx.fillStyle = col;
  for (var k = 0; k < 5; k++) { var a = k * 1.2566 - 1.5708; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * r * .55, y + Math.sin(a) * r * .55, r * .55, r * .36, a, 0, 6.2832); ctx.fill(); }
  ctx.fillStyle = "#ffe9a8"; ctx.beginPath(); ctx.arc(x, y, r * .28, 0, 6.2832); ctx.fill();
}
function bee(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = "rgba(230,245,255,.6)"; ctx.beginPath(); ctx.ellipse(-2, -6, 5, 3, -.5, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.ellipse(3, -6, 5, 3, .5, 0, 6.2832); ctx.fill();
  var g = ctx.createLinearGradient(-7, 0, 7, 0); g.addColorStop(0, "#ffcf4a"); g.addColorStop(1, "#e89a10");
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 7, 4.6, 0, 0, 6.2832); ctx.fill();
  ctx.fillStyle = "#2a1c08"; ctx.fillRect(-2.5, -4.4, 1.8, 8.8); ctx.fillRect(1.5, -4.4, 1.8, 8.8);
  ctx.beginPath(); ctx.arc(7, 0, 2.6, 0, 6.2832); ctx.fill(); ctx.restore();
}
function wrapT(ctx, s, x, y, maxW, lh, o) {
  ctx.font = (o.w || "700") + " " + (o.s || 12) + "px " + K.FONT;
  var line = "", yy = y;
  s.split(" ").forEach(function (w) { var t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { K.t(ctx, line, x, yy, o); yy += lh; line = w; } else line = t; });
  if (line) K.t(ctx, line, x, yy, o);
  return yy;
}

/* =========================================================================
   이야기 ① 녹는 땅, 차오르는 바다
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "p1", title: "조사단의 첫 추리",
    question: "최근 수십 년 동안 지구 기온이 빠르게 오른 주된 원인은 무엇일까요?",
    options: ["㉠ 태양 활동이 강해져서", "㉡ 사람이 화석 연료를 태워 온실 기체가 늘어서", "㉢ 화산이 많이 분출해서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 원인별 기온 곡선 */
  (function () {
    var canvas = $("c-att"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    function ghg(y) { var t = (y - 1850) / 170; return t <= 0 ? 0 : 1.48 * Math.pow(t, 2.6); }
    function aer(y) { var t = (y - 1850) / 170; return t <= 0 ? 0 : -0.30 * Math.pow(t, 2.0); }
    function sol(y) { return 0.04 * Math.sin(2 * Math.PI * (y - 1850) / 11); }
    function vol(y) { var s = 0; [[1883, -0.25], [1902, -0.12], [1963, -0.15], [1982, -0.15], [1991, -0.3]].forEach(function (e) { if (y >= e[0]) s += e[1] * Math.exp(-(y - e[0]) / 1.5); }); return s; }
    var F = [
      { id: "sol", t: "☀️ 태양 활동", kind: "자연", f: sol },
      { id: "vol", t: "🌋 화산 분출", kind: "자연", f: vol },
      { id: "ghg", t: "🏭 온실 기체", kind: "인위", f: ghg },
      { id: "aer", t: "💨 에어로졸", kind: "인위", f: aer }
    ];
    var on = {}, got = window.sthState("attGot") || { a: false, b: false, s: false };
    var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - 0.5; }
    var noise = {}; for (var y = 1850; y <= 2020; y++) noise[y] = rnd() * 0.12;
    function clean(yy) { return ghg(yy) + aer(yy) + sol(yy) + vol(yy); }
    function model(yy) { var s = 0; F.forEach(function (x) { if (on[x.id]) s += x.f(yy); }); return s; }
    F.forEach(function (x) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "btn"; b.style.margin = "4px";
      b.innerHTML = x.t + " <small>(" + x.kind + ")</small>";
      b.addEventListener("click", function () { on[x.id] = !on[x.id]; b.classList.toggle("primary", !!on[x.id]); update(); });
      $("att-ctrl").appendChild(b);
    });
    var FC = { sol: KC.yellow, vol: KC.violet, ghg: KC.red, aer: KC.blue };
    function draw() {
      var yy;
      ctx.clearRect(0, 0, W, H);
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 21 });
      K.pill(ctx, "1850년 이후 지구 기온 · 원인을 켜서 맞춰 보기", 16, 28, { s: 13, c: KC.blue });
      var lg = K.pill(ctx, "━ 켠 원인으로 계산한 모형", W - 16, 28, { a: "right", s: 11.5, c: KC.orange });
      K.pill(ctx, "● 관측(1850~1900년 대비, 단순화)", lg.x - 8, 28, { a: "right", s: 11.5, c: "#d6defa" });
      var g = K.chart(ctx, { x: 6, y: 40, w: W - 12, h: H - 44, x0: 1850, x1: 2020, y0: -0.5, y1: 1.5, xt: 17, yt: 4, xf: function (vv) { vv = Math.round(vv); return vv % 30 === 0 ? String(vv) : ""; }, yf: function (vv) { return (vv > 0 ? "+" : "") + vv.toFixed(1) + " ℃"; } });
      clipRect(ctx, g);
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(g.L, g.Y(0)); ctx.lineTo(g.R, g.Y(0)); ctx.stroke(); ctx.setLineDash([]);
      for (yy = 1850; yy <= 2020; yy++) { ctx.fillStyle = "rgba(214,222,250,.55)"; ctx.beginPath(); ctx.arc(g.X(yy), g.Y(clean(yy) + noise[yy]), 2.3, 0, 6.2832); ctx.fill(); }
      F.forEach(function (x) {
        if (!on[x.id]) return;
        var pts = []; for (var y2 = 1850; y2 <= 2020; y2++) pts.push([y2, x.f(y2)]);
        K.plot(ctx, g, pts, FC[x.id], { w: 1.4, glow: false, dash: [4, 3] });
      });
      var mp = []; for (yy = 1850; yy <= 2020; yy++) mp.push([yy, model(yy)]);
      K.plot(ctx, g, mp, KC.orange, { w: 3 });
      ctx.restore();
      if (on.vol) [[1883, "크라카타우 1883"], [1991, "피나투보 1991"]].forEach(function (e) { K.t(ctx, "▲ " + e[1], g.X(e[0]), g.B - 8, { s: 10, a: e[0] > 1950 ? "right" : "left", c: KC.violet }); });
      var px = g.L + 10, names = F.filter(function (x) { return on[x.id]; });
      if (!names.length) K.pill(ctx, "켠 원인이 없어 모형은 0 ℃에 머묾러 있습니다", px, g.T + 22, { s: 11.5, c: KC.mute });
      names.forEach(function (x) { var b = K.pill(ctx, "┄ " + x.t.replace(/^\S+\s/, "") + " (" + x.kind + ")", px, g.T + 22, { s: 11, c: FC[x.id] }); px = b.x + b.w + 6; });
      var rms = 0, n = 0, m10 = 0;
      for (yy = 1850; yy <= 2020; yy++) { rms += Math.pow(model(yy) - clean(yy), 2); n++; }
      for (yy = 2011; yy <= 2020; yy++) m10 += model(yy) / 10;
      return { rms: Math.sqrt(rms / n), m10: m10 };
    }
    function update() {
      var r = draw(), ch = false;
      var names = F.filter(function (x) { return on[x.id]; }).map(function (x) { return x.t.replace(/^\S+\s/, ""); });
      var natOnly = (on.sol || on.vol) && !on.ghg && !on.aer;
      rd("att-read", kv("2011~2020년 모형", (r.m10 >= 0 ? "+" : "") + r.m10.toFixed(2) + " ℃", "y", "관측 약 +1.1 ℃") +
        kv("관측과의 평균 차이", r.rms.toFixed(2) + " ℃", r.rms <= 0.05 ? "g" : "r") +
        (r.rms <= 0.05 ? okp(true, "모형이 관측과 거의 겹칩니다") : (natOnly ? okp(false, "자연적 원인만으로는 최근 상승이 나오지 않습니다") : "")));
      $("att-info").innerHTML = (names.length ? "켠 원인: " + names.join(", ") : "아직 켠 원인이 없습니다") + " → 2011~2020년 모형 기온 <b>" + (r.m10 >= 0 ? "+" : "") + r.m10.toFixed(2) + " ℃</b> (관측 약 +1.1 ℃), 관측과의 평균 차이 <b>" + r.rms.toFixed(2) + " ℃</b>. " +
        (natOnly ? "자연적 원인만으로는 최근의 급격한 상승이 전혀 나타나지 않습니다." : (on.ghg && !on.aer ? "온실 기체만 켜면 관측보다 조금 높습니다. 햇빛을 가려 식히는 원인도 있지 않을까요?" : ""));
      if (natOnly && !got.a) { got.a = ch = true; }
      if (r.rms <= 0.05 && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("attGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.b) done("m1-2b");
      if (got.a && got.b) window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>자연적 원인은 짧은 오르내림만 만들고, 최근의 빠른 상승은 <b>온실 기체</b>를 넣어야 설명됩니다. 에어로졸은 그 일부를 가려 왔습니다.");
      if (got.s) window.sthMission("m1-2c", true, "<span class='m-tag'>미션 완료</span>자연적 원인 4가지, 인위적 원인 4가지.");
      if (got.a && got.b && got.s) ep.clear(1);
    }
    canvas._redraw = draw;
    window.sthSort({
      mount: "s1-sort",
      buckets: [{ id: "n", label: "자연적 원인" }, { id: "h", label: "인위적 원인" }],
      items: [
        { t: "태양 활동의 변화", a: "n", why: "태양이 내보내는 에너지의 변화입니다." },
        { t: "지구 공전 궤도의 변화", a: "n", why: "수만 년 주기로 기후를 바꿉니다." },
        { t: "수륙 분포의 변화", a: "n", why: "대륙 이동은 아주 오랜 기간에 걸쳐 기후를 바꿉니다." },
        { t: "화산 분출", a: "n", why: "화산재·에어로졸이 햇빛을 가려 몇 해 동안 기온을 낮춥니다.", hint: "사람이 일으키나요?" },
        { t: "화석 연료 사용에 따른 온실 기체 배출", a: "h", why: "최근 온난화의 가장 큰 원인입니다." },
        { t: "공장·자동차에서 나오는 에어로졸", a: "h", why: "사람이 내보낸 미세 입자입니다.", hint: "화산이 아니라 공장·자동차에서 나온 것입니다." },
        { t: "숲을 밭이나 도시로 바꾸는 토지 이용 변화", a: "h", why: "반사율과 탄소 흡수를 바꿉니다." },
        { t: "열대 우림 파괴", a: "h", why: "흡수원이 줄고 저장된 탄소가 배출됩니다." }
      ],
      onDone: function () { got.s = true; window.sthState("attGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 비커 실험 */
  (function () {
    var canvas = $("c-bx"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var exp = "a", phase = 0, busy = false, got = window.sthState("bxGot") || { a: false, b: false, c: false };
    var RES = { a: { before: 109.0, after: 109.0 }, b: { before: 100.0, after: 109.0 }, c: { before: 100.0, after: 100.6 } };
    var NAME = { a: "(가) 물에 떠 있는 얼음 90 g", b: "(나) 받침대 위 얼음 90 g", c: "(다) 물 1,000 cm³를 20 ℃ → 40 ℃" };
    function cube(x, y, s, a) {
      ctx.save(); ctx.globalAlpha = a;
      var g = ctx.createLinearGradient(x, y, x + s, y + s); g.addColorStop(0, "#ffffff"); g.addColorStop(.5, "#d6ecfa"); g.addColorStop(1, "#8fc3e6");
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, s, s, Math.min(6, s / 5)); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(x + s * .15, y + s * .12, s * .5, Math.max(1.5, s * .08));
      ctx.restore();
    }
    function earthPanel(RX, RW) {
      K.stage(ctx, RX, 0, RW, H, "ocean", { seed: 23 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(RX, 0, RW, H, 14); ctx.clip();
      var sea = 196, sk = ctx.createLinearGradient(0, 0, 0, sea); sk.addColorStop(0, "#0b1d3d"); sk.addColorStop(1, "#2a5a8f");
      ctx.fillStyle = sk; ctx.fillRect(RX, 0, RW, sea);
      var rise = exp === "b" ? 18 * phase : (exp === "c" ? 10 * phase : 0), sl = sea - rise;
      var wg = ctx.createLinearGradient(0, sl, 0, H); wg.addColorStop(0, exp === "c" ? "rgba(255,140,90," + (.35 + .5 * phase).toFixed(2) + ")" : "#1a6fb0"); wg.addColorStop(.35, "#0d4f86"); wg.addColorStop(1, "#04142e");
      ctx.fillStyle = wg; ctx.fillRect(RX, sl, RW, H - sl);
      if (exp === "b") {
        var lg = ctx.createLinearGradient(0, 120, 0, H); lg.addColorStop(0, "#6b5638"); lg.addColorStop(1, "#2c2116");
        ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(RX + RW, 120); ctx.lineTo(RX + 150, 150); ctx.lineTo(RX + 110, H); ctx.lineTo(RX + RW, H); ctx.closePath(); ctx.fill();
        var ih = 46 * (1 - phase) + 4, ig = ctx.createLinearGradient(0, 120 - ih, 0, 150); ig.addColorStop(0, "#ffffff"); ig.addColorStop(1, "#a9d3ef");
        ctx.fillStyle = ig; ctx.beginPath(); ctx.moveTo(RX + RW, 120 - ih); ctx.quadraticCurveTo(RX + 220, 112 - ih, RX + 150, 150); ctx.lineTo(RX + RW, 120); ctx.closePath(); ctx.fill();
        if (phase > 0 && phase < 1) { ctx.strokeStyle = "rgba(140,210,255,.8)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(RX + 160, 148); ctx.quadraticCurveTo(RX + 140, 170, RX + 120, sl); ctx.stroke(); }
      }
      if (exp === "a") {
        var fh = 40 * (1 - phase);
        if (fh > 1) {
          var fg = ctx.createLinearGradient(0, sl - fh * .12, 0, sl + fh); fg.addColorStop(0, "#ffffff"); fg.addColorStop(1, "#8fc3e6");
          ctx.fillStyle = fg; ctx.beginPath(); ctx.roundRect(RX + 60, sl - fh * .12, 150, fh, 6); ctx.fill();
          ctx.fillStyle = "rgba(13,79,134,.5)"; ctx.fillRect(RX + 60, sl, 150, fh * .88);
        }
      }
      if (exp === "c") { for (var k = 0; k < 4; k++) K.arrow(ctx, { x: RX + 50 + k * 70, y: sl + 40 }, { x: RX + 50 + k * 70, y: sl + 40 - 26 * phase - 4 }, "rgba(255,180,140,.9)", 2, 7); }
      ctx.strokeStyle = "rgba(255,211,107,.85)"; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(RX, sea); ctx.lineTo(RX + RW, sea); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      K.pill(ctx, "실제 지구에서는", RX + 14, 28, { s: 13, c: KC.blue });
      K.pill(ctx, exp === "a" ? "바다에 떠 있는 해빙·빙붕" : (exp === "b" ? "그린란드·남극 대륙의 빙상" : "따뜻해지는 바다 윗층"), RX + 14, 60, { s: 11.5, c: KC.ink });
      K.pill(ctx, exp === "a" ? "녹아도 해수면 거의 그대로" : (exp === "b" ? "녹은 물이 더해져 해수면 ↑" : "열팽창으로 해수면 ↑"), RX + RW / 2, H - 16, { a: "center", s: 12, c: exp === "a" ? KC.green : KC.red, box: [RX, RX + RW] });
      K.warn(ctx, RX + RW - 14, sea + 26, "⚠ 높이는 과장", "right");
    }
    function draw() {
      var r = RES[exp], lv = r.before + (r.after - r.before) * phase;
      ctx.clearRect(0, 0, W, H);
      var LW = 540, bx = 130, bw = 250, by0 = 46, by1 = 282;
      function Y(mm) { return by1 - (mm - 60) / 70 * (by1 - by0); }
      K.stage(ctx, 0, 0, LW, H, "lab", { seed: 22 });
      /* 실험대 */
      var tg = ctx.createLinearGradient(0, by1 + 8, 0, H); tg.addColorStop(0, "#5a4632"); tg.addColorStop(1, "#2a2018");
      ctx.fillStyle = tg; ctx.fillRect(10, by1 + 10, LW - 20, H - by1 - 14);
      if (exp === "c") {
        var hp = ctx.createLinearGradient(0, by1 + 2, 0, by1 + 12); hp.addColorStop(0, phase > 0 ? "rgba(255," + Math.round(140 - 60 * phase) + ",60,1)" : "#7a7f8c"); hp.addColorStop(1, "#3a3d45");
        ctx.fillStyle = hp; ctx.fillRect(bx - 16, by1 + 2, bw + 32, 10);
        if (phase > 0) { ctx.save(); ctx.globalAlpha = .55 * phase; K.glow(ctx, bx + bw / 2, by1 + 6, 30, "rgba(255,120,60,.6)", 3.5); ctx.restore(); }
      }
      /* 물 */
      var wt = Y(lv), wg = ctx.createLinearGradient(0, wt, 0, by1);
      var hot = exp === "c" ? phase : 0;
      wg.addColorStop(0, "rgba(" + Math.round(90 + 150 * hot) + "," + Math.round(180 - 40 * hot) + "," + Math.round(255 - 120 * hot) + ",.55)"); wg.addColorStop(1, "rgba(30,90,200,.75)");
      ctx.fillStyle = wg; ctx.fillRect(bx + 3, wt, bw - 6, by1 - wt - 3);
      ctx.strokeStyle = "rgba(200,235,255,.95)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + 3, wt); ctx.lineTo(bx + bw - 3, wt); ctx.stroke();
      if (exp === "c" && phase > 0) { var Rb = K.rng(5); for (var q = 0; q < 14; q++) { var bxq = bx + 20 + Rb() * (bw - 40), byq = by1 - 10 - ((Rb() * 200 + phase * 400) % (by1 - wt - 14)); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bxq, byq, 2 + Rb() * 2, 0, 6.2832); ctx.stroke(); } }
      /* 받침대 */
      if (exp === "b") {
        var mg = ctx.createLinearGradient(0, Y(118), 0, Y(118) + 8); mg.addColorStop(0, "#e5e9f0"); mg.addColorStop(1, "#7d8696");
        ctx.fillStyle = mg; ctx.fillRect(bx + bw - 100, Y(118), 90, 8);
        ctx.strokeStyle = "#9aa3b3"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx + bw - 90, Y(118) + 8); ctx.lineTo(bx + bw - 90, by1 - 3); ctx.moveTo(bx + bw - 20, Y(118) + 8); ctx.lineTo(bx + bw - 20, by1 - 3); ctx.stroke();
      }
      var ice = 1 - phase;
      if (ice > 0.02 && exp !== "c") {
        var s = 46 * Math.sqrt(ice), ix = exp === "a" ? bx + 60 : bx + bw - 55 - s / 2, iy = exp === "a" ? Y(lv) - s * 0.1 : Y(118) - s;
        cube(ix, iy, s, 1);
        if (exp === "a") { ctx.fillStyle = "rgba(30,90,200,.35)"; ctx.fillRect(ix, Y(lv), s, s * .9); }
        if (exp === "b" && phase > 0) { ctx.fillStyle = "rgba(170,220,255,.9)"; for (var dd = 0; dd < 3; dd++) { ctx.beginPath(); ctx.arc(ix + s / 2 + (dd - 1) * 8, iy + s + 10 + ((phase * 300 + dd * 13) % Math.max(8, wt - iy - s - 10)), 2.2, 0, 6.2832); ctx.fill(); } }
      }
      /* 유리 비커 */
      ctx.strokeStyle = "rgba(215,232,255,.85)"; ctx.lineWidth = 4; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(bx - 6, by0 - 6); ctx.lineTo(bx, by0); ctx.lineTo(bx, by1 - 8); ctx.quadraticCurveTo(bx, by1, bx + 8, by1); ctx.lineTo(bx + bw - 8, by1); ctx.quadraticCurveTo(bx + bw, by1, bx + bw, by1 - 8); ctx.lineTo(bx + bw, by0); ctx.stroke();
      var hl = ctx.createLinearGradient(bx + 6, 0, bx + 22, 0); hl.addColorStop(0, "rgba(255,255,255,.28)"); hl.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hl; ctx.fillRect(bx + 4, by0 + 10, 18, by1 - by0 - 24);
      /* 눈금 */
      for (var mm = 70; mm <= 120; mm += 10) { K.t(ctx, mm + " mm", bx - 12, Y(mm) + 4, { s: 10, a: "right", c: KC.mute }); ctx.strokeStyle = "rgba(215,232,255,.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, Y(mm)); ctx.lineTo(bx + 12, Y(mm)); ctx.stroke(); }
      ctx.strokeStyle = KC.yellow; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(bx - 4, Y(r.before)); ctx.lineTo(bx + bw + 24, Y(r.before)); ctx.stroke(); ctx.setLineDash([]);
      K.pill(ctx, "처음 수면", bx + bw + 28, Y(r.before) + 5, { s: 11, c: KC.yellow, box: [0, LW] });
      if (Math.abs(lv - r.before) > 0.05) K.pill(ctx, "지금 수면", bx + bw + 28, Math.min(Y(lv) + 5, Y(r.before) - 22), { s: 11, c: "#cfeaff", box: [0, LW] });
      K.pill(ctx, NAME[exp], 14, 28, { s: 13, c: KC.blue });
      K.t(ctx, "비커 바닥 넓이 100 cm²", LW - 14, H - 10, { s: 10.5, a: "right", c: "#d8c7b0" });
      if (exp !== "b") {
        /* 확대경: 수면 변화 × 20 */
        var mx = 468, my = 226, mr = 44, dz = clamp((lv - r.before) * 3.37 * 20, -36, 36);
        ctx.save(); ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.2832); ctx.clip();
        ctx.fillStyle = "#0b1530"; ctx.fillRect(mx - mr, my - mr, 2 * mr, 2 * mr);
        var zg = ctx.createLinearGradient(0, my - dz, 0, my + mr); zg.addColorStop(0, "rgba(120,200,255,.7)"); zg.addColorStop(1, "rgba(30,90,200,.85)");
        ctx.fillStyle = zg; ctx.fillRect(mx - mr, my - dz, 2 * mr, mr + dz + 2);
        ctx.strokeStyle = KC.yellow; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(mx - mr, my); ctx.lineTo(mx + mr, my); ctx.stroke(); ctx.setLineDash([]);
        ctx.restore();
        ctx.strokeStyle = "rgba(215,232,255,.8)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.2832); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx - mr * .7, my + mr * .7); ctx.lineTo(mx - mr * 1.1, my + mr * 1.1); ctx.stroke();
        K.pill(ctx, "수면 확대 ×20", mx, my - mr - 10, { a: "center", s: 11, c: KC.ink, box: [0, LW] });
      }
      earthPanel(LW + 8, W - LW - 8);
    }
    var MSG = {
      a: "떠 있는 얼음은 녹기 전부터 <b>자기 무게만큼 물을 밀어내고</b> 있었습니다. 녹아서 생긴 물이 딱 그 자리를 채우므로 수면은 <b>그대로</b>입니다. 바다에 떠 있는 해빙·빙붕이 녹는 경우와 같습니다.",
      b: "받침대 위 얼음은 물을 밀어내지 않다가, 녹은 물 90 cm³가 <b>새로</b> 비커에 들어와 수면이 <b>9 mm</b> 오릅니다. 그린란드·남극 대륙의 빙상이 녹아 바다로 흘러드는 경우와 같습니다.",
      c: "물 1,000 cm³를 20 ℃에서 40 ℃로 데우면 밀도가 0.998 → 0.992 g/cm³로 줄어 부피가 약 6 cm³ 늘고, 수면이 <b>0.6 mm</b> 오릅니다. 작아 보이지만 바다는 수천 m 깊이라 <b>열팽창</b>만으로도 해수면이 크게 오릅니다."
    };
    function bxRead() {
      var r = RES[exp], lv = r.before + (r.after - r.before) * phase, d = lv - r.before;
      rd("bx-read", kv("처음 수면", r.before.toFixed(1) + " mm", "b") + kv("지금 수면", lv.toFixed(1) + " mm", "b") +
        kv("변화", (d >= 0 ? "+" : "") + d.toFixed(1) + " mm", d > 0.05 ? "r" : "g", phase >= 1 ? "실험 끝" : (phase > 0 ? "실험 중…" : "▶ 실험하기를 누르세요")));
    }
    function run() {
      if (busy) return;
      busy = true; $("bx-run").disabled = true; phase = 0;
      (function step() {
        phase = Math.min(1, phase + 0.04); draw(); bxRead();
        if (phase < 1) window.setTimeout(step, 30);
        else {
          busy = false; $("bx-run").disabled = false;
          $("bx-info").innerHTML = MSG[exp];
          if (!got[exp]) { got[exp] = true; window.sthState("bxGot", got); }
          mission();
        }
      })();
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.b) done("m1-3b"); if (got.c) done("m1-3c");
      if (got.a && got.b && got.c) { window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>해수면을 올리는 것은 <b>육지 얼음의 융해</b>와 <b>열팽창</b>. 바다에 떠 있는 얼음은 녹아도 수면을 거의 바꾸지 않습니다."); ep.clear(2); }
    }
    canvas._redraw = draw;
    segWire("bx-exp", function (x) { exp = x; phase = 0; draw(); bxRead(); $("bx-info").innerHTML = "실험하기를 눌러 얼음을 녹이거나 물을 데우세요."; });
    $("bx-run").addEventListener("click", run);
    draw(); bxRead(); mission();
  })();

  /* 장면 4 — 해수면 가계부 (아이소메트릭 블록 모형 + 가계부 막대) */
  (function () {
    var canvas = $("c-sl"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var dT = 0, ice = 0, ph = 0, mo = motion("sl-play");
    function th() { return 0.0002 * dT * 700 * 1000; }
    function ic() { return ice * 1000 / 3.61e8 * 1e6; }

    /* ── 모형: x = 육지(왼쪽 위) → 먼바다(오른쪽 아래), y = 해안선을 따라. 앞면(y = D)이 바다 단면 ── */
    var DH = 392;                                         /* 모형 칸 높이(아래는 가계부) */
    var I = K.iso({ ox: 420, oy: 105, s: 0.62, L: 640, D: 220 });
    var L = I.L, D = I.D;
    var SEA = 95, LB = 50, MMZ = 0.15;                    /* 1993년 해수면 높이, 바다 윗층 700 m 의 바닥, 1 mm = 0.15 그림 단위(크게 과장) */
    function xc(y) { return 250 + 25 * Math.sin(y / 40); } /* 1993년 해안선 */
    function mtn(x, y) { return 32 * Math.exp(-(Math.pow(x - 40, 2) / 2600 + Math.pow(y - 55, 2) / 3400)); }
    function gth(x, y) { return Math.max(0, mtn(x, y) - (11 + ice * 0.4)) * 0.75; }   /* 빙하 두께: 녹은 물이 늘수록 얇고 좁아진다 */
    function ground(x, y) {
      var c = xc(y);
      if (x <= c) return SEA + Math.min(35, 0.35 * (c - x)) + mtn(x, y);
      return Math.max(15, SEA - (x - c) * 0.9);
    }
    function zOf(x, y) { return ground(x, y) + gth(x, y); }
    function landCol(x, y, z, light) {
      var c;
      if (gth(x, y) > 0.6) c = "#eef6ff";                               /* 빙하 */
      else if (z > SEA + 36) c = "#7d9a55";                             /* 산자락 */
      else if (z > SEA + 7) c = "#6ea04a";                              /* 풀밭 */
      else if (z > SEA - 4) c = "#d9c08a";                              /* 모래사장 */
      else if (z > SEA - 30) c = "#b49a6c";                             /* 얕은 바다 밑 */
      else c = "#7d6a55";                                               /* 깊은 바다 밑 */
      return K.tint(c, light);
    }
    function faceZ(side) { return function (u) { return side === "front" ? zOf(u, D) : zOf(L, u); }; }

    function drawModel(a, b, tot) {
      var wz = SEA + tot * MMZ, heat = clamp(dT / 0.5, 0, 1);
      K.studio(ctx, 0, 0, W, DH, { x: I.P(L, D, 0).x - 160, y: I.P(L, D, 0).y - 20, rx: 330, ry: 52 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      /* 지형 + 칸마다 물 덮기(바다 윗물이 데워질수록 붉은 기) */
      I.field(ctx, zOf, landCol, 64, 22, function (c, x0, y0, x1, y1, zMax, zMin) {
        if (wz > zMin + 0.2) {
          var p1 = I.P(x0, y0, wz), p2 = I.P(x1, y0, wz), p3 = I.P(x1, y1, wz), p4 = I.P(x0, y1, wz);
          var dep = wz - zMin, al = Math.min(.8, .3 + dep / 110);
          c.beginPath(); c.moveTo(p1.x, p1.y); c.lineTo(p2.x, p2.y); c.lineTo(p3.x, p3.y); c.lineTo(p4.x, p4.y); c.closePath();
          c.fillStyle = "rgba(" + Math.round(60 - dep * .2 + heat * 45) + "," + Math.round(150 - dep * .4) + "," + Math.round(225 - heat * 25) + "," + al.toFixed(2) + ")"; c.fill();
        }
      });
      /* 앞면·오른쪽 면: 땅과 바다 밑 단면 */
      ["front", "right"].forEach(function (side) {
        var zf = faceZ(side);
        I.face(ctx, side, function (Lw) {
          I.profile(ctx, side, zf, 0);
          var g = ctx.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, "#5b4a3a"); g.addColorStop(.6, "#8c7253"); g.addColorStop(1, "#b89c70");
          ctx.fillStyle = g; ctx.fill();
          ctx.save(); I.profile(ctx, side, zf, 0); ctx.clip();
          var R = K.rng(side === "front" ? 41 : 43);
          for (var i = 0; i < Lw * 1.4; i++) { ctx.fillStyle = R() > .5 ? "rgba(255,255,255,.16)" : "rgba(40,28,18,.25)"; ctx.fillRect(R() * Lw, R() * 200, 1.6, 1.6); }
          ctx.strokeStyle = "rgba(50,35,20,.22)"; ctx.lineWidth = 1;
          for (var y2 = 14; y2 < 200; y2 += 18) { ctx.beginPath(); ctx.moveTo(0, y2); ctx.lineTo(Lw, y2 + 2); ctx.stroke(); }
          ctx.restore();
        });
      });
      I.water(ctx, wz, function (u, side) { return faceZ(side)(u); }, { surface: false, top: "rgba(80,170,235,.55)", deep: "rgba(10,45,110,.8)" });
      /* 바다 윗층(700 m): 데워질수록 붉게 */
      ["front", "right"].forEach(function (side) {
        var zf = faceZ(side);
        I.face(ctx, side, function (Lw) {
          var u, st = Math.max(2, Lw / 90);
          ctx.beginPath();
          for (u = 0; u <= Lw + .01; u += st) { var uu = Math.min(u, Lw); ctx.lineTo(uu, Math.min(wz, Math.max(zf(uu), LB))); }
          for (u = Lw; u >= -.01; u -= st) ctx.lineTo(Math.max(u, 0), wz);
          ctx.closePath();
          ctx.fillStyle = "rgba(255,105,75," + (0.06 + 0.46 * heat).toFixed(2) + ")"; ctx.fill();
          ctx.save(); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(255,190,160,.7)";
          ctx.beginPath(); var on = false;
          for (u = 0; u <= Lw + .01; u += st) { var u2 = Math.min(u, Lw); if (zf(u2) < LB) { if (!on) { ctx.moveTo(u2, LB); on = true; } else ctx.lineTo(u2, LB); } }
          ctx.stroke(); ctx.restore();
        });
      });
      I.shade(ctx, "front", function (u) { return Math.max(zOf(u, D), wz); });
      I.shade(ctx, "right", function (u) { return Math.max(zOf(L, u), wz); });
      /* 1993년 해수면(노란 점선) */
      ["front", "right"].forEach(function (side) {
        I.face(ctx, side, function (Lw) {
          ctx.save(); ctx.setLineDash([7, 5]); ctx.lineWidth = 1.8; ctx.strokeStyle = "#ffd35a";
          var u0 = side === "front" ? xc(D) : 0;
          ctx.beginPath(); ctx.moveTo(u0, SEA); ctx.lineTo(Lw, SEA); ctx.stroke(); ctx.restore();
        });
      });
      /* 열팽창: 데워진 윗물이 부풀어 오른다 */
      if (dT > 0) for (var k = 0; k < 4; k++) {
        var ux = 380 + k * 70, pA = I.P(ux, D, LB + 6), pB = I.P(ux, D, LB + 14 + 22 * heat);
        K.arrow(ctx, pA, pB, "rgba(255,200,170,.95)", 2, 7);
      }
      I.edges(ctx, Math.max(zOf(L, D), wz), Math.max(zOf(L, D), wz));
      /* 해안 마을과 숲 */
      [[125, 40], [140, 70], [128, 150], [140, 185], [150, 110]].forEach(function (h, i) { I.house(ctx, h[0], h[1], zOf(h[0] + 8, h[1] + 7), 15, 13, 11, ["#c0553f", "#3f6fb5", "#d08a2e", "#c0553f", "#3f8f7a"][i]); });
      [[160, 28], [40, 190], [165, 200], [170, 150], [75, 170], [110, 15], [95, 120]].forEach(function (t, i) { I.tree(ctx, t[0], t[1], zOf(t[0], t[1]), 0.8 + (i % 3) * .12); });
      /* 녹은 물이 바다로 흘러든다 */
      var mid = null;
      if (ice > 0) {
        var path = [[62, 88], [92, 104], [122, 120], [160, 130], [200, 138], [xc(140) + 4, 140]];
        ctx.save(); ctx.strokeStyle = "rgba(150,215,255,.95)"; ctx.lineWidth = 1.5 + ice / 12; ctx.lineCap = "round";
        ctx.setLineDash([7, 5]); ctx.lineDashOffset = -ph * 0.8;
        ctx.beginPath();
        path.forEach(function (q, i) { var p = I.P(q[0], q[1], ground(q[0], q[1]) + 1.2); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
        ctx.stroke(); ctx.restore();
        mid = [160, 130];
      }
      /* 해수면 측정 막대(눈금 50 mm) */
      var gx = 300, gy = D - 8, gb = ground(gx, gy), gt = SEA + 34;
      var q0 = I.P(gx, gy, gb), q1 = I.P(gx, gy, gt);
      ctx.strokeStyle = "#f4f4f4"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(q1.x, q1.y); ctx.stroke();
      for (var mm = 0; mm <= 200; mm += 50) {
        var qt = I.P(gx, gy, SEA + mm * MMZ);
        ctx.strokeStyle = mm === 0 ? "#ffd35a" : "#e0475b"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(qt.x - 6, qt.y); ctx.lineTo(qt.x + 6, qt.y); ctx.stroke();
      }
      var qw = I.P(gx, gy, wz); ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(qw.x, qw.y, 3.2, 0, 6.2832); ctx.fill();
      /* 물결 */
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1;
      for (var i = 0; i < 10; i++) {
        var wy = 12 + ((i * 0.61) % 1) * (D - 24), wx = xc(wy) + 40 + ((i * 0.37 + ph * .01) % 1) * (L - xc(wy) - 70);
        var s1 = I.P(wx - 14, wy, wz), s2 = I.P(wx + 9, wy, wz);
        ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.quadraticCurveTo((s1.x + s2.x) / 2, s1.y - 3, s2.x, s2.y); ctx.stroke();
      }
      ctx.restore();
      /* 이름표 */
      var box = [0, W];
      I.label(ctx, 40, 55, zOf(40, 55), ice > 0 ? "줄어드는 빙하·빙상" : "빙하·빙상", 60, -12, "#e8f4ff", box);
      I.label(ctx, 128, 150, zOf(128, 150) + 10, "해안 마을", -70, 40, "#f4f0e6", box);
      if (mid) I.label(ctx, mid[0], mid[1], ground(mid[0], mid[1]) + 1, "녹은 물이 바다로", 52, -30, "#bfe6ff", box);
      I.label(ctx, gx, gy, gt, "해수면 측정 막대 (눈금 50 mm)", 60, -50, "#f4f0e6", box);
      I.label(ctx, L, 40, SEA, "1993년 해수면", 44, -10, "#ffd35a", box);
      if (tot > 0.05) I.label(ctx, L, 130, wz, "지금 해수면 +" + tot.toFixed(1) + " mm", 44, 30, "#bfe6ff", box);
      var lp = I.P(560, D, (LB + SEA) / 2 - 4);
      K.pill(ctx, "바다 위층 700 m · +" + dT.toFixed(2) + " ℃", lp.x, lp.y + 4, { a: "center", s: 11, c: "#ffc2a8", box: box });
      K.warn(ctx, W - 14, 30, "⚠ 해수면 상승·높이는 크게 과장", "right");
    }

    function headline(tot, share) {
      var pct = Math.round(share * 100), inB = tot >= 86 && tot <= 97, inS = share >= 0.25 && share <= 0.40;
      if (tot < 0.05) { K.bigText(ctx, "1993년의 바다", 22, 54, 28, "#ffffff"); K.bigText(ctx, "두 경로로 해수면을 올려 보세요", 22, 88, 18, "#ffd35a"); }
      else if (inB && inS) { K.bigText(ctx, "관측 91.3 mm를 설명했다", 22, 54, 28, "#ffd35a"); K.bigText(ctx, "열팽창 " + pct + "% · 녹은 물 " + (100 - pct) + "%", 22, 88, 18, "#ffffff"); }
      else if (inB) { K.bigText(ctx, "합계는 맞는데 몫이 다르다", 22, 54, 26, "#ffffff"); K.bigText(ctx, "열팽창 " + pct + "% → 25~40%로", 22, 88, 18, "#ffd35a"); }
      else if (tot < 86) { K.bigText(ctx, "관측까지 " + (91.3 - tot).toFixed(1) + " mm 모자란다", 22, 54, 28, "#ffffff"); K.bigText(ctx, "지금 +" + tot.toFixed(1) + " mm · 관측 91.3 mm", 22, 88, 18, "#ffd35a"); }
      else { K.bigText(ctx, "관측보다 " + (tot - 91.3).toFixed(1) + " mm 더 올랐다", 22, 54, 28, "#ffffff"); K.bigText(ctx, "지금 +" + tot.toFixed(1) + " mm · 관측 91.3 mm", 22, 88, 18, "#ffd35a"); }
    }

    function drawBook(a, b, tot) {
      var y0 = DH + 8, h = H - y0;
      K.stage(ctx, 0, y0, W, h, "lab", { seed: 25 });
      K.pill(ctx, "해수면 가계부 · 1993~2020년 상승 (mm)", 14, y0 + 26, { s: 13, c: KC.blue });
      var gx = 110, MAX = 190, sc = (W - 150) / MAX;
      function X(mm) { return gx + Math.min(mm, MAX) * sc; }
      var r1 = y0 + 48, r2 = y0 + 100, bh = 32, ax = y0 + 150;
      ctx.fillStyle = "rgba(63,211,163,.16)"; ctx.fillRect(X(86), r1 - 8, X(97) - X(86), ax - r1 + 8);
      /* 관측 */
      K.t(ctx, "관측", gx - 12, r1 + 21, { s: 12, a: "right", c: KC.mute });
      var og = ctx.createLinearGradient(0, r1, 0, r1 + bh); og.addColorStop(0, "rgba(225,232,255,.55)"); og.addColorStop(1, "rgba(160,175,220,.28)");
      ctx.fillStyle = og; ctx.beginPath(); ctx.roundRect(gx, r1, X(91.3) - gx, bh, [0, 6, 6, 0]); ctx.fill();
      K.pill(ctx, "91.3 mm", X(91.3) + 10, r1 + 21, { s: 12, c: "#d6defa", box: [0, W - 8] });
      /* 내 계산: 열팽창 + 녹은 물 */
      K.t(ctx, "내 계산", gx - 12, r2 + 21, { s: 12, a: "right", c: KC.mute });
      var xa = X(a), xb = X(a + b);
      ctx.save(); ctx.shadowColor = KC.red; ctx.shadowBlur = 8;
      var ga = ctx.createLinearGradient(0, r2, 0, r2 + bh); ga.addColorStop(0, "#ff8a7a"); ga.addColorStop(1, "#b8324a");
      ctx.fillStyle = ga; ctx.fillRect(gx, r2, xa - gx, bh);
      ctx.shadowColor = KC.blue;
      var gb = ctx.createLinearGradient(0, r2, 0, r2 + bh); gb.addColorStop(0, "#bfe8ff"); gb.addColorStop(1, "#2f86e0");
      ctx.fillStyle = gb; ctx.fillRect(xa, r2, xb - xa, bh);
      ctx.restore();
      if (xa - gx > 56) K.t(ctx, "열팽창", (gx + xa) / 2, r2 + 21, { s: 11.5, a: "center", c: "#fff" });
      if (xb - xa > 60) K.t(ctx, "녹은 물", (xa + xb) / 2, r2 + 21, { s: 11.5, a: "center", c: "#06213f" });
      K.pill(ctx, tot.toFixed(1) + " mm", Math.max(xb, gx) + 10, r2 + 21, { s: 12, c: tot >= 86 && tot <= 97 ? KC.green : KC.ink, box: [0, W - 8] });
      /* 눈금 */
      ctx.strokeStyle = KC.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx, ax); ctx.lineTo(X(MAX), ax); ctx.stroke();
      for (var mm = 0; mm <= 180; mm += 20) {
        ctx.beginPath(); ctx.moveTo(X(mm), ax); ctx.lineTo(X(mm), ax + 5); ctx.stroke();
        K.t(ctx, String(mm), X(mm), ax + 19, { s: 10.5, a: "center", c: KC.mute });
      }
      K.t(ctx, "초록 띠: 86~97 mm", W - 20, ax + 42, { s: 10.5, a: "right", c: KC.green });
    }

    function draw() {
      var a = th(), b = ic(), tot = a + b, share = tot > 0 ? a / tot : 0;
      ctx.clearRect(0, 0, W, H);
      drawModel(a, b, tot);
      headline(tot, share);
      drawBook(a, b, tot);
      return { tot: tot, share: share };
    }
    function update() {
      var r = draw();
      rd("sl-read", kv("열팽창", th().toFixed(1) + " mm", "r", Math.round(r.share * 100) + "%") + kv("녹은 물", ic().toFixed(1) + " mm", "b", Math.round((1 - r.share) * 100) + "%") +
        kv("합계", r.tot.toFixed(1) + " mm", r.tot >= 86 && r.tot <= 97 ? "g" : "y", "관측 91.3 mm"));
      $("sl-info").innerHTML = "열팽창 = 0.0002 /℃ × 수온 상승 × 700 m, 녹은 물 = 부피 ÷ 바다 넓이(3억 6,100만 km²). 녹은 물 1천 km³는 해수면을 약 2.8 mm 올립니다.";
      if (r.tot >= 86 && r.tot <= 97 && r.share >= 0.25 && r.share <= 0.40 && !ep.cleared(3)) {
        window.sthState("slBest", "수온 +" + dT.toFixed(2) + " ℃ · 녹은 물 " + ice + " 천 km³ → " + r.tot.toFixed(1) + " mm");
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("slBest") + " (열팽창 " + Math.round(r.share * 100) + "%). 바다 위층이 0.2 ℃ 남짓 데워지고 녹은 물 2만 km³ 남짓이 흘러들면 관측값이 설명됩니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("sl-t").addEventListener("input", function (e) { dT = +e.target.value; $("sl-t-val").textContent = dT.toFixed(2) + " ℃"; update(); });
    $("sl-i").addEventListener("input", function (e) { ice = +e.target.value; $("sl-i-val").textContent = ice + " 천 km³"; update(); });
    K.animate(canvas, function (dt) { if (mo.on) { ph += dt / 60; draw(); } }, 20);
    update();
    if (ep.cleared(3)) window.sthMission("m1-4", true);
  })();

  function finish() { window.sthState("r1", "해결 · 원인은 온실 기체, 해수면 " + (window.sthState("slBest") || "")); }
  function vs() {
    var p = firstPick("p1");
    $("e1-vs").innerHTML = "<b>나의 첫 추리</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 기온 곡선이 추리를 뒷받침했습니다." : " — 자연적 원인만으로는 곡선이 따라가지 않았지요.") + "<br><b>해수면 가계부</b> " + (window.sthState("slBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[기후변화와 환경생태 Ⅱ] 이야기 ① 녹는 땅, 차오르는 바다",
    items: [
      { id: "w2", label: "해수면이 오르는 두 경로", hint: "빙상의 융해와 열팽창이 각각 어떻게 해수면을 올리는지 구분해 쓰세요." },
      { id: "e1b", label: "조사 보고: 기후위기의 원인과 심각성", hint: "최근 온난화의 주된 원인을 근거와 함께 쓰고, 시베리아·훈자·판타날 사례 가운데 하나로 심각성을 설명하세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 2100년의 일기 예보
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "p2", title: "캐스터의 첫 답변",
    question: "기온이 오르면 왜 폭우가 더 세질까요?",
    options: ["㉠ 따뜻한 공기가 수증기를 더 많이 품을 수 있어서", "㉡ 더우면 구름이 사라져서 비가 한꺼번에 와서", "㉢ 기온과 비는 관계가 없다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 포화 수증기량 */
  (function () {
    var canvas = $("c-cc"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, d = 0;
    function es(T) { return 6.112 * Math.exp(17.67 * T / (T + 243.5)); }
    var mo = motion("cc-play"), Rm = K.rng(33), MOL = [];
    for (var q = 0; q < 90; q++) MOL.push({ x: Rm(), y: Rm(), vx: Rm() - .5, vy: Rm() - .5 });
    function box(x, y, w, h, T, title, hot) {
      var n = Math.round(es(T) * 1.25), g = ctx.createLinearGradient(x, y, x, y + h);
      g.addColorStop(0, hot ? "rgba(255,140,90,.16)" : "rgba(127,211,255,.10)"); g.addColorStop(1, "rgba(20,30,70,.35)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
      ctx.strokeStyle = hot ? "rgba(255,170,130,.75)" : "rgba(170,215,255,.6)"; ctx.lineWidth = 2; ctx.stroke();
      for (var i = 0; i < Math.min(n, MOL.length); i++) { var m = MOL[i]; K.glow(ctx, x + 8 + m.x * (w - 16), y + 8 + m.y * (h - 16), 2.1, "rgba(140,210,255,.95)", 3.2); }
      K.pill(ctx, title, x + w / 2, y - 10, { a: "center", s: 12, c: hot ? KC.orange : KC.blue });
      K.pill(ctx, "수증기 점 " + n + "개", x + w / 2, y + h + 22, { a: "center", s: 11, c: KC.ink });
    }
    function draw() {
      var T2 = 25 + d, inc = (es(T2) / es(25) - 1) * 100;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 포화된 공기 상자 둘 ── */
      var LW = 360;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 26 });
      K.pill(ctx, "같은 부피의 포화된 공기", 14, 28, { s: 13, c: KC.blue });
      box(22, 76, 148, 170, 25, "25 ℃", false);
      box(190, 76, 148, 170, T2, T2.toFixed(1) + " ℃", d > 0);
      K.t(ctx, "점 하나 ≈ 포화 수증기압 0.8 hPa", LW / 2, H - 12, { s: 10.5, a: "center", c: KC.dim });

      /* ── 오른쪽: 포화 수증기압 곡선 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 27 });
      K.pill(ctx, "포화 수증기압 — 공기가 품을 수 있는 수증기의 최대량", RX + 14, 28, { s: 12.5, c: KC.blue });
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 8, h: H - 48, x0: 10, x1: 35, y0: 0, y1: 60, xt: 5, yt: 4, xl: "기온(℃)", yl: "hPa", xf: function (vv) { return vv + " ℃"; } });
      var pts = []; for (var T = 10; T <= 35.001; T += 0.25) pts.push([T, es(T)]);
      clipRect(ctx, g);
      var ag = ctx.createLinearGradient(0, g.T, 0, g.B); ag.addColorStop(0, "rgba(127,211,255,.32)"); ag.addColorStop(1, "rgba(127,211,255,.02)");
      ctx.beginPath(); ctx.moveTo(g.X(10), g.B); pts.forEach(function (p) { ctx.lineTo(g.X(p[0]), g.Y(p[1])); }); ctx.lineTo(g.X(35), g.B); ctx.closePath(); ctx.fillStyle = ag; ctx.fill();
      ctx.restore();
      K.plot(ctx, g, pts, KC.blue, { w: 3 });
      [[25, "rgba(220,228,255,.9)"], [T2, "rgba(255,170,120,.95)"]].forEach(function (p, i) {
        var px = g.X(p[0]), py = g.Y(es(p[0]));
        ctx.strokeStyle = p[1]; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, g.B); ctx.lineTo(px, py); ctx.lineTo(g.L, py); ctx.stroke(); ctx.setLineDash([]);
        K.glow(ctx, px, py, 4.5, p[1], 4);
        if (i === 0 || d > 0) K.pill(ctx, es(p[0]).toFixed(1) + " hPa", px + (i ? 12 : -12), py + (i ? -6 : 18), { a: i ? "left" : "right", s: 11.5, c: i ? KC.orange : "#d6defa", box: [RX, W] });
      });
      K.pill(ctx, "곡선이 위로 휘어 있어, 따뜻할수록 1 ℃의 효과가 더 큽니다", g.L + 10, g.T + 22, { s: 11, c: KC.mute });
      return inc;
    }
    function update() {
      var inc = draw();
      rd("cc-read", kv("기온", "25 → " + (25 + d).toFixed(1) + " ℃", "y") + kv("포화 수증기압", es(25).toFixed(1) + " → " + es(25 + d).toFixed(1) + " hPa", "b") +
        kv("품을 수 있는 수증기", "+" + inc.toFixed(1) + " %", inc >= 12 && inc <= 16 ? "g" : "r", "1 ℃에 약 6~7%씩"));
      $("cc-info").innerHTML = "기온이 " + d.toFixed(1) + " ℃ 오르면 공기가 품을 수 있는 수증기가 약 <b>" + inc.toFixed(1) + "%</b> 늘어납니다. 곡선이 위로 휘어 있어 따뜻할수록 1 ℃의 효과가 더 큽니다.";
      if (inc >= 12 && inc <= 16 && !window.sthState("ccOk")) { window.sthState("ccOk", "+" + d.toFixed(1) + " ℃ → 수증기 +" + inc.toFixed(1) + "%"); mission(); }
    }
    function mission() {
      var a = window.sthState("ccOk"), b = window.sthState("wxSorted");
      if (a) window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + a + ". 약 2 ℃만 올라도 한 번에 쏟아질 수 있는 비의 재료가 10% 넘게 늘어납니다.");
      if (b) window.sthMission("m2-2b", true, "<span class='m-tag'>미션 완료</span>다섯 가지 극한 기상 현상을 정리했습니다.");
      if (a && b) ep.clear(1);
    }
    canvas._redraw = draw;
    $("cc-t").addEventListener("input", function (e) { d = +e.target.value; $("cc-t-val").textContent = "+" + d.toFixed(1) + " ℃"; update(); });
    K.animate(canvas, function (dt) {
      if (!mo.on) return;
      MOL.forEach(function (m, i) { var sp = (i % 2 ? 1.1 : 0.9) * dt * 0.00045; m.x += m.vx * sp; m.y += m.vy * sp; if (m.x < 0 || m.x > 1) { m.vx = -m.vx; m.x = clamp(m.x, 0, 1); } if (m.y < 0 || m.y > 1) { m.vy = -m.vy; m.y = clamp(m.y, 0, 1); } });
      draw();
    });
    window.sthSort({
      mount: "s2-sort",
      buckets: [{ id: "t", label: "🌀 슈퍼 태풍" }, { id: "d", label: "🏜️ 메가 가뭄" }, { id: "h", label: "🥵 열파(폭염)" }, { id: "r", label: "🌧️ 집중 호우" }, { id: "c", label: "❄️ 한파·폭설" }],
      items: [
        { t: "따뜻해진 바다에서 증발이 활발해져 잠열이 커지고 세력이 급격히 강해진다", a: "t", why: "태풍의 에너지원은 수증기가 응결할 때 나오는 잠열입니다." },
        { t: "2013년 하이옌은 순간 최대 풍속 약 105 m/s를 기록했다", a: "t", why: "우리 기상청은 최대 풍속 54 m/s 이상인 태풍을 ‘초강력’ 등급으로 분류합니다(흔히 슈퍼 태풍이라 부릅니다)." },
        { t: "미국 남서부에서 2000년부터 20년 넘게 이어져 1,200년 만에 가장 건조했다", a: "d", why: "10년~수십 년 이어지는 가뭄입니다." },
        { t: "기온이 올라 토양 수분 증발이 빨라져 가뭄이 깊어진다", a: "d", why: "온난화가 가뭄을 심화합니다.", hint: "비가 오는 것이 아니라 흙이 마르는 쪽입니다." },
        { t: "고온다습한 북태평양 고기압이 우리나라 부근에 오래 머문다", a: "h", why: "이상 고온이 며칠~몇 주 이어지는 열파의 원인입니다." },
        { t: "2024년 여름 전국 평균 기온 25.6 ℃로 1973년 관측 이래 가장 높았다", a: "h", why: "폭염 기록입니다(기상청)." },
        { t: "장마 전선과 대기 불안정으로 강한 상승 기류가 생긴다", a: "r", why: "짧은 시간 많은 비를 내리는 원인입니다." },
        { t: "2022년 8월 서울에 시간당 141.5 mm의 비가 내렸다", a: "r", why: "80년 만에 기록이 깨졌습니다." },
        { t: "시베리아 고기압이 확장해 차가운 북서풍이 강해진다", a: "c", why: "겨울 한파의 원인입니다." },
        { t: "북극이 더워져 제트 기류가 약해지고 북극의 찬 공기가 중위도로 내려온다", a: "c", why: "온난화 속 한파의 역설입니다.", hint: "북극의 ‘찬 공기’가 어디로 오나요?" }
      ],
      onDone: function () { window.sthState("wxSorted", 1); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 부리의 비밀 (자연 선택) */
  (function () {
    var canvas = $("c-bk"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var picked = !!window.sthState("parrot"), heat = 1, gen = 0, xs = [], p0 = [], p = [], i;
    for (i = 0; i <= 40; i++) { var x = 14 + i * 0.3; xs.push(x); p0.push(Math.exp(-Math.pow(x - 20, 2) / (2 * 1.5 * 1.5))); }
    function norm(a) { var s = a.reduce(function (u, w) { return u + w; }, 0); return a.map(function (w) { return w / s; }); }
    p0 = norm(p0); p = p0.slice();
    function mean(a) { return xs.reduce(function (s, x, k) { return s + x * a[k]; }, 0); }
    var M0 = mean(p0);
    function generation() {
      var m = mean(p), w = p.map(function (q, k) { return q * Math.exp(0.045 * heat * (xs[k] - m)); });
      w = norm(w);
      p = norm(w.map(function (q, k) { return 0.25 * (w[k - 1] || 0) + 0.5 * q + 0.25 * (w[k + 1] || 0); }));
      gen++;
    }
    function parrot(cx, cy, k) {
      /* 머리·몸 */
      var bg = ctx.createRadialGradient(cx - 30, cy - 20, 8, cx, cy + 10, 90); bg.addColorStop(0, "#7ee08a"); bg.addColorStop(1, "#1f6e3a");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(cx - 10, cy + 40, 58, 72, 0.15, 0, 6.2832); ctx.fill();
      var hg = ctx.createRadialGradient(cx - 14, cy - 26, 6, cx, cy - 10, 56); hg.addColorStop(0, "#a8f0a8"); hg.addColorStop(1, "#2e8a4a");
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(cx, cy - 10, 48, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#e9f6e4"; ctx.beginPath(); ctx.ellipse(cx + 16, cy - 16, 16, 13, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#1b1b1b"; ctx.beginPath(); ctx.arc(cx + 19, cy - 17, 6, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx + 21, cy - 19, 2, 0, 6.2832); ctx.fill();
      /* 부리(크기 k배) */
      ctx.save(); ctx.translate(cx + 38, cy - 8); ctx.scale(k, k);
      var kg = ctx.createLinearGradient(0, -18, 30, 30); kg.addColorStop(0, "#ffe08a"); kg.addColorStop(1, "#d9822b");
      ctx.fillStyle = kg; ctx.beginPath(); ctx.moveTo(0, -16); ctx.quadraticCurveTo(34, -18, 30, 18); ctx.quadraticCurveTo(26, 28, 18, 24); ctx.quadraticCurveTo(22, 8, 0, 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#c97a2a"; ctx.beginPath(); ctx.moveTo(0, 6); ctx.quadraticCurveTo(16, 8, 14, 18); ctx.quadraticCurveTo(4, 18, 0, 14); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    function draw() {
      var m = mean(p), inc = (m / M0 - 1) * 100, mxv = Math.max.apply(null, p0.concat(p)) * 1.15;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 무리의 평균 앵무 ── */
      var LW = 290;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 28 });
      var sh = ctx.createRadialGradient(LW - 40, 40, 4, LW - 40, 40, 120); sh.addColorStop(0, "rgba(255,170,60," + (0.15 + 0.35 * heat).toFixed(2) + ")"); sh.addColorStop(1, "rgba(255,150,40,0)");
      ctx.fillStyle = sh; ctx.fillRect(0, 0, LW, H);
      K.sun(ctx, LW - 40, 46, 6 + 8 * heat);
      ctx.strokeStyle = "#6b4a2a"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(20, H - 54); ctx.lineTo(LW - 20, H - 70); ctx.stroke(); ctx.lineCap = "butt";
      parrot(118, 150, m / M0);
      K.pill(ctx, "무리의 평균 앵무", 14, 28, { s: 13, c: KC.blue });
      K.pill(ctx, "더위 " + Math.round(heat * 100) + "%", LW - 74, 50, { a: "right", s: 11.5, c: KC.orange });
      K.pill(ctx, "평균 부리 " + m.toFixed(2) + " mm", LW / 2, H - 18, { a: "center", s: 12, c: KC.yellow });
      K.warn(ctx, 14, H - 48, "⚠ 부리 크기 변화는 과장");

      /* ── 오른쪽: 부리 길이 분포 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 29 });
      K.pill(ctx, "무리의 부리 길이 분포 · " + gen + "세대 뒤", RX + 14, 28, { s: 13, c: KC.blue });
      var lg = K.pill(ctx, "┄ 처음 무리", W - 14, 28, { a: "right", s: 11.5, c: "#d6defa" });
      K.pill(ctx, "▮ 지금 무리", lg.x - 8, 28, { a: "right", s: 11.5, c: KC.violet });
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 8, h: H - 48, x0: 14, x1: 26, y0: 0, y1: mxv, xt: 4, yt: 1, xl: "부리 길이(mm)", yf: function () { return ""; }, xf: function (vv) { return vv + " mm"; } });
      var bw = (g.X(14.3) - g.X(14)) * .8;
      ctx.save(); ctx.shadowColor = KC.violet; ctx.shadowBlur = 6;
      xs.forEach(function (b, k) { var top = g.Y(p[k]), bgd = ctx.createLinearGradient(0, top, 0, g.B); bgd.addColorStop(0, "#d4c2ff"); bgd.addColorStop(1, "#6a4fd0"); ctx.fillStyle = bgd; ctx.fillRect(g.X(b) - bw / 2, top, bw, g.B - top); });
      ctx.restore();
      K.plot(ctx, g, xs.map(function (b, k) { return [b, p0[k]]; }), "rgba(220,228,255,.85)", { w: 2, dash: [5, 4], glow: false });
      ctx.strokeStyle = "rgba(220,228,255,.6)"; ctx.setLineDash([3, 4]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(g.X(M0), g.T); ctx.lineTo(g.X(M0), g.B); ctx.stroke(); ctx.setLineDash([]);
      ctx.save(); ctx.shadowColor = KC.orange; ctx.shadowBlur = 8; ctx.strokeStyle = KC.orange; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(g.X(m), g.T); ctx.lineTo(g.X(m), g.B); ctx.stroke(); ctx.restore();
      K.pill(ctx, "평균 " + m.toFixed(2) + " mm", g.X(m) + 8, g.T + 22, { s: 11.5, c: KC.orange, box: [RX, W] });
      K.t(ctx, "막대 = 그 부리 길이를 가진 개체의 비율", g.L + 4, g.B + 30, { s: 10.5, c: KC.dim });
      return inc;
    }
    function bkRead(inc) {
      rd("bk-read", kv("지난 세대", gen + "세대", "y") + kv("평균 부리", mean(p).toFixed(2) + " mm", "b", "처음 " + M0.toFixed(2) + " mm") +
        kv("처음보다", (inc >= 0 ? "+" : "") + inc.toFixed(1) + " %", inc >= 4 && inc <= 10 ? "g" : "r"));
    }
    function after() {
      var inc = draw(); bkRead(inc);
      $("bk-info").innerHTML = "세대마다 더위 속에서 <b>부리가 큰 개체가 조금 더 많이 살아남아</b> 자손을 남깁니다. 개체 하나하나의 부리가 자라는 것이 아니라, 무리 안의 비율이 달라집니다.";
      if (inc >= 4 && inc <= 10 && !ep.cleared(2)) {
        window.sthState("beakBest", gen + "세대 뒤 평균 부리 +" + inc.toFixed(1) + "%");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("beakBest") + ". 부리가 ‘커지려고 노력한’ 것이 아니라, 원래 다양했던 개체 가운데 큰 부리를 가진 개체가 더 많이 살아남았습니다.");
        if (picked) ep.clear(2);
      }
    }
    function guard() { if (!picked) { $("bk-info").innerHTML = "먼저 위에서 예상을 고르세요."; return false; } return true; }
    window.sthGate({
      gate: "g2b", key: "parrot", title: "먼저 예상해 봅시다",
      question: "기온이 오르자 앵무새의 <b>부리가 커졌습니다.</b> 왜 그럴까요?",
      options: ["㉠ 체온을 발산하려고 부리를 키웠다", "㉡ 부리가 큰 개체가 살아남았다", "㉢ 먹이가 커져서 부리도 커졌다", "㉣ 부리를 많이 써서 커졌다"],
      onPick: function (k) {
        picked = true;
        window.sthState("parrotOK", k === 1 ? "맞음" : "어긋남");
        if (ep.cleared(2) || window.sthState("beakBest")) ep.clear(2);
      }
    });
    canvas._redraw = draw;
    $("bk-h").addEventListener("input", function (e) { heat = +e.target.value / 100; $("bk-h-val").textContent = e.target.value + "%"; draw(); });
    $("bk-g1").addEventListener("click", function () { if (!guard()) return; generation(); after(); });
    $("bk-g5").addEventListener("click", function () { if (!guard()) return; for (var k = 0; k < 5; k++) generation(); after(); });
    bkRead(draw());
    $("bk-info").innerHTML = "세대 버튼을 눌러 무리가 어떻게 바뀌는지 보세요.";
    if (ep.cleared(2)) window.sthMission("m2-3", true);
  })();

  /* 장면 4 — SSP 시나리오 */
  (function () {
    var canvas = $("c-ssp"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, pct = 50;
    var got = window.sthState("sspGot") || { a: false, b: false };
    var LV = [
      { min: 80, n: "SSP1-2.6 친환경 성장", d: "재생 에너지로 화석 연료 사용을 최소화하는 가장 이상적인 경로" },
      { min: 60, n: "SSP2-4.5 중도 성장", d: "지금 추세를 유지하며 완화와 발전이 중간 수준으로 진행" },
      { min: 40, n: "SSP4-6.0 불평등 성장", d: "나라 사이·안의 격차가 커서 감축과 적응이 고르지 못함" },
      { min: 20, n: "SSP3-7.0 지역 경쟁", d: "인구 급증·느린 기술 변화, 완화 정책에 소극적" },
      { min: 0, n: "SSP5-8.5 고속 성장(최악)", d: "화석 연료에 의존한 빠른 개발, 2081~2100년 지구 기온 약 4.4 ℃ 상승(최선 추정값)" }
    ];
    function lv() { for (var k = 0; k < LV.length; k++) if (pct >= LV[k].min) return LV[k]; return LV[4]; }
    function vals() { var t = pct / 100; return { temp: 4.93 + (2.07 - 4.93) * t, sea: 1.1 + (0.72 - 1.1) * t }; }
    function draw() {
      var s = vals(), L = lv(), k;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 2100년의 해안 단면 ── */
      var LW = 470, base = 214, mpx = 50, sl = base - s.sea * mpx, warm = clamp((s.temp - 2) / 3, 0, 1);
      function shore(x) { return base + 34 - (x - 150) * 0.3; }
      K.stage(ctx, 0, 0, LW, H, "ocean", { seed: 30 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var sk = ctx.createLinearGradient(0, 0, 0, base); sk.addColorStop(0, "#0b1a3a"); sk.addColorStop(1, "#2b5d93"); ctx.fillStyle = sk; ctx.fillRect(0, 0, LW, base + 40);
      var wg = ctx.createLinearGradient(0, sl, 0, H);
      wg.addColorStop(0, "rgba(" + Math.round(40 + 200 * warm) + "," + Math.round(130 - 30 * warm) + "," + Math.round(200 - 120 * warm) + ",.95)"); wg.addColorStop(.45, "#0d4f86"); wg.addColorStop(1, "#04142e");
      ctx.fillStyle = wg; ctx.fillRect(0, sl, LW, H - sl);
      /* 갯벌·습지와 육지 */
      ctx.beginPath(); ctx.moveTo(150, base + 34); for (var x = 150; x <= LW; x += 10) ctx.lineTo(x, shore(x)); ctx.lineTo(LW, H); ctx.lineTo(150, H); ctx.closePath();
      var lg = ctx.createLinearGradient(0, 120, 0, H); lg.addColorStop(0, "#7a6648"); lg.addColorStop(1, "#2c2116"); ctx.fillStyle = lg; ctx.fill();
      ctx.fillStyle = "rgba(110,170,90,.85)"; ctx.beginPath(); ctx.moveTo(150, base + 34); for (x = 150; x <= 330; x += 10) ctx.lineTo(x, shore(x)); for (x = 330; x >= 150; x -= 10) ctx.lineTo(x, shore(x) + 7); ctx.closePath(); ctx.fill();
      for (k = 0; k < 9; k++) { var gx = 168 + k * 18; ctx.strokeStyle = "rgba(150,210,110,.9)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx, shore(gx)); ctx.lineTo(gx - 3, shore(gx) - 9); ctx.moveTo(gx, shore(gx)); ctx.lineTo(gx + 3, shore(gx) - 8); ctx.stroke(); }
      /* 물에 잠긴 갯벌: 물은 땅 위(sl ~ 지면)에만 보인다 */
      ctx.save(); ctx.beginPath(); ctx.rect(150, sl, LW - 150, H - sl); ctx.clip();
      ctx.fillStyle = wg; ctx.beginPath(); ctx.moveTo(150, sl); for (x = 150; x <= LW; x += 10) ctx.lineTo(x, Math.max(sl, shore(x))); ctx.lineTo(LW, sl); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "rgba(255,211,107,.9)"; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, base); ctx.lineTo(LW, base); ctx.stroke();
      var y08 = base - 0.8 * mpx; ctx.strokeStyle = "rgba(63,211,163,.8)"; ctx.beginPath(); ctx.moveTo(0, y08); ctx.lineTo(LW, y08); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(200,240,255,.95)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, sl); ctx.lineTo(LW, sl); ctx.stroke();
      ctx.restore();
      /* 온도계 */
      var tx = 40, tt = 64, tb = 186, fill = tb - (s.temp / 5.5) * (tb - tt);
      ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.beginPath(); ctx.roundRect(tx - 7, tt - 6, 14, tb - tt + 12, 7); ctx.fill();
      var tg = ctx.createLinearGradient(0, fill, 0, tb); tg.addColorStop(0, "#ff6b81"); tg.addColorStop(1, "#ffb35c");
      ctx.fillStyle = tg; ctx.fillRect(tx - 4, fill, 8, tb - fill); ctx.beginPath(); ctx.arc(tx, tb + 6, 10, 0, 6.2832); ctx.fill();
      K.pill(ctx, "2100년 우리나라 주변 바다", 14, 28, { s: 13, c: KC.blue });
      K.pill(ctx, "해수 온도 +" + s.temp.toFixed(2) + " ℃", tx + 18, fill + 5, { s: 11.5, c: KC.orange });
      K.pill(ctx, "지금 해수면", LW - 14, base + 20, { a: "right", s: 11, c: KC.yellow });
      K.pill(ctx, "0.8 m", 110, y08 - 6, { a: "right", s: 11, c: KC.green });
      K.pill(ctx, "2100년 +" + s.sea.toFixed(2) + " m", LW - 14, sl - 8, { a: "right", s: 12, c: "#cfeaff" });
      K.pill(ctx, "갯벌·연안 습지", 240, H - 14, { a: "center", s: 11, c: "#bfe7a8" });
      K.warn(ctx, 14, H - 14, "⚠ 높이 과장");

      /* ── 오른쪽: 다섯 가지 경로 ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 31 });
      K.pill(ctx, "공통 사회경제 경로(SSP)", RX + 14, 28, { s: 13, c: KC.blue });
      LV.slice().reverse().forEach(function (o, i) {
        var y = 62 + i * 30, cur = o === L, col = o.min >= 80 ? KC.green : (o.min < 20 ? KC.red : KC.ink);
        if (cur) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.fillStyle = "rgba(127,211,255,.14)"; ctx.beginPath(); ctx.roundRect(RX + 12, y - 18, RW - 24, 26, 8); ctx.fill(); ctx.restore(); }
        K.t(ctx, (cur ? "▶ " : "   ") + o.n, RX + 22, y, { s: cur ? 13 : 12, w: cur ? "900" : "600", c: cur ? col : KC.dim });
        K.t(ctx, "감축 " + o.min + "%~", RX + RW - 22, y, { s: 10.5, a: "right", c: cur ? KC.mute : KC.dim });
      });
      wrapT(ctx, L.d, RX + 22, 232, RW - 44, 19, { s: 12, c: KC.mute });
      return s;
    }
    function update() {
      var s = draw(), ch = false;
      rd("ssp-read", kv("경로", lv().n.split(" ")[0], pct >= 80 ? "g" : (pct < 20 ? "r" : "y"), lv().n.split(" ").slice(1).join(" ")) +
        kv("해수 온도", "+" + s.temp.toFixed(2) + " ℃", "r") + kv("해수면", "+" + s.sea.toFixed(2) + " m", "b") +
        okp(s.sea < 0.8, s.sea < 0.8 ? "0.8 m 미만으로 묶였습니다" : "0.8 m를 넘습니다"));
      $("ssp-info").innerHTML = "감축 노력 " + pct + "% → 해수 온도 <b>+" + s.temp.toFixed(2) + " ℃</b>, 해수면 <b>+" + s.sea.toFixed(2) + " m</b>. 해수면이 오르면 연안 습지와 갯벌이 잠기고, 수온이 오르면 한류성 어종은 북쪽으로 밀려납니다.";
      if (pct < 20 && !got.a) { got.a = ch = true; }
      if (pct >= 80 && s.sea < 0.8 && !got.b) { got.b = ch = true; got.p = pct; }
      if (ch) { window.sthState("sspGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-4a"); if (got.b) done("m2-4b");
      if (got.a && got.b) {
        window.sthState("sspBest", "감축 노력 " + got.p + "% 이상 → 해수면 0.8 m 미만 (SSP1-2.6)");
        window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>해수면을 0.8 m 아래로 묶으려면 감축 노력이 약 <b>80% 이상</b>, 곧 SSP1-2.6에 가까운 경로여야 합니다. 그래도 해수면은 0.7 m 넘게 오릅니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("ssp-p").addEventListener("input", function (e) { pct = +e.target.value; $("ssp-p-val").textContent = pct + "%"; update(); });
    update(); mission();
  })();

  function finish() { window.sthState("r2", "해결 · " + (window.sthState("ccOk") || "") + " / " + (window.sthState("sspBest") || "")); }
  function vs() {
    var p = firstPick("p2"), q = window.sthState("parrotOK");
    $("e2-vs").innerHTML = "<b>나의 첫 답변</b> " + (p || "기록 없음") + "<br><b>앵무 부리 예상</b> " + (q === "맞음" ? "자연 선택으로 정확히 예상" : (q ? "처음엔 ‘하려고 커졌다’고 생각했지만 모형에서 자연 선택을 확인" : "-")) + "<br><b>나의 예보</b> " + (window.sthState("sspBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[기후변화와 환경생태 Ⅱ] 이야기 ② 2100년의 일기 예보",
    items: [
      { id: "w1", label: "자연 선택으로 다시 쓰기", hint: "오개념 상자의 앵무 사례를 자연 선택설의 언어로 다시 써 보세요. \"~하기 위해\"라는 표현은 쓰지 말 것." },
      { id: "w3", label: "시나리오가 갈리는 지점", hint: "SSP 시나리오 둘을 골라, 무엇이 달라서 결과가 갈리는지 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 39만 봉군이 사라진 겨울
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "p3", title: "조사원의 첫 추측",
    question: "겨울을 나던 꿀벌이 벌통에서 사라진 까닭으로 가장 그럴듯한 것은?",
    options: ["㉠ 겨울이 너무 추워 벌통 안에서 얼어 죽었다", "㉡ 따뜻한 날 밖으로 나갔다가 먹이를 못 찾고 추위에 돌아오지 못했다", "㉢ 누군가 벌통을 훔쳐 갔다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 개화 자료 */
  (function () {
    var canvas = $("c-bloom"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var D = [["인천", null, null, 3], ["서울", 1, 6, 6], ["대구", null, 11, 7], ["부산", 4, null, 4], ["목포", null, 8, 7], ["강릉", 1, null, 6]];
    var C = ["--amber", "--rose", "--violet"], N = ["개나리", "진달래", "벚나무"];
    var FL = [["#ffd84a", "#c99a10"], ["#ff7fb0", "#b83a74"], ["#ffd6e6", "#c98aa6"]];
    function draw() {
      ctx.clearRect(0, 0, W, H);
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 32 });
      K.pill(ctx, "1980년대보다 개화가 빨라진 날 수 (자료가 있는 꽃만)", 16, 28, { s: 13, c: KC.blue });
      var px = W - 16;
      N.slice().reverse().forEach(function (n, i) { var s2 = 2 - i, b = K.pill(ctx, n, px, 28, { a: "right", s: 11.5, c: FL[s2][0] }); flower(ctx, b.x - 9, 23, 7, FL[s2][0]); px = b.x - 24; });
      var g = K.chart(ctx, { x: 6, y: 44, w: W - 12, h: H - 48, x0: 0, x1: D.length, y0: 0, y1: 12, xt: D.length, yt: 3, xf: function () { return ""; }, yf: function (vv) { return vv + "일"; } });
      var gw = g.X(1) - g.X(0), bw = gw * .22;
      D.forEach(function (r, k) {
        var cxg = g.X(k + .5);
        for (var s = 0; s < 3; s++) {
          var bx = cxg + (s - 1) * (bw + 6) - bw / 2;
          if (r[s + 1] == null) { K.t(ctx, "–", bx + bw / 2, g.B - 6, { s: 11, a: "center", c: KC.dim }); continue; }
          var top = g.Y(r[s + 1]), bg = ctx.createLinearGradient(0, top, 0, g.B); bg.addColorStop(0, FL[s][0]); bg.addColorStop(1, FL[s][1]);
          ctx.save(); ctx.shadowColor = FL[s][0]; ctx.shadowBlur = 8; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(bx, top, bw, g.B - top, [5, 5, 0, 0]); ctx.fill(); ctx.restore();
          flower(ctx, bx + bw / 2, top - 20, 6, FL[s][0]);
          K.t(ctx, r[s + 1] + "", bx + bw / 2, top - 32, { s: 10.5, a: "center", c: KC.ink });
        }
        K.t(ctx, r[0], cxg, g.B + 18, { s: 12, w: "800", a: "center", c: KC.ink });
      });
      K.t(ctx, "– = 자료 없음", g.R, g.B + 30, { s: 10.5, a: "right", c: KC.dim });
    }
    canvas._redraw = draw; draw();
    window.sthPick({
      mount: "s3-q1",
      q: "자료에서 알 수 있는 것으로 가장 알맞은 것은?",
      options: ["모든 지역에서 개화 시기가 똑같이 빨라졌다", "대구의 진달래가 11일로 가장 크게 빨라졌고, 변화 폭은 지역과 꽃마다 다르다", "강릉은 개화 시기가 늦어졌다", "벚나무는 어느 지역에서도 빨라지지 않았다"],
      answer: 1,
      why: ["인천 3일부터 대구 11일까지 지역마다 다릅니다.", "지역의 기후 조건에 따라 변화 폭이 다르지만, 자료가 있는 모든 지역에서 개화가 빨라졌습니다.", "강릉도 개나리 1일, 벚나무 6일 빨라졌습니다.", "벚나무도 3~7일 빨라졌습니다."],
      onDone: function () { window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>봄꽃은 기온에 민감해, 따뜻해진 봄에 맞춰 개화를 앞당기고 있습니다."); ep.clear(1); }
    });
    if (ep.cleared(1)) window.sthMission("m3-2", true);
  })();

  /* 장면 3 — 엇박자 */
  (function () {
    var canvas = $("c-gap"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, w = 0.5;
    function draw() {
      var fs = 8 * w, is = 3 * w, gap = fs - is, x0 = 70, x1 = W - 50, d;
      function X(s) { return x1 - (s + 10) / 40 * (x1 - x0); }
      ctx.clearRect(0, 0, W, H);
      K.stage(ctx, 0, 0, W, H, "night", { seed: 34 });
      K.pill(ctx, "봄의 시간표 · 꽃이 피어 있는 10일과 곤충이 나오는 날", 16, 28, { s: 13, c: KC.blue });
      /* 날짜 눈금 */
      for (d = -10; d <= 30; d += 5) { var tx = X(d); ctx.strokeStyle = "rgba(160,175,255,.14)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, 64); ctx.lineTo(tx, H - 40); ctx.stroke(); K.t(ctx, d > 0 ? "−" + d + "일" : (d < 0 ? "+" + (-d) + "일" : "과거의 날짜"), tx, H - 22, { s: 10.5, a: d === -10 ? "right" : "center", c: d ? KC.mute : KC.yellow }); }
      K.t(ctx, "← 더 이른 날", x0, 58, { s: 10.5, c: KC.mute });
      ctx.strokeStyle = "rgba(255,211,107,.7)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(0), 64); ctx.lineTo(X(0), H - 40); ctx.stroke(); ctx.setLineDash([]);
      /* 꽃 레인 */
      var fy = 108, fx0 = X(fs), fx1 = X(fs - 10), fg = ctx.createLinearGradient(fx0, 0, fx1, 0);
      fg.addColorStop(0, "rgba(255,127,176,.85)"); fg.addColorStop(1, "rgba(255,127,176,.25)");
      ctx.save(); ctx.shadowColor = "#ff7fb0"; ctx.shadowBlur = 12; ctx.fillStyle = fg; ctx.beginPath(); ctx.roundRect(fx0, fy - 14, fx1 - fx0, 28, 14); ctx.fill(); ctx.restore();
      for (d = 0; d < 5; d++) flower(ctx, fx0 + 14 + d * (fx1 - fx0 - 28) / 4, fy, 7, "#ffd6e6");
      K.pill(ctx, "🌸 개화 −" + fs.toFixed(1) + "일", fx0 - 8, fy + 5, { a: "right", s: 12, c: "#ffb3d0" });
      /* 곤충 레인 */
      var iy = 202, ix = X(is);
      ctx.save(); ctx.shadowColor = KC.green; ctx.shadowBlur = 8; ctx.strokeStyle = KC.green; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(x1, iy); ctx.stroke(); ctx.restore();
      K.arrow(ctx, { x: x1 - 30, y: iy }, { x: x1 + 4, y: iy }, KC.green, 4, 12);
      bee(ctx, ix, iy - 2, 1.8);
      K.pill(ctx, "🐝 곤충 활동 시작 −" + is.toFixed(1) + "일", ix - 20, iy + 5, { a: "right", s: 12, c: KC.green });
      /* 엇박자 */
      var col = gap >= 10 ? KC.red : (gap >= 8 ? KC.yellow : KC.green);
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(fx0, fy + 16); ctx.lineTo(fx0, 156); ctx.moveTo(ix, 156); ctx.lineTo(ix, iy - 14); ctx.stroke(); ctx.setLineDash([]);
      K.bracket(ctx, fx0, ix, 156, col, null, true);
      K.pill(ctx, "엇박자 " + gap.toFixed(1) + "일" + (gap >= 10 ? " · 곤충이 오기 전에 꽃이 짐" : (gap >= 8 ? " · 꽃이 지기 직전에 겨우 만남" : " · 만날 여유가 있음")), Math.max(fx0, 200), 146, { a: "left", s: 12.5, c: col });
      return gap;
    }
    function update() {
      var gap = draw();
      rd("gap-read", kv("개화", "−" + (8 * w).toFixed(1) + "일", "y", "1 ℃에 8일씩 빨라짐") + kv("곤충 활동 시작", "−" + (3 * w).toFixed(1) + "일", "g", "1 ℃에 3일씩") +
        kv("엇박자", gap.toFixed(1) + "일", gap >= 10 ? "r" : (gap >= 8 ? "y" : "g"), "꽃이 피어 있는 기간 약 10일"));
      $("gap-info").innerHTML = "봄철 기온이 " + w.toFixed(1) + " ℃ 오르면 개화는 " + (8 * w).toFixed(1) + "일, 곤충 활동은 " + (3 * w).toFixed(1) + "일 빨라져 <b>엇박자 " + gap.toFixed(1) + "일</b>. " + (gap >= 10 ? "곤충이 활동을 시작할 때 이미 꽃이 졌습니다." : (gap >= 8 ? "곤충이 꽃이 지기 직전에야 겨우 만납니다." : "아직 꽃과 곤충이 만날 여유가 있습니다."));
      if (gap >= 8 && gap < 10 && !ep.cleared(2)) {
        window.sthState("gapBest", "+" + w.toFixed(1) + " ℃ → 엇박자 " + gap.toFixed(1) + "일");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("gapBest") + ". 기온이 약 2 ℃ 넘게 오르면 이 곤충은 꽃을 만나지 못합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("gap-w").addEventListener("input", function (e) { w = +e.target.value; $("gap-w-val").textContent = "+" + w.toFixed(1) + " ℃"; update(); });
    update();
    if (ep.cleared(2)) window.sthMission("m3-3", true);
  })();

  /* 장면 4 — 월동 생존율 */
  (function () {
    var canvas = $("c-bee"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, d = 0;
    var got = window.sthState("beeGot") || { a: false, b: false };
    function surv(x) { return Math.max(10, 95 - 2.2 * x); }
    function draw() {
      var s = surv(d), k;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 벌통 ── */
      var LW = 330, hx = 70, hy = 112, hw = 150, hh = 140;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 35 });
      K.sun(ctx, LW - 46, 62, 7 + d * 0.25);
      ctx.fillStyle = "rgba(60,90,50,.9)"; ctx.fillRect(0, hy + hh, LW, H - hy - hh);
      var wg = ctx.createLinearGradient(hx, 0, hx + hw, 0); wg.addColorStop(0, "#8a5a2e"); wg.addColorStop(.5, "#c48a4c"); wg.addColorStop(1, "#7a4c24");
      ctx.fillStyle = wg; ctx.fillRect(hx, hy, hw, hh);
      ctx.strokeStyle = "rgba(60,35,15,.55)"; ctx.lineWidth = 2; for (k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(hx, hy + k * hh / 3); ctx.lineTo(hx + hw, hy + k * hh / 3); ctx.stroke(); }
      var rg = ctx.createLinearGradient(0, hy - 22, 0, hy); rg.addColorStop(0, "#b9bfca"); rg.addColorStop(1, "#6d7480");
      ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(hx - 12, hy); ctx.lineTo(hx + hw / 2, hy - 26); ctx.lineTo(hx + hw + 12, hy); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#1a1208"; ctx.beginPath(); ctx.roundRect(hx + hw / 2 - 22, hy + hh - 16, 44, 8, 4); ctx.fill();
      var Rb = K.rng(36), inside = Math.round(s / 100 * 26), lost = Math.round((100 - s) / 100 * 26);
      for (k = 0; k < inside; k++) bee(ctx, hx + 18 + (k % 7) * 19 + Rb() * 4, hy + 20 + Math.floor(k / 7) * 32 + Rb() * 6, 0.9);
      for (k = 0; k < lost; k++) { ctx.globalAlpha = 0.35 + 0.5 * Rb(); bee(ctx, hx + hw + 30 + Rb() * 110, 54 + Rb() * 150, 0.8); ctx.globalAlpha = 1; }
      K.pill(ctx, "겨울 벌통", 14, 28, { s: 13, c: KC.blue });
      if (d > 0) K.pill(ctx, "따뜻한 겨울날 " + d + "일 · 밖으로 나간 벌", LW - 14, H - 16, { a: "right", s: 11, c: KC.yellow });
      else K.pill(ctx, "추운 날에는 벌통 안에서 뭉쳐 겨울을 납니다", LW / 2, H - 16, { a: "center", s: 11, c: KC.mute });

      /* ── 오른쪽: 월동 생존율 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 37 });
      K.pill(ctx, "월동 생존율", RX + 14, 28, { s: 13, c: KC.blue });
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 8, h: H - 48, x0: 0, x1: 30, y0: 0, y1: 100, xt: 6, yt: 4, xl: "헛걸음한 날 수", xf: function (vv) { return vv + "일"; }, yf: function (vv) { return vv + "%"; } });
      var pts = []; for (var x = 0; x <= 30; x += 0.5) pts.push([x, surv(x)]);
      clipRect(ctx, g);
      ctx.fillStyle = "rgba(255,107,129,.10)"; ctx.fillRect(g.L, g.T, g.R - g.L, g.Y(s) - g.T);
      ctx.strokeStyle = "rgba(255,211,107,.6)"; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(g.L, g.Y(57)); ctx.lineTo(g.R, g.Y(57)); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      K.plot(ctx, g, pts, KC.green, { w: 3 });
      ctx.strokeStyle = "rgba(255,179,92,.7)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(g.X(d), g.B); ctx.lineTo(g.X(d), g.Y(s)); ctx.stroke(); ctx.setLineDash([]);
      K.glow(ctx, g.X(d), g.Y(s), 5, "rgba(255,179,92,.95)", 4);
      K.pill(ctx, "생존 " + s.toFixed(0) + "% · 피해 " + (100 - s).toFixed(0) + "%", g.X(d) + 12, g.Y(s) - 12, { s: 11.5, c: KC.orange, box: [RX, W] });
      K.pill(ctx, "전라남도 피해율 43.0% 수준", g.R - 6, g.Y(57) + 20, { a: "right", s: 11, c: KC.yellow });
      return 100 - s;
    }
    function update() {
      var dmg = draw();
      rd("bee-read", kv("헛걸음", d + "일", "y") + kv("생존율", (100 - dmg).toFixed(0) + "%", "g") +
        kv("피해율", dmg.toFixed(0) + "%", dmg >= 40 && dmg <= 46 ? "g" : "r", "전라남도 실제 피해율 43.0%"));
      $("bee-info").innerHTML = "헛걸음 하루마다 벌은 먹이 없이 에너지를 쓰고, 일부는 추위에 돌아오지 못합니다. 헛걸음 " + d + "일 → 피해율 약 <b>" + dmg.toFixed(0) + "%</b>.";
      if (dmg >= 40 && dmg <= 46 && !got.a) { got.a = true; got.d = d; window.sthState("beeGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-4a"); if (got.b) done("m3-4b");
      if (got.a && got.b) {
        window.sthState("beeBest", "헛걸음 약 " + got.d + "일 → 피해율 40%대");
        window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>겨울에 따뜻한 날이 2주 넘게 이어지면 피해율이 40%를 넘습니다. 기후 요인과 다른 원인이 겹쳐 피해가 커집니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("bee-d").addEventListener("input", function (e) { d = +e.target.value; $("bee-d-val").textContent = d + "일"; update(); });
    window.sthSort({
      mount: "s3-sort",
      buckets: [{ id: "c", label: "기후변화와 관련된 원인" }, { id: "o", label: "다른 원인" }],
      items: [
        { t: "겨울철 이상 고온으로 벌이 일찍 밖에 나갔다가 돌아오지 못함", a: "c", why: "따뜻한 겨울의 덫입니다." },
        { t: "개화 시기와 벌의 활동 시기가 어긋나 꽃꿀·꽃가루가 모자람", a: "c", why: "생태계 엇박자입니다." },
        { t: "폭염·폭우가 잦아 꽃꿀이 잘 만들어지지 않음", a: "c", why: "극한 기상이 밀원을 줄입니다." },
        { t: "꿀벌응애 같은 기생충과 바이러스 병", a: "o", why: "기후와 별개로 꿀벌을 약하게 만드는 큰 원인입니다.", hint: "기온과 직접 관계된 일인가요?" },
        { t: "농약에 노출됨", a: "o", why: "사람이 쓰는 화학 물질입니다." },
        { t: "개발로 밀원 식물이 자라던 땅이 줄어듦", a: "o", why: "토지 이용의 변화입니다." }
      ],
      onDone: function () { got.b = true; window.sthState("beeGot", got); mission(); }
    });
    update(); mission();
  })();

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("gapBest") || "") + " / " + (window.sthState("beeBest") || "")); }
  function vs() {
    var p = firstPick("p3");
    $("e3-vs").innerHTML = "<b>나의 첫 추측</b> " + (p || "기록 없음") + "<br><b>엇박자 한계</b> " + (window.sthState("gapBest") || "-") + "<br><b>월동 피해</b> " + (window.sthState("beeBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[기후변화와 환경생태 Ⅱ] 이야기 ③ 39만 봉군이 사라진 겨울",
    items: [
      { id: "e3a", label: "양봉 조합에 보내는 보고서", hint: "꿀벌이 사라진 원인을 기후변화와 연결해 두 가지 이상 쓰고, 다른 원인도 함께 밝히세요." },
      { id: "e3b", label: "개화 시기 변화와 우리 생활", hint: "개화 시기가 빨라질 때 우리 생활(농업, 건강, 지역 축제 등)에 생기는 영향을 하나 골라 설명하세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 초록 강, 여름 모기
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "사건 파일 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "p4", title: "조사관의 첫 추리",
    question: "올여름 녹조가 유난히 심한 까닭으로 가장 그럴듯한 것은?",
    options: ["㉠ 물이 뜨거워지고 영양염이 많이 흘러들어서", "㉡ 물고기가 너무 많아져서", "㉢ 비가 많이 와서 물이 깨끗해져서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 호수 */
  (function () {
    var canvas = $("c-lake"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, T = 22, n = 100;
    var got = window.sthState("lakeGot") || { a: false, b: false };
    function algae(t, N) { var r = 0.12 * Math.pow(1.07, t - 20) * N / (N + 0.5), st = t > 24 ? 1 + 0.06 * (t - 24) : 1; return 200 * Math.exp(18 * r * st); }
    var mo = motion("lk-play"), tt = 0, RA = K.rng(38), ALG = [];
    for (var q = 0; q < 160; q++) ALG.push({ x: RA(), y: RA(), p: RA() * 6.28 });
    function draw() {
      var c = algae(T, n / 100), strat = T > 24, k, g = clamp(Math.log(c / 200) / Math.log(60), 0, 1);
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 호수 단면 ── */
      var LW = 540, x0 = 20, x1 = LW - 20, top = 92, bot = H - 22;
      K.stage(ctx, 0, 0, LW, H, "sky", { seed: 39 });
      K.sun(ctx, 470, 48, 11);
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      ctx.fillStyle = "#4c6b3a"; ctx.fillRect(0, top - 6, LW, H - top + 6);
      ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x1, top); ctx.quadraticCurveTo(x1 - 10, bot, LW / 2, bot); ctx.quadraticCurveTo(x0 + 10, bot, x0, top); ctx.closePath();
      var wg = ctx.createLinearGradient(0, top, 0, bot); wg.addColorStop(0, "#1d6fa8"); wg.addColorStop(1, "#06213f"); ctx.fillStyle = wg; ctx.fill();
      ctx.save(); ctx.clip();
      var warmD = strat ? 70 : 0;
      if (strat) {
        ctx.fillStyle = "rgba(255,120,80," + (.25 + (T - 24) * 0.05).toFixed(2) + ")"; ctx.fillRect(x0, top, x1 - x0, warmD);
        ctx.strokeStyle = "rgba(255,200,170,.7)"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]); ctx.beginPath(); for (var xx = x0; xx <= x1; xx += 8) { var yy = top + warmD + 3 * Math.sin(xx / 30 + tt / 900); if (xx === x0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); } ctx.stroke(); ctx.setLineDash([]);
      }
      /* 빛줄기: 조류가 많을수록 얕게 */
      var depth = (bot - top) * (1 - 0.8 * g);
      for (k = 0; k < 6; k++) { var lx = 60 + k * 78 + 10 * Math.sin(tt / 1200 + k), lg = ctx.createLinearGradient(0, top, 0, top + depth); lg.addColorStop(0, "rgba(255,240,190,.28)"); lg.addColorStop(1, "rgba(255,240,190,0)"); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(lx, top); ctx.lineTo(lx + 22, top); ctx.lineTo(lx + 40, top + depth); ctx.lineTo(lx + 8, top + depth); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = "rgba(60,170,70," + (0.12 + 0.6 * g).toFixed(2) + ")"; ctx.fillRect(x0, top, x1 - x0, 10 + 26 * g);
      var na = Math.round(10 + 150 * g);
      for (k = 0; k < na; k++) { var a = ALG[k], ax = x0 + a.x * (x1 - x0), ay = top + 4 + Math.pow(a.y, 2.2) * (strat ? warmD + 20 : 160) + 3 * Math.sin(tt / 700 + a.p); K.glow(ctx, ax, ay, 1.7, "rgba(120,255,120,.9)", 3); }
      ctx.restore();
      ctx.restore();
      K.pill(ctx, "호수 단면 · 수면 " + T + " ℃ · 영양염 " + n + "%", 14, 28, { s: 13, c: KC.blue });
      if (strat) { K.pill(ctx, "따뜻한 윗물", x1 - 10, top + 30, { a: "right", s: 11.5, c: "#ffd2bf" }); K.pill(ctx, "성층: 위아래가 섞이지 않음", LW / 2, top + warmD + 24, { a: "center", s: 11, c: "#ffd2bf" }); }
      else K.pill(ctx, "위아래 물이 잘 섞임", x1 - 10, top + 30, { a: "right", s: 11.5, c: "#cfeaff" });
      K.pill(ctx, "차가운 아랫물", LW / 2, bot - 22, { a: "center", s: 11.5, c: "#cfeaff" });
      K.pill(ctx, "남세균(초록 점)", x0 + 14, top + 30, { s: 11, c: "#a8ff9f" });

      /* ── 오른쪽: 남세균 계기 ── */
      var RX = LW + 8, RW = W - RX, gx = RX + 70, gy0 = 70, gy1 = H - 40, lv = function (val) { return gy1 - (Math.log(val) / Math.LN10 - 2) / 3 * (gy1 - gy0); };
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 40 });
      K.pill(ctx, "남세균 수 (세포/mL)", RX + 14, 28, { s: 13, c: KC.blue });
      ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.roundRect(gx, gy0, 34, gy1 - gy0, 17); ctx.fill();
      var cy = clamp(lv(Math.max(c, 100)), gy0, gy1), col = c >= 5000 ? "#ff6b81" : (c < 1000 ? "#3fd3a3" : "#ffd36b");
      var bg = ctx.createLinearGradient(0, cy, 0, gy1); bg.addColorStop(0, col); bg.addColorStop(1, "rgba(63,211,163,.35)");
      ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(gx + 4, cy, 26, gy1 - cy - 4, 13); ctx.fill(); ctx.restore();
      [[100, "100"], [1000, "1,000"], [10000, "10,000"], [100000, "100,000"]].forEach(function (m) { K.t(ctx, m[1], gx - 8, lv(m[0]) + 4, { s: 10.5, a: "right", c: KC.mute }); });
      [[1000, "안전 기준 1,000", KC.green], [5000, "경보 기준 5,000 (모형)", KC.red]].forEach(function (m) { var yy2 = lv(m[0]); ctx.strokeStyle = m[2]; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(gx - 4, yy2); ctx.lineTo(RX + RW - 16, yy2); ctx.stroke(); ctx.setLineDash([]); K.t(ctx, m[1], RX + RW - 16, yy2 - 6, { s: 10.5, a: "right", c: m[2] }); });
      K.pill(ctx, Math.round(c).toLocaleString(), gx + 44, cy + 5, { s: 13, c: col, box: [RX, W] });
      K.t(ctx, "(눈금은 10배씩)", gx + 17, gy1 + 22, { s: 10, a: "center", c: KC.dim });
      return c;
    }
    function update() {
      var c = draw(), ch = false;
      rd("lk-read", kv("남세균 수", Math.round(c).toLocaleString() + " 세포/mL", c >= 5000 ? "r" : (c < 1000 ? "g" : "y")) +
        kv("상태", c >= 5000 ? "🚨 녹조 경보" : (c < 1000 ? "✅ 안전" : "⚠️ 주의"), c >= 5000 ? "r" : (c < 1000 ? "g" : "y"), "모형 기준: 안전 1,000 미만 · 경보 5,000 이상") +
        kv("성층", T > 24 ? "강함" : "약함", T > 24 ? "r" : "b", T > 24 ? "떠오르는 남세균에 유리" : "물이 잘 섞임"));
      $("lk-info").innerHTML = "수온이 높을수록 남세균이 빨리 불어나고, 영양염(질소·인)이 많을수록 불어날 재료가 많습니다. 수온 25 ℃가 넘으면 성층이 강해져 남세균이 더 유리해집니다.";
      if (c >= 5000 && !got.a) { got.a = ch = true; }
      if (T >= 30 && c < 1000 && !got.b) { got.b = ch = true; got.n = n; }
      if (ch) { window.sthState("lakeGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-2a"); if (got.b) done("m4-2b");
      if (got.a && got.b) {
        window.sthState("lakeBest", "수온 30 ℃ 이상에서도 영양염 " + got.n + "% 이하로 녹조 억제");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>수온은 우리가 바로 낮출 수 없지만, <b>영양염을 줄이면</b> 더운 여름에도 녹조를 막을 수 있습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("lk-t").addEventListener("input", function (e) { T = +e.target.value; $("lk-t-val").textContent = T + " ℃"; update(); });
    $("lk-n").addEventListener("input", function (e) { n = +e.target.value; $("lk-n-val").textContent = n + "%"; update(); });
    K.animate(canvas, function (dt) { if (mo.on) { tt += dt; draw(); } });
    update(); mission();
  })();

  /* 장면 3 — 원인과 결과의 순서 */
  var STEPS = ["수온이 오르고 영양염이 흘러든다", "남세균이 대량으로 늘어 녹조가 생긴다", "물속으로 들어가는 빛이 막혀 수생 식물의 광합성이 줄어든다", "죽은 조류가 분해되면서 물속 산소가 줄어든다", "물고기가 떼죽음을 당하고 생물다양성이 줄어든다"];
  if (ep.cleared(2)) {
    $("s4-order").innerHTML = "<div class='order sort'><div class='slots'>" + STEPS.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>";
    window.sthMission("m4-3", true);
  } else {
    window.sthOrder({ mount: "s4-order", steps: STEPS, onDone: function () { window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>녹조는 빛과 산소를 빼앗아 물속 생물다양성을 떨어뜨립니다."); ep.clear(2); } });
  }

  /* 장면 4 — 모기의 계절 */
  (function () {
    var canvas = $("c-mos"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, d = 0;
    var got = window.sthState("mosGot") || { a: false, b: false };
    function Tday(day, dd) { return 12.5 + dd - 14 * Math.cos(2 * Math.PI * (day - 15) / 365); }
    function season(dd) { var c = 0; for (var k = 0; k < 365; k++) if (Tday(k, dd) >= 15) c++; return c; }
    var S0 = season(0);
    var MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function md(k) { var m = 0; k = Math.round(k); while (m < 11 && k >= MD[m]) { k -= MD[m]; m++; } return (m + 1) + "월 " + (k + 1) + "일"; }
    function draw() {
      var s = season(d), k, st = -1, en = -1;
      for (k = 0; k < 365; k++) if (Tday(k, d) >= 15) { if (st < 0) st = k; en = k; }
      ctx.clearRect(0, 0, W, H);
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 41 });
      K.pill(ctx, "하루 평균 기온과 모기가 활동하는 기간 (15 ℃ 이상)", 16, 28, { s: 13, c: KC.blue });
      var lg = K.pill(ctx, "━ +" + d.toFixed(1) + " ℃", W - 16, 28, { a: "right", s: 11.5, c: KC.orange });
      K.pill(ctx, "┄ 지금", lg.x - 8, 28, { a: "right", s: 11.5, c: "#d6defa" });
      var MN = ["1월", "3월", "5월", "7월", "9월", "11월", ""];
      var g = K.chart(ctx, { x: 6, y: 44, w: W - 12, h: H - 48, x0: 0, x1: 365, y0: -5, y1: 35, xt: 6, yt: 4, xf: function (vv) { return MN[Math.round(vv / 365 * 6)] || ""; }, yf: function (vv) { return vv + " ℃"; } });
      clipRect(ctx, g);
      if (st >= 0) { var sg = ctx.createLinearGradient(0, g.T, 0, g.B); sg.addColorStop(0, "rgba(255,107,129,.28)"); sg.addColorStop(1, "rgba(255,107,129,.05)"); ctx.fillStyle = sg; ctx.fillRect(g.X(st), g.T, g.X(en + 1) - g.X(st), g.B - g.T); }
      ctx.strokeStyle = KC.yellow; ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(g.L, g.Y(15)); ctx.lineTo(g.R, g.Y(15)); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      var p0 = [], p1 = []; for (k = 0; k <= 365; k += 2) { p0.push([k, Tday(k, 0)]); p1.push([k, Tday(k, d)]); }
      K.plot(ctx, g, p0, "rgba(220,228,255,.7)", { w: 1.6, dash: [5, 4], glow: false });
      K.plot(ctx, g, p1, KC.orange, { w: 3 });
      K.pill(ctx, "15 ℃", g.R - 6, g.Y(15) + 20, { a: "right", s: 11, c: KC.yellow });
      if (st >= 0) {
        K.glow(ctx, g.X(st), g.Y(15), 4, "rgba(255,140,150,.95)", 4); K.glow(ctx, g.X(en), g.Y(15), 4, "rgba(255,140,150,.95)", 4);
        K.pill(ctx, "시작 " + md(st), g.X(st) - 8, g.Y(15) - 12, { a: "right", s: 11, c: "#ffb3c0", box: [0, W] });
        K.pill(ctx, "끝 " + md(en), g.X(en) + 8, g.Y(15) - 12, { s: 11, c: "#ffb3c0", box: [0, W] });
        K.pill(ctx, "🦟 활동 기간 " + s + "일", g.X((st + en) / 2), g.B - 12, { a: "center", s: 12.5, c: s - S0 >= 14 ? KC.red : KC.ink });
      }
      return s - S0;
    }
    function update() {
      var add = draw();
      rd("mos-read", kv("연평균 기온 상승", "+" + d.toFixed(1) + " ℃", "y") + kv("모기 활동 기간", season(d) + "일", "b", "지금 " + S0 + "일") +
        kv("늘어난 날", "+" + add + "일", add >= 14 ? "r" : "g") + (add >= 14 ? okp(true, "2주(14일) 넘게 길어졌습니다") : ""));
      $("mos-info").innerHTML = "하루 평균 기온 곡선이 15 ℃ 선보다 위에 있는 기간(분홍)이 모기의 활동 기간입니다. 기온이 오르면 봄에는 더 일찍 시작하고 가을에는 더 늦게 끝납니다. 지금보다 <b>+" + add + "일</b>.";
      if (add >= 14 && !got.a) { got.a = true; got.d = d; window.sthState("mosGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-4a"); if (got.b) done("m4-4b");
      if (got.a && got.b) {
        window.sthState("mosBest", "+" + got.d.toFixed(1) + " ℃ → 모기 활동 2주 이상 늘어남");
        window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>연평균 기온이 2 ℃ 가까이 오르면 모기가 활동하는 기간이 2주 넘게 늘어납니다. 매개 곤충이 오래, 넓게 활동할수록 감염병이 퍼질 기회도 늘어납니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("mos-t").addEventListener("input", function (e) { d = +e.target.value; $("mos-t-val").textContent = "+" + d.toFixed(1) + " ℃"; update(); });
    window.sthSort({
      mount: "s4-sort",
      buckets: [{ id: "an", label: "얼룩날개모기" }, { id: "ae", label: "흰줄숲모기·이집트숲모기" }, { id: "cu", label: "작은빨간집모기" }, { id: "sf", label: "모래파리" }, { id: "ts", label: "체체파리" }],
      items: [
        { t: "말라리아", a: "an", why: "말라리아 원충에 감염된 암컷 얼룩날개모기가 옮깁니다." },
        { t: "뎅기열", a: "ae", why: "숲모기류가 뎅기바이러스를 옮깁니다." },
        { t: "지카 바이러스 감염증", a: "ae", why: "숲모기류가 옮깁니다." },
        { t: "치쿤구니야열", a: "ae", why: "숲모기류가 옮깁니다." },
        { t: "일본뇌염", a: "cu", why: "작은빨간집모기가 옮깁니다. 기온이 오르며 출현이 빨라지고 활동 기간이 길어지고 있습니다." },
        { t: "리슈만편모충증", a: "sf", why: "암컷 모래파리가 리슈만편모충을 옮깁니다." },
        { t: "아프리카수면병", a: "ts", why: "체체파리가 파동편모충을 옮깁니다." }
      ],
      onDone: function () { got.b = true; window.sthState("mosGot", got); mission(); }
    });
    update(); mission();
  })();

  function finish() { window.sthState("r4", "해결 · " + (window.sthState("lakeBest") || "") + " / " + (window.sthState("mosBest") || "")); }
  function vs() {
    var p = firstPick("p4");
    $("e4-vs").innerHTML = "<b>나의 첫 추리</b> " + (p || "기록 없음") + "<br><b>녹조 대책</b> " + (window.sthState("lakeBest") || "-") + "<br><b>모기의 계절</b> " + (window.sthState("mosBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[기후변화와 환경생태 Ⅱ] 이야기 ④ 초록 강, 여름 모기",
    items: [
      { id: "e4a", label: "녹조 경보문", hint: "물꽃 현상이 생기는 두 조건과, 그것이 수생태계의 생물다양성을 떨어뜨리는 과정을 주민에게 알리는 글로 쓰세요." },
      { id: "e4b", label: "감염병 대비 제안", hint: "기후변화로 곤충 매개 감염병이 새로 나타나거나 빨리 퍼지는 까닭을 쓰고, 우리 지역이 할 수 있는 대비 한 가지를 제안하세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[기후변화와 환경생태 Ⅱ] 기후위기와 환경생태 변화 — 정리",
  recap: [
    { key: "r1", label: "① 녹는 땅, 차오르는 바다" },
    { key: "r2", label: "② 2100년의 일기 예보" },
    { key: "r3", label: "③ 39만 봉군이 사라진 겨울" },
    { key: "r4", label: "④ 초록 강, 여름 모기" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 사건을 꿰는 한 문장", hint: "바다, 날씨, 꿀벌, 강과 모기. 네 이야기에 공통으로 들어 있는 원인과 그 영향을 한 문장으로 이어 보세요." },
    { id: "w4", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "cce-2", unitLabel: "[기후변화와 환경생태 Ⅱ] 기후위기와 환경생태 변화",
  rows: [
    { key: "r1", label: "① 녹는 땅, 차오르는 바다" },
    { key: "r2", label: "② 2100년의 일기 예보" },
    { key: "r3", label: "③ 39만 봉군이 사라진 겨울" },
    { key: "r4", label: "④ 초록 강, 여름 모기" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
