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
function meter(ctx, x, y, w, val, max, thr, ok, name, valTxt, thrTxt) {
  K.pill(ctx, name, x, y - 22, { s: 12, c: KC.ink });
  K.pill(ctx, valTxt + (ok ? "  ✅" : "  ✗"), x + w, y - 22, { a: "right", s: 13, c: ok ? KC.green : KC.red });
  ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.beginPath(); ctx.roundRect(x, y - 6, w, 18, 9); ctx.fill();
  var fw = w * Math.max(0, Math.min(1, val / max));
  if (fw > 1) {
    var bg = ctx.createLinearGradient(x, 0, x + fw, 0); bg.addColorStop(0, ok ? "#1f9a74" : "#a8463a"); bg.addColorStop(1, ok ? "#5ff0c0" : "#ff9a6b");
    ctx.save(); ctx.shadowColor = ok ? KC.green : KC.orange; ctx.shadowBlur = 10; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x, y - 6, Math.max(fw, 10), 18, 9); ctx.fill(); ctx.restore();
  }
  var tx = x + w * thr / max;
  ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(tx, y - 11); ctx.lineTo(tx, y + 17); ctx.stroke(); ctx.setLineDash([]);
  K.t(ctx, thrTxt, tx, y + 30, { s: 10.5, a: "center", c: KC.mute });
}
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
    var mo = motion("t0-play"), tt = 0, RF = mulberry(77), FISH = [];
    for (var q = 0; q < 9; q++) FISH.push({ x: RF(), y: 90 + RF() * 150, s: .6 + RF() * .6, v: (RF() > .5 ? 1 : -1) * (0.02 + RF() * 0.03), c: ["#ffb35c", "#7fd3ff", "#ffd36b", "#ff8aa0"][q % 4] });
    function fish(x, y, s, dir, col) {
      ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
      var fg = ctx.createLinearGradient(-12, 0, 12, 0); fg.addColorStop(0, col); fg.addColorStop(1, "#ffffff");
      ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(0, 0, 12, 6, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-19, -6); ctx.lineTo(-19, 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#10203a"; ctx.beginPath(); ctx.arc(6, -1.5, 1.6, 0, 6.2832); ctx.fill(); ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var z = zoox(), d = dhw(), al = alertOf(d), k;
      /* ── 왼쪽: 바닷속 산호초 ── */
      var LW = 560;
      K.stage(ctx, 0, 0, LW, H, "ocean", { seed: 42 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var warm = Math.min(1, dT / 3) * Math.min(1, wk / 6);
      if (warm > 0) { ctx.fillStyle = "rgba(255,120,80," + (0.18 * warm).toFixed(3) + ")"; ctx.fillRect(0, 0, LW, H); }
      for (k = 0; k < 7; k++) { var cx = 40 + k * 80 + 18 * Math.sin(tt / 1500 + k * 1.7), cg = ctx.createLinearGradient(0, 0, 0, H - 60); cg.addColorStop(0, "rgba(200,240,255,.20)"); cg.addColorStop(1, "rgba(200,240,255,0)"); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx + 26, 0); ctx.lineTo(cx + 60, H - 60); ctx.lineTo(cx + 20, H - 60); ctx.closePath(); ctx.fill(); }
      var sg = ctx.createLinearGradient(0, H - 70, 0, H); sg.addColorStop(0, "#c9b48a"); sg.addColorStop(1, "#7d6a48");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(0, H - 58); for (var sx = 0; sx <= LW; sx += 20) ctx.lineTo(sx, H - 58 + 6 * Math.sin(sx / 47)); ctx.lineTo(LW, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      ctx.restore();
      var healthy = [[255, 138, 101], [255, 179, 71], [186, 104, 200], [77, 208, 225]];
      BRANCH.forEach(function (b, i) {
        var base = healthy[i % 4], r = Math.round(base[0] * z + 246 * (1 - z)), gg = Math.round(base[1] * z + 246 * (1 - z)), bb = Math.round(base[2] * z + 240 * (1 - z));
        var tipx = b.x + b.lean, tipy = b.base - b.h, gr = ctx.createLinearGradient(b.x, b.base, tipx, tipy);
        gr.addColorStop(0, "rgb(" + Math.round(r * .55) + "," + Math.round(gg * .55) + "," + Math.round(bb * .6) + ")"); gr.addColorStop(1, "rgb(" + r + "," + gg + "," + bb + ")");
        ctx.strokeStyle = gr; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = b.w;
        ctx.beginPath(); ctx.moveTo(b.x, b.base); ctx.lineTo(tipx, tipy); ctx.stroke();
        for (var a = 0; a < b.arms; a++) {
          var f = 0.45 + a * 0.22, px = b.x + b.lean * f, py = b.base - b.h * f, dir = (a % 2 ? 1 : -1);
          ctx.lineWidth = b.w * 0.6; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + dir * (15 + b.seed * 15), py - (21 + b.seed * 17)); ctx.stroke();
        }
        ctx.fillStyle = "rgba(255,255,255," + (0.25 + 0.5 * (1 - z)).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(tipx, tipy, b.w * .38, 0, 6.2832); ctx.fill();
      });
      if (z < 0.15) {
        ctx.strokeStyle = "rgba(80,140,60,.75)"; ctx.lineWidth = 2.4;
        BRANCH.forEach(function (b) { ctx.beginPath(); ctx.moveTo(b.x - 6, b.base - b.h * 0.5); ctx.quadraticCurveTo(b.x + 10, b.base - b.h * 0.3, b.x + 4, b.base); ctx.stroke(); });
      }
      var nf = Math.round(FISH.length * z);
      for (k = 0; k < nf; k++) { var F = FISH[k]; fish(20 + F.x * (LW - 40), F.y + 4 * Math.sin(tt / 600 + k), F.s, F.v > 0 ? 1 : -1, F.c); }
      K.pill(ctx, z > 0.6 ? "건강한 산호" : (z > 0.15 ? "백화 진행 중" : "백화 후 폐사 · 해조류가 덮음"), 14, 28, { s: 13, c: z > 0.6 ? KC.green : (z > 0.15 ? KC.yellow : KC.red) });
      K.pill(ctx, "공생 조류 잔존율 " + Math.round(z * 100) + "%", 14, 58, { s: 11.5, c: KC.ink });
      K.pill(ctx, "평년보다 +" + dT.toFixed(1) + " °C · " + wk + "주", LW - 14, 28, { a: "right", s: 12, c: dT >= 1 ? KC.orange : KC.blue, box: [0, LW] });

      /* ── 오른쪽: 12주 수온 편차와 DHW ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 43 });
      K.pill(ctx, "최근 12주 수온 편차", RX + 14, 28, { s: 13, c: KC.blue });
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: RW - 8, h: 240, x0: 0, x1: 12, y0: 0, y1: 4, xt: 12, yt: 4, pl: 46, xf: function (vv) { return vv === 0 ? "12주 전" : (vv === 12 ? "지금" : ""); }, yf: function (vv) { return "+" + vv + "°"; } });
      var bw = (g.X(1) - g.X(0)) * .7;
      for (var w = 0; w < 12; w++) {
        var val = (w >= 12 - wk) ? dT : 0, top = g.Y(Math.min(Math.max(val, 0.06), 4)), hot = val >= 1;
        var bg = ctx.createLinearGradient(0, top, 0, g.B); bg.addColorStop(0, hot ? "#ff9a7a" : "#8fa0d0"); bg.addColorStop(1, hot ? "#b8324a" : "#3a4a7a");
        ctx.save(); if (hot) { ctx.shadowColor = KC.red; ctx.shadowBlur = 8; } ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(g.X(w + .5) - bw / 2, top, bw, g.B - top, [4, 4, 0, 0]); ctx.fill(); ctx.restore();
      }
      ctx.strokeStyle = KC.red; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(g.L, g.Y(1)); ctx.lineTo(g.R, g.Y(1)); ctx.stroke(); ctx.setLineDash([]);
      K.pill(ctx, "+1 °C 기준선", g.L + 6, g.Y(1) - 8, { s: 11, c: KC.red });
      /* DHW 계기 */
      var mx0 = RX + 22, mw = RW - 44, my = 334, dmax = 16, dx = function (vv) { return mx0 + mw * Math.min(vv, dmax) / dmax; };
      [[0, 4, "rgba(63,211,163,.35)"], [4, 8, "rgba(255,211,107,.4)"], [8, 16, "rgba(255,107,129,.4)"]].forEach(function (z2) { ctx.fillStyle = z2[2]; ctx.fillRect(dx(z2[0]), my, dx(z2[1]) - dx(z2[0]), 14); });
      [[2, "주의"], [6, "경보 1"], [12, "경보 2"]].forEach(function (m) { K.t(ctx, m[1], dx(m[0]), my + 30, { s: 10.5, a: "center", c: KC.mute }); });
      [0, 4, 8, 16].forEach(function (m) { K.t(ctx, String(m), dx(m), my - 6, { s: 10, a: m === 0 ? "left" : (m === 16 ? "right" : "center"), c: KC.dim }); });
      ctx.save(); ctx.shadowColor = "#fff"; ctx.shadowBlur = 8; ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.moveTo(dx(d), my - 2); ctx.lineTo(dx(d) - 6, my - 12); ctx.lineTo(dx(d) + 6, my - 12); ctx.closePath(); ctx.fill(); ctx.fillRect(dx(d) - 1.5, my, 3, 14); ctx.restore();
      K.pill(ctx, "DHW " + d.toFixed(1) + " · " + al.n, RX + RW / 2, H - 22, { a: "center", s: 14, c: d >= 8 ? KC.red : (d >= 4 ? KC.yellow : (d > 0 ? KC.orange : KC.green)) });
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
      rd("t0-read", kv("DHW = 편차 × 주", dT >= 1 ? dT.toFixed(1) + " × " + Math.min(wk, 12) + " = " + d.toFixed(1) : "0", d >= 8 ? "r" : (d >= 4 ? "y" : "g"), dT >= 1 ? "최근 12주 안에서만 쌓입니다" : "편차가 1 °C 미만이면 쌓이지 않습니다") +
        kv("단계", al.n, d >= 8 ? "r" : (d >= 4 ? "y" : "g")) + kv("공생 조류", Math.round(zoox() * 100) + "%", "b", "산호 몸속에 남은 비율(모형)"));
      if (Math.abs(dT - 1) < 1e-9 && d >= 4 && !got.a) { got.a = ch = true; got.wa = wk; }
      if (d >= 8 && !got.b) { got.b = ch = true; got.cb = "+" + dT.toFixed(1) + " °C · " + wk + "주"; }
      if (ch) { window.sthState("dhwGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.b) done("m1-2b");
      if (got.a && got.b) {
        window.sthState("dhwBest", "+1.0 °C는 " + got.wa + "주면 백화 시작 · " + got.cb + " 이면 대량 폐사");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>+1 °C도 <b>4주</b>면 백화가 시작됩니다. 높은 수온과 긴 기간이 곱해져 열스트레스가 쌓입니다.");
        ep.clear(1);
      }
    }
    $("t0-dt").addEventListener("input", function () { dT = +this.value / 10; refresh(); });
    $("t0-wk").addEventListener("input", function () { wk = +this.value; refresh(); });
    cv._redraw = draw;
    K.animate(cv, function (dt) { if (mo.on) { tt += dt; FISH.forEach(function (F) { F.x += F.v * dt / 1000; if (F.x < 0 || F.x > 1) { F.v = -F.v; F.x = Math.max(0, Math.min(1, F.x)); } }); draw(); } });
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
      var r = sim(n), ok = r.avg >= 30 && r.avg <= 40, y;
      ctx.clearRect(0, 0, W, H);
      K.stage(ctx, 0, 0, W, H, "ocean", { seed: 44, grid: true });
      K.pill(ctx, "산호 덮임률 60년 (처음 60%)", 16, 28, { s: 13, c: KC.blue });
      var lg = K.pill(ctx, "▼ 대규모 백화 (" + n + "년마다 절반이 죽음)", W - 16, 28, { a: "right", s: 11.5, c: "#e8f4ff" });
      K.pill(ctx, "━ 덮임률", lg.x - 8, 28, { a: "right", s: 11.5, c: KC.orange });
      var g = K.chart(ctx, { x: 6, y: 44, w: W - 12, h: H - 48, x0: 0, x1: 60, y0: 0, y1: 60, xt: 6, yt: 4, xl: "지난 해", xf: function (vv) { return vv + "년"; }, yf: function (vv) { return vv + "%"; } });
      clipRect(ctx, g);
      ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.fillRect(g.X(40), g.T, g.X(60) - g.X(40), g.B - g.T);
      for (y = n; y <= 60; y += n) { ctx.strokeStyle = "rgba(232,244,255,.22)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(g.X(y), g.T); ctx.lineTo(g.X(y), g.B); ctx.stroke(); ctx.fillStyle = "#e8f4ff"; ctx.beginPath(); ctx.moveTo(g.X(y) - 4, g.T + 2); ctx.lineTo(g.X(y) + 4, g.T + 2); ctx.lineTo(g.X(y), g.T + 9); ctx.closePath(); ctx.fill(); }
      var ag = ctx.createLinearGradient(0, g.T, 0, g.B); ag.addColorStop(0, "rgba(255,140,110,.35)"); ag.addColorStop(1, "rgba(255,140,110,.02)");
      ctx.beginPath(); ctx.moveTo(g.X(0), g.B); r.tr.forEach(function (c, yy) { ctx.lineTo(g.X(yy), g.Y(c)); }); ctx.lineTo(g.X(60), g.B); ctx.closePath(); ctx.fillStyle = ag; ctx.fill();
      ctx.strokeStyle = ok ? KC.green : KC.yellow; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(g.X(40), g.Y(r.avg)); ctx.lineTo(g.X(60), g.Y(r.avg)); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      K.plot(ctx, g, r.tr.map(function (c, yy) { return [yy, c]; }), KC.orange, { w: 2.6 });
      K.pill(ctx, "마지막 20년", g.X(50), g.B - 10, { a: "center", s: 11, c: KC.mute });
      K.pill(ctx, "평균 " + r.avg.toFixed(1) + "%", g.X(60) - 8, Math.min(g.Y(r.avg) - 12, g.B - 36), { a: "right", s: 12, c: ok ? KC.green : KC.yellow });
      return r.avg;
    }
    function update() {
      var a = draw();
      rd("rf-read", kv("백화 간격", n + "년", "y") + kv("마지막 20년 평균", a.toFixed(1) + "%", a >= 30 && a <= 40 ? "g" : "r", "처음 덮임률 60%") +
        (a >= 30 && a <= 40 ? okp(true, "처음의 절반쯤을 겨우 유지합니다") : ""));
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
    $("e1-vs").innerHTML = "<b>나의 첫 예상</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 정확했습니다. 1 °C × 4주 = DHW 4." : " — 실제로는 1 °C로 4주면 DHW 4, 백화가 시작됩니다.") + "<br><b>회복 계산</b> " + (window.sthState("reefBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[기후변화와 환경생태 Ⅲ] 이야기 ① 하얗게 변한 산호초",
    items: [
      { id: "w1", label: "온도만이 아니라 기간이 문제인 까닭", hint: "수온 편차와 기간을 각각 바꿔 보고, 어느 쪽이 DHW를 더 크게 만드는지 근거와 함께 쓰세요.", ph: "+2 °C로 2주 두었을 때와 +1 °C로 4주 두었을 때를 비교하면 …" },
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
      var a = series(), i, g;
      ctx.clearRect(0, 0, W, H);
      K.stage(ctx, 0, 0, W, H, "night", { seed: 45, grid: true });
      var lg = K.pill(ctx, "기온 +" + dT.toFixed(1) + " °C 일 때 같은 지역의 1년", W - 16, 28, { a: "right", s: 12, c: KC.orange });
      if (mode === "rain") {
        var mx = Math.max(60, Math.max.apply(null, a)), imx = a.indexOf(Math.max.apply(null, a));
        K.pill(ctx, "하루하루 내린 비 (mm)", 16, 28, { s: 13, c: KC.blue });
        var MN = ["1월", "3월", "5월", "7월", "9월", "11월", ""];
        g = K.chart(ctx, { x: 6, y: 44, w: W - 12, h: H - 48, x0: 0, x1: 365, y0: 0, y1: mx, xt: 6, yt: 4, yl: "하루 강수량(mm)", xf: function (vv) { return MN[Math.round(vv / 365 * 6)] || ""; }, yf: function (vv) { return String(Math.round(vv)); } });
        var bw = Math.max(1.8, (g.R - g.L) / 365 - 0.3);
        ctx.strokeStyle = "rgba(255,107,129,.6)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(g.L, g.Y(57)); ctx.lineTo(g.R, g.Y(57)); ctx.stroke(); ctx.setLineDash([]);
        for (i = 0; i < a.length; i++) {
          if (a[i] <= 0) continue;
          var x = g.X(i), top = g.Y(a[i]), big = a[i] >= 57, bg = ctx.createLinearGradient(0, top, 0, g.B);
          bg.addColorStop(0, big ? "#ff8aa0" : "#9fe0ff"); bg.addColorStop(1, big ? "#b8324a" : "#2a6ea8");
          ctx.save(); if (big) { ctx.shadowColor = KC.red; ctx.shadowBlur = 10; } ctx.fillStyle = bg; ctx.fillRect(x, top, bw, g.B - top); ctx.restore();
        }
        K.pill(ctx, "분홍 = 하루 57 mm 이상", g.L + 8, g.T + 22, { s: 11, c: "#ff9aa8" });
        K.pill(ctx, "하루 최대 " + Math.round(a[imx]) + " mm", g.X(imx) + (imx > 300 ? -10 : 10), Math.max(g.Y(a[imx]) + 4, g.T + 50), { a: imx > 300 ? "right" : "left", s: 11.5, c: KC.red });
      } else {
        var runs = [], run = 0;
        for (i = 0; i < a.length; i++) { if (a[i] > 0) { if (run) runs.push(run); run = 0; } else run++; }
        if (run) runs.push(run);
        runs.sort(function (p, q) { return q - p; });
        var show = runs.slice(0, 40), maxRun = Math.max(20, show[0] || 10);
        K.pill(ctx, "연속으로 비가 오지 않은 날 (긴 순서로 40개)", 16, 28, { s: 13, c: KC.blue });
        g = K.chart(ctx, { x: 6, y: 44, w: W - 12, h: H - 48, x0: 0, x1: 40, y0: 0, y1: maxRun, xt: 4, yt: 4, yl: "연속 무강수 일수", xf: function (vv) { return vv ? vv + "번째" : "가장 긴 것"; }, yf: function (vv) { return Math.round(vv) + "일"; } });
        var bw2 = (g.X(1) - g.X(0)) * .76;
        for (i = 0; i < show.length; i++) {
          var top2 = g.Y(show[i]), fire = show[i] >= 14, bg2 = ctx.createLinearGradient(0, top2, 0, g.B);
          bg2.addColorStop(0, fire ? "#ffb35c" : "#ffe29a"); bg2.addColorStop(1, fire ? "#c2410c" : "#8a6a20");
          ctx.save(); if (fire) { ctx.shadowColor = KC.orange; ctx.shadowBlur = 10; } ctx.fillStyle = bg2; ctx.beginPath(); ctx.roundRect(g.X(i + .5) - bw2 / 2, top2, bw2, g.B - top2, [3, 3, 0, 0]); ctx.fill(); ctx.restore();
        }
        ctx.strokeStyle = KC.red; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(g.L, g.Y(14)); ctx.lineTo(g.R, g.Y(14)); ctx.stroke(); ctx.setLineDash([]);
        K.pill(ctx, "🔥 2주 이상 — 산불 위험이 커지는 구간", g.R - 8, g.Y(14) - 10, { a: "right", s: 11.5, c: KC.orange });
      }
    }
    function refresh() {
      var a = series(), tot = a.reduce(function (x, y) { return x + y; }, 0), days = a.filter(function (x) { return x > 0; }).length, mx = Math.max.apply(null, a);
      var up = (mx / MAX0 - 1) * 100, totUp = (tot / TOT0 - 1) * 100;
      $("t1-dtv").textContent = "+" + dT.toFixed(1) + " °C";
      $("t1-info").innerHTML = "대기가 품는 수증기 <b>+" + Math.round((Math.pow(1.07, dT) - 1) * 100) + "%</b> · 연 강수량 <b>" + Math.round(TOT0) + " → " + Math.round(tot) + " mm</b> (" + (totUp >= 0 ? "+" : "") + totUp.toFixed(1) + "%) · 비 오는 날 <b>" + DAY0 + " → " + days + "일</b> · 하루 최대 강수 <b>" + Math.round(MAX0) + " → " + Math.round(mx) + " mm</b> (+" + up.toFixed(0) + "%). 같은 양의 비가 더 적은 날에 몰립니다.";
      draw();
      rd("t1-read", kv("연 강수량", Math.round(TOT0) + " → " + Math.round(tot) + " mm", totUp <= 6 ? "b" : "r", (totUp >= 0 ? "+" : "") + totUp.toFixed(1) + "% (거의 그대로면 +6% 이하)") +
        kv("비 오는 날", DAY0 + " → " + days + "일", "y") +
        kv("하루 최대 강수", Math.round(MAX0) + " → " + Math.round(mx) + " mm", up >= 30 ? "r" : "y", "+" + up.toFixed(0) + "%") +
        (up >= 30 && totUp <= 6 ? okp(true, "같은 양의 비가 더 적은 날에 몰렸습니다") : ""));
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
    var mo = motion("sp-play"), RD = mulberry(91), DROPS = [];
    for (var q = 0; q < 70; q++) DROPS.push({ x: RD(), y: RD() });
    function draw() {
      var ro = run(), c = cost(), k;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 도시 단면 ── */
      var LW = 560, gy = 160, x0 = 16, x1 = LW - 16, px = x0 + (x1 - x0 - 120) * p / 100;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 46 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var cl = ctx.createLinearGradient(0, 0, 0, 60); cl.addColorStop(0, "#3a4560"); cl.addColorStop(1, "rgba(58,69,96,0)"); ctx.fillStyle = cl; ctx.fillRect(0, 0, LW, 60);
      DROPS.forEach(function (d) { var dx = 8 + d.x * (LW - 16), dy = 40 + d.y * (gy - 46); ctx.strokeStyle = "rgba(150,210,255,.75)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx - 3, dy + 10); ctx.stroke(); });
      var soil = ctx.createLinearGradient(0, gy, 0, H); soil.addColorStop(0, "#5a4430"); soil.addColorStop(1, "#22180f"); ctx.fillStyle = soil; ctx.fillRect(0, gy, LW, H - gy);
      if (p > 0) { var gr = ctx.createLinearGradient(0, gy - 6, 0, gy + 6); gr.addColorStop(0, "#6fcf5a"); gr.addColorStop(1, "#2f7a2a"); ctx.fillStyle = gr; ctx.fillRect(x0, gy - 5, px - x0, 10); for (k = x0 + 4; k < px; k += 7) { ctx.strokeStyle = "#8fe070"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(k, gy - 5); ctx.lineTo(k - 2, gy - 11); ctx.stroke(); } }
      var as = ctx.createLinearGradient(0, gy - 5, 0, gy + 7); as.addColorStop(0, "#5b6170"); as.addColorStop(1, "#2c303a"); ctx.fillStyle = as; ctx.fillRect(px, gy - 5, x1 - px, 12);
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.setLineDash([12, 10]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px + 6, gy); ctx.lineTo(x1 - 130, gy); ctx.stroke(); ctx.setLineDash([]);
      /* 스며드는 물 */
      for (k = 0; k < Math.round(p / 6); k++) { var ix = x0 + 14 + k * ((px - x0 - 20) / Math.max(1, Math.round(p / 6) - 1)); K.arrow(ctx, { x: ix, y: gy + 12 }, { x: ix, y: gy + 40 }, "rgba(127,211,255,.85)", 2, 7); }
      /* 저류조 */
      var tx = 200, ty = 196, tw = 160, th = 56, lvl = th * s / 40;
      var cg = ctx.createLinearGradient(tx, ty, tx + tw, ty + th); cg.addColorStop(0, "#9aa3b3"); cg.addColorStop(1, "#5d6573"); ctx.fillStyle = cg; ctx.fillRect(tx - 5, ty - 5, tw + 10, th + 10);
      ctx.fillStyle = "#1a2238"; ctx.fillRect(tx, ty, tw, th);
      if (s > 0) { var wg = ctx.createLinearGradient(0, ty + th - lvl, 0, ty + th); wg.addColorStop(0, "#5fb8ff"); wg.addColorStop(1, "#1d5fa8"); ctx.fillStyle = wg; ctx.fillRect(tx, ty + th - lvl, tw, lvl); }
      /* 하수관 */
      var sx = 470, sy = 216, sr = 30, fill = Math.min(1, ro / 100);
      ctx.fillStyle = "#2c303a"; ctx.fillRect(sx - 8, gy + 4, 16, sy - sr - gy);
      var pg = ctx.createRadialGradient(sx - 10, sy - 10, 4, sx, sy, sr + 6); pg.addColorStop(0, "#e3e7ee"); pg.addColorStop(1, "#6d7480"); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(sx, sy, sr + 6, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#0b1020"; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 6.2832); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 6.2832); ctx.clip(); ctx.fillStyle = ro > 50 ? "#ff6b81" : "#3f9be0"; ctx.fillRect(sx - sr, sy + sr - 2 * sr * fill, 2 * sr, 2 * sr * fill); ctx.restore();
      ctx.strokeStyle = "#ffffff"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx - sr, sy); ctx.lineTo(sx + sr, sy); ctx.stroke(); ctx.setLineDash([]);
      /* 흘러가는 빗물 */
      if (ro > 0) { ctx.strokeStyle = "rgba(127,211,255,.8)"; ctx.lineWidth = 2 + ro / 14; ctx.beginPath(); ctx.moveTo(px + 10, gy - 7); ctx.lineTo(sx - 10, gy - 7); ctx.stroke(); K.arrow(ctx, { x: sx - 40, y: gy - 7 }, { x: sx - 4, y: gy - 7 }, "rgba(127,211,255,.95)", 2, 9); }
      if (ro > 50) { ctx.fillStyle = "rgba(90,170,255,.55)"; ctx.beginPath(); ctx.ellipse(sx + 10, gy - 8, 70, 7, 0, 0, 6.2832); ctx.fill(); }
      ctx.restore();
      K.pill(ctx, "시간당 100 mm 폭우가 내리는 도시", 14, 28, { s: 13, c: KC.blue });
      if (p > 0) K.pill(ctx, "투수 포장·녹지 " + p + "%", x0 + 6, gy + 62, { s: 11, c: "#a8f09a" });
      K.pill(ctx, "빗물 저류조 " + s + " mm", tx + tw / 2, ty + th + 26, { a: "center", s: 11, c: "#cfeaff" });
      K.pill(ctx, "하수관 · 점선 = 용량 50 mm", sx, sy + sr + 26, { a: "center", s: 11, c: KC.ink, box: [0, LW] });
      if (ro > 50) K.pill(ctx, "⚠ 도로 침수", sx + 10, gy - 22, { a: "center", s: 11.5, c: KC.red, box: [0, LW] });

      /* ── 오른쪽: 두 기준 ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 47 });
      K.pill(ctx, "두 기준을 함께 맞추기", RX + 14, 28, { s: 13, c: KC.blue });
      meter(ctx, RX + 18, 112, RW - 36, ro, 100, 50, ro <= 50, "하수관으로 흘러드는 물", ro.toFixed(0) + " mm", "용량 50 mm 이하");
      meter(ctx, RX + 18, 212, RW - 36, c, 120, 70, c <= 70, "비용", c.toFixed(0), "예산 70 이하");
      return { ro: ro, c: c };
    }
    function update() {
      var r = draw();
      rd("sp-read", kv("흘러드는 물", r.ro.toFixed(0) + " mm", r.ro <= 50 ? "g" : "r", "하수관 용량 50 mm") + kv("비용", r.c.toFixed(0), r.c <= 70 ? "g" : "r", "예산 70") +
        (r.ro <= 50 && r.c <= 70 ? okp(true, "침수 없이 예산 안에서 막았습니다") : ""));
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
    K.animate(canvas, function (dt) { if (!mo.on) return; DROPS.forEach(function (d) { d.y += dt / 700; if (d.y > 1) { d.y -= 1; d.x = RD(); } }); draw(); });
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
      { id: "w2", label: "가뭄과 홍수가 함께 늘어나는 까닭", hint: "연 강수량 · 비 오는 날 · 하루 최대 강수 세 값을 근거로 설명하세요.", ph: "연 강수량은 (      )인데 비 오는 날은 (      ), 하루 최대 강수는 (      )이므로 …" },
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
    var EC = [["#ff8a9c", "#b8324a"], ["#ffc27a", "#c2610c"], ["#7ff0b0", "#1f8a5a"], ["#cdb8ff", "#6a4fd0"], ["#9fe0ff", "#2a6ea8"]];
    var SC = [["#7ff0b0", "#1f8a5a"], ["#7ff0e8", "#1b8a8a"], ["#9fc4ff", "#2a4ea8"]];
    var tiltNow = null;
    function tiltOf(t) { return Math.max(-0.2, Math.min(0.2, t.net / 130)); }
    function block(x, y, w, h, c2, label) {
      var g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, c2[0]); g.addColorStop(1, c2[1]);
      ctx.save(); ctx.shadowColor = c2[0]; ctx.shadowBlur = 6; ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, Math.max(1, h - 2), 4); ctx.fill(); ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(x + 4, y + 2, w - 8, Math.min(3, h / 4));
      if (h > 16) K.t(ctx, label, x + w / 2, y + h / 2 + 4, { s: 11, a: "center", c: "#0b1020", w: "800" });
    }
    function draw() {
      var t = totals(), cx = W / 2, topY = 250, scale = 2.3, armL = 232;
      if (tiltNow === null || K.REDUCE) tiltNow = tiltOf(t);
      var tilt = tiltNow;
      ctx.clearRect(0, 0, W, H);
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 48 });
      K.pill(ctx, "탄소 저울 · 배출 100을 기준으로 한 상대값", 16, 28, { s: 13, c: KC.blue });
      /* 받침대 */
      var mg = ctx.createLinearGradient(cx - 10, 0, cx + 10, 0); mg.addColorStop(0, "#7d8696"); mg.addColorStop(.5, "#e3e7ee"); mg.addColorStop(1, "#6d7480");
      ctx.fillStyle = mg; ctx.fillRect(cx - 6, topY, 12, H - 74 - topY);
      var bg = ctx.createLinearGradient(0, H - 80, 0, H - 60); bg.addColorStop(0, "#c9ced6"); bg.addColorStop(1, "#5d6573");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(cx - 70, H - 62); ctx.lineTo(cx - 30, H - 82); ctx.lineTo(cx + 30, H - 82); ctx.lineTo(cx + 70, H - 62); ctx.closePath(); ctx.fill();
      var lx = cx - armL * Math.cos(tilt), ly = topY + armL * Math.sin(tilt), rx = cx + armL * Math.cos(tilt), ry = topY - armL * Math.sin(tilt);
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#3a404c"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke();
      ctx.strokeStyle = "#d9dee6"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke(); ctx.restore();
      ctx.fillStyle = KC.yellow; ctx.beginPath(); ctx.arc(cx, topY, 8, 0, 6.2832); ctx.fill();
      function pan(px, py) {
        ctx.strokeStyle = "rgba(220,228,255,.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 70, py + 36); ctx.moveTo(px, py); ctx.lineTo(px + 70, py + 36); ctx.stroke();
        var pg = ctx.createLinearGradient(px - 90, 0, px + 90, 0); pg.addColorStop(0, "#6d7480"); pg.addColorStop(.45, "#eef1f6"); pg.addColorStop(1, "#5d6573");
        ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(px, py + 40, 90, 11, 0, 0, 6.2832); ctx.fill();
      }
      pan(lx, ly); pan(rx, ry);
      var sy = ly + 36;
      EMIT.forEach(function (e, i) { var val = e.base * (1 - e.cut / 100); if (val < 0.4) return; var h = val * scale; sy -= h; block(lx - 60, sy, 120, h, EC[i], e.n + " " + val.toFixed(0)); });
      var sy2 = ry + 36;
      SINK.forEach(function (s, i) { if (s.v < 0.4) return; var h = s.v * scale; sy2 -= h; block(rx - 60, sy2, 120, h, SC[i], s.n.split("·")[0] + " " + s.v.toFixed(0)); });
      K.pill(ctx, "배출 " + t.em.toFixed(0), lx, ly + 76, { a: "center", s: 13, c: KC.red });
      K.pill(ctx, "흡수 " + t.ab.toFixed(0), rx, ry + 76, { a: "center", s: 13, c: KC.green });
      var ok = Math.abs(t.net) < 1.5;
      K.pill(ctx, ok ? "⚖ 탄소중립 — 순배출 0" : ("순배출 " + (t.net > 0 ? "+" : "") + t.net.toFixed(1)), cx, H - 22, { a: "center", s: 16, c: ok ? KC.green : KC.red });
    }
    function refresh() {
      var t = totals(), msg;
      if (Math.abs(t.net) < 1.5) msg = "<b>수지가 맞았습니다.</b> 배출 " + t.em.toFixed(0) + " 과 흡수 " + t.ab.toFixed(0) + " 이 같아졌습니다. 이것이 탄소중립입니다 — 배출이 0이 된 것이 아닙니다.";
      else if (t.net > 0) msg = "배출 " + t.em.toFixed(1) + " · 흡수 " + t.ab.toFixed(1) + " → 아직 <b>" + t.net.toFixed(0) + "</b> 만큼 남습니다. 흡수원을 모두 최대로 켜도 <b>" + MAXABS + "</b> 까지가 한계이므로, 배출을 <b>" + (100 - MAXABS) + "% 이상</b> 줄이지 않으면 수지가 맞지 않습니다.";
      else msg = "흡수가 배출을 넘었습니다(<b>순배출 " + t.net.toFixed(0) + "</b>). 이런 상태를 <b>탄소 네거티브</b>라고 합니다.";
      $("t2-info").innerHTML = msg;
      draw();
      rd("t2-read", kv("배출", t.em.toFixed(1), "r") + kv("흡수", t.ab.toFixed(1), "g", "흡수원을 모두 켜도 " + MAXABS + "까지") + kv("순배출 = 배출 − 흡수", (t.net > 0 ? "+" : "") + t.net.toFixed(1), Math.abs(t.net) < 1.5 ? "g" : "y") +
        (Math.abs(t.net) < 1.5 ? okp(true, "탄소중립 — 배출이 0이 된 것이 아니라 수지가 맞은 것") : ""));
      if (Math.abs(t.net) < 1.5 && !ep.cleared(1)) {
        window.sthState("balBest", "배출 " + t.em.toFixed(0) + " = 흡수 " + t.ab.toFixed(0));
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("balBest") + ". 흡수에 한계가 있어 배출을 절반 넘게 줄여야 했습니다.");
        ep.clear(1);
      }
    }
    EMIT.forEach(function (e, i) { $("em" + i).addEventListener("input", function () { e.cut = +this.value; $("em" + i + "-v").textContent = e.cut + "%"; refresh(); }); });
    SINK.forEach(function (s, i) { $("sk" + i).addEventListener("input", function () { s.v = +this.value; $("sk" + i + "-v").textContent = String(s.v); refresh(); }); });
    cv._redraw = draw;
    K.animate(cv, function (dt) { var tg = tiltOf(totals()); if (tiltNow !== null && Math.abs(tg - tiltNow) > 0.0005) { tiltNow += (tg - tiltNow) * Math.min(1, dt / 160); draw(); } });
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
      { t: "발전소 굴뚝의 이산화 탄소를 붙잡아 땅속에 저장(CCS)", a: "c", why: "대기로 나갈 이산화 탄소를 굴뚝에서 붙잡아 땅속에 가둬 배출을 막습니다. 이미 공기 중에 있는 이산화 탄소를 빼내는 DAC와는 다릅니다.", hint: "이 기술은 이산화 탄소를 ‘안 만드는’ 것일까요, 만들어진 것을 ‘붙잡는’ 것일까요?" },
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
    var mo = motion("h2-play"), tt = 0, RS = mulberry(55), PUFF = [];
    for (var q = 0; q < 40; q++) PUFF.push({ x: RS(), y: RS(), r: RS() });
    function tank(x, y, w, h, c0, c1, label, lc) {
      var g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, c1); g.addColorStop(.45, c0); g.addColorStop(1, c1);
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, w / 2.5); ctx.fill();
      K.pill(ctx, label, x + w / 2, y + h + 22, { a: "center", s: 11, c: lc || KC.ink, box: [0, 560] });
    }
    function draw() {
      var c = co2(), k;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 만드는 과정 ── */
      var LW = 560, gy = 230;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 49 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var gg = ctx.createLinearGradient(0, gy, 0, H); gg.addColorStop(0, "#3a2e22"); gg.addColorStop(1, "#1a130d"); ctx.fillStyle = gg; ctx.fillRect(0, gy, LW, H - gy);
      ctx.restore();
      /* 반응 장치 */
      var rx = 220, ry = 120, rw = 110, rh = 90, hot = m === "green" ? "#4aa8ff" : "#ff8a50";
      var rg = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh); rg.addColorStop(0, "#c9ced6"); rg.addColorStop(1, "#5d6573");
      ctx.fillStyle = rg; ctx.beginPath(); ctx.roundRect(rx, ry, rw, rh, 10); ctx.fill();
      ctx.save(); ctx.shadowColor = hot; ctx.shadowBlur = 16; ctx.fillStyle = hot; ctx.globalAlpha = .75; ctx.beginPath(); ctx.roundRect(rx + 14, ry + 16, rw - 28, rh - 32, 6); ctx.fill(); ctx.restore();
      K.t(ctx, m === "green" ? "전기 분해" : "개질 반응", rx + rw / 2, ry + rh / 2 + 5, { s: 12, a: "center", c: "#0b1020", w: "900" });
      if (m === "green") {
        /* 태양광·풍력 */
        for (k = 0; k < 3; k++) { var px = 24 + k * 44, py = 170; var pg = ctx.createLinearGradient(px, py, px + 38, py + 26); pg.addColorStop(0, "#2f4f9a"); pg.addColorStop(1, "#13244f"); ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(px, py + 26); ctx.lineTo(px + 8, py); ctx.lineTo(px + 40, py); ctx.lineTo(px + 32, py + 26); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(150,190,255,.6)"; ctx.lineWidth = 1; ctx.stroke(); ctx.strokeStyle = "#8a93a8"; ctx.beginPath(); ctx.moveTo(px + 20, py + 26); ctx.lineTo(px + 20, gy); ctx.stroke(); }
        var wx = 160, wy = 76; ctx.strokeStyle = "#d9dee6"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, gy); ctx.stroke();
        for (k = 0; k < 3; k++) { var a = tt / 400 + k * 2.094; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 34 * Math.cos(a), wy + 34 * Math.sin(a)); ctx.stroke(); ctx.lineCap = "butt"; }
        K.arrow(ctx, { x: 178, y: 150 }, { x: rx - 6, y: 150 }, KC.yellow, 2.5, 9);
        K.pill(ctx, "⚡ 재생 전기", 26, 150, { s: 11, c: KC.yellow });
        tank(258, 250, 34, 20, "#9fe0ff", "#2a6ea8", "물 2H₂O", "#cfeaff");
        K.arrow(ctx, { x: 275, y: 248 }, { x: 275, y: ry + rh + 4 }, "rgba(127,211,255,.9)", 2, 8);
        K.arrow(ctx, { x: rx + rw / 2 - 20, y: ry - 2 }, { x: rx + rw / 2 - 20, y: 66 }, "rgba(255,255,255,.75)", 2, 8);
        K.pill(ctx, "산소 O₂", rx + rw / 2 - 26, 56, { a: "right", s: 11, c: "#e8ecff" });
      } else {
        tank(40, 120, 52, 100, "#9aa3b3", "#4a5160", "천연가스 CH₄");
        tank(120, 160, 44, 60, "#9fe0ff", "#2a6ea8", "수증기 2H₂O", "#cfeaff");
        K.arrow(ctx, { x: 94, y: 150 }, { x: rx - 6, y: 150 }, "#c9ced6", 2.5, 9);
        K.arrow(ctx, { x: 166, y: 190 }, { x: rx - 6, y: 190 }, "rgba(127,211,255,.9)", 2.5, 9);
        /* 굴뚝과 이산화 탄소 */
        var cx = rx + rw - 22, top = 54, out = m === "blue" ? 1 - cap / 100 : 1;
        var cg = ctx.createLinearGradient(cx - 9, 0, cx + 9, 0); cg.addColorStop(0, "#5d6573"); cg.addColorStop(.5, "#c9ced6"); cg.addColorStop(1, "#4a5160"); ctx.fillStyle = cg; ctx.fillRect(cx - 9, top, 18, ry - top);
        var np = Math.round(PUFF.length * out);
        for (k = 0; k < np; k++) { var P = PUFF[k], yy = top - 4 - ((P.y + tt / 5000) % 1) * 50, xx = cx + (P.x - .5) * 30 * (1 + (top - yy) / 40); ctx.fillStyle = "rgba(170,175,190," + (0.55 * (1 - (top - yy) / 54)).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(xx, yy, 4 + P.r * 5, 0, 6.2832); ctx.fill(); }
        K.pill(ctx, "CO₂ " + Math.round(out * 100) + "%", cx + 18, 40, { s: 11, c: "#d8dbe6", box: [0, LW] });
        if (m === "blue") {
          ctx.strokeStyle = "#8a93a8"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(rx + rw - 40, ry + rh); ctx.lineTo(rx + rw - 40, H - 30); ctx.stroke();
          var sg = ctx.createLinearGradient(0, H - 46, 0, H - 10); sg.addColorStop(0, "#4a3d2c"); sg.addColorStop(1, "#2a2018"); ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(rx - 40, H - 42, 200, 30, 8); ctx.fill();
          var nst = Math.round(cap / 8); for (k = 0; k < nst; k++) { ctx.fillStyle = "rgba(200,200,215,.85)"; ctx.beginPath(); ctx.arc(rx - 28 + k * 15, H - 27 + (k % 2) * 6, 3.4, 0, 6.2832); ctx.fill(); }
          K.pill(ctx, "포집한 CO₂를 땅속에 저장 · " + cap + "%", rx + 170, H - 22, { s: 11, c: "#d8dbe6", box: [0, LW] });
        }
      }
      /* 수소 탱크 */
      K.arrow(ctx, { x: rx + rw + 4, y: 165 }, { x: 410, y: 165 }, "rgba(127,211,255,.95)", 3, 10);
      tank(418, 112, 54, 106, "#bfe8ff", "#2f86e0", "수소 H₂", "#cfeaff");
      for (k = 0; k < 6; k++) { var by = 210 - ((k * 17 + tt / 30) % 90); K.glow(ctx, 432 + (k % 3) * 13, by, 2, "rgba(220,245,255,.9)", 2.6); }
      K.pill(ctx, NM[m] + " · " + (m === "green" ? "2H₂O → 2H₂ + O₂" : "CH₄ + 2H₂O → CO₂ + 4H₂"), 14, 28, { s: 13, c: m === "green" ? KC.green : (m === "blue" ? KC.blue : "#d6defa") });

      /* ── 오른쪽: 수소 1 kg당 CO₂ ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 50 });
      K.pill(ctx, "수소 1 kg당 CO₂", RX + 14, 28, { s: 13, c: KC.blue });
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: RW - 8, h: H - 48, x0: 0, x1: 1, y0: 0, y1: 10, xt: 1, yt: 5, xf: function () { return ""; }, yf: function (vv) { return vv + " kg"; } });
      var bx = g.X(.5) - 50, top2 = g.Y(c), ok = c <= 1.0001, bg = ctx.createLinearGradient(0, top2, 0, g.B);
      bg.addColorStop(0, ok ? "#7ff0c4" : "#ff9a7a"); bg.addColorStop(1, ok ? "#1f8a5a" : "#b8324a");
      ctx.save(); ctx.shadowColor = ok ? KC.green : KC.red; ctx.shadowBlur = 12; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(bx, top2, 100, Math.max(2, g.B - top2), [6, 6, 0, 0]); ctx.fill(); ctx.restore();
      ctx.strokeStyle = KC.yellow; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(g.L, g.Y(1)); ctx.lineTo(g.R, g.Y(1)); ctx.stroke(); ctx.setLineDash([]);
      K.pill(ctx, "기준 1 kg", g.R - 4, g.Y(1) - 10, { a: "right", s: 11, c: KC.yellow });
      K.pill(ctx, c.toFixed(1) + " kg", g.X(.5), Math.min(top2 - 10, g.Y(1) - 34), { a: "center", s: 14, c: ok ? KC.green : KC.red });
      return c;
    }
    function update() {
      var c = draw(), ch = false;
      rd("h2-read", kv("만드는 방법", NM[m], m === "green" ? "g" : (m === "blue" ? "b" : "y"), m === "blue" ? "포집률 " + cap + "%" : (m === "grey" ? "천연가스 개질" : "재생 전기로 물 분해")) +
        kv("수소 1 kg당 CO₂", c.toFixed(1) + " kg", c <= 1.0001 ? "g" : "r", "기준 1 kg 이하") + okp(c <= 1.0001, c <= 1.0001 ? "기준을 맞추었습니다" : "기준보다 많이 나옵니다"));
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
    K.animate(canvas, function (dt) { if (mo.on) { tt += dt; draw(); } });
    update(); mission();
  })();

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("balBest") || "") + " / " + (window.sthState("h2Best") || "")); }
  function vs() {
    var p = window.sthState("p3") || "";
    $("e3-vs").innerHTML = "<b>나의 첫 발언</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 정확했습니다." : " — 저울을 맞추며 보았듯, 탄소중립은 순배출 0입니다.") + "<br><b>나의 저울</b> " + (window.sthState("balBest") || "-");
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
      var YEARS = 60, t, ey = exhaustYear(), Texh = ey === null ? YEARS : Math.min(YEARS, ey - Y0);
      ctx.clearRect(0, 0, W, H);
      var CW = 690;
      K.stage(ctx, 0, 0, CW, H, "lab", { seed: 51 });
      K.pill(ctx, "해마다 " + (r * 100).toFixed(1) + "%씩 줄일 때의 연간 배출량", 16, 28, { s: 13, c: KC.blue });
      var g = K.chart(ctx, { x: 6, y: 44, w: CW - 12, h: H - 48, x0: 0, x1: YEARS, y0: 0, y1: 45, xt: 4, yt: 3, yl: "Gt CO₂/년", xf: function (vv) { return String(Y0 + vv); }, yf: function (vv) { return String(Math.round(vv)); } });
      var pts = []; for (t = 0; t <= YEARS; t += 0.5) pts.push([t, E0 * Math.pow(1 - r, t)]);
      clipRect(ctx, g);
      var ag = ctx.createLinearGradient(0, g.T, 0, g.B); ag.addColorStop(0, "rgba(255,140,110,.55)"); ag.addColorStop(1, "rgba(255,140,110,.08)");
      ctx.beginPath(); ctx.moveTo(g.X(0), g.B); for (t = 0; t <= Texh; t += 0.5) ctx.lineTo(g.X(t), g.Y(E0 * Math.pow(1 - r, t))); ctx.lineTo(g.X(Texh), g.B); ctx.closePath(); ctx.fillStyle = ag; ctx.fill();
      ctx.restore();
      K.plot(ctx, g, pts, KC.orange, { w: 3 });
      if (ey !== null && ey - Y0 <= YEARS) {
        var ex = g.X(ey - Y0);
        ctx.save(); ctx.shadowColor = KC.red; ctx.shadowBlur = 8; ctx.strokeStyle = KC.red; ctx.lineWidth = 2.2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(ex, g.T); ctx.lineTo(ex, g.B); ctx.stroke(); ctx.restore();
        K.pill(ctx, Math.round(ey) + "년 예산 소진", ex + (ex > CW - 160 ? -8 : 8), g.T + 40, { a: ex > CW - 160 ? "right" : "left", s: 13, c: KC.red, box: [0, CW] });
      } else K.pill(ctx, "예산 안에 머뭅니다", g.R - 8, g.T + 22, { a: "right", s: 13, c: KC.green, box: [0, CW] });
      K.pill(ctx, "칠해진 넓이 = 그때까지 쌓인 배출량", g.X(Math.min(Texh, YEARS) / 2), g.B - 12, { a: "center", s: 11, c: "#ffd2c4", box: [g.L, CW] });

      /* ── 오른쪽: 탄소예산 통 ── */
      var RX = CW + 8, RW = W - RX, used = ey === null ? cumulative(200) : budget, frac = Math.min(1, used / budget);
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 52 });
      K.pill(ctx, "탄소예산", RX + 14, 28, { s: 13, c: KC.blue });
      var bx = RX + RW / 2 - 34, by0 = 74, bh = H - 160, bw = 68;
      ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.beginPath(); ctx.roundRect(bx, by0, bw, bh, 12); ctx.fill();
      ctx.strokeStyle = "rgba(220,228,255,.55)"; ctx.lineWidth = 2; ctx.stroke();
      var fh = bh * frac, fg = ctx.createLinearGradient(0, by0 + bh - fh, 0, by0 + bh); fg.addColorStop(0, frac >= 1 ? "#ff6b81" : "#ffb35c"); fg.addColorStop(1, "#8a2a3a");
      ctx.save(); ctx.shadowColor = frac >= 1 ? KC.red : KC.orange; ctx.shadowBlur = 12; ctx.fillStyle = fg; ctx.beginPath(); ctx.roundRect(bx + 4, by0 + bh - fh + 2, bw - 8, Math.max(0, fh - 6), 9); ctx.fill(); ctx.restore();
      K.pill(ctx, budget.toLocaleString() + " Gt", RX + RW / 2, by0 - 12, { a: "center", s: 11.5, c: KC.ink, box: [RX, W] });
      K.pill(ctx, frac >= 1 ? "가득 참" : "누적 " + Math.round(used) + " Gt", RX + RW / 2, by0 + bh + 26, { a: "center", s: 12, c: frac >= 1 ? KC.red : KC.green, box: [RX, W] });
      K.t(ctx, budget === 500 ? "1.5 °C 목표" : "2 °C 목표", RX + RW / 2, H - 22, { s: 11, a: "center", c: KC.mute });
    }
    function refresh() {
      var ey = exhaustYear(), need = E0 / budget, ch = false;
      $("t3-rv").textContent = (r * 100).toFixed(1) + " %";
      rd("t3-read", kv("해마다 줄이는 비율", (r * 100).toFixed(1) + " %", "y", budget === 500 ? "1.5 °C 목표 · 500 Gt" : "2 °C 목표 · 1,150 Gt") +
        kv("탄소예산", ey === null ? "안에 머묾" : Math.round(ey) + "년 소진", ey === null ? "g" : "r", ey === null ? "누적 " + cumulative(200).toFixed(0) + " Gt에서 멈춤" : "") +
        kv("2050년 배출량", (E0 * Math.pow(1 - r, 30)).toFixed(1) + " Gt", "b", "2020년 40 Gt"));
      $("t3-info").innerHTML = (ey === null ? "<b>예산 안에 머뭅니다.</b> 해마다 " + (r * 100).toFixed(1) + "%씩 줄이면 누적이 " + cumulative(200).toFixed(0) + " Gt에서 멈춥니다." : "<b>" + Math.round(ey) + "년</b>에 예산이 바닥납니다.") +
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
      var s = saved(), pct = s.tot / 1000000 * 100, k;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 우리 학교 ── */
      var LW = 450, bx = 40, by = 110, bwid = 340, bht = 150;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 53 });
      ctx.fillStyle = "#2f4a2a"; ctx.fillRect(0, by + bht, LW, H - by - bht);
      var wg = ctx.createLinearGradient(0, by, 0, by + bht); wg.addColorStop(0, "#d9c7a5"); wg.addColorStop(1, "#9a8a6e");
      ctx.fillStyle = wg; ctx.fillRect(bx, by, bwid, bht);
      ctx.fillStyle = "#7a6a52"; ctx.fillRect(bx - 6, by - 8, bwid + 12, 10);
      /* 옥상 태양광 */
      var np = Math.round(S / 10);
      for (k = 0; k < np; k++) { var px = bx + 8 + k * 33, pg = ctx.createLinearGradient(px, by - 30, px + 28, by - 10); pg.addColorStop(0, "#3a5fb8"); pg.addColorStop(1, "#13244f"); ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(px, by - 10); ctx.lineTo(px + 6, by - 30); ctx.lineTo(px + 30, by - 30); ctx.lineTo(px + 24, by - 10); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(150,190,255,.6)"; ctx.lineWidth = 1; ctx.stroke(); }
      /* 창문: 빈 교실 소등 */
      var dark = Math.round(24 * 0.3 * L / 100), Rw = mulberry(61), order = [];
      for (k = 0; k < 24; k++) order.push([Rw(), k]);
      order.sort(function (a, b) { return a[0] - b[0]; });
      var off = {}; for (k = 0; k < dark; k++) off[order[k][1]] = true;
      for (k = 0; k < 24; k++) {
        var wx = bx + 14 + (k % 8) * 40, wy = by + 14 + Math.floor(k / 8) * 44;
        if (off[k]) { ctx.fillStyle = "#1a2238"; ctx.fillRect(wx, wy, 30, 30); }
        else { ctx.save(); ctx.shadowColor = "#ffe9a8"; ctx.shadowBlur = 8; var lg = ctx.createLinearGradient(wx, wy, wx, wy + 30); lg.addColorStop(0, "#fff3c4"); lg.addColorStop(1, "#ffd36b"); ctx.fillStyle = lg; ctx.fillRect(wx, wy, 30, 30); ctx.restore(); }
        ctx.strokeStyle = "#5a4a36"; ctx.lineWidth = 2; ctx.strokeRect(wx, wy, 30, 30); ctx.beginPath(); ctx.moveTo(wx + 15, wy); ctx.lineTo(wx + 15, wy + 30); ctx.stroke();
      }
      /* 실외기 */
      var ux = bx + bwid + 12, uy = by + 70, ug = ctx.createLinearGradient(ux, uy, ux + 44, uy + 40); ug.addColorStop(0, "#e3e7ee"); ug.addColorStop(1, "#7d8696");
      ctx.fillStyle = ug; ctx.beginPath(); ctx.roundRect(ux, uy, 44, 40, 5); ctx.fill();
      ctx.strokeStyle = "#5d6573"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ux + 22, uy + 20, 13, 0, 6.2832); ctx.stroke();
      K.pill(ctx, "우리 학교 · 여름", 14, 28, { s: 13, c: KC.blue });
      K.pill(ctx, "❄ 냉방 " + T + " ℃", ux + 22, uy - 12, { a: "center", s: 11.5, c: KC.blue, box: [0, LW] });
      K.pill(ctx, "태양광 " + S + " kW", LW - 14, 28, { a: "right", s: 11.5, c: KC.yellow, box: [0, LW] });
      K.pill(ctx, "불 꺼진 빈 교실 " + dark + "칸 / 24칸", bx, H - 14, { s: 11, c: "#d6defa" });

      /* ── 오른쪽: 줄인 몫 ── */
      var RX = LW + 8, RW = W - RX, x0 = RX + 20, y0 = 96, bw = RW - 40;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 54 });
      K.pill(ctx, "학교 전기 100만 kWh 가운데 줄인 몫", RX + 14, 28, { s: 13, c: KC.blue });
      ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.roundRect(x0, y0, bw, 40, 8); ctx.fill();
      var cx = x0;
      [[s.cool, ["#7ff0e8", "#1b8a8a"], "냉방"], [s.light, ["#ffe29a", "#c2870c"], "조명"], [s.solar, ["#7ff0b0", "#1f8a5a"], "태양광"]].forEach(function (p) {
        var w = bw * p[0] / 1000000 / 0.4; if (w < 0.5) return; w = Math.min(w, x0 + bw - cx);
        var gg = ctx.createLinearGradient(0, y0, 0, y0 + 40); gg.addColorStop(0, p[1][0]); gg.addColorStop(1, p[1][1]);
        ctx.save(); ctx.shadowColor = p[1][0]; ctx.shadowBlur = 8; ctx.fillStyle = gg; ctx.fillRect(cx, y0, w, 40); ctx.restore();
        if (w > 44) K.t(ctx, p[2], cx + w / 2, y0 + 25, { s: 11, a: "center", c: "#0b1020", w: "800" });
        cx += w;
      });
      var gx = x0 + bw * 0.15 / 0.4;
      ctx.strokeStyle = KC.red; ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx, y0 - 10); ctx.lineTo(gx, y0 + 50); ctx.stroke(); ctx.setLineDash([]);
      K.pill(ctx, "목표 15%", gx, y0 + 70, { a: "center", s: 11, c: KC.red, box: [RX, W] });
      [0, 10, 20, 30, 40].forEach(function (m) { K.t(ctx, m + "%", x0 + bw * m / 40, y0 - 10, { s: 10, a: m === 0 ? "left" : (m === 40 ? "right" : "center"), c: KC.dim }); });
      K.pill(ctx, "줄인 전기 " + Math.round(s.tot).toLocaleString() + " kWh (" + pct.toFixed(1) + "%)", x0, 196, { s: 13, c: pct >= 15 ? KC.green : KC.ink });
      K.pill(ctx, "줄인 이산화 탄소 약 " + (s.tot * 0.46 / 1000).toFixed(0) + " t", x0, 236, { s: 13, c: KC.blue });
      K.t(ctx, "전기 1 kWh ≈ CO₂ 0.46 kg으로 계산", x0, H - 14, { s: 10.5, c: KC.dim });
      return pct;
    }

    function update() {
      var pct = draw(), sv = saved();
      rd("sc-read", kv("줄인 전기", Math.round(sv.tot).toLocaleString() + " kWh", pct >= 15 ? "g" : "y", pct.toFixed(1) + "% · 목표 15%") + kv("줄인 이산화 탄소", "약 " + (sv.tot * 0.46 / 1000).toFixed(0) + " t", "b") +
        (pct >= 15 ? okp(true, "목표 15%를 넘었습니다") : ""));
      $("sc-info").innerHTML = "냉방을 1 ℃ 높이면 냉방 전기가 약 7% 줄고(냉방은 전체의 30%), 빈 교실 소등으로 조명 전기의 최대 30%를 줄이며(조명은 전체의 20%), 태양광 1 kW는 한 해 약 1,200 kWh를 만듭니다.";
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
    { key: "rInq", label: "교과서 실험" },
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
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
