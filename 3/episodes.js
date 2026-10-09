/* 기후변화와 환경생태 Ⅲ 기후위기에 대응하는 우리의 노력 — 소단원별 이야기 네 편
   01 하얗게 변한 산호초 / 02 같은 비, 다른 재해 / 03 저울 위의 탄소 / 04 8%의 약속
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("cce-3");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function V(n) { return window.cssVar(n); }
function A(hex, a) {
  hex = (hex || "#888").trim();
  if (hex.charAt(0) !== "#") return hex;
  if (hex.length === 4) hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  return "rgba(" + parseInt(hex.substr(1, 2), 16) + "," + parseInt(hex.substr(3, 2), 16) + "," + parseInt(hex.substr(5, 2), 16) + "," + a + ")";
}
function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function paper(ctx, W, H) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = V("--panel"); ctx.fillRect(0, 0, W, H); }
function text(ctx, s, x, y, o) {
  o = o || {};
  ctx.font = (o.w || "500") + " " + (o.s || 12) + "px " + FONT;
  ctx.fillStyle = o.c || V("--ink"); ctx.textAlign = o.a || "left";
  ctx.fillText(s, x, y);
}
function axes(ctx, x0, y0, x1, y1) { ctx.strokeStyle = V("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); }
function segWire(id, attr, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute(attr)); });
  });
}

/* =========================================================================
   이야기 ① 하얗게 변한 산호초
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "coral", title: "조사원의 첫 예상",
    question: "수온이 평년보다 <b>1 °C</b> 높은 상태가 <b>몇 주</b> 이어지면 산호가 하얗게 변하기 시작할까요?",
    options: ["㉠ 1주", "㉡ 4주", "㉢ 8주", "㉣ 20주 이상"],
    onPick: function (i) { window.sthState("coralOK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — DHW (기존 시뮬레이션) */
  (function () {
    var cv = $("c0"), ctx = window.setupCanvas(cv), W = cv._w, H = cv._h;
    var dT = 1.0, wk = 2, got = window.sthState("dhwGot") || { a: false, b: false };
    var BRANCH = (function () {
      var r = mulberry(4242), out = [];
      for (var i = 0; i < 24; i++) out.push({ x: 80 + r() * 450, base: 350 + r() * 26, h: 60 + r() * 100, w: 9 + r() * 8, lean: (r() - 0.5) * 26, arms: 2 + Math.floor(r() * 3), seed: r() });
      return out;
    })();
    function dhw() { return dT >= 1 ? dT * Math.min(wk, 12) : 0; }
    function alertOf(d) {
      if (d <= 0) return { n: "정상", c: "--green-700", t: "수온이 백화 기준선을 넘지 않았습니다." };
      if (d < 4) return { n: "주의", c: "--amber-700", t: "열스트레스가 쌓이고 있지만 아직 백화 기준 아래입니다." };
      if (d < 8) return { n: "경보 1단계", c: "--coral-700", t: "백화가 시작되는 구간입니다." };
      return { n: "경보 2단계", c: "--rose-700", t: "대량 폐사가 일어날 수 있는 구간입니다." };
    }
    function zoox() { var d = dhw(); if (d <= 0) return 1; return Math.max(0, Math.min(1, 1 - Math.pow(d / 10, 1.5))); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var z = zoox(), d = dhw(), al = alertOf(d);
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, A(V("--brand"), 0.30)); g.addColorStop(1, A(V("--brand-700"), 0.20));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = A(V("--mist"), 0.30); ctx.fillRect(0, H - 50, W, 50);
      var healthy = [[255, 138, 101], [255, 179, 71], [186, 104, 200], [77, 208, 225]];
      BRANCH.forEach(function (b, i) {
        var base = healthy[i % 4];
        ctx.strokeStyle = "rgb(" + Math.round(base[0] * z + 246 * (1 - z)) + "," + Math.round(base[1] * z + 246 * (1 - z)) + "," + Math.round(base[2] * z + 240 * (1 - z)) + ")";
        ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = b.w;
        ctx.beginPath(); ctx.moveTo(b.x, b.base); ctx.lineTo(b.x + b.lean, b.base - b.h); ctx.stroke();
        for (var k = 0; k < b.arms; k++) {
          var f = 0.45 + k * 0.22, px = b.x + b.lean * f, py = b.base - b.h * f, dir = (k % 2 ? 1 : -1);
          ctx.lineWidth = b.w * 0.6; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + dir * (15 + b.seed * 15), py - (21 + b.seed * 17)); ctx.stroke();
        }
      });
      if (z < 0.15) {
        ctx.strokeStyle = A(V("--green-700"), 0.5); ctx.lineWidth = 2;
        BRANCH.forEach(function (b) { ctx.beginPath(); ctx.moveTo(b.x - 6, b.base - b.h * 0.5); ctx.quadraticCurveTo(b.x + 10, b.base - b.h * 0.3, b.x + 4, b.base); ctx.stroke(); });
      }
      var bx = 600, by = 60, bw = 258, bh = 280;
      ctx.fillStyle = A(V("--card"), 0.94); ctx.strokeStyle = A(V("--line"), 1); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
      text(ctx, "최근 12주 수온 편차", bx + 4, by - 12, { s: 13, w: "800" });
      var iw = bw - 44, ih = bh - 66, ox = bx + 28, oy = by + 26, maxT = 4;
      var yOf = function (t) { return oy + ih - ih * Math.min(t, maxT) / maxT; };
      ctx.strokeStyle = A(V("--rose"), 0.85); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ox, yOf(1)); ctx.lineTo(ox + iw, yOf(1)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "+1 °C 기준선", ox + 2, yOf(1) - 6, { s: 11, w: "700", c: V("--rose-700") });
      for (var w = 0; w < 12; w++) {
        var val = (w >= 12 - wk) ? dT : 0, barX = ox + w * (iw / 12) + 2, barW = iw / 12 - 4;
        ctx.fillStyle = val >= 1 ? A(V("--coral"), 0.9) : A(V("--line"), 1);
        var top = yOf(Math.max(val, 0.06)); ctx.fillRect(barX, top, barW, oy + ih - top);
      }
      ctx.strokeStyle = A(V("--mist"), 0.7); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ox, oy + ih); ctx.lineTo(ox + iw, oy + ih); ctx.stroke();
      text(ctx, "12주 전", ox + 22, oy + ih + 18, { s: 11, w: "600", c: V("--mist"), a: "center" });
      text(ctx, "지금", ox + iw - 14, oy + ih + 18, { s: 11, w: "600", c: V("--mist"), a: "center" });
      text(ctx, "DHW " + d.toFixed(1) + " · " + al.n, bx + 4, by + bh + 26, { s: 15, w: "800", c: V(al.c) });
      text(ctx, z > 0.6 ? "건강한 산호" : (z > 0.15 ? "백화 진행 중" : "백화 후 폐사"), 34, 44, { s: 14, w: "800" });
      text(ctx, "공생 조류 잔존율 " + Math.round(z * 100) + "%", 34, 64, { s: 11.5, w: "600", c: V("--mist") });
    }
    function refresh() {
      var d = dhw(), al = alertOf(d), ch = false;
      $("t0-dtv").textContent = "+" + dT.toFixed(1) + " °C";
      $("t0-wkv").textContent = wk + "주";
      var msg = "<b>" + al.n + "</b> — DHW " + d.toFixed(1) + ". " + al.t;
      if (dT > 0 && dT < 1) msg += " 편차가 1 °C 미만이면 DHW로 쌓이지 않습니다.";
      else if (d >= 4 && d < 8) msg += " 이 상태가 <b>더 이어지면</b> 되돌리기 어려워집니다.";
      else if (d >= 8) msg += " 수온을 낮춰도 조류가 곧바로 돌아오지 않습니다. 회복에는 <b>여러 해</b>가 걸립니다.";
      $("t0-info").innerHTML = msg;
      draw();
      if (Math.abs(dT - 1) < 1e-9 && d >= 4 && !got.a) { got.a = ch = true; got.wa = wk; }
      if (d >= 8 && !got.b) { got.b = ch = true; got.cb = "+" + dT.toFixed(1) + " °C · " + wk + "주"; }
      if (ch) { window.sthState("dhwGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.b) done("m1-2b");
      if (got.a && got.b) {
        window.sthState("dhwBest", "+1.0 °C 는 " + got.wa + "주면 백화 시작 · " + got.cb + " 이면 대량 폐사");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>+1 °C 도 <b>4주</b>면 백화가 시작됩니다. 높은 수온과 긴 기간이 곱해져 열스트레스가 쌓입니다.");
        ep.clear(1);
      }
    }
    $("t0-dt").addEventListener("input", function () { dT = +this.value / 10; refresh(); });
    $("t0-wk").addEventListener("input", function () { wk = +this.value; refresh(); });
    cv._redraw = draw;
    refresh(); mission();
  })();

  /* 장면 3 — 순서 */
  var STEPS = ["수온이 평년보다 높은 상태가 여러 주 이어진다", "산호가 몸속의 공생 조류를 내보낸다", "색을 잃어 하얀 석회 골격이 비친다(백화)", "영양을 얻지 못해 산호가 굶주린다", "뜨거운 물이 계속되면 산호가 죽고 해조류가 덮는다"];
  if (ep.cleared(2)) {
    $("s1-order").innerHTML = "<div class='order sort'><div class='slots'>" + STEPS.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>";
    window.sthMission("m1-3", true);
  } else {
    window.sthOrder({ mount: "s1-order", steps: STEPS, onDone: function () { window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>백화 자체는 바로 죽음이 아닙니다. 수온이 제때 내려가면 조류가 돌아올 수 있지만, 오래 이어지면 폐사로 넘어갑니다."); ep.clear(2); } });
  }

  /* 장면 4 — 회복의 시간 */
  (function () {
    var canvas = $("c-reef"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 3;
    function sim(k) { var C = 60, tr = [60], s = 0, c = 0; for (var y = 1; y <= 60; y++) { C = C + 0.25 * C * (1 - C / 60); if (y % k === 0) C *= 0.5; tr.push(C); if (y > 40) { s += C; c++; } } return { tr: tr, avg: s / c }; }
    function draw() {
      paper(ctx, W, H);
      var r = sim(n), x0 = 60, x1 = W - 30, y0 = 40, y1 = H - 40;
      function X(y) { return x0 + y / 60 * (x1 - x0); }
      function Y(c) { return y1 - c / 60 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 30, 60].forEach(function (c) { text(ctx, c + "%", x0 - 6, Y(c) + 4, { s: 10, a: "right", c: V("--mist") }); });
      [0, 20, 40, 60].forEach(function (y) { text(ctx, y + "년", X(y), y1 + 18, { s: 10.5, a: "center", c: V("--mist") }); });
      ctx.fillStyle = A(V("--mist"), 0.15); ctx.fillRect(X(40), y0, X(60) - X(40), y1 - y0);
      ctx.strokeStyle = V("--coral"); ctx.lineWidth = 2.5; ctx.beginPath();
      r.tr.forEach(function (c, y) { if (y) ctx.lineTo(X(y), Y(c)); else ctx.moveTo(X(y), Y(c)); }); ctx.stroke();
      text(ctx, "산호 덮임률 (처음 60%) — 회색 구간: 마지막 20년", x0 + 6, 24, { s: 12.5, w: "800" });
      text(ctx, "마지막 20년 평균 " + r.avg.toFixed(1) + "%", x1, 24, { s: 14, w: "900", a: "right", c: r.avg >= 30 && r.avg <= 40 ? V("--green-700") : V("--rose-700") });
      return r.avg;
    }
    function update() {
      var a = draw();
      $("rf-info").innerHTML = "백화가 <b>" + n + "년</b>마다 오면 마지막 20년 평균 덮임률 <b>" + a.toFixed(1) + "%</b>. " + (a < 30 ? "회복할 틈 없이 다음 백화가 옵니다." : (a > 40 ? "백화 사이에 충분히 회복합니다." : "겨우 절반쯤을 유지합니다."));
      if (a >= 30 && a <= 40 && !ep.cleared(3)) {
        window.sthState("reefBest", n + "년 간격 → 평균 덮임률 " + a.toFixed(1) + "%");
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("reefBest") + ". 요즘 대규모 백화 간격(약 6년)은 바로 이 경계에 있습니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("rf-n").addEventListener("input", function (e) { n = +e.target.value; $("rf-n-val").textContent = n + "년"; update(); });
    update();
    if (ep.cleared(3)) window.sthMission("m1-4", true);
  })();

  function finish() { window.sthState("r1", "해결 · " + (window.sthState("reefBest") || "") + " / " + (window.sthState("dhwBest") || "")); }
  function vs() {
    var p = window.sthState("coral") || "";
    $("e1-vs").innerHTML = "<b>나의 첫 예상</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 정확했습니다. 1 °C × 4주 = DHW 4." : " — 실제로는 1 °C 로 4주면 DHW 4, 백화가 시작됩니다.") + "<br><b>회복 계산</b> " + (window.sthState("reefBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[기후변화와 환경생태 Ⅲ] 이야기 ① 하얗게 변한 산호초",
    items: [
      { id: "w1", label: "온도만이 아니라 기간이 문제인 까닭", hint: "수온 편차와 기간을 각각 바꿔 보고, 어느 쪽이 DHW를 더 크게 만드는지 근거와 함께 쓰세요.", ph: "+2 °C 로 2주 두었을 때와 +1 °C 로 4주 두었을 때를 비교하면 …" },
      { id: "e1b", label: "산호의 백화가 해양 생태계에 주는 영향", hint: "산호초가 바다 생물에게 어떤 곳인지, 백화가 자주 오면 무슨 일이 생기는지 설명하세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 같은 비, 다른 재해
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "p2", title: "연구원의 첫 가설",
    question: "1년 강수량이 비슷한데 가뭄과 홍수가 함께 늘어나는 까닭은?",
    options: ["㉠ 같은 양의 비가 더 적은 날에 몰려 내려서", "㉡ 사실은 비가 훨씬 많이 와서", "㉢ 비와 재해는 관계가 없어서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 1년의 비 (기존 시뮬레이션) */
  (function () {
    var cv = $("c1"), ctx = window.setupCanvas(cv), W = cv._w, H = cv._h, dT = 0, mode = "rain";
    var BASE = (function () { var r = mulberry(20261), a = []; for (var i = 0; i < 365; i++) { var x = r() < 0.28 ? Math.pow(r(), 2.2) * 45 + 1 : 0; a.push(x < 1.2 ? 0 : x); } return a; })();
    var TOT0 = BASE.reduce(function (s, x) { return s + x; }, 0), DAY0 = BASE.filter(function (x) { return x > 0; }).length, MAX0 = Math.max.apply(null, BASE);
    function series() {
      var out = BASE.map(function (x) { return x > 0 ? Math.pow(x, 1 + 0.16 * dT) : 0; });
      var s = out.reduce(function (a, b) { return a + b; }, 0), k = s > 0 ? (TOT0 * (1 + 0.02 * dT)) / s : 1;
      return out.map(function (x) { return x * k; }).map(function (x) { return x < 1.2 ? 0 : x; });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = A(V("--card-2"), 1); ctx.fillRect(0, 0, W, H);
      var a = series(), ox = 62, oy = 42, iw = W - 110, ih = H - 110, t, i;
      if (mode === "rain") {
        var mx = Math.max(60, Math.max.apply(null, a));
        ctx.strokeStyle = A(V("--line"), 1); ctx.lineWidth = 1.4;
        for (t = 0; t <= 4; t++) { var yy = oy + ih - ih * t / 4; ctx.beginPath(); ctx.moveTo(ox, yy); ctx.lineTo(ox + iw, yy); ctx.stroke(); text(ctx, String(Math.round(mx * t / 4)), ox - 8, yy + 4, { s: 11, w: "600", c: V("--mist"), a: "right" }); }
        for (i = 0; i < a.length; i++) { if (a[i] <= 0) continue; var x = ox + iw * i / 365, h = ih * a[i] / mx; ctx.fillStyle = a[i] >= 57 ? A(V("--rose"), 0.95) : A(V("--brand"), 0.8); ctx.fillRect(x, oy + ih - h, Math.max(1.6, iw / 365 - 0.4), h); }
        ctx.save(); ctx.translate(18, oy + ih / 2); ctx.rotate(-Math.PI / 2); text(ctx, "하루 강수량 (mm)", 0, 0, { s: 11.5, w: "700", c: V("--mist"), a: "center" }); ctx.restore();
        text(ctx, "1월", ox + iw * 0.04, oy + ih + 20, { s: 11.5, w: "600", c: V("--mist"), a: "center" });
        text(ctx, "7월", ox + iw * 0.5, oy + ih + 20, { s: 11.5, w: "600", c: V("--mist"), a: "center" });
        text(ctx, "12월", ox + iw * 0.96, oy + ih + 20, { s: 11.5, w: "600", c: V("--mist"), a: "center" });
      } else {
        var runs = [], run = 0;
        for (i = 0; i < a.length; i++) { if (a[i] > 0) { if (run) runs.push(run); run = 0; } else run++; }
        if (run) runs.push(run);
        runs.sort(function (p, q) { return q - p; });
        var show = runs.slice(0, 40), maxRun = Math.max(20, show[0] || 10);
        text(ctx, "연속으로 비가 오지 않은 날 (긴 순서로 40개)", ox, oy - 12, { s: 13, w: "800" });
        for (i = 0; i < show.length; i++) { var bw2 = (iw - 16) / 40, bx2 = ox + i * bw2, hh = ih * show[i] / maxRun; ctx.fillStyle = show[i] >= 14 ? A(V("--coral"), 0.95) : A(V("--amber"), 0.7); ctx.fillRect(bx2 + 1, oy + ih - hh, bw2 - 2, hh); }
        var dy = oy + ih - ih * 14 / maxRun;
        ctx.strokeStyle = A(V("--coral"), 0.9); ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ox, dy); ctx.lineTo(ox + iw, dy); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "2주 이상 — 산불 위험이 커지는 구간", ox + 6, dy - 8, { s: 11.5, w: "700", c: V("--coral-700") });
        ctx.strokeStyle = A(V("--line"), 1); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ox, oy + ih); ctx.lineTo(ox + iw, oy + ih); ctx.stroke();
        ctx.save(); ctx.translate(18, oy + ih / 2); ctx.rotate(-Math.PI / 2); text(ctx, "연속 무강수 일수", 0, 0, { s: 11.5, w: "700", c: V("--mist"), a: "center" }); ctx.restore();
      }
      text(ctx, "기온 +" + dT.toFixed(1) + " °C 일 때 같은 지역의 1년", ox, H - 16, { s: 11.5, w: "600", c: V("--mist") });
    }
    function refresh() {
      var a = series(), tot = a.reduce(function (x, y) { return x + y; }, 0), days = a.filter(function (x) { return x > 0; }).length, mx = Math.max.apply(null, a);
      var up = (mx / MAX0 - 1) * 100, totUp = (tot / TOT0 - 1) * 100;
      $("t1-dtv").textContent = "+" + dT.toFixed(1) + " °C";
      $("t1-info").innerHTML = "대기가 품는 수증기 <b>+" + Math.round((Math.pow(1.07, dT) - 1) * 100) + "%</b> · 연 강수량 <b>" + Math.round(TOT0) + " → " + Math.round(tot) + " mm</b> (" + (totUp >= 0 ? "+" : "") + totUp.toFixed(1) + "%) · 비 오는 날 <b>" + DAY0 + " → " + days + "일</b> · 하루 최대 강수 <b>" + Math.round(MAX0) + " → " + Math.round(mx) + " mm</b> (+" + up.toFixed(0) + "%). 같은 양의 비가 더 적은 날에 몰립니다.";
      draw();
      if (up >= 30 && totUp <= 6 && !ep.cleared(1)) {
        window.sthState("rainBest", "+" + dT.toFixed(1) + " °C → 연 강수 +" + totUp.toFixed(1) + "%, 하루 최대 +" + up.toFixed(0) + "%, 비 오는 날 " + (DAY0 - days) + "일 감소");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("rainBest") + ". 비의 총량보다 <b>내리는 방식</b>이 바뀐 것이 재해를 키웁니다.");
        ep.clear(1);
      }
    }
    $("t1-dt").addEventListener("input", function () { dT = +this.value / 10; refresh(); });
    segWire("t1-mode", "data-m", function (m) { mode = m; draw(); });
    cv._redraw = draw;
    refresh();
    if (ep.cleared(1)) window.sthMission("m2-2", true);
  })();

  /* 장면 3 — 대응 방안 */
  window.sthSort({
    mount: "s2-sort",
    buckets: [{ id: "d", label: "🏜️ 사막화" }, { id: "f", label: "🔥 대형 산불" }, { id: "g", label: "💧 가뭄" }, { id: "w", label: "🌊 홍수" }],
    items: [
      { t: "사막 가장자리에 나무를 심어 방풍림 띠를 만든다", a: "d", why: "모래바람을 막고 흙을 붙잡습니다(중국·아프리카의 ‘녹색 장벽’)." },
      { t: "가축을 한곳에 너무 많이 풀지 않도록 방목을 조절한다", a: "d", why: "과도한 방목은 사막화의 큰 원인입니다." },
      { t: "숲 사이에 나무가 없는 띠(방화선)를 만든다", a: "f", why: "불이 번지는 길을 끊습니다." },
      { t: "위성과 감시 카메라로 불씨를 일찍 찾아낸다", a: "f", why: "초기에 꺼야 대형 산불을 막습니다." },
      { t: "비가 올 때 빗물을 모아 두었다가 재이용한다", a: "g", why: "마른 시기에 쓸 물을 확보합니다." },
      { t: "물을 적게 쓰는 방울 관개 방식으로 농사짓는다", a: "g", why: "한정된 물을 아껴 씁니다." },
      { t: "투수성 포장과 녹지를 늘려 빗물이 땅에 스며들게 한다", a: "w", why: "스펀지 도시의 원리입니다." },
      { t: "하천 옆에 물이 넘쳐도 되는 저류지를 둔다", a: "w", why: "넘치는 물을 잠시 담아 둡니다.", hint: "물을 ‘아껴 쓰는’ 것인가요, 넘치는 물을 ‘담아 두는’ 것인가요?" }
    ],
    onDone: function () { window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>재해의 원인에 맞춰 대응도 달라집니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m2-3", true);

  /* 장면 4 — 스펀지 도시 */
  (function () {
    var canvas = $("c-sp"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, p = 0, s = 0;
    function run() { return Math.max(0, 100 * (1 - 0.8 * p / 100) - s); }
    function cost() { return p + 1.5 * s; }
    function draw() {
      paper(ctx, W, H);
      var ro = run(), c = cost(), gx = 40, gy = 150, gw = 440;
      ctx.fillStyle = V("--mist"); ctx.fillRect(gx, gy, gw, 26);
      ctx.fillStyle = V("--green"); ctx.fillRect(gx, gy, gw * p / 100, 26);
      text(ctx, "투수 " + p + "%", gx + 6, gy + 18, { s: 11.5, w: "800", c: V("--on-accent") });
      ctx.strokeStyle = V("--brand"); ctx.lineWidth = 1.5;
      for (var k = 0; k < 30; k++) { var rx = gx + 10 + k * 14.5; ctx.beginPath(); ctx.moveTo(rx, 40 + (k % 3) * 12); ctx.lineTo(rx - 6, 70 + (k % 3) * 12); ctx.stroke(); }
      text(ctx, "시간당 100 mm 폭우", gx, 30, { s: 12.5, w: "800" });
      ctx.fillStyle = A(V("--brand"), 0.3); ctx.fillRect(gx + gw - 110, gy + 30, 110, 60 * s / 40 + 2);
      ctx.strokeStyle = V("--brand-700"); ctx.strokeRect(gx + gw - 110, gy + 30, 110, 60);
      text(ctx, "저류조 " + s + " mm", gx + gw - 55, gy + 104, { s: 11, w: "800", a: "center" });
      var rx2 = 560;
      text(ctx, "하수관으로 흘러드는 물", rx2, 70, { s: 12.5, c: V("--mist") });
      text(ctx, ro.toFixed(0) + " mm", rx2, 104, { s: 26, w: "900", c: ro <= 50 ? V("--green-700") : V("--rose-700") });
      text(ctx, "하수관 용량 50 mm", rx2, 128, { s: 11, c: V("--mist") });
      text(ctx, "비용", rx2, 180, { s: 12.5, c: V("--mist") });
      text(ctx, c.toFixed(0) + " / 70", rx2, 214, { s: 24, w: "900", c: c <= 70 ? V("--green-700") : V("--rose-700") });
      return { ro: ro, c: c };
    }
    function update() {
      var r = draw();
      $("sp-info").innerHTML = "투수 면적은 그 위에 내린 비의 80%를 땅으로 흘려보내고(비용 1% 당 1), 저류조는 용량만큼 빗물을 잠시 담습니다(비용 1 mm 당 1.5). 흘러드는 물 " + r.ro.toFixed(0) + " mm · 비용 " + r.c.toFixed(0) + ".";
      if (r.ro <= 50 && r.c <= 70 && !ep.cleared(3)) {
        window.sthState("spBest", "투수 " + p + "% + 저류조 " + s + " mm → 흘러드는 물 " + r.ro.toFixed(0) + " mm, 비용 " + r.c.toFixed(0));
        window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("spBest") + ". 땅이 비를 머금게 하는 것이 가장 값싼 저류조입니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("sp-p").addEventListener("input", function (e) { p = +e.target.value; $("sp-p-val").textContent = p + "%"; update(); });
    $("sp-s").addEventListener("input", function (e) { s = +e.target.value; $("sp-s-val").textContent = s + " mm"; update(); });
    update();
    if (ep.cleared(3)) window.sthMission("m2-4", true);
  })();

  function finish() { window.sthState("r2", "해결 · " + (window.sthState("rainBest") || "") + " / " + (window.sthState("spBest") || "")); }
  function vs() {
    var p = window.sthState("p2") || "";
    $("e2-vs").innerHTML = "<b>나의 첫 가설</b> " + (p || "기록 없음") + "<br><b>1년의 비</b> " + (window.sthState("rainBest") || "-") + "<br><b>스펀지 도시</b> " + (window.sthState("spBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[기후변화와 환경생태 Ⅲ] 이야기 ② 같은 비, 다른 재해",
    items: [
      { id: "w2", label: "가뭄과 홍수가 함께 늘어나는 까닭", hint: "연 강수량 · 비 오는 날 · 하루 최대 강수 세 값을 근거로 설명하세요.", ph: "연 강수량은 (      ) 인데 비 오는 날은 (      ), 하루 최대 강수는 (      ) 이므로 …" },
      { id: "e2b", label: "우리 지역 재해 대응 방안", hint: "사막화·대형 산불·가뭄·홍수 가운데 우리 지역에 가장 걱정되는 재해를 골라, 원인과 대응 방안을 짝지어 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 저울 위의 탄소
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "p3", title: "청소년 위원의 첫 발언",
    question: "탄소중립이란 무엇일까요?",
    options: ["㉠ 이산화 탄소를 한 톨도 내보내지 않는 것", "㉡ 내보내는 양과 거두어들이는 양을 같게 해 순배출을 0으로 만드는 것", "㉢ 이산화 탄소를 다른 나라로 옮기는 것"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 탄소 저울 (기존 시뮬레이션) */
  (function () {
    var cv = $("c2"), ctx = window.setupCanvas(cv), W = cv._w, H = cv._h;
    var EMIT = [{ n: "에너지 공급", base: 34, cut: 0, c: "--coral" }, { n: "산업", base: 24, cut: 0, c: "--amber" }, { n: "농업·임업·토지", base: 22, cut: 0, c: "--green" }, { n: "수송", base: 15, cut: 0, c: "--violet" }, { n: "건물", base: 5, cut: 0, c: "--brand" }];
    var SINK = [{ n: "산림 흡수", v: 0, max: 20, c: "--green" }, { n: "바다숲·블루카본", v: 0, max: 12, c: "--teal" }, { n: "탄소 포집·저장(CCUS)", v: 0, max: 15, c: "--brand" }];
    var MAXABS = SINK.reduce(function (a, s) { return a + s.max; }, 0);
    $("t2-controls").innerHTML = EMIT.map(function (e, i) {
      return '<div class="ctrl-group"><div class="ctrl-label">' + e.n + ' 감축<span class="val" id="em' + i + '-v">0%</span></div><input type="range" id="em' + i + '" min="0" max="100" step="1" value="0"></div>';
    }).join("") + SINK.map(function (s, i) {
      return '<div class="ctrl-group"><div class="ctrl-label">' + s.n + '<span class="val" id="sk' + i + '-v">0</span></div><input type="range" id="sk' + i + '" min="0" max="' + s.max + '" step="1" value="0"></div>';
    }).join("");
    function totals() { var em = EMIT.reduce(function (a, e) { return a + e.base * (1 - e.cut / 100); }, 0), ab = SINK.reduce(function (a, s) { return a + s.v; }, 0); return { em: em, ab: ab, net: em - ab }; }
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = A(V("--card-2"), 1); ctx.fillRect(0, 0, W, H);
      var t = totals(), cx = W / 2, topY = 260, scale = 2.3;
      ctx.strokeStyle = A(V("--mist"), 0.55); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, topY); ctx.lineTo(cx, H - 60); ctx.stroke();
      var tilt = Math.max(-0.2, Math.min(0.2, t.net / 130)), armL = 232;
      var lx = cx - armL * Math.cos(tilt), ly = topY + armL * Math.sin(tilt), rx = cx + armL * Math.cos(tilt), ry = topY - armL * Math.sin(tilt);
      ctx.strokeStyle = A(V("--ink"), 0.75); ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke();
      function pan(px, py, label, sum) {
        ctx.strokeStyle = A(V("--mist"), 0.55); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + 32); ctx.stroke();
        ctx.fillStyle = A(V("--card"), 1); ctx.strokeStyle = A(V("--line"), 1); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(px, py + 38, 88, 11, 0, 0, 6.2832); ctx.fill(); ctx.stroke();
        text(ctx, label + "  " + sum.toFixed(0), px, py + 70, { s: 13, w: "800", a: "center" });
      }
      var sy = ly + 34;
      EMIT.forEach(function (e) { var val = e.base * (1 - e.cut / 100); if (val < 0.4) return; var h = val * scale; sy -= h; ctx.fillStyle = A(V(e.c), 0.92); ctx.fillRect(lx - 60, sy, 120, h - 1.5); if (h > 15) text(ctx, e.n + " " + val.toFixed(0), lx, sy + h / 2 + 4, { s: 11, w: "700", a: "center" }); });
      pan(lx, ly, "배출", t.em);
      var sy2 = ry + 34;
      SINK.forEach(function (s) { if (s.v < 0.4) return; var h = s.v * scale; sy2 -= h; ctx.fillStyle = A(V(s.c), 0.8); ctx.fillRect(rx - 60, sy2, 120, h - 1.5); if (h > 15) text(ctx, s.n.split("·")[0] + " " + s.v.toFixed(0), rx, sy2 + h / 2 + 4, { s: 11, w: "700", a: "center" }); });
      pan(rx, ry, "흡수", t.ab);
      var ok = Math.abs(t.net) < 1.5;
      text(ctx, ok ? "탄소중립 — 순배출 0" : ("순배출 " + (t.net > 0 ? "+" : "") + t.net.toFixed(1)), cx, H - 32, { s: 17, w: "800", a: "center", c: ok ? V("--green-700") : V("--rose-700") });
      text(ctx, "배출 100 을 기준으로 한 상대값", cx, H - 13, { s: 11.5, w: "600", a: "center", c: V("--mist") });
    }
    function refresh() {
      var t = totals(), msg;
      if (Math.abs(t.net) < 1.5) msg = "<b>수지가 맞았습니다.</b> 배출 " + t.em.toFixed(0) + " 과 흡수 " + t.ab.toFixed(0) + " 이 같아졌습니다. 이것이 탄소중립입니다 — 배출이 0이 된 것이 아닙니다.";
      else if (t.net > 0) msg = "배출 " + t.em.toFixed(1) + " · 흡수 " + t.ab.toFixed(1) + " → 아직 <b>" + t.net.toFixed(0) + "</b> 만큼 남습니다. 흡수원을 모두 최대로 켜도 <b>" + MAXABS + "</b> 까지가 한계이므로, 배출을 <b>" + (100 - MAXABS) + "% 이상</b> 줄이지 않으면 수지가 맞지 않습니다.";
      else msg = "흡수가 배출을 넘었습니다(<b>순배출 " + t.net.toFixed(0) + "</b>). 이런 상태를 <b>탄소 네거티브</b>라고 합니다.";
      $("t2-info").innerHTML = msg;
      draw();
      if (Math.abs(t.net) < 1.5 && !ep.cleared(1)) {
        window.sthState("balBest", "배출 " + t.em.toFixed(0) + " = 흡수 " + t.ab.toFixed(0));
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("balBest") + ". 흡수에 한계가 있어 배출을 절반 넘게 줄여야 했습니다.");
        ep.clear(1);
      }
    }
    EMIT.forEach(function (e, i) { $("em" + i).addEventListener("input", function () { e.cut = +this.value; $("em" + i + "-v").textContent = e.cut + "%"; refresh(); }); });
    SINK.forEach(function (s, i) { $("sk" + i).addEventListener("input", function () { s.v = +this.value; $("sk" + i + "-v").textContent = String(s.v); refresh(); }); });
    cv._redraw = draw;
    refresh();
    if (ep.cleared(1)) window.sthMission("m3-2", true);
  })();

  /* 장면 3 — 기술 분류 */
  window.sthSort({
    mount: "s3-sort",
    buckets: [{ id: "r", label: "배출을 줄이는 기술", sub: "처음부터 덜 내보낸다" }, { id: "c", label: "붙잡거나 거두어들이는 기술", sub: "나가는 것을 붙잡거나, 이미 나온 것을 빼낸다" }],
    items: [
      { t: "태양광·풍력 발전", a: "r", why: "화석 연료를 태우지 않고 전기를 만듭니다." },
      { t: "전기차·수소차", a: "r", why: "달리는 동안 배기가스가 나오지 않습니다(전기·수소를 만드는 과정은 따로 따져야 함)." },
      { t: "재생 에너지로 물을 분해해 만드는 그린 수소", a: "r", why: "만드는 과정에서도 이산화 탄소가 거의 나오지 않습니다." },
      { t: "건물 단열과 고효율 설비", a: "r", why: "같은 일을 적은 에너지로 합니다." },
      { t: "숲 가꾸기와 나무 심기", a: "c", why: "광합성으로 대기 중 이산화 탄소를 흡수합니다." },
      { t: "바다숲·갯벌·염습지 보전(블루카본)", a: "c", why: "해양 생태계가 탄소를 흡수·저장합니다." },
      { t: "발전소 굴뚝의 이산화 탄소를 붙잡아 땅속에 저장(CCS)", a: "c", why: "대기로 나갈 이산화 탄소를 굴뚝에서 붙잡아 땅속에 가둬 배출을 막습니다. 이미 공기 중에 있는 이산화 탄소를 빼내는 DAC 와는 다릅니다.", hint: "이 기술은 이산화 탄소를 ‘안 만드는’ 것일까요, 만들어진 것을 ‘붙잡는’ 것일까요?" },
      { t: "공기 중 이산화 탄소를 직접 빨아들이는 직접 공기 포집(DAC)", a: "c", why: "이미 대기에 있는 이산화 탄소를 제거합니다." }
    ],
    onDone: function () { window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>배출을 줄이는 기술과 붙잡거나 거두어들이는 기술이 함께 저울을 맞춥니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m3-3", true);

  /* 장면 4 — 수소의 색깔 */
  (function () {
    var canvas = $("c-h2"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, m = "grey", cap = 50;
    var got = window.sthState("h2Got") || { a: false, b: false };
    function co2() { return m === "grey" ? 10 : (m === "blue" ? 10 * (1 - cap / 100) : 0.3); }
    var NM = { grey: "회색 수소", blue: "블루 수소", green: "그린 수소" };
    function draw() {
      paper(ctx, W, H);
      var c = co2(), x0 = 70, y1 = 250, sc = 18;
      axes(ctx, x0, 30, 480, y1);
      [0, 5, 10].forEach(function (k) { text(ctx, k + " kg", x0 - 6, y1 - k * sc + 4, { s: 10, a: "right", c: V("--mist") }); });
      ctx.strokeStyle = V("--amber"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, y1 - sc); ctx.lineTo(480, y1 - sc); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "기준 1 kg", 484, y1 - sc + 4, { s: 10.5, w: "800", c: V("--amber-700") });
      ctx.fillStyle = c <= 1 ? V("--green") : V("--coral"); ctx.fillRect(x0 + 110, y1 - c * sc, 140, c * sc);
      text(ctx, c.toFixed(1) + " kg", x0 + 180, y1 - c * sc - 8, { s: 15, w: "900", a: "center" });
      text(ctx, "수소 1 kg 을 만들 때 나오는 이산화 탄소", x0, 20, { s: 12.5, w: "800" });
      text(ctx, NM[m], 580, 90, { s: 20, w: "900", c: m === "green" ? V("--green-700") : (m === "blue" ? V("--brand-700") : V("--mist")) });
      text(ctx, m === "grey" ? "천연가스(CH₄)를 수증기와 반응시켜 수소를 얻음" : (m === "blue" ? "개질에서 나온 CO₂ 를 포집해 땅속에 저장" : "재생 에너지 전기로 물(H₂O)을 분해"), 580, 124, { s: 11.5, c: V("--mist") });
      text(ctx, m === "blue" ? "포집률 " + cap + "%" : "", 580, 160, { s: 14, w: "800" });
      return c;
    }
    function update() {
      var c = draw(), ch = false;
      $("h2-info").innerHTML = NM[m] + " — 수소 1 kg 당 이산화 탄소 약 <b>" + c.toFixed(1) + " kg</b>. " + (m === "grey" ? "천연가스 속 탄소가 이산화 탄소가 되어 나옵니다." : (m === "blue" ? "붙잡은 만큼만 줄어듭니다. 포집률을 올려 보세요." : "물을 분해하므로 원료에 탄소가 없습니다. 설비를 만드는 데 든 배출이 조금 남습니다."));
      if (m === "blue" && c <= 1.0001 && !got.a) { got.a = ch = true; }
      if (m === "green" && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("h2Got", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-4a"); if (got.b) done("m3-4b");
      if (got.a && got.b) {
        window.sthState("h2Best", "블루 수소는 포집률 90% 이상, 그린 수소는 포집 없이 1 kg 이하");
        window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("h2Best") + ". 수소는 <b>어떻게 만드느냐</b>에 따라 탄소중립 기술이 되기도, 아니기도 합니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    segWire("h2-m", "data-v", function (x) { m = x; update(); });
    $("h2-c").addEventListener("input", function (e) { cap = +e.target.value; $("h2-c-val").textContent = cap + "%"; update(); });
    update(); mission();
  })();

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("balBest") || "") + " / " + (window.sthState("h2Best") || "")); }
  function vs() {
    var p = window.sthState("p3") || "";
    $("e3-vs").innerHTML = "<b>나의 첫 발언</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 정확했습니다." : " — 저울을 맞추며 보았듯, 탄소중립은 순배출 0 입니다.") + "<br><b>나의 저울</b> " + (window.sthState("balBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[기후변화와 환경생태 Ⅲ] 이야기 ③ 저울 위의 탄소",
    items: [
      { id: "w3", label: "탄소중립은 배출 0이 아니다", hint: "저울을 맞춰 보고, 흡수원을 모두 켜도 배출을 몇 % 이상 줄여야 했는지 쓰세요." },
      { id: "e3b", label: "탄소 저감 기술 하나의 원리", hint: "기술 하나(예: CCUS, 그린 수소, 블루카본)를 골라 이산화 탄소를 어떻게 줄이거나 거두는지 원리를 설명하세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 8%의 약속
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "사건 파일 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "p4", title: "청소년 대표의 첫 답변",
    question: "“배출이 적은 나라는 줄이지 않아도 된다”는 말에 어떻게 답할까요?",
    options: ["㉠ 맞다, 큰 나라만 줄이면 된다", "㉡ 대기는 하나로 이어져 있어, 모든 나라가 함께 줄여야 목표에 닿는다", "㉢ 기후는 나라마다 따로 정해지므로 상관없다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 연표 */
  var STEPS = ["1988년 IPCC(기후 변화에 관한 정부 간 협의체) 설립", "1992년 리우 회의에서 기후변화 협약 채택", "1997년 선진국의 감축 의무를 정한 교토 의정서 채택", "2015년 모든 나라가 참여하는 파리 협정 채택", "2021년 글래스고 기후 합의 — 석탄 발전 감축 합의"];
  if (ep.cleared(1)) {
    $("s4-order").innerHTML = "<div class='order sort'><div class='slots'>" + STEPS.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>";
    window.sthMission("m4-2", true);
  } else {
    window.sthOrder({ mount: "s4-order", steps: STEPS, onDone: function () { window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>과학적 평가(IPCC)가 국제 협약을 이끌고, 협약은 선진국 중심(교토)에서 모든 나라의 참여(파리)로 넓어졌습니다."); ep.clear(1); } });
  }

  /* 장면 3 — 탄소예산 시계 (기존 시뮬레이션) */
  (function () {
    var cv = $("c3"), ctx = window.setupCanvas(cv), W = cv._w, H = cv._h;
    var E0 = 40, budget = 500, r = 0.03, Y0 = 2020, picked = !!window.sthState("budget"), got = window.sthState("bgGot") || { a: false, b: false };
    function cumulative(T) { return r <= 0.0001 ? E0 * T : E0 * (1 - Math.pow(1 - r, T)) / r; }
    function exhaustYear() { var cap = r > 0.0001 ? E0 / r : Infinity; if (cap <= budget + 1e-9) return null; if (r <= 0.0001) return Y0 + budget / E0; return Y0 + Math.log(1 - budget * r / E0) / Math.log(1 - r); }
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = A(V("--card-2"), 1); ctx.fillRect(0, 0, W, H);
      var ox = 68, oy = 40, iw = W - 122, ih = H - 100, YEARS = 60, maxE = 45, t;
      ctx.strokeStyle = A(V("--line"), 1); ctx.lineWidth = 1.4;
      for (t = 0; t <= 4; t++) { var yy = oy + ih - ih * t / 4; ctx.beginPath(); ctx.moveTo(ox, yy); ctx.lineTo(ox + iw, yy); ctx.stroke(); text(ctx, String(Math.round(maxE * t / 4)), ox - 8, yy + 4, { s: 11, w: "600", c: V("--mist"), a: "right" }); }
      ctx.save(); ctx.translate(20, oy + ih / 2); ctx.rotate(-Math.PI / 2); text(ctx, "연간 배출량 (Gt CO₂)", 0, 0, { s: 11.5, w: "700", c: V("--mist"), a: "center" }); ctx.restore();
      var X = function (T) { return ox + iw * T / YEARS; }, Y = function (e) { return oy + ih - ih * e / maxE; };
      var ey = exhaustYear(), Texh = ey === null ? YEARS : Math.min(YEARS, ey - Y0);
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); for (t = 0; t <= Texh; t += 0.5) ctx.lineTo(X(t), Y(E0 * Math.pow(1 - r, t))); ctx.lineTo(X(Texh), Y(0)); ctx.closePath(); ctx.fillStyle = A(V("--coral"), 0.32); ctx.fill();
      ctx.beginPath(); for (t = 0; t <= YEARS; t += 0.5) { var px = X(t), py = Y(E0 * Math.pow(1 - r, t)); if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.strokeStyle = A(V("--coral"), 1); ctx.lineWidth = 3; ctx.stroke();
      if (ey !== null && ey - Y0 <= YEARS) {
        ctx.strokeStyle = A(V("--rose"), 1); ctx.lineWidth = 2.5; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(X(ey - Y0), oy); ctx.lineTo(X(ey - Y0), oy + ih); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, Math.round(ey) + "년 예산 소진", Math.min(X(ey - Y0), W - 70), oy - 12, { s: 13, w: "800", c: V("--rose-700"), a: "center" });
      } else text(ctx, "예산 안에 머뭅니다 · 누적 " + cumulative(200).toFixed(0) + " Gt ≤ " + budget + " Gt", ox + iw / 2, oy + 22, { s: 14, w: "800", c: V("--green-700"), a: "center" });
      [0, 15, 30, 45, 60].forEach(function (T) { text(ctx, String(Y0 + T), X(T), oy + ih + 20, { s: 11.5, w: "600", c: V("--mist"), a: "center" }); });
      text(ctx, "칠해진 넓이 = 그때까지 쌓인 배출량", ox, H - 12, { s: 11.5, w: "600", c: V("--mist") });
    }
    function refresh() {
      var ey = exhaustYear(), need = E0 / budget, ch = false;
      $("t3-rv").textContent = (r * 100).toFixed(1) + " %";
      $("t3-info").innerHTML = (ey === null ? "<b>예산 안에 머뭅니다.</b> 해마다 " + (r * 100).toFixed(1) + "%씩 줄이면 누적이 " + cumulative(200).toFixed(0) + " Gt 에서 멈춥니다." : "<b>" + Math.round(ey) + "년</b>에 예산이 바닥납니다.") +
        " 2050년 배출량 " + (E0 * Math.pow(1 - r, 30)).toFixed(1) + " Gt." + ((budget === 500 ? got.a : got.b) ? " 이 목표를 넘지 않으려면 해마다 최소 <b>" + (need * 100).toFixed(1) + "%</b>." : "") + " 곡선의 높이가 아니라 <b>칠해진 넓이</b>를 보세요.";
      draw();
      if (!picked) return;
      var minR = E0 / budget;
      if (budget === 500 && r >= minR - 1e-9 && r <= minR + 0.005 + 1e-9 && !got.a) { got.a = ch = true; got.ra = (r * 100).toFixed(1); }
      if (budget === 1150 && r >= minR - 1e-9 && r <= minR + 0.005 + 1e-9 && !got.b) { got.b = ch = true; got.rb = (r * 100).toFixed(1); }
      if (ch) { window.sthState("bgGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-3a"); if (got.b) done("m4-3b");
      if (got.a && got.b) {
        window.sthState("bgBest", "1.5 °C: 해마다 " + got.ra + "% · 2 °C: 해마다 " + got.rb + "%");
        window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("bgBest") + ". 목표가 0.5 °C 달라지면 필요한 감축 속도는 2배 넘게 달라집니다.");
        ep.clear(2);
      }
    }
    window.sthGate({
      gate: "g4b", key: "budget", title: "먼저 예상해 봅시다",
      question: "지금부터 배출을 <b>해마다 몇 %씩</b> 줄여야 1.5 °C 탄소예산(500 Gt)을 넘지 않을까요?",
      options: ["㉠ 해마다 1 %", "㉡ 해마다 3 %", "㉢ 해마다 8 %", "㉣ 해마다 20 %"],
      onPick: function (i) { picked = true; window.sthState("budgetOK", i === 2 ? "맞음" : "어긋남"); refresh(); }
    });
    $("t3-r").addEventListener("input", function () { r = +this.value / 1000; refresh(); });
    segWire("t3-goal", "data-b", function (b) { budget = +b; refresh(); });
    cv._redraw = draw;
    refresh(); mission();
  })();

  /* 장면 4 — 우리 학교의 몫 */
  (function () {
    var canvas = $("c-sch"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, T = 26, L = 0, S = 0;
    var got = window.sthState("schGot") || { a: false, b: false };
    function saved() { var cool = 300000 * (1 - Math.pow(0.93, T - 26)), light = 200000 * 0.3 * L / 100, solar = S * 1200; return { cool: cool, light: light, solar: solar, tot: cool + light + solar }; }
    function draw() {
      paper(ctx, W, H);
      var s = saved(), pct = s.tot / 1000000 * 100, x0 = 60, y0 = 70, bw = 460;
      text(ctx, "학교 전기 사용 100만 kWh 가운데 줄인 몫", x0, 40, { s: 12.5, w: "800" });
      ctx.fillStyle = V("--card-2"); ctx.fillRect(x0, y0, bw, 40);
      var cx = x0;
      [[s.cool, "--teal", "냉방"], [s.light, "--amber", "조명"], [s.solar, "--green", "태양광"]].forEach(function (p) { var w = bw * p[0] / 1000000; ctx.fillStyle = V(p[1]); ctx.fillRect(cx, y0, w, 40); if (w > 44) text(ctx, p[2], cx + w / 2, y0 + 25, { s: 11, w: "800", a: "center", c: V("--on-accent") }); cx += w; });
      ctx.strokeStyle = V("--rose"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0 + bw * 0.15, y0 - 10); ctx.lineTo(x0 + bw * 0.15, y0 + 50); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "목표 15%", x0 + bw * 0.15, y0 + 66, { s: 10.5, w: "800", a: "center", c: V("--rose-700") });
      var rx = 580;
      text(ctx, "줄인 전기", rx, 70, { s: 12, c: V("--mist") });
      text(ctx, Math.round(s.tot).toLocaleString() + " kWh (" + pct.toFixed(1) + "%)", rx, 100, { s: 16, w: "900", c: pct >= 15 ? V("--green-700") : V("--ink") });
      text(ctx, "줄인 이산화 탄소", rx, 150, { s: 12, c: V("--mist") });
      text(ctx, "약 " + (s.tot * 0.46 / 1000).toFixed(0) + " t", rx, 184, { s: 24, w: "900" });
      return pct;
    }
    function update() {
      var pct = draw();
      $("sc-info").innerHTML = "냉방을 1 ℃ 높이면 냉방 전기가 약 7% 줄고(냉방은 전체의 30%), 빈 교실 소등으로 조명 전기의 최대 30%를 줄이며(조명은 전체의 20%), 태양광 1 kW 는 한 해 약 1,200 kWh 를 만듭니다.";
      if (pct >= 15 && !got.a) { got.a = true; got.plan = "냉방 " + T + " ℃ · 소등 " + L + "% · 태양광 " + S + " kW → " + pct.toFixed(1) + "%"; window.sthState("schGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-4a"); if (got.b) done("m4-4b");
      if (got.a && got.b) {
        window.sthState("schBest", got.plan);
        window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>" + got.plan + ". 생활 실천과 설비 투자, 정책 제안이 함께 가야 목표에 닿습니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("sc-t").addEventListener("input", function (e) { T = +e.target.value; $("sc-t-val").textContent = T + " ℃"; update(); });
    $("sc-l").addEventListener("input", function (e) { L = +e.target.value; $("sc-l-val").textContent = L + "%"; update(); });
    $("sc-s").addEventListener("input", function (e) { S = +e.target.value; $("sc-s-val").textContent = S + " kW"; update(); });
    window.sthSort({
      mount: "s4-sort",
      buckets: [{ id: "i", label: "개인 실천" }, { id: "c", label: "학교·지역 공동체 활동" }, { id: "p", label: "정책 참여" }],
      items: [
        { t: "가까운 거리는 걷거나 자전거·대중교통 이용하기", a: "i", why: "나 한 사람이 바로 할 수 있는 실천입니다." },
        { t: "음식을 남기지 않고 다회용 컵 쓰기", a: "i", why: "개인 실천입니다." },
        { t: "학생회가 빈 교실 소등 캠페인과 에너지 지킴이 활동을 운영하기", a: "c", why: "함께 모여 하는 공동체 활동입니다." },
        { t: "지역 환경 단체와 함께 학교 숲·바다숲 가꾸기 봉사하기", a: "c", why: "공동체 활동입니다." },
        { t: "학교 옥상 태양광 설치를 교육청에 청원하기", a: "p", why: "제도와 예산을 바꾸려는 정책 참여입니다.", hint: "누구에게 무엇을 요청하는 일인가요?" },
        { t: "지방 의회 공청회에 참석해 탄소중립 조례에 의견 내기", a: "p", why: "민주 시민으로서의 정책 참여입니다." }
      ],
      onDone: function () { got.b = true; window.sthState("schGot", got); mission(); }
    });
    update(); mission();
  })();

  function finish() { window.sthState("r4", "해결 · " + (window.sthState("bgBest") || "") + " / 학교 " + (window.sthState("schBest") || "")); }
  function vs() {
    var p = window.sthState("p4") || "", q = window.sthState("budget") || "";
    $("e4-vs").innerHTML = "<b>나의 첫 답변</b> " + (p || "기록 없음") + "<br><b>감축률 예상</b> " + (q || "-") + (q.indexOf("㉢") === 0 ? " — 정확했습니다." : " — 실제로는 해마다 약 8%.") + "<br><b>우리 학교 계획</b> " + (window.sthState("schBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[기후변화와 환경생태 Ⅲ] 이야기 ④ 8%의 약속",
    items: [
      { id: "w4", label: "얼마나가 아니라 얼마나 빨리", hint: "감축률을 8 % 앞뒤로 바꿔 보고, 왜 감축 속도가 총량보다 중요한지 쓰세요." },
      { id: "w5", label: "내가 제안하는 참여 방안", hint: "학교나 지역에서 해 볼 수 있는 일을 하나 정하고, 이 단원에서 알아낸 것 가운데 무엇을 근거로 효과가 있는지 쓰세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[기후변화와 환경생태 Ⅲ] 기후위기에 대응하는 우리의 노력 — 정리",
  recap: [
    { key: "r1", label: "① 하얗게 변한 산호초" },
    { key: "r2", label: "② 같은 비, 다른 재해" },
    { key: "r3", label: "③ 저울 위의 탄소" },
    { key: "r4", label: "④ 8%의 약속" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 사건을 꿰는 한 문장", hint: "산호, 재해, 탄소 저울, 탄소예산. 네 이야기를 ‘피해’와 ‘대응’이라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w6", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "cce-3", unitLabel: "[기후변화와 환경생태 Ⅲ] 기후위기에 대응하는 우리의 노력",
  rows: [
    { key: "r1", label: "① 하얗게 변한 산호초" },
    { key: "r2", label: "② 같은 비, 다른 재해" },
    { key: "r3", label: "③ 저울 위의 탄소" },
    { key: "r4", label: "④ 8%의 약속" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
