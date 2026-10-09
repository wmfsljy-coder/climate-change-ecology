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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = W - 30, y0 = 40, y1 = H - 40;
      function X(yy) { return x0 + (yy - 1850) / 170 * (x1 - x0); }
      function Y(t) { return y1 - (t + 0.5) / 2.0 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [-0.5, 0, 0.5, 1.0, 1.5].forEach(function (t) { text(ctx, (t > 0 ? "+" : "") + t.toFixed(1) + " ℃", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: v("--mist") }); });
      for (var yy = 1860; yy <= 2020; yy += 40) text(ctx, yy + "", X(yy), y1 + 18, { s: 10.5, a: "center", c: v("--mist") });
      ctx.fillStyle = v("--mist");
      for (yy = 1850; yy <= 2020; yy++) { ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(X(yy), Y(clean(yy) + noise[yy]), 2.2, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 3; ctx.beginPath();
      for (yy = 1850; yy <= 2020; yy++) { if (yy === 1850) ctx.moveTo(X(yy), Y(model(yy))); else ctx.lineTo(X(yy), Y(model(yy))); }
      ctx.stroke();
      text(ctx, "회색 점: 관측 기온(1850~1900년 평균 대비, 단순화)   주황 선: 켠 원인들로 계산한 모형", x0 + 6, 24, { s: 12, w: "800" });
      var rms = 0, n = 0, m10 = 0;
      for (yy = 1850; yy <= 2020; yy++) { rms += Math.pow(model(yy) - clean(yy), 2); n++; }
      for (yy = 2011; yy <= 2020; yy++) m10 += model(yy) / 10;
      return { rms: Math.sqrt(rms / n), m10: m10 };
    }
    function update() {
      var r = draw(), ch = false;
      var names = F.filter(function (x) { return on[x.id]; }).map(function (x) { return x.t.replace(/^\S+\s/, ""); });
      var natOnly = (on.sol || on.vol) && !on.ghg && !on.aer;
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
    function draw() {
      paper(ctx, W, H);
      var r = RES[exp], lv = r.before + (r.after - r.before) * phase;
      var bx = 150, bw = 260, by0 = 40, by1 = 290;
      function Y(mm) { return by1 - (mm - 60) / 70 * (by1 - by0); }
      ctx.strokeStyle = v("--ink"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx, by0); ctx.lineTo(bx, by1); ctx.lineTo(bx + bw, by1); ctx.lineTo(bx + bw, by0); ctx.stroke();
      ctx.fillStyle = exp === "c" && phase > 0 ? v("--coral") : v("--brand"); ctx.globalAlpha = .35; ctx.fillRect(bx + 2, Y(lv), bw - 4, by1 - Y(lv) - 2); ctx.globalAlpha = 1;
      if (exp === "b") { ctx.fillStyle = v("--mist"); ctx.fillRect(bx + bw - 90, Y(118), 80, 8); }
      var ice = 1 - phase;
      if (ice > 0.02 && exp !== "c") {
        var s = 46 * Math.sqrt(ice), ix = exp === "a" ? bx + 70 : bx + bw - 50 - s / 2, iy = exp === "a" ? Y(lv) - s * 0.1 : Y(118) - s;
        ctx.fillStyle = "#e8f4fb"; ctx.strokeStyle = v("--brand-700"); ctx.lineWidth = 1.5; ctx.fillRect(ix, iy, s, s); ctx.strokeRect(ix, iy, s, s);
      }
      for (var mm = 70; mm <= 120; mm += 10) { text(ctx, mm + " mm", bx - 8, Y(mm) + 4, { s: 10, a: "right", c: v("--mist") }); ctx.strokeStyle = v("--line"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, Y(mm)); ctx.lineTo(bx + 10, Y(mm)); ctx.stroke(); }
      ctx.strokeStyle = v("--amber"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(bx - 4, Y(r.before)); ctx.lineTo(bx + bw + 30, Y(r.before)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "처음 수면", bx + bw + 34, Y(r.before) + 4, { s: 10.5, c: v("--amber-700"), w: "800" });
      text(ctx, NAME[exp], 480, 60, { s: 13, w: "800" });
      text(ctx, "처음 수면 " + r.before.toFixed(1) + " mm", 480, 110, { s: 13, c: v("--mist") });
      text(ctx, "지금 수면 " + lv.toFixed(1) + " mm", 480, 140, { s: 13, c: v("--mist") });
      text(ctx, "변화 " + (lv - r.before >= 0 ? "+" : "") + (lv - r.before).toFixed(1) + " mm", 480, 184, { s: 22, w: "900", c: lv - r.before > 0.05 ? v("--rose-700") : v("--green-700") });
      text(ctx, "비커 바닥 넓이 100 cm²", 480, 250, { s: 11, c: v("--mist") });
    }
    var MSG = {
      a: "떠 있는 얼음은 녹기 전부터 <b>자기 무게만큼 물을 밀어내고</b> 있었습니다. 녹아서 생긴 물이 딱 그 자리를 채우므로 수면은 <b>그대로</b>입니다. 바다에 떠 있는 해빙·빙붕이 녹는 경우와 같습니다.",
      b: "받침대 위 얼음은 물을 밀어내지 않다가, 녹은 물 90 cm³가 <b>새로</b> 비커에 들어와 수면이 <b>9 mm</b> 오릅니다. 그린란드·남극 대륙의 빙상이 녹아 바다로 흘러드는 경우와 같습니다.",
      c: "물 1,000 cm³를 20 ℃에서 40 ℃로 데우면 밀도가 0.998 → 0.992 g/cm³로 줄어 부피가 약 6 cm³ 늘고, 수면이 <b>0.6 mm</b> 오릅니다. 작아 보이지만 바다는 수천 m 깊이라 <b>열팽창</b>만으로도 해수면이 크게 오릅니다."
    };
    function run() {
      if (busy) return;
      busy = true; $("bx-run").disabled = true; phase = 0;
      (function step() {
        phase = Math.min(1, phase + 0.04); draw();
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
    segWire("bx-exp", function (x) { exp = x; phase = 0; draw(); $("bx-info").innerHTML = "실험하기를 눌러 얼음을 녹이거나 물을 데우세요."; });
    $("bx-run").addEventListener("click", run);
    draw(); mission();
  })();

  /* 장면 4 — 해수면 가계부 */
  (function () {
    var canvas = $("c-sl"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var dT = 0, ice = 0;
    function th() { return 0.0002 * dT * 700 * 1000; }
    function ic() { return ice * 1000 / 3.61e8 * 1e6; }
    function draw() {
      paper(ctx, W, H);
      var a = th(), b = ic(), tot = a + b, x0 = 70, y1 = 260, sc = 1.6;
      text(ctx, "1993~2020년 해수면 상승 (mm)", x0, 30, { s: 13, w: "800" });
      ctx.fillStyle = v("--mist"); ctx.globalAlpha = .35; ctx.fillRect(x0, y1 - 91.3 * sc, 140, 91.3 * sc); ctx.globalAlpha = 1;
      text(ctx, "관측 91.3", x0 + 70, y1 - 91.3 * sc - 8, { s: 12, w: "800", a: "center", c: v("--mist") });
      text(ctx, "관측", x0 + 70, y1 + 20, { s: 11.5, a: "center", c: v("--mist") });
      var bx = x0 + 200;
      ctx.fillStyle = v("--coral"); ctx.fillRect(bx, y1 - a * sc, 140, a * sc);
      ctx.fillStyle = v("--brand"); ctx.fillRect(bx, y1 - (a + b) * sc, 140, b * sc);
      text(ctx, "모형 " + tot.toFixed(1), bx + 70, y1 - tot * sc - 8, { s: 12, w: "900", a: "center" });
      text(ctx, "내 계산", bx + 70, y1 + 20, { s: 11.5, a: "center", c: v("--mist") });
      ctx.strokeStyle = v("--line"); ctx.beginPath(); ctx.moveTo(x0 - 10, y1); ctx.lineTo(bx + 170, y1); ctx.stroke();
      var share = tot > 0 ? a / tot : 0;
      var rx = 560;
      text(ctx, "🌡️ 열팽창", rx, 70, { s: 12.5, w: "800", c: v("--coral-700") });
      text(ctx, a.toFixed(1) + " mm (" + Math.round(share * 100) + "%)", rx, 96, { s: 18, w: "900" });
      text(ctx, "🧊 육지 얼음 녹은 물", rx, 140, { s: 12.5, w: "800", c: v("--brand-700") });
      text(ctx, b.toFixed(1) + " mm (" + Math.round((1 - share) * 100) + "%)", rx, 166, { s: 18, w: "900" });
      text(ctx, "합계 " + tot.toFixed(1) + " mm", rx, 216, { s: 22, w: "900", c: tot >= 86 && tot <= 97 ? v("--green-700") : v("--rose-700") });
      return { tot: tot, share: share };
    }
    function update() {
      var r = draw();
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 500, y0 = 40, y1 = H - 40;
      function X(T) { return x0 + (T - 10) / 25 * (x1 - x0); }
      function Y(e) { return y1 - e / 60 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [10, 15, 20, 25, 30, 35].forEach(function (T) { text(ctx, T + " ℃", X(T), y1 + 18, { s: 10.5, a: "center", c: v("--mist") }); });
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 3; ctx.beginPath();
      for (var T = 10; T <= 35; T += 0.25) { if (T === 10) ctx.moveTo(X(T), Y(es(T))); else ctx.lineTo(X(T), Y(es(T))); }
      ctx.stroke();
      text(ctx, "포화 수증기압 (hPa) — 공기가 품을 수 있는 수증기의 최대량", x0, 24, { s: 12, w: "800" });
      [[25, "--mist"], [25 + d, "--coral"]].forEach(function (p) { ctx.fillStyle = v(p[1]); ctx.beginPath(); ctx.arc(X(p[0]), Y(es(p[0])), 7, 0, Math.PI * 2); ctx.fill(); });
      var inc = (es(25 + d) / es(25) - 1) * 100;
      text(ctx, "25 ℃ → " + (25 + d).toFixed(1) + " ℃", 560, 80, { s: 14, w: "800" });
      text(ctx, "품을 수 있는 수증기", 560, 130, { s: 12, c: v("--mist") });
      text(ctx, "+" + inc.toFixed(1) + " %", 560, 166, { s: 28, w: "900", c: inc >= 12 && inc <= 16 ? v("--green-700") : v("--coral-700") });
      text(ctx, "1 ℃에 약 6~7%씩", 560, 210, { s: 12, c: v("--mist") });
      return inc;
    }
    function update() {
      var inc = draw();
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 560, y0 = 40, y1 = H - 44, mx = Math.max.apply(null, p0.concat(p)) * 1.15;
      function X(b) { return x0 + (b - 14) / 12 * (x1 - x0); }
      function Y(q) { return y1 - q / mx * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [14, 17, 20, 23, 26].forEach(function (b) { text(ctx, b + " mm", X(b), y1 + 18, { s: 10.5, a: "center", c: v("--mist") }); });
      ctx.strokeStyle = v("--mist"); ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath();
      xs.forEach(function (b, k) { if (k) ctx.lineTo(X(b), Y(p0[k])); else ctx.moveTo(X(b), Y(p0[k])); }); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = v("--violet"); ctx.globalAlpha = .75;
      xs.forEach(function (b, k) { ctx.fillRect(X(b) - 5, Y(p[k]), 10, y1 - Y(p[k])); });
      ctx.globalAlpha = 1;
      var m = mean(p), inc = (m / M0 - 1) * 100;
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(m), y0); ctx.lineTo(X(m), y1); ctx.stroke();
      text(ctx, "무리의 부리 길이 분포 (점선: 처음 무리)", x0, 24, { s: 12.5, w: "800" });
      text(ctx, gen + "세대 뒤", 610, 70, { s: 14, w: "800" });
      text(ctx, "평균 부리 " + m.toFixed(2) + " mm", 610, 110, { s: 15, w: "900" });
      text(ctx, "처음보다 " + (inc >= 0 ? "+" : "") + inc.toFixed(1) + " %", 610, 150, { s: 22, w: "900", c: inc >= 4 && inc <= 10 ? v("--green-700") : v("--coral-700") });
      text(ctx, "막대 = 그 부리 길이를 가진 개체의 비율", 610, 200, { s: 11, c: v("--mist") });
      return inc;
    }
    function after() {
      var inc = draw();
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
    $("bk-h").addEventListener("input", function (e) { heat = +e.target.value / 100; $("bk-h-val").textContent = e.target.value + "%"; });
    $("bk-g1").addEventListener("click", function () { if (!guard()) return; generation(); after(); });
    $("bk-g5").addEventListener("click", function () { if (!guard()) return; for (var k = 0; k < 5; k++) generation(); after(); });
    draw();
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
      paper(ctx, W, H);
      var s = vals(), L = lv(), y1 = 270;
      text(ctx, "2100년 우리나라 주변 바다", 60, 30, { s: 13, w: "800" });
      [["해수 온도 상승", s.temp, 5.5, "℃", "--teal"], ["해수면 상승", s.sea, 1.5, "m", "--coral"]].forEach(function (b, k) {
        var bx = 90 + k * 200, bh = b[1] / b[2] * 200;
        ctx.fillStyle = v(b[4]); ctx.fillRect(bx, y1 - bh, 110, bh);
        text(ctx, b[1].toFixed(2) + " " + b[3], bx + 55, y1 - bh - 8, { s: 15, w: "900", a: "center" });
        text(ctx, b[0], bx + 55, y1 + 20, { s: 11.5, a: "center", c: v("--mist") });
      });
      var sy = y1 - 0.8 / 1.5 * 200; ctx.strokeStyle = v("--amber"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(280, sy); ctx.lineTo(410, sy); ctx.stroke(); ctx.setLineDash([]); text(ctx, "0.8 m", 414, sy + 4, { s: 10.5, w: "800", c: v("--amber-700") });
      text(ctx, L.n, 520, 90, { s: 16, w: "900", c: pct >= 80 ? v("--green-700") : (pct < 20 ? v("--rose-700") : v("--ink")) });
      var words = L.d, line = "", yy = 124;
      words.split(" ").forEach(function (w) { if ((line + w).length > 22) { text(ctx, line, 520, yy, { s: 12, c: v("--mist") }); yy += 20; line = ""; } line += w + " "; });
      text(ctx, line, 520, yy, { s: 12, c: v("--mist") });
      return s;
    }
    function update() {
      var s = draw(), ch = false;
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, y1 = H - 40, y0 = 50, gw = (W - 100) / D.length;
      function Y(d) { return y1 - d / 12 * (y1 - y0); }
      axes(ctx, x0, y0, W - 30, y1);
      [0, 4, 8, 12].forEach(function (d) { text(ctx, d + "일", x0 - 6, Y(d) + 4, { s: 10, a: "right", c: v("--mist") }); });
      D.forEach(function (r, k) {
        var gx = x0 + 14 + k * gw;
        for (var s = 0; s < 3; s++) {
          if (r[s + 1] == null) continue;
          ctx.fillStyle = v(C[s]); ctx.fillRect(gx + s * 30, Y(r[s + 1]), 24, y1 - Y(r[s + 1]));
          text(ctx, r[s + 1] + "", gx + s * 30 + 12, Y(r[s + 1]) - 5, { s: 10.5, w: "800", a: "center" });
        }
        text(ctx, r[0], gx + 42, y1 + 18, { s: 11.5, w: "800", a: "center" });
      });
      N.forEach(function (n, s) { ctx.fillStyle = v(C[s]); ctx.fillRect(x0 + 10 + s * 90, 18, 12, 12); text(ctx, n, x0 + 28 + s * 90, 29, { s: 11.5 }); });
      text(ctx, "1980년대 대비 개화가 빨라진 날 수 (자료가 있는 꽃만)", W - 30, 29, { s: 11.5, a: "right", c: v("--mist") });
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
      paper(ctx, W, H);
      var fs = 8 * w, is = 3 * w, gap = fs - is, x0 = 80, x1 = W - 60;
      function X(s) { return x1 - s / 30 * (x1 - x0); }
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 1;
      [100, 200].forEach(function (y) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); });
      ctx.strokeStyle = v("--mist"); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(0), 60); ctx.lineTo(X(0), 240); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "과거의 날짜", X(0), 52, { s: 10.5, a: "center", c: v("--mist") });
      text(ctx, "← 더 이른 날", x0, 52, { s: 10.5, c: v("--mist") });
      ctx.fillStyle = v("--rose"); ctx.globalAlpha = .25; ctx.fillRect(X(fs) - 0, 86, 10 / 30 * (x1 - x0), 28); ctx.globalAlpha = 1;
      ctx.fillStyle = v("--rose"); ctx.beginPath(); ctx.arc(X(fs), 100, 9, 0, Math.PI * 2); ctx.fill();
      text(ctx, "🌸 개화 −" + fs.toFixed(1) + "일 (피어 있는 10일)", Math.min(X(fs), W - 10), 80, { s: 11.5, w: "800", a: "right" });
      ctx.fillStyle = v("--teal"); ctx.beginPath(); ctx.arc(X(is), 200, 9, 0, Math.PI * 2); ctx.fill();
      text(ctx, "🐝 곤충 활동 시작 −" + is.toFixed(1) + "일", Math.min(X(is), W - 10), 230, { s: 11.5, w: "800", a: "right" });
      text(ctx, "엇박자 " + gap.toFixed(1) + "일", (x0 + x1) / 2, 150, { s: 20, w: "900", a: "center", c: gap >= 10 ? v("--rose-700") : (gap >= 8 ? v("--amber-700") : v("--green-700")) });
      return gap;
    }
    function update() {
      var gap = draw();
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
      paper(ctx, W, H);
      var x0 = 70, x1 = 560, y0 = 40, y1 = H - 44, s = surv(d);
      function X(x) { return x0 + x / 30 * (x1 - x0); }
      function Y(q) { return y1 - q / 100 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 50, 100].forEach(function (q) { text(ctx, q + "%", x0 - 6, Y(q) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 10, 20, 30].forEach(function (x) { text(ctx, x + "일", X(x), y1 + 18, { s: 10.5, a: "center", c: v("--mist") }); });
      ctx.strokeStyle = v("--teal"); ctx.lineWidth = 2.5; ctx.beginPath();
      for (var x = 0; x <= 30; x += 0.5) { if (x === 0) ctx.moveTo(X(x), Y(surv(x))); else ctx.lineTo(X(x), Y(surv(x))); } ctx.stroke();
      ctx.fillStyle = v("--coral"); ctx.beginPath(); ctx.arc(X(d), Y(s), 7, 0, Math.PI * 2); ctx.fill();
      text(ctx, "월동 생존율", x0, 24, { s: 12.5, w: "800" });
      text(ctx, "헛걸음 " + d + "일", 610, 80, { s: 14, w: "800" });
      text(ctx, "생존율 " + s.toFixed(0) + "%", 610, 120, { s: 18, w: "900" });
      text(ctx, "피해율 " + (100 - s).toFixed(0) + "%", 610, 160, { s: 24, w: "900", c: 100 - s >= 40 && 100 - s <= 46 ? v("--green-700") : v("--rose-700") });
      text(ctx, "전라남도 실제 피해율 43.0%", 610, 200, { s: 11.5, c: v("--mist") });
      return 100 - s;
    }
    function update() {
      var dmg = draw();
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
    function draw() {
      paper(ctx, W, H);
      var c = algae(T, n / 100), x0 = 40, x1 = 480, top = 60, bot = 300, strat = T > 24;
      ctx.fillStyle = v("--brand-700"); ctx.fillRect(x0, top, x1 - x0, bot - top);
      var warmD = strat ? 70 : 0;
      if (strat) { ctx.fillStyle = v("--coral"); ctx.globalAlpha = .35 + (T - 24) * 0.05; ctx.fillRect(x0, top, x1 - x0, warmD); ctx.globalAlpha = 1; text(ctx, "따뜻한 윗물", x1 - 10, top + 20, { s: 11.5, w: "800", a: "right", c: v("--on-accent") }); text(ctx, "── 성층: 위아래가 섞이지 않음 ──", (x0 + x1) / 2, top + warmD + 14, { s: 10.5, a: "center", c: v("--on-accent") }); }
      text(ctx, "차가운 아랫물", x1 - 10, bot - 12, { s: 11.5, w: "800", a: "right", c: v("--on-accent") });
      var g = clamp(Math.log(c / 200) / Math.log(60), 0, 1);
      ctx.fillStyle = v("--green"); ctx.globalAlpha = 0.15 + 0.85 * g; ctx.fillRect(x0, top, x1 - x0, 14 + 30 * g); ctx.globalAlpha = 1;
      text(ctx, "수면 수온 " + T + " ℃ · 영양염 " + n + "%", x0, top - 16, { s: 12.5, w: "800" });
      var rx = 540;
      text(ctx, "남세균 수", rx, 90, { s: 12.5, c: v("--mist") });
      text(ctx, Math.round(c).toLocaleString() + " 세포/mL", rx, 124, { s: 22, w: "900", c: c >= 5000 ? v("--rose-700") : (c < 1000 ? v("--green-700") : v("--amber-700")) });
      text(ctx, c >= 5000 ? "🚨 녹조 경보 (모형 기준 5,000)" : (c < 1000 ? "✅ 안전 (1,000 미만)" : "⚠️ 주의"), rx, 160, { s: 13, w: "800" });
      text(ctx, "성층 " + (strat ? "강함 — 떠오르는 남세균에 유리" : "약함 — 물이 잘 섞임"), rx, 210, { s: 11.5, c: v("--mist") });
      return c;
    }
    function update() {
      var c = draw(), ch = false;
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = W - 30, y0 = 40, y1 = H - 40;
      function X(k) { return x0 + k / 365 * (x1 - x0); }
      function Y(t) { return y1 - (t + 5) / 40 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      ["1월", "4월", "7월", "10월"].forEach(function (m, k) { text(ctx, m, X(k * 91 + 10), y1 + 18, { s: 10.5, a: "center", c: v("--mist") }); });
      [0, 15, 30].forEach(function (t) { text(ctx, t + " ℃", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: v("--mist") }); });
      ctx.fillStyle = v("--rose"); ctx.globalAlpha = .18;
      for (var k = 0; k < 365; k++) if (Tday(k, d) >= 15) ctx.fillRect(X(k), y0, (x1 - x0) / 365 + 0.5, y1 - y0);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = v("--amber"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(15)); ctx.lineTo(x1, Y(15)); ctx.stroke(); ctx.setLineDash([]);
      [[0, "--mist"], [d, "--coral"]].forEach(function (q) { ctx.strokeStyle = v(q[1]); ctx.lineWidth = 2.5; ctx.beginPath(); for (var k2 = 0; k2 < 365; k2 += 2) { if (k2 === 0) ctx.moveTo(X(k2), Y(Tday(k2, q[0]))); else ctx.lineTo(X(k2), Y(Tday(k2, q[0]))); } ctx.stroke(); });
      var s = season(d);
      text(ctx, "🦟 모기 활동 기간 " + s + "일 (지금보다 +" + (s - S0) + "일)", x0 + 6, 26, { s: 13, w: "900", c: s - S0 >= 14 ? v("--rose-700") : v("--ink") });
      return s - S0;
    }
    function update() {
      var add = draw();
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
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
