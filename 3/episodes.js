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
/* ---- 스튜디오 블록 모형 도구 (밝은 바탕) ---- */
var LC = K.LT;
function zCard(ctx, x, w, H, title, rows, tip, big, y0) {
  K.card(ctx, x, 0, w, H, title);
  var x0 = x + 18, x1 = x + w - 18, y = y0 || 58;
  if (big) { K.t(ctx, big[0], x0, y + 8, { s: 26, w: "900", c: big[1] }); y += 44; }
  rows.forEach(function (r) { K.row(ctx, r[0], r[1], x0, x1, y, r[2]); if (r[3] != null) { K.bar(ctx, x0, y + 8, x1 - x0, r[3], r[2]); y += 14; } y += 28; });
  if (tip) K.tip(ctx, tip[0], x0 - 4, H - 46, x1 - x0 + 8, tip[1]);
  return y;
}
/* 입체 상자(화면 좌표): 앞면 x,y,w,h + 깊이 d */
function zBox(ctx, x, y, w, h, d, cF, cT, cR) {
  ctx.fillStyle = cF; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = cT; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d * .6); ctx.lineTo(x + w + d, y - d * .6); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = cR; ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + d, y - d * .6); ctx.lineTo(x + w + d, y + h - d * .6); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
}
/* 원통(탱크): 가운데 x, 위 y, 반지름 r, 높이 h */
function zCyl(ctx, cx, y, r, h, c0, c1) {
  var g = ctx.createLinearGradient(cx - r, 0, cx + r, 0); g.addColorStop(0, c1); g.addColorStop(.42, c0); g.addColorStop(1, c1);
  ctx.fillStyle = g; ctx.fillRect(cx - r, y, 2 * r, h); ctx.beginPath(); ctx.ellipse(cx, y + h, r, r * .35, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = c0; ctx.beginPath(); ctx.ellipse(cx, y, r, r * .35, 0, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1; ctx.stroke();
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
    function dhw() { return dT >= 1 ? dT * Math.min(wk, 12) : 0; }
    function alertOf(d) {
      if (d <= 0) return { n: "정상", c: "--green-700", t: "수온이 백화 기준선을 넘지 않았습니다." };
      if (d < 4) return { n: "주의", c: "--amber-700", t: "열스트레스가 쌓이고 있지만 아직 백화 기준 아래입니다." };
      if (d < 8) return { n: "경보 1단계", c: "--coral-700", t: "백화가 시작되는 구간입니다." };
      return { n: "경보 2단계", c: "--rose-700", t: "대량 폐사가 일어날 수 있는 구간입니다." };
    }
    function zoox() { var d = dhw(); if (d <= 0) return 1; return Math.max(0, Math.min(1, 1 - Math.pow(d / 10, 1.5))); }
    /* ── 위: 산호초를 블록으로 잘라 낸 모형(아이소메트릭) · 아래: 12주 수온 편차와 DHW 계기 ──
       x 오른쪽 아래, y 왼쪽 아래, z 위(그림 단위). 깊이·산호 크기는 보기 쉽게 과장했다. */
    var DH = 410;
    var I = K.iso({ ox: 470, oy: 130, s: 0.7, L: 520, D: 230 });
    var BL = I.L, BD = I.D, WL = 128;                           /* WL: 해수면 높이 */
    function seabed(x, y) {
      var mound = 16 * Math.exp(-Math.pow((x - 250) / 170, 2) - Math.pow((y - 115) / 95, 2));
      return 36 + mound + 1.6 * Math.sin(x / 37) * Math.cos(y / 29);
    }
    function faceZ(side) { return function (u) { return side === "front" ? seabed(u, BD) : seabed(BL, u); }; }
    var CORAL = (function () {
      var r = mulberry(4242), out = [], i = 0, tries = 0;
      while (out.length < 26 && tries < 400) {
        tries++;
        var x = 40 + r() * (BL - 80), y = 30 + r() * (BD - 60), ok = true;
        for (i = 0; i < out.length; i++) if (Math.abs(out[i].x - x) < 34 && Math.abs(out[i].y - y) < 30) ok = false;
        if (!ok) continue;
        var t = r();
        out.push({ x: x, y: y, kind: t < 0.5 ? "br" : (t < 0.8 ? "dome" : "table"), sc: 0.95 + r() * 0.6, seed: r(), lean: (r() - 0.5) * 0.5, col: out.length % 4 });
      }
      out.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); });
      return out;
    })();
    var mo = motion("t0-play"), tt = 0, RF = mulberry(77), FISH = [];
    for (var q = 0; q < 9; q++) FISH.push({ x: RF(), y: 0.15 + RF() * 0.7, z: 0.35 + RF() * 0.5, s: .55 + RF() * .4, v: (RF() > .5 ? 1 : -1) * (0.02 + RF() * 0.03), c: ["#ffb35c", "#7fd3ff", "#ffd36b", "#ff8aa0"][q % 4] });
    function fish(x, y, s, dir, col) {
      ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
      var fg = ctx.createLinearGradient(-12, 0, 12, 0); fg.addColorStop(0, col); fg.addColorStop(1, "#ffffff");
      ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(0, 0, 12, 6, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-19, -6); ctx.lineTo(-19, 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#10203a"; ctx.beginPath(); ctx.arc(6, -1.5, 1.6, 0, 6.2832); ctx.fill(); ctx.restore();
    }
    var HEALTHY = [[255, 138, 101], [255, 179, 71], [186, 104, 200], [77, 208, 225]];
    function mix(c, z, k) {
      return "rgb(" + Math.round((c[0] * z + 246 * (1 - z)) * k) + "," + Math.round((c[1] * z + 246 * (1 - z)) * k) + "," + Math.round((c[2] * z + 240 * (1 - z)) * k) + ")";
    }
    /* 산호 한 무리: 가지형 · 뇌산호(둥근 덩이) · 탁자형 */
    function coral(c, z, dead) {
      var p = I.P(c.x, c.y, seabed(c.x, c.y)), s = c.sc, base = HEALTHY[c.col];
      ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(p.x + 3, p.y, 16 * s, 5 * s, 0, 0, 6.2832); ctx.fill();
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (c.kind === "br") {
        var n = 5, h = 34 * s;
        for (var a = 0; a < n; a++) {
          var ang = -Math.PI / 2 + (a - (n - 1) / 2) * 0.32 + c.lean * 0.4, len = h * (0.7 + 0.3 * Math.sin(a * 2.1 + c.seed * 6));
          var ex = p.x + Math.cos(ang) * len, ey = p.y + Math.sin(ang) * len;
          var gr = ctx.createLinearGradient(p.x, p.y, ex, ey); gr.addColorStop(0, mix(base, z, .55)); gr.addColorStop(1, mix(base, z, 1));
          ctx.strokeStyle = gr; ctx.lineWidth = 4.2 * s;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(p.x + Math.cos(ang) * len * .5 - 3, p.y + Math.sin(ang) * len * .5, ex, ey); ctx.stroke();
          var fx = p.x + Math.cos(ang) * len * .6, fy = p.y + Math.sin(ang) * len * .6, d2 = a % 2 ? 1 : -1;
          ctx.lineWidth = 2.8 * s; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + d2 * 9 * s, fy - 11 * s); ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255," + (0.25 + 0.55 * (1 - z)).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(ex, ey, 1.9 * s, 0, 6.2832); ctx.fill();
        }
      } else if (c.kind === "dome") {
        var rr = 15 * s, dg = ctx.createRadialGradient(p.x - rr * .35, p.y - rr * .9, 2, p.x, p.y - rr * .4, rr * 1.3);
        dg.addColorStop(0, mix(base, z, 1.05)); dg.addColorStop(1, mix(base, z, .55));
        ctx.fillStyle = dg; ctx.beginPath(); ctx.ellipse(p.x, p.y, rr, rr * .95, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(60,30,30,.28)"; ctx.lineWidth = 1;
        for (var m = 0; m < 3; m++) { ctx.beginPath(); ctx.ellipse(p.x, p.y, rr * (0.3 + m * 0.22), rr * (0.28 + m * 0.21), 0, Math.PI + .3, -.3); ctx.stroke(); }
      } else {
        var tw = 22 * s, th = 18 * s;
        ctx.strokeStyle = mix(base, z, .55); ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - th); ctx.stroke();
        var tg = ctx.createLinearGradient(0, p.y - th - 6, 0, p.y - th + 6); tg.addColorStop(0, mix(base, z, 1.05)); tg.addColorStop(1, mix(base, z, .6));
        ctx.fillStyle = tg; ctx.beginPath(); ctx.ellipse(p.x, p.y - th, tw, tw * .34, 0, 0, 6.2832); ctx.fill();
      }
      if (dead) {                                            /* 죽은 골격을 덮은 해조류 */
        ctx.strokeStyle = "rgba(92,128,58,.85)"; ctx.lineWidth = 2;
        for (var g2 = 0; g2 < 4; g2++) { var gx2 = p.x - 10 * s + g2 * 6 * s; ctx.beginPath(); ctx.moveTo(gx2, p.y); ctx.quadraticCurveTo(gx2 + 5, p.y - 12 * s, gx2 - 2, p.y - 22 * s * (0.6 + 0.1 * g2)); ctx.stroke(); }
      }
    }
    function drawModel(z, d, al) {
      var box = [0, W], warm = Math.min(1, dT / 3) * Math.min(1, wk / 6), dead = z < 0.15;
      K.studio(ctx, 0, 0, W, DH, { x: I.P(BL, BD, 0).x - 150, y: I.P(BL, BD, 0).y - 22, rx: 330, ry: 50 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      /* 바닥: 모래와 산호초(옛 산호 골격이 쌓인 석회암) */
      I.field(ctx, seabed, function (x, y, zz, light) {
        var m = zz - 36, c = m > 8 ? (dead ? "#8f8a5c" : "#c9b38a") : (m > 3 ? "#d4c19a" : "#e0d0a8");
        return K.tint(c, light);
      }, 40, 18);
      ["front", "right"].forEach(function (side) {
        var zf = faceZ(side);
        I.face(ctx, side, function (Lw) {
          I.profile(ctx, side, zf, 0);
          var g = ctx.createLinearGradient(0, 0, 0, 56); g.addColorStop(0, "#5f574c"); g.addColorStop(.18, "#6d6458"); g.addColorStop(.3, "#b9a782"); g.addColorStop(1, "#e3d3ad");
          ctx.fillStyle = g; ctx.fill();
          ctx.save(); I.profile(ctx, side, zf, 0); ctx.clip();
          var R = K.rng(side === "front" ? 31 : 37);
          for (var i = 0; i < Lw * 0.9; i++) { ctx.fillStyle = R() > .5 ? "rgba(255,250,235,.35)" : "rgba(90,70,40,.30)"; ctx.beginPath(); ctx.arc(R() * Lw, 10 + R() * 42, .8 + R() * 1.4, 0, 6.2832); ctx.fill(); }
          ctx.strokeStyle = "rgba(90,70,40,.3)"; ctx.lineWidth = .8;
          for (var y2 = 12; y2 < 54; y2 += 7) { ctx.beginPath(); ctx.moveTo(0, y2); ctx.lineTo(Lw, y2 + 1.5); ctx.stroke(); }
          ctx.restore();
        });
      });
      /* 산호(먼 것부터) */
      CORAL.forEach(function (c) { coral(c, z, dead); });
      /* 물고기: 공생 조류가 줄면 산호초를 떠난다 */
      var nf = Math.round(FISH.length * z);
      for (var k = 0; k < nf; k++) {
        var F = FISH[k], fx = 30 + F.x * (BL - 60), fy = F.y * BD, fz = seabed(fx, fy) + 12 + F.z * (WL - seabed(fx, fy) - 22);
        var fp = I.P(fx, fy, fz + 3 * Math.sin(tt / 600 + k));
        fish(fp.x, fp.y, F.s, F.v > 0 ? 1 : -1, F.c);
      }
      /* 물: 앞면·오른쪽 면은 투명하게, 수면은 옅게. 뜨거울수록 주황빛 */
      I.water(ctx, WL, function (u, side) { return faceZ(side)(u); }, { surface: false, top: "rgba(80,180,235,.30)", deep: "rgba(20,80,150,.50)" });
      I.plane(ctx, WL, "rgba(130,210,255,.16)", "rgba(255,255,255,.6)");
      if (warm > 0) I.plane(ctx, WL, "rgba(255,120,70," + (0.22 * warm).toFixed(3) + ")");
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1;
      for (var w = 0; w < 10; w++) {
        var gx = ((w * .37 + tt / 20000) % 1) * BL, gy = ((w * .61) % 1) * BD, a1 = I.P(gx - 16, gy, WL), a2 = I.P(gx + 10, gy, WL);
        ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.quadraticCurveTo((a1.x + a2.x) / 2, a1.y - 3, a2.x, a2.y); ctx.stroke();
      }
      I.shade(ctx, "front", function (u) { return Math.max(seabed(u, BD), WL); });
      I.shade(ctx, "right", function (u) { return Math.max(seabed(BL, u), WL); });
      I.edges(ctx, WL, WL);
      /* 햇빛(위에서 내리쬐는) */
      if (warm > 0) {
        var sg = ctx.createRadialGradient(820, -20, 10, 820, -20, 300); sg.addColorStop(0, "rgba(255,170,90," + (0.35 * warm).toFixed(3) + ")"); sg.addColorStop(1, "rgba(255,170,90,0)");
        ctx.fillStyle = sg; ctx.fillRect(0, 0, W, DH);
      }
      ctx.restore();
      /* 이름표 */
      var cl = CORAL[0]; CORAL.forEach(function (c) { if (c.y > 150 && c.x < 200 && c.kind === "br") cl = c; });
      I.label(ctx, cl.x, cl.y, seabed(cl.x, cl.y) + 22 * cl.sc, dead ? "죽은 산호를 덮은 해조류" : (d >= 4 ? "조류가 빠져나가 하얀 골격이 비침" : "공생 조류를 품은 산호"), -70, 40, dead ? "#c8e6a0" : (d >= 4 ? "#ffffff" : "#ffd1bf"), box);
      I.label(ctx, 300, BD, 24, "옛 산호 골격이 쌓인 석회암", -150, 62, "#f1e6cc", box);
      I.label(ctx, BL, 70, WL - 40, "바닷물", 22, 34, "#bfe6ff", box);
      K.warn(ctx, W - 14, 30, "⚠ 깊이·산호 크기는 보기 쉽게 과장", "right");
      K.pill(ctx, "평년보다 +" + dT.toFixed(1) + " °C · " + wk + "주", W - 14, 62, { a: "right", s: 12, c: dT >= 1 ? KC.orange : KC.blue, box: box });
      K.pill(ctx, "공생 조류 잔존율 " + Math.round(z * 100) + "%", W - 14, 92, { a: "right", s: 12, c: z > 0.6 ? KC.green : (z > 0.15 ? KC.yellow : KC.red), box: box });
      /* 큰 글자 */
      if (d <= 0) { K.bigText(ctx, "건강한 산호초", 22, 52, 28, "#ffffff"); K.bigText(ctx, dT > 0 ? "+1 °C 아래는 쌓이지 않는다" : "평년 수온 · DHW 0", 22, 86, 17, "#7fe7c4"); }
      else if (d < 4) { K.bigText(ctx, "열이 쌓이고 있다", 22, 52, 28, "#ffffff"); K.bigText(ctx, "DHW " + d.toFixed(1) + " · 아직 백화 전", 22, 86, 17, "#ffd35a"); }
      else if (d < 8) { K.bigText(ctx, "산호가 하얗게 변한다", 22, 52, 28, "#ffffff"); K.bigText(ctx, "DHW " + d.toFixed(1) + " · 공생 조류가 떠난다", 22, 86, 17, "#ffd35a"); }
      else { K.bigText(ctx, "하얀 숲이 죽어 간다", 22, 52, 28, "#ffb3b3"); K.bigText(ctx, "DHW " + d.toFixed(1) + " · 대량 폐사 구간", 22, 86, 17, "#ffffff"); }
    }
    function drawChart(d, al) {
      var Y0 = DH + 8, h = H - Y0, w;
      K.stage(ctx, 0, Y0, W, h, "lab", { seed: 43 });
      K.pill(ctx, "최근 12주 수온 편차", 14, Y0 + 24, { s: 12.5, c: KC.blue });
      var g = K.chart(ctx, { x: 4, y: Y0 + 34, w: 560, h: h - 38, pb: 26, x0: 0, x1: 12, y0: 0, y1: 4, xt: 12, yt: 4, pl: 46, xf: function (vv) { return vv === 0 ? "12주 전" : (vv === 12 ? "지금" : ""); }, yf: function (vv) { return "+" + vv + "°"; } });
      var bw = (g.X(1) - g.X(0)) * .7;
      for (w = 0; w < 12; w++) {
        var val = (w >= 12 - wk) ? dT : 0, top = g.Y(Math.min(Math.max(val, 0.06), 4)), hot = val >= 1;
        var bg = ctx.createLinearGradient(0, top, 0, g.B); bg.addColorStop(0, hot ? "#ff9a7a" : "#8fa0d0"); bg.addColorStop(1, hot ? "#b8324a" : "#3a4a7a");
        ctx.save(); if (hot) { ctx.shadowColor = KC.red; ctx.shadowBlur = 8; } ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(g.X(w + .5) - bw / 2, top, bw, g.B - top, [4, 4, 0, 0]); ctx.fill(); ctx.restore();
      }
      ctx.strokeStyle = KC.red; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(g.L, g.Y(1)); ctx.lineTo(g.R, g.Y(1)); ctx.stroke(); ctx.setLineDash([]);
      K.pill(ctx, "+1 °C 기준선", g.L + 6, g.Y(1) - 8, { s: 11, c: KC.red });
      /* DHW 계기 */
      var RX = 584, mx0 = RX + 18, mw = W - RX - 40, my = Y0 + 96, dmax = 16, dx = function (vv) { return mx0 + mw * Math.min(vv, dmax) / dmax; };
      K.pill(ctx, "누적 열스트레스 (DHW)", RX + 4, Y0 + 24, { s: 12.5, c: KC.yellow });
      [[0, 4, "rgba(63,211,163,.35)"], [4, 8, "rgba(255,211,107,.4)"], [8, 16, "rgba(255,107,129,.4)"]].forEach(function (z2) { ctx.fillStyle = z2[2]; ctx.fillRect(dx(z2[0]), my, dx(z2[1]) - dx(z2[0]), 14); });
      [[2, "주의"], [6, "경보 1"], [12, "경보 2"]].forEach(function (m) { K.t(ctx, m[1], dx(m[0]), my + 30, { s: 10.5, a: "center", c: KC.mute }); });
      [0, 4, 8, 16].forEach(function (m) { K.t(ctx, String(m), dx(m), my - 6, { s: 10, a: m === 0 ? "left" : (m === 16 ? "right" : "center"), c: KC.dim }); });
      ctx.save(); ctx.shadowColor = "#fff"; ctx.shadowBlur = 8; ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.moveTo(dx(d), my - 2); ctx.lineTo(dx(d) - 6, my - 12); ctx.lineTo(dx(d) + 6, my - 12); ctx.closePath(); ctx.fill(); ctx.fillRect(dx(d) - 1.5, my, 3, 14); ctx.restore();
      K.pill(ctx, "DHW " + d.toFixed(1) + " · " + al.n, RX + (W - RX) / 2, H - 40, { a: "center", s: 14, c: d >= 8 ? KC.red : (d >= 4 ? KC.yellow : (d > 0 ? KC.orange : KC.green)) });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var z = zoox(), d = dhw(), al = alertOf(d);
      drawModel(z, d, al);
      drawChart(d, al);
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
      var r = sim(n), ok = r.avg >= 30 && r.avg <= 40, y, LW = 640;
      ctx.clearRect(0, 0, W, H);
      K.studio(ctx, 0, 0, LW, H, null);
      K.bigText(ctx, "마지막 20년 평균 " + r.avg.toFixed(1) + "%", 16, 34, 20, ok ? "#7ee0a0" : "#ffffff");
      K.t(ctx, "━ 덮임률   ▼ 대규모 백화 (" + n + "년마다 절반이 죽음)", LW - 16, 28, { s: 11, w: "900", a: "right", c: LC.orange });
      var g = K.chart(ctx, { x: 4, y: 44, w: LW - 8, h: H - 48, pl: 44, pb: 30, pt: 10, pr: 14, x0: 0, x1: 60, y0: 0, y1: 60, xt: 6, yt: 4, light: true, xl: "지난 해", xf: function (vv) { return vv + "년"; }, yf: function (vv) { return vv + "%"; } });
      clipRect(ctx, g);
      ctx.fillStyle = "rgba(28,126,214,.07)"; ctx.fillRect(g.X(40), g.T, g.X(60) - g.X(40), g.B - g.T);
      for (y = n; y <= 60; y += n) { K.line(ctx, { x: g.X(y), y: g.T }, { x: g.X(y), y: g.B }, "rgba(20,40,90,.12)", 1); ctx.fillStyle = "#1c7ed6"; ctx.beginPath(); ctx.moveTo(g.X(y) - 4, g.T + 2); ctx.lineTo(g.X(y) + 4, g.T + 2); ctx.lineTo(g.X(y), g.T + 9); ctx.closePath(); ctx.fill(); }
      var ag = ctx.createLinearGradient(0, g.T, 0, g.B); ag.addColorStop(0, "rgba(232,89,12,.28)"); ag.addColorStop(1, "rgba(232,89,12,.02)");
      ctx.beginPath(); ctx.moveTo(g.X(0), g.B); r.tr.forEach(function (c, yy) { ctx.lineTo(g.X(yy), g.Y(c)); }); ctx.lineTo(g.X(60), g.B); ctx.closePath(); ctx.fillStyle = ag; ctx.fill();
      K.line(ctx, { x: g.X(40), y: g.Y(r.avg) }, { x: g.X(60), y: g.Y(r.avg) }, ok ? LC.green : LC.yellow, 1.8, [6, 5]);
      ctx.restore();
      K.plot(ctx, g, r.tr.map(function (c, yy) { return [yy, c]; }), LC.orange, { w: 2.8, light: true });
      K.t(ctx, "마지막 20년", g.X(50), g.B - 8, { s: 11, w: "800", a: "center", c: LC.mute });
      /* 오른쪽: 산호초 블록 미니어처(덮임률만큼 색 있는 산호, 나머지는 하얗게) + 카드 */
      var RX = LW + 12;
      zCard(ctx, RX, W - RX, H, "산호초의 회복", [["백화 간격", n + "년", LC.blue], ["마지막 20년 평균", r.avg.toFixed(1) + "%", ok ? LC.green : LC.red], ["처음 덮임률", "60%", LC.mute]], [ok ? "처음의 절반쯤을 겨우 유지" : (r.avg < 30 ? "회복할 틈이 없음" : "백화 사이에 충분히 회복"), ok ? true : (r.avg < 30 ? false : null)], null, 160);
      var I = K.iso({ ox: RX + 118, oy: 74, s: 0.5, L: 170, D: 110 });
      ["front", "right"].forEach(function (sd, j) { I.face(ctx, sd, function (Lw) { ctx.fillStyle = j ? "#c9b48a" : "#e0cc9e"; ctx.fillRect(0, 0, Lw, 10); var wg = ctx.createLinearGradient(0, 40, 0, 10); wg.addColorStop(0, "rgba(70,170,230,.7)"); wg.addColorStop(1, "rgba(20,90,160,.8)"); ctx.fillStyle = wg; ctx.fillRect(0, 10, Lw, 30); }); });
      I.plane(ctx, 10, "#e9d8a6", null);
      var cover = r.tr[60] / 60, Rc = mulberry(7);
      for (var q = 0; q < 26; q++) { var cx = 10 + Rc() * 150, cy = 10 + Rc() * 90, p = I.P(cx, cy, 10), live = q / 26 < cover; K.planet(ctx, p.x, p.y - 5, 5 + Rc() * 3, live ? ["#ff8787", "#ffa94d", "#b197fc", "#63e6be"][q % 4] : "#f8f9fa", live ? "#862e2e" : "#adb5bd"); }
      I.plane(ctx, 40, "rgba(120,200,255,.35)", "rgba(255,255,255,.6)");
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
      var a = series(), i, g, LW = 680;
      var tot = a.reduce(function (x, y) { return x + y; }, 0), days = a.filter(function (x) { return x > 0; }).length, mxv = Math.max.apply(null, a);
      ctx.clearRect(0, 0, W, H);
      K.studio(ctx, 0, 0, LW, H, null);
      K.t(ctx, "기온 +" + dT.toFixed(1) + " °C 일 때 같은 지역의 1년", LW - 16, 28, { s: 12, w: "900", a: "right", c: LC.orange });
      if (mode === "rain") {
        var mx = Math.max(60, mxv), imx = a.indexOf(mxv);
        K.bigText(ctx, "하루하루 내린 비", 16, 34, 18, "#ffffff");
        var MN = ["1월", "3월", "5월", "7월", "9월", "11월", ""];
        g = K.chart(ctx, { x: 4, y: 44, w: LW - 8, h: H - 48, pl: 44, pb: 28, pt: 10, pr: 14, x0: 0, x1: 365, y0: 0, y1: mx, xt: 6, yt: 4, light: true, xf: function (vv) { return MN[Math.round(vv / 365 * 6)] || ""; }, yf: function (vv) { return Math.round(vv) + "mm"; } });
        var bw = Math.max(1.6, (g.R - g.L) / 365 - 0.3);
        K.line(ctx, { x: g.L, y: g.Y(57) }, { x: g.R, y: g.Y(57) }, LC.red, 1.2, [4, 4]);
        for (i = 0; i < a.length; i++) { if (a[i] <= 0) continue; var top = g.Y(a[i]), big = a[i] >= 57; ctx.fillStyle = big ? "#e03131" : "#4dabf7"; ctx.fillRect(g.X(i), top, bw, g.B - top); }
        K.t(ctx, "빨강 = 하루 57 mm 이상", g.L + 8, g.T + 16, { s: 11, w: "900", c: LC.red });
        K.t(ctx, "하루 최대 " + Math.round(a[imx]) + " mm", g.X(imx) + (imx > 300 ? -10 : 10), Math.max(g.Y(a[imx]) + 4, g.T + 36), { s: 11.5, w: "900", a: imx > 300 ? "right" : "left", c: LC.red });
      } else {
        var runs = [], run = 0;
        for (i = 0; i < a.length; i++) { if (a[i] > 0) { if (run) runs.push(run); run = 0; } else run++; }
        if (run) runs.push(run);
        runs.sort(function (p, q) { return q - p; });
        var show = runs.slice(0, 40), maxRun = Math.max(20, show[0] || 10);
        K.bigText(ctx, "비가 오지 않은 날이 이어진 기간", 16, 34, 18, "#ffffff");
        g = K.chart(ctx, { x: 4, y: 44, w: LW - 8, h: H - 48, pl: 44, pb: 28, pt: 10, pr: 14, x0: 0, x1: 40, y0: 0, y1: maxRun, xt: 4, yt: 4, light: true, xf: function (vv) { return vv ? vv + "번째" : "가장 긴 것"; }, yf: function (vv) { return Math.round(vv) + "일"; } });
        var bw2 = (g.X(1) - g.X(0)) * .6, dp = 5;
        for (i = 0; i < show.length; i++) { var top2 = g.Y(show[i]), fire = show[i] >= 14, x2 = g.X(i + .5) - bw2 / 2; zBox(ctx, x2, top2, bw2, g.B - top2, dp, fire ? "#f76707" : "#fcc419", fire ? "#ffa94d" : "#ffe066", fire ? "#c2410c" : "#d9a400"); }
        K.line(ctx, { x: g.L, y: g.Y(14) }, { x: g.R, y: g.Y(14) }, LC.red, 1.5, [6, 4]);
        K.t(ctx, "🔥 2주 이상 — 산불 위험이 커지는 구간", g.R - 8, g.Y(14) - 8, { s: 11.5, w: "900", a: "right", c: LC.orange });
      }
      /* 오른쪽: 비구름 아래 땅 블록 + 카드 */
      var RX = LW + 12, up = (mxv / MAX0 - 1) * 100, totUp = (tot / TOT0 - 1) * 100;
      zCard(ctx, RX, W - RX, H, "같은 비, 다른 내림", [["연 강수량", Math.round(tot) + " mm", totUp <= 6 ? LC.blue : LC.red], ["비 오는 날", days + "일", LC.orange], ["하루 최대", Math.round(mxv) + " mm", up >= 30 ? LC.red : LC.ink]], [up >= 30 && totUp <= 6 ? "같은 양이 더 적은 날에 몰림" : "기온을 올려 보세요", up >= 30 && totUp <= 6 ? true : null], null, 230);
      var I = K.iso({ ox: RX + 104, oy: 150, s: 0.55, L: 160, D: 110 });
      ["front", "right"].forEach(function (sd, j) { I.face(ctx, sd, function (Lw) { [[0, 8, "#7c818a"], [8, 16, "#9a7650"], [16, 22, "#5a3d26"]].forEach(function (b) { ctx.fillStyle = j ? K.tint(b[2], .84) : b[2]; ctx.fillRect(0, b[0], Lw, b[1] - b[0]); }); }); });
      I.top(ctx, function () { return 22; }, function (j) { return j < 8 ? (dT > 2 ? "#d9b96a" : "#9cc26a") : "#7fb3d8"; }, 16);
      [[30, 30], [60, 70]].forEach(function (t) { I.tree(ctx, t[0], t[1], 22, .9); });
      var cl = I.P(110, 40, 150); ctx.fillStyle = "#868e96"; [[0, 0, 22], [-20, 6, 16], [20, 6, 18], [8, -10, 16]].forEach(function (c) { ctx.beginPath(); ctx.arc(cl.x + c[0], cl.y + c[1], c[2], 0, 6.2832); ctx.fill(); });
      for (i = 0; i < 10 + Math.round(dT * 6); i++) { var rx2 = cl.x - 26 + (i * 13) % 52, ry2 = cl.y + 20 + (i * 7) % 30; K.line(ctx, { x: rx2, y: ry2 }, { x: rx2 - 3, y: ry2 + 10 }, "#1c7ed6", 1.6); }
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
      /* ── 왼쪽: 도시 블록 모형(윗면 = 도로·투수 녹지, 앞면 = 땅속 저류조·하수관) ── */
      var LW = 560, I = K.iso({ ox: 222, oy: 92, s: 0.8, L: 320, D: 150 }), ZG = 70, pw = 320 * p / 100;
      var fc = I.P(160, 75, 0); K.studio(ctx, 0, 0, LW, H, { x: fc.x + 8, y: fc.y + 22, rx: 230, ry: 30 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      I.face(ctx, "front", function (Lw) {
        var sg = ctx.createLinearGradient(0, ZG, 0, 0); sg.addColorStop(0, "#9a7650"); sg.addColorStop(1, "#5a3d26"); ctx.fillStyle = sg; ctx.fillRect(0, 0, Lw, ZG);
        ctx.fillStyle = "#6c757d"; ctx.fillRect(pw, ZG - 4, Lw - pw, 4);
        /* 저류조 */
        var tx = 110, tw = 110, th = 30, tz = 18, lv = th * s / 40;
        ctx.fillStyle = "#adb5bd"; ctx.fillRect(tx - 4, tz - 4, tw + 8, th + 8); ctx.fillStyle = "#343a40"; ctx.fillRect(tx, tz, tw, th);
        if (s > 0) { ctx.fillStyle = "#4dabf7"; ctx.fillRect(tx, tz, tw, lv); }
        /* 하수관 */
        var sx = 270, sz = 30, sr = 16, fill = Math.min(1, ro / 100);
        ctx.fillStyle = "#868e96"; ctx.beginPath(); ctx.arc(sx, sz, sr + 4, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#212529"; ctx.beginPath(); ctx.arc(sx, sz, sr, 0, 6.2832); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(sx, sz, sr, 0, 6.2832); ctx.clip(); ctx.fillStyle = ro > 50 ? "#e03131" : "#1c7ed6"; ctx.fillRect(sx - sr, sz - sr, 2 * sr, 2 * sr * fill); ctx.restore();
        ctx.strokeStyle = "#ffffff"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(sx - sr, sz); ctx.lineTo(sx + sr, sz); ctx.stroke(); ctx.setLineDash([]);
        for (k = 0; k < Math.round(p / 8); k++) { var ix = 8 + k * Math.max(8, (pw - 16) / Math.max(1, Math.round(p / 8) - 1)); if (ix > pw - 4) break; K.arrow(ctx, { x: ix, y: ZG - 6 }, { x: ix, y: ZG - 26 }, "rgba(77,171,247,.95)", 2, 7); }
      });
      I.face(ctx, "right", function (Lw) { var sg = ctx.createLinearGradient(0, ZG, 0, 0); sg.addColorStop(0, "#876744"); sg.addColorStop(1, "#4c3320"); ctx.fillStyle = sg; ctx.fillRect(0, 0, Lw, ZG); });
      I.top(ctx, function () { return ZG; }, function (j, u) { return u < pw ? (j % 2 ? "#6fbf55" : "#62b24a") : "#495057"; }, 32);
      for (k = 0; k < 6; k++) { var a1 = I.P(pw + 10 + k * 40, 75, ZG), a2 = I.P(pw + 26 + k * 40, 75, ZG); if (pw + 26 + k * 40 > 318) break; K.line(ctx, a1, a2, "#ffffff", 2); }
      for (k = 0; k < Math.round(p / 10); k++) I.tree(ctx, 10 + (k * 37) % Math.max(10, pw - 10), 20 + (k * 53) % 110, ZG, .9);
      if (ro > 50) I.plane(ctx, ZG + 1.5, "rgba(77,171,247,.45)", null, pw, 320, 0, 150);
      [[250, 10, 30], [290, 112, 44]].forEach(function (b) { if (b[0] > pw) I.box(ctx, b[0], b[1], ZG, b[0] + 26, b[1] + 26, ZG + b[2], "#e9ecef", "#ced4da", "#adb5bd"); });
      if (ro > 0) { var f0 = I.P(Math.max(pw, 0) + 6, 140, ZG + 1), f1 = I.P(300, 140, ZG + 1); ctx.strokeStyle = "rgba(28,126,214,.8)"; ctx.lineWidth = 2 + ro / 14; ctx.beginPath(); ctx.moveTo(f0.x, f0.y); ctx.lineTo(f1.x, f1.y); ctx.stroke(); }
      ctx.restore();
      DROPS.forEach(function (d) { var dx = 30 + d.x * (LW - 60), dy = 50 + d.y * 60; K.line(ctx, { x: dx, y: dy }, { x: dx - 3, y: dy + 10 }, "rgba(28,126,214,.7)", 1.6); });
      var BX = [0, LW];
      I.label(ctx, 165, 150, 33, "빗물 저류조 " + s + " mm", -40, 60, "#cfeaff", BX);
      I.label(ctx, 270, 150, 30, "하수관 · 점선 = 용량 50 mm", 20, 54, "#e8ecff", BX);
      if (p > 0) I.label(ctx, Math.min(pw / 2, 60), 130, ZG, "투수 포장·녹지 " + p + "%", -10, 34, "#c3f5b0", BX);
      K.bigText(ctx, ro > 50 ? "⚠ 도로 침수" : "침수 없음", 16, 36, 22, ro > 50 ? "#ff9a7a" : "#7ee0a0");
      K.bigText(ctx, "시간당 100 mm 폭우", 16, 60, 14, "#ffd35a");
      /* ── 오른쪽: 흰 카드 — 두 기준 ── */
      var RX = LW + 12;
      zCard(ctx, RX, W - RX, H, "두 기준을 함께 맞추기", [["하수관으로 흘러드는 물", ro.toFixed(0) + " mm", ro <= 50 ? LC.green : LC.red, Math.min(1, ro / 100)], ["비용", c.toFixed(0), c <= 70 ? LC.green : LC.red, Math.min(1, c / 120)]], [ro <= 50 && c <= 70 ? "침수 없이 예산 안에서 막음" : "용량 50 mm 이하 · 예산 70 이하", ro <= 50 && c <= 70 ? true : null], null, 70);
      var bx0 = RX + 18, bw = W - RX - 36;
      ctx.fillStyle = LC.ink; ctx.fillRect(bx0 + bw * 0.5 - 1, 72, 2, 20); ctx.fillRect(bx0 + bw * 70 / 120 - 1, 114, 2, 20);
      K.t(ctx, "50 mm", bx0 + bw * 0.5, 104, { s: 10, w: "800", a: "center", c: LC.mute }); K.t(ctx, "예산 70", bx0 + bw * 70 / 120, 146, { s: 10, w: "800", a: "center", c: LC.mute });
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
      zBox(ctx, x, y, w, Math.max(1, h - 2), 12, c2[1], c2[0], K.tint(c2[1].length === 7 ? c2[1] : "#888888", .75));
      if (h > 16) K.t(ctx, label, x + w / 2, y + h / 2 + 4, { s: 11, a: "center", c: "#ffffff", w: "900" });
    }
    function draw() {
      var t = totals(), cx = W / 2, topY = 250, scale = 2.3, armL = 232;
      if (tiltNow === null || K.REDUCE) tiltNow = tiltOf(t);
      var tilt = tiltNow;
      ctx.clearRect(0, 0, W, H);
      K.studio(ctx, 0, 0, W, H, { x: cx, y: H - 60, rx: 220, ry: 20 });
      K.bigText(ctx, "탄소 저울", 16, 36, 22, "#ffffff");
      K.t(ctx, "배출 100을 기준으로 한 상대값", 16, 58, { s: 12, w: "800", c: LC.mute });
      /* 받침대(금속 기둥 + 받침) */
      var mg = ctx.createLinearGradient(cx - 10, 0, cx + 10, 0); mg.addColorStop(0, "#868e96"); mg.addColorStop(.5, "#f1f3f5"); mg.addColorStop(1, "#6c757d");
      ctx.fillStyle = mg; ctx.fillRect(cx - 7, topY, 14, H - 74 - topY);
      zBox(ctx, cx - 70, H - 82, 140, 18, 14, "#868e96", "#dee2e6", "#6c757d");
      var lx = cx - armL * Math.cos(tilt), ly = topY + armL * Math.sin(tilt), rx = cx + armL * Math.cos(tilt), ry = topY - armL * Math.sin(tilt);
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#495057"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke();
      ctx.strokeStyle = "#e9ecef"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke(); ctx.restore();
      K.planet(ctx, cx, topY, 9, "#ffd43b", "#a36b00");
      function pan(px, py) {
        ctx.strokeStyle = "#868e96"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 70, py + 36); ctx.moveTo(px, py); ctx.lineTo(px + 70, py + 36); ctx.stroke();
        var pg = ctx.createLinearGradient(px - 90, 0, px + 90, 0); pg.addColorStop(0, "#868e96"); pg.addColorStop(.45, "#f8f9fa"); pg.addColorStop(1, "#6c757d");
        ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(px, py + 40, 90, 11, 0, 0, 6.2832); ctx.fill();
      }
      pan(lx, ly); pan(rx, ry);
      var sy = ly + 36;
      EMIT.forEach(function (e, i) { var val = e.base * (1 - e.cut / 100); if (val < 0.4) return; var h = val * scale; sy -= h; block(lx - 60, sy, 120, h, EC[i], e.n + " " + val.toFixed(0)); });
      var sy2 = ry + 36;
      SINK.forEach(function (s, i) { if (s.v < 0.4) return; var h = s.v * scale; sy2 -= h; block(rx - 60, sy2, 120, h, SC[i], s.n.split("·")[0] + " " + s.v.toFixed(0)); });
      /* 접시 밑의 작은 모형: 공장(배출) · 숲(흡수) */
      zBox(ctx, lx - 80, ly + 52, 26, 18, 8, "#adb5bd", "#dee2e6", "#868e96"); ctx.fillStyle = "#6c757d"; ctx.fillRect(lx - 72, ly + 34, 6, 18);
      I3tree(rx + 70, ry + 70);
      K.t(ctx, "배출 " + t.em.toFixed(0), lx, ly + 76, { s: 14, w: "900", a: "center", c: LC.red });
      K.t(ctx, "흡수 " + t.ab.toFixed(0), rx, ry + 76, { s: 14, w: "900", a: "center", c: LC.green });
      var ok = Math.abs(t.net) < 1.5;
      K.tip(ctx, ok ? "⚖ 탄소중립 — 순배출 0" : ("순배출 " + (t.net > 0 ? "+" : "") + t.net.toFixed(1)), cx - 130, H - 44, 260, ok ? true : (t.net > 0 ? false : null));
    }
    function I3tree(x, y) { ctx.fillStyle = "#6b4a2e"; ctx.fillRect(x - 2, y - 10, 4, 10); K.planet(ctx, x, y - 16, 10, "#69db7c", "#2b8a3e"); K.planet(ctx, x - 9, y - 10, 7, "#8ce99a", "#2b8a3e"); }
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
      zCyl(ctx, x + w / 2, y + w * .17, w / 2, h - w * .35, c0, c1);
      K.t(ctx, label, x + w / 2, y + h + 20, { s: 11, w: "900", a: "center", c: lc || LC.ink });
    }
    function draw() {
      var c = co2(), k;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 만드는 과정(스튜디오 위 입체 장치) ── */
      var LW = 560, gy = 230;
      K.studio(ctx, 0, 0, LW, H, { x: 280, y: gy + 16, rx: 250, ry: 22 });
      zBox(ctx, 10, gy, LW - 40, 12, 18, "#adb5bd", "#dee2e6", "#868e96");
      var rx = 220, ry = 120, rw = 110, rh = 90, hot = m === "green" ? "#4dabf7" : "#ff8a50";
      zBox(ctx, rx, ry, rw, rh, 22, "#adb5bd", "#e9ecef", "#868e96");
      ctx.save(); ctx.shadowColor = hot; ctx.shadowBlur = 14; ctx.fillStyle = hot; ctx.globalAlpha = .8; ctx.beginPath(); ctx.roundRect(rx + 14, ry + 16, rw - 28, rh - 32, 6); ctx.fill(); ctx.restore();
      K.t(ctx, m === "green" ? "전기 분해" : "개질 반응", rx + rw / 2, ry + rh / 2 + 5, { s: 12, a: "center", c: "#ffffff", w: "900" });
      if (m === "green") {
        for (k = 0; k < 3; k++) { var px = 24 + k * 44, py = 170; ctx.fillStyle = "#1c3f8a"; ctx.beginPath(); ctx.moveTo(px, py + 26); ctx.lineTo(px + 8, py); ctx.lineTo(px + 40, py); ctx.lineTo(px + 32, py + 26); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(190,215,255,.8)"; ctx.lineWidth = 1; ctx.stroke(); ctx.strokeStyle = "#868e96"; ctx.beginPath(); ctx.moveTo(px + 20, py + 26); ctx.lineTo(px + 20, gy); ctx.stroke(); }
        var wx = 160, wy = 76; ctx.strokeStyle = "#adb5bd"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, gy); ctx.stroke();
        ctx.strokeStyle = "#f1f3f5"; for (k = 0; k < 3; k++) { var a = tt / 400 + k * 2.094; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 34 * Math.cos(a), wy + 34 * Math.sin(a)); ctx.stroke(); ctx.lineCap = "butt"; }
        K.planet(ctx, wx, wy, 4, "#dee2e6", "#495057");
        K.arrow(ctx, { x: 178, y: 150 }, { x: rx - 6, y: 150 }, LC.yellow, 3, 10);
        K.t(ctx, "⚡ 재생 전기", 26, 150, { s: 11.5, w: "900", c: "#b7791f" });
        tank(258, 236, 34, 24, "#74c0fc", "#1864ab", "물 2H₂O", LC.blue);
        K.arrow(ctx, { x: 275, y: 236 }, { x: 275, y: ry + rh + 4 }, LC.blue, 2, 8);
        K.arrow(ctx, { x: rx + rw / 2 - 20, y: ry - 14 }, { x: rx + rw / 2 - 20, y: 66 }, "#868e96", 2, 8);
        K.t(ctx, "산소 O₂", rx + rw / 2 - 26, 60, { s: 11.5, w: "900", a: "right", c: LC.mute });
      } else {
        tank(40, 120, 52, 100, "#ced4da", "#495057", "천연가스 CH₄");
        tank(120, 160, 44, 60, "#74c0fc", "#1864ab", "수증기 2H₂O", LC.blue);
        K.arrow(ctx, { x: 94, y: 150 }, { x: rx - 6, y: 150 }, "#868e96", 2.5, 9);
        K.arrow(ctx, { x: 166, y: 190 }, { x: rx - 6, y: 190 }, LC.blue, 2.5, 9);
        var cx = rx + rw - 22, top = 54, out = m === "blue" ? 1 - cap / 100 : 1;
        zCyl(ctx, cx, top, 9, ry - top - 8, "#dee2e6", "#6c757d");
        var np = Math.round(PUFF.length * out);
        for (k = 0; k < np; k++) { var P = PUFF[k], yy = top - 4 - ((P.y + tt / 5000) % 1) * 50, xx = cx + (P.x - .5) * 30 * (1 + (top - yy) / 40); ctx.fillStyle = "rgba(110,115,130," + (0.5 * (1 - (top - yy) / 54)).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(xx, yy, 4 + P.r * 5, 0, 6.2832); ctx.fill(); }
        K.t(ctx, "CO₂ " + Math.round(out * 100) + "%", cx + 18, 40, { s: 11.5, w: "900", c: LC.mute });
        if (m === "blue") {
          ctx.strokeStyle = "#868e96"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(rx + rw - 40, ry + rh); ctx.lineTo(rx + rw - 40, H - 30); ctx.stroke();
          zBox(ctx, rx - 40, H - 42, 200, 28, 10, "#6e5238", "#a08468", "#4c3320");
          var nst = Math.round(cap / 8); for (k = 0; k < nst; k++) K.planet(ctx, rx - 28 + k * 15, H - 27 + (k % 2) * 6, 3.6, "#dee2e6", "#495057");
          K.t(ctx, "포집한 CO₂를 땅속에 저장 · " + cap + "%", rx + 170, H - 18, { s: 11, w: "900", c: LC.ink });
        }
      }
      K.arrow(ctx, { x: rx + rw + 26, y: 165 }, { x: 410, y: 165 }, LC.blue, 3, 10);
      tank(418, 112, 54, 106, "#d0ebff", "#1c7ed6", "수소 H₂", LC.blue);
      for (k = 0; k < 6; k++) { var by = 206 - ((k * 17 + tt / 30) % 80); K.planet(ctx, 432 + (k % 3) * 13, by, 2.4, "#ffffff", "#74c0fc"); }
      K.bigText(ctx, NM[m], 16, 36, 22, m === "green" ? "#7ee0a0" : (m === "blue" ? "#8fd0ff" : "#ffffff"));
      K.t(ctx, m === "green" ? "2H₂O → 2H₂ + O₂" : "CH₄ + 2H₂O → CO₂ + 4H₂", 16, 58, { s: 12, w: "900", c: LC.mute });
      /* ── 오른쪽: 흰 카드 — 수소 1 kg당 CO₂(입체 막대) ── */
      var RX = LW + 12, RW = W - RX, ok = c <= 1.0001;
      K.card(ctx, RX, 0, RW, H, "수소 1 kg당 CO₂");
      var bx = RX + RW / 2 - 40, b0 = H - 60, sc2 = 18, hgt = Math.max(2, c * sc2), y1 = b0 - 1 * sc2;
      zBox(ctx, bx, b0 - hgt, 70, hgt, 14, ok ? "#0f9f76" : "#e03131", ok ? "#63e6be" : "#ff8787", ok ? "#087f5b" : "#a61e1e");
      K.line(ctx, { x: RX + 18, y: y1 }, { x: W - 18, y: y1 }, LC.yellow, 1.5, [5, 4]);
      K.t(ctx, "기준 1 kg", W - 20, y1 - 6, { s: 11, w: "900", a: "right", c: "#b7791f" });
      K.t(ctx, c.toFixed(1) + " kg", RX + 18, 70, { s: 26, w: "900", c: ok ? LC.green : LC.red });
      K.tip(ctx, ok ? "기준을 맞추었습니다" : "기준보다 많이 나옴", RX + 14, H - 44, RW - 28, ok);
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
      var CW = 680;
      K.studio(ctx, 0, 0, CW, H, null);
      K.bigText(ctx, ey === null ? "예산 안에 머묾" : Math.round(ey) + "년 예산 소진", 16, 36, 22, ey === null ? "#7ee0a0" : "#ff9a7a");
      K.t(ctx, "해마다 " + (r * 100).toFixed(1) + "%씩 줄일 때의 연간 배출량 (Gt CO₂/년)", CW - 16, 28, { s: 11.5, w: "800", a: "right", c: LC.mute });
      var g = K.chart(ctx, { x: 4, y: 48, w: CW - 8, h: H - 52, pl: 40, pb: 28, pt: 10, pr: 14, x0: 0, x1: YEARS, y0: 0, y1: 45, xt: 4, yt: 3, light: true, xf: function (vv) { return String(Y0 + vv); }, yf: function (vv) { return String(Math.round(vv)); } });
      var pts = []; for (t = 0; t <= YEARS; t += 0.5) pts.push([t, E0 * Math.pow(1 - r, t)]);
      clipRect(ctx, g);
      var ag = ctx.createLinearGradient(0, g.T, 0, g.B); ag.addColorStop(0, "rgba(232,89,12,.45)"); ag.addColorStop(1, "rgba(232,89,12,.06)");
      ctx.beginPath(); ctx.moveTo(g.X(0), g.B); for (t = 0; t <= Texh; t += 0.5) ctx.lineTo(g.X(t), g.Y(E0 * Math.pow(1 - r, t))); ctx.lineTo(g.X(Texh), g.B); ctx.closePath(); ctx.fillStyle = ag; ctx.fill();
      ctx.restore();
      K.plot(ctx, g, pts, LC.orange, { w: 3, light: true });
      if (ey !== null && ey - Y0 <= YEARS) { var ex = g.X(ey - Y0); K.line(ctx, { x: ex, y: g.T }, { x: ex, y: g.B }, LC.red, 2.2, [6, 5]); K.t(ctx, Math.round(ey) + "년 예산 소진", ex + (ex > CW - 160 ? -8 : 8), g.T + 30, { s: 13, w: "900", a: ex > CW - 160 ? "right" : "left", c: LC.red }); }
      else K.t(ctx, "예산 안에 머뭅니다", g.R - 8, g.T + 20, { s: 13, w: "900", a: "right", c: LC.green });
      K.t(ctx, "칠해진 넓이 = 그때까지 쌓인 배출량", g.X(Math.min(Texh, YEARS) / 2), g.B - 10, { s: 11, w: "900", a: "center", c: "#a33f00" });
      /* ── 오른쪽: 흰 카드 — 유리 원통 탄소예산 통 ── */
      var RX = CW + 12, RW = W - RX, used = ey === null ? cumulative(200) : budget, frac = Math.min(1, used / budget);
      K.card(ctx, RX, 0, RW, H, "탄소예산");
      var cx = RX + RW / 2, rr = 42, by0 = 80, bh = H - 170, fh = bh * frac;
      ctx.fillStyle = "rgba(20,30,50,.15)"; ctx.beginPath(); ctx.ellipse(cx + 6, by0 + bh + 6, rr + 14, rr * .4, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(200,225,250,.35)"; ctx.fillRect(cx - rr, by0, 2 * rr, bh);
      if (fh > 2) zCyl(ctx, cx, by0 + bh - fh, rr - 3, fh, frac >= 1 ? "#ff8787" : "#ffa94d", frac >= 1 ? "#a61e1e" : "#c2410c");
      ctx.strokeStyle = "rgba(80,100,130,.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - rr, by0); ctx.lineTo(cx - rr, by0 + bh); ctx.ellipse(cx, by0 + bh, rr, rr * .35, 0, Math.PI, 0, true); ctx.lineTo(cx + rr, by0); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, by0, rr, rr * .35, 0, 0, 6.2832); ctx.stroke();
      K.t(ctx, budget.toLocaleString() + " Gt", cx, by0 - 22, { s: 12, w: "900", a: "center", c: LC.ink });
      K.t(ctx, frac >= 1 ? "가득 참" : "누적 " + Math.round(used) + " Gt", cx, by0 + bh + 34, { s: 13, w: "900", a: "center", c: frac >= 1 ? LC.red : LC.green });
      K.t(ctx, budget === 500 ? "1.5 °C 목표" : "2 °C 목표", cx, H - 22, { s: 11.5, w: "800", a: "center", c: LC.mute });
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
      /* ── 왼쪽: 학교 블록 모형(앞면 창문 = 교실 불빛, 옥상 = 태양광) ── */
      var LW = 450, I = K.iso({ ox: 168, oy: 118, s: 0.72, L: 300, D: 110 }), ZG = 12, ZB = 96;
      var fc = I.P(150, 55, 0); K.studio(ctx, 0, 0, LW, H, { x: fc.x + 6, y: fc.y + 24, rx: 200, ry: 28 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      ["front", "right"].forEach(function (sd, j) { I.face(ctx, sd, function (Lw) { ctx.fillStyle = j ? "#5e4530" : "#6e5238"; ctx.fillRect(0, 0, Lw, ZG); }); });
      I.top(ctx, function () { return ZG; }, function (j) { return j % 2 ? "#8cc46a" : "#84bd62"; }, 20);
      I.tree(ctx, 14, 10, ZG, 1);
      I.box(ctx, 30, 20, ZG, 270, 80, ZB, "#cfc4b0", "#e2d6c2", "#bfae94");
      var dark = Math.round(24 * 0.3 * L / 100), Rw = mulberry(61), order = [];
      for (k = 0; k < 24; k++) order.push([Rw(), k]);
      order.sort(function (a, b) { return a[0] - b[0]; });
      var off = {}; for (k = 0; k < dark; k++) off[order[k][1]] = true;
      K.iso({ ox: 168, oy: 118, s: 0.72, L: 300, D: 80 }).face(ctx, "front", function () {
        for (k = 0; k < 24; k++) { var wx = 40 + (k % 8) * 28, wz = ZG + 12 + Math.floor(k / 8) * 26; ctx.save(); ctx.translate(0, 0); ctx.fillStyle = off[k] ? "#343a40" : "#ffe066"; ctx.fillRect(wx, wz, 18, 16); ctx.strokeStyle = "#7a6a52"; ctx.lineWidth = 1.5; ctx.strokeRect(wx, wz, 18, 16); ctx.restore(); }
      });
      var np = Math.round(S / 10);
      for (k = 0; k < np; k++) { var x0p = 38 + (k % 6) * 38, y0p = 26 + Math.floor(k / 6) * 26; I.quad(ctx, I.P(x0p, y0p, ZB + 2), I.P(x0p + 32, y0p, ZB + 2), I.P(x0p + 32, y0p + 20, ZB + 10), I.P(x0p, y0p + 20, ZB + 10), "#1c3f8a", "rgba(190,215,255,.8)"); }
      I.box(ctx, 274, 40, ZG, 290, 60, ZG + 18, "#f1f3f5", "#ced4da", "#adb5bd");
      [[10, 96], [290, 100]].forEach(function (t) { I.tree(ctx, t[0], t[1], ZG, 1); });
      ctx.restore();
      var BX = [0, LW];
      I.label(ctx, 290, 50, ZG + 18, "❄ 냉방 " + T + " ℃", 30, 40, "#bfe6ff", BX);
      if (np > 0) I.label(ctx, 100, 40, ZB + 8, "태양광 " + S + " kW", -20, -40, "#ffe8a3", BX);
      K.bigText(ctx, "줄인 몫 " + pct.toFixed(1) + "%", 16, 36, 22, pct >= 15 ? "#7ee0a0" : "#ffffff");
      K.t(ctx, "불 꺼진 빈 교실 " + dark + "칸 / 24칸", 16, H - 14, { s: 11.5, w: "900", c: LC.mute });
      /* ── 오른쪽: 흰 카드 — 줄인 몫(입체 띠) ── */
      var RX = LW + 12, RW = W - RX, x0 = RX + 20, y0 = 96, bw = RW - 50;
      K.card(ctx, RX, 0, RW, H, "학교 전기 100만 kWh 가운데 줄인 몫");
      zBox(ctx, x0, y0, bw, 36, 12, "#e3e9f1", "#f1f3f5", "#ced4da");
      var cx = x0;
      [[s.cool, ["#0c8599", "#66d9e8"], "냉방"], [s.light, ["#f59f00", "#ffe066"], "조명"], [s.solar, ["#0f9f76", "#63e6be"], "태양광"]].forEach(function (p) {
        var w = bw * p[0] / 1000000 / 0.4; if (w < 0.5) return; w = Math.min(w, x0 + bw - cx);
        zBox(ctx, cx, y0, w, 36, 12, p[1][0], p[1][1], K.tint(p[1][0], .75));
        if (w > 44) K.t(ctx, p[2], cx + w / 2, y0 + 23, { s: 11, a: "center", c: "#ffffff", w: "900" });
        cx += w;
      });
      var gx = x0 + bw * 0.15 / 0.4;
      K.line(ctx, { x: gx, y: y0 - 16 }, { x: gx, y: y0 + 46 }, LC.red, 2, [5, 4]);
      K.t(ctx, "목표 15%", gx, y0 + 64, { s: 11, w: "900", a: "center", c: LC.red });
      [0, 10, 20, 30, 40].forEach(function (m2) { K.t(ctx, m2 + "%", x0 + bw * m2 / 40, y0 - 18, { s: 10, w: "700", a: m2 === 0 ? "left" : (m2 === 40 ? "right" : "center"), c: LC.mute }); });
      K.row(ctx, "줄인 전기", Math.round(s.tot).toLocaleString() + " kWh", x0, W - 20, 196, pct >= 15 ? LC.green : LC.ink);
      K.row(ctx, "줄인 이산화 탄소", "약 " + (s.tot * 0.46 / 1000).toFixed(0) + " t", x0, W - 20, 224, LC.blue);
      K.tip(ctx, pct >= 15 ? "목표 15%를 넘었습니다" : "전기 1 kWh ≈ CO₂ 0.46 kg으로 계산", x0 - 6, H - 44, RW - 28, pct >= 15 ? true : null);
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
