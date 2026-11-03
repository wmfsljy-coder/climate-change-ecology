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
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 3 });
      K.pill(ctx, "10년 동안 매일 잰 기온 · 평균하는 기간을 늘려 보기", 16, 28, { s: 13, c: KC.blue });
      var lg = K.pill(ctx, "━ " + win + "일 평균", W - 16, 28, { a: "right", s: 11.5, c: KC.orange });
      K.pill(ctx, "━ 매일 기온(날씨)", lg.x - 8, 28, { a: "right", s: 11.5, c: "#c9d3f5" });
      var g = K.chart(ctx, { x: 6, y: 40, w: W - 12, h: H - 44, x0: 0, x1: 10, y0: -5, y1: 30, xt: 10, yt: 7, xl: "지난 시간(년)", yl: "기온(℃)" });
      clipRect(ctx, g);
      /* 평균하는 구간(창) */
      var wy = win / 365, wx0 = g.X(5 - wy / 2), wx1 = g.X(5 + wy / 2);
      ctx.fillStyle = "rgba(255,179,92,.10)"; ctx.fillRect(wx0, g.T, Math.max(2, wx1 - wx0), g.B - g.T);
      ctx.strokeStyle = "rgba(255,179,92,.6)"; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.strokeRect(wx0, g.T, Math.max(2, wx1 - wx0), g.B - g.T); ctx.setLineDash([]);
      /* 변동 폭 띠 (평균 ± 표준 편차) */
      ctx.fillStyle = "rgba(127,211,255,.10)"; ctx.fillRect(g.L, g.Y(m + d), g.R - g.L, g.Y(m - d) - g.Y(m + d));
      ctx.strokeStyle = "rgba(127,211,255,.45)"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      [m + d, m - d].forEach(function (t) { ctx.beginPath(); ctx.moveTo(g.L, g.Y(t)); ctx.lineTo(g.R, g.Y(t)); ctx.stroke(); });
      ctx.setLineDash([]);
      /* 매일의 기온 */
      ctx.strokeStyle = "rgba(200,212,255,.38)"; ctx.lineWidth = 1; ctx.beginPath();
      for (p = 0; p < 400; p++) { var xx = g.X(p / 40), yy = g.Y(daily[Math.floor(p / 400 * N)]); if (p) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
      ctx.stroke();
      K.plot(ctx, g, s.map(function (val, k) { return [k / 40, val]; }), KC.orange, { w: 2.8 });
      ctx.restore();
      K.pill(ctx, "평균하는 구간 " + win + "일", g.X(5), g.T + 18, { a: "center", s: 11.5, c: KC.orange });
      K.pill(ctx, "변동 폭 ±" + d.toFixed(2) + " ℃", g.R - 8, Math.max(g.T + 46, g.Y(m + d) - 8), { a: "right", s: 11.5, c: d < 0.5 ? KC.green : KC.blue });
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

  /* 장면 4 — 기후 만들기 */
  (function () {
    var canvas = $("c-clim"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var lat = 50, cont = 50, cur = "none", got = window.sthState("climGot") || { a: false, b: false };
    var CUR = { warm: 6, none: 0, cold: -3 }, CN = { warm: "난류", none: "해류 없음", cold: "한류" };
    function clim() {
      var c = cont / 100, Tm = 30 - 0.5 * lat + CUR[cur] - 3 * c, A = 1.5 + 0.42 * lat * (0.15 + 0.85 * c);
      return { jan: Tm - A, jul: Tm + A, rng: 2 * A, mean: Tm };
    }
    var ph = 0, mo = motion("cl-play");
    function coast(y) { return 112 + 10 * Math.sin(y / 37) + 6 * Math.sin(y / 13 + 1); }
    function draw() {
      var r = clim(), y, k;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 위에서 본 해안 ── */
      var LW = 330;
      K.stage(ctx, 0, 0, LW, H, "ocean", { seed: 8 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      ctx.beginPath(); ctx.moveTo(coast(0), 0);
      for (y = 6; y <= H; y += 6) ctx.lineTo(coast(y), y);
      ctx.lineTo(LW, H); ctx.lineTo(LW, 0); ctx.closePath();
      var lgd = ctx.createLinearGradient(110, 0, LW, H); lgd.addColorStop(0, "#5b8a45"); lgd.addColorStop(1, "#26421f");
      ctx.fillStyle = lgd; ctx.fill();
      var frost = clamp(-r.jan / 25, 0, .75);
      if (frost > 0) { ctx.fillStyle = "rgba(232,242,255," + frost.toFixed(2) + ")"; ctx.fill(); }
      var Rr = K.rng(21);
      for (k = 0; k < 40; k++) { var tx = 140 + Rr() * 180, ty = Rr() * H; ctx.fillStyle = "rgba(20,50,20," + (0.25 * (1 - frost)).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(tx, ty, 2 + Rr() * 4, 0, 6.2832); ctx.fill(); }
      ctx.strokeStyle = "rgba(240,220,170,.75)"; ctx.lineWidth = 3; ctx.beginPath();
      for (y = 0; y <= H; y += 6) { if (y) ctx.lineTo(coast(y), y); else ctx.moveTo(coast(y), y); }
      ctx.stroke();
      /* 해류: 난류는 극 쪽(위)으로, 한류는 적도 쪽(아래)으로 */
      if (cur !== "none") {
        var up = cur === "warm", col = up ? "rgba(255,150,100," : "rgba(130,225,255,";
        for (var c = 0; c < 3; c++) {
          var cx = 26 + c * 28;
          for (k = 0; k < Math.ceil((H + 40) / 40); k++) {
            var yy = ((k * 40 + c * 13 + (up ? -1 : 1) * ph * 0.03) % (H + 40) + H + 40) % (H + 40) - 20, dy = up ? 7 : -7;
            ctx.strokeStyle = col + (0.45 + 0.4 * (c % 2)).toFixed(2) + ")"; ctx.lineWidth = 2.6; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(cx - 7, yy + dy); ctx.lineTo(cx, yy); ctx.lineTo(cx + 7, yy + dy); ctx.stroke();
          }
        }
        ctx.lineCap = "butt";
      }
      ctx.restore();
      K.pill(ctx, "위에서 본 해안", 14, 28, { s: 13, c: KC.blue });
      K.pill(ctx, lat === 0 ? "적도 0°" : "북위 " + lat + "°", LW - 14, 28, { a: "right", s: 12, c: KC.yellow, box: [0, LW] });
      K.pill(ctx, cur === "warm" ? "난류 ↑ 남쪽의 따뜻한 물" : (cur === "cold" ? "한류 ↓ 북쪽의 찬 물" : "해류 없음"), 14, H - 16, { s: 11.5, c: cur === "warm" ? KC.orange : (cur === "cold" ? KC.blue : KC.mute), box: [0, LW] });
      var cy = H / 2 - 20, x0c = coast(cy), cityX = x0c + 22 + cont / 100 * (LW - x0c - 52);
      if (cont > 0) K.bracket(ctx, x0c, cityX, cy + 26, "rgba(255,255,255,.7)", "내륙 쪽 " + cont + "%", false);
      K.glow(ctx, cityX, cy, 5, "rgba(255,236,190,.95)", 4);
      K.pill(ctx, "가상 도시", cityX, cy - 14, { a: "center", s: 11.5, c: "#fff4d6", box: [0, LW] });
      var palm = r.jan >= 4 && r.rng <= 14, harsh = r.jan <= -15;
      if (palm || harsh) K.pill(ctx, palm ? "🌴 야자나무 월동 가능" : "❄️ 혹독한 겨울", cityX, cy + 86, { a: "center", s: 12, c: palm ? KC.green : "#cfe6ff", box: [0, LW] });

      /* ── 오른쪽: 월평균 기온 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 9 });
      K.pill(ctx, "가상 도시의 월평균 기온", RX + 14, 28, { s: 13, c: KC.blue });
      var MN = ["1월", "4월", "7월", "10월", "1월"];
      var g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 8, h: H - 44, x0: 0, x1: 12, y0: -30, y1: 40, xt: 4, yt: 7, yl: "기온(℃)", xf: function (vv) { return MN[Math.round(vv / 3)]; } });
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
    var cx = 196, cy = 178, R = 118, SUN = { x: 360, y: 60 };
    function edge(a) { return 1 + .07 * Math.sin(5 * a + 1) + .05 * Math.sin(9 * a + 2) + .03 * Math.sin(17 * a); }
    function iceR() { return R * Math.sqrt(A / TOT); }
    function onIce(x, y) { var dx = x - cx, dy = y - cy; return Math.sqrt(dx * dx + dy * dy) < Math.min(R - 2, iceR() * edge(Math.atan2(dy, dx))); }
    function beam(a, b, w0, w1, fill) {
      var dx = b.x - a.x, dy = b.y - a.y, L = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / L, ny = dx / L;
      ctx.fillStyle = fill; ctx.beginPath();
      ctx.moveTo(a.x + nx * w0 / 2, a.y + ny * w0 / 2); ctx.lineTo(b.x + nx * w1 / 2, b.y + ny * w1 / 2);
      ctx.lineTo(b.x - nx * w1 / 2, b.y - ny * w1 / 2); ctx.lineTo(a.x - nx * w0 / 2, a.y - ny * w0 / 2); ctx.closePath(); ctx.fill();
    }
    function step(dt) {
      spawn += dt;
      while (spawn > 70) {
        spawn -= 70;
        var rr = R * Math.sqrt(RP()), aa = RP() * 6.2832;
        PH.push({ x: SUN.x + (RP() - .5) * 16, y: SUN.y + (RP() - .5) * 16, tx: cx + rr * Math.cos(aa), ty: cy + rr * Math.sin(aa), st: 0, t: 0 });
      }
      PH.forEach(function (p) {
        p.t += dt;
        if (p.st === 0) {
          var dx = p.tx - p.x, dy = p.ty - p.y, d = Math.sqrt(dx * dx + dy * dy), sp = 0.22 * dt;
          if (d <= sp) { p.x = p.tx; p.y = p.ty; p.t = 0; p.st = RP() < (onIce(p.x, p.y) ? 0.6 : 0.06) ? 1 : 2; p.vx = (SUN.x - p.x) / 900 + (RP() - .5) * .08; p.vy = (SUN.y - p.y) / 900 - .05; }
          else { p.x += dx / d * sp; p.y += dy / d * sp; }
        } else if (p.st === 1) { p.x += p.vx * dt; p.y += p.vy * dt; }
      });
      PH = PH.filter(function (p) { return p.st === 0 || (p.st === 1 && p.t < 900) || (p.st === 2 && p.t < 700); });
    }
    function draw() {
      var ab = absorb(A), full = absorb(TOT), k;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 위에서 본 북극해 ── */
      var LW = 400;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 4 });
      var lg = ctx.createRadialGradient(cx, cy, R, cx, cy, R + 44);
      lg.addColorStop(0, "#5a4a34"); lg.addColorStop(.5, "rgba(70,58,40,.7)"); lg.addColorStop(1, "rgba(40,32,24,0)");
      ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(cx, cy, R + 44, 0, 6.2832); ctx.fill();
      var og = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, R);
      og.addColorStop(0, "#16578f"); og.addColorStop(1, "#061f3c");
      ctx.fillStyle = og; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
      var ir = iceR();
      if (ir > 1) {
        ctx.save();
        ctx.beginPath();
        for (k = 0; k <= 90; k++) { var a = k / 90 * 6.2832, rr = Math.min(R - 2, ir * edge(a)), px = cx + rr * Math.cos(a), py = cy + rr * Math.sin(a); if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
        ctx.closePath();
        var ig = ctx.createRadialGradient(cx - ir * .3, cy - ir * .3, 2, cx, cy, ir * 1.1);
        ig.addColorStop(0, "#ffffff"); ig.addColorStop(.6, "#dcecf8"); ig.addColorStop(1, "#9cc6e4");
        ctx.fillStyle = ig; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.clip();
        var Rc = K.rng(9); ctx.strokeStyle = "rgba(110,160,205,.5)"; ctx.lineWidth = 1;
        for (k = 0; k < 12; k++) { var a0 = Rc() * 6.28, r0 = Rc() * ir; ctx.beginPath(); ctx.moveTo(cx + r0 * Math.cos(a0), cy + r0 * Math.sin(a0)); ctx.lineTo(cx + (r0 + 26) * Math.cos(a0 + .35), cy + (r0 + 26) * Math.sin(a0 + .35)); ctx.stroke(); }
        ctx.restore();
      }
      ctx.strokeStyle = "rgba(160,200,255,.55)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
      K.sun(ctx, SUN.x, SUN.y, 10);
      PH.forEach(function (p) {
        if (p.st === 0) K.glow(ctx, p.x, p.y, 1.5, "rgba(255,226,140,.95)", 3);
        else if (p.st === 1) { ctx.globalAlpha = Math.max(0, 1 - p.t / 900); K.glow(ctx, p.x, p.y, 1.6, "rgba(225,240,255,.95)", 3); ctx.globalAlpha = 1; }
        else { ctx.globalAlpha = Math.max(0, 1 - p.t / 700); K.glow(ctx, p.x, p.y, 2 + p.t / 140, "rgba(255,120,70,.6)", 2.4); ctx.globalAlpha = 1; }
      });
      K.pill(ctx, "북극해 · 위에서 본 모습", 14, 28, { s: 13, c: KC.blue });
      if (ir > 34) K.pill(ctx, "해빙 · 반사율 약 60%", cx, cy + 5, { a: "center", s: 11, c: "#0b2a4a", bg: "rgba(255,255,255,.72)" });
      if (R - ir > 30) K.pill(ctx, "드러난 바다 · 약 6%", cx, cy + (ir + R) / 2 + (ir > 34 ? 6 : -10), { a: "center", s: 11, c: KC.blue });
      K.pill(ctx, "햇빛", SUN.x - 22, SUN.y + 5, { a: "right", s: 11, c: KC.yellow });
      K.pill(ctx, "해빙 " + A.toFixed(1) + " · 바다 " + (TOT - A).toFixed(1) + " (백만 km²)", cx, H - 12, { a: "center", s: 11.5, c: KC.mute, box: [0, LW] });

      /* ── 오른쪽: 햇빛 100이 가는 곳 ── */
      var RX = LW + 8, RW = W - RX, sy = 214, mid = RX + RW / 2;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 6 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(RX, 0, RW, H, 14); ctx.clip();
      var wg = ctx.createLinearGradient(0, sy, 0, H); wg.addColorStop(0, "#0f4675"); wg.addColorStop(1, "#03122a");
      ctx.fillStyle = wg; ctx.fillRect(RX, sy, RW, H - sy);
      var fi = A / TOT, sx0 = RX + 18, sw = RW - 36;
      ctx.fillStyle = "#e8f4fb"; ctx.fillRect(sx0, sy - 5, sw * fi, 8);
      ctx.fillStyle = "#2a76b8"; ctx.fillRect(sx0 + sw * fi, sy - 5, sw * (1 - fi), 8);
      var bw = 92, hit = { x: mid, y: sy - 5 }, A0 = { x: RX + 60, y: 20 }, ddx = hit.x - A0.x, ddy = hit.y - A0.y, dl = Math.sqrt(ddx * ddx + ddy * ddy);
      ctx.save(); ctx.beginPath(); ctx.rect(RX, 0, RW, sy - 5); ctx.clip();
      var gi = ctx.createLinearGradient(0, 20, 0, sy); gi.addColorStop(0, "rgba(255,232,140,.95)"); gi.addColorStop(1, "rgba(255,211,107,.6)");
      beam(A0, { x: hit.x + ddx / dl * 60, y: hit.y + ddy / dl * 60 }, bw * .9, bw, gi);
      if (ab < 1) beam({ x: hit.x - ddx / dl * 60 + (bw * ab) / 2, y: hit.y + ddy / dl * 60 }, { x: RX + RW - 60 + (bw * ab) / 2, y: 20 }, bw * (1 - ab), bw * (1 - ab) * .9, "rgba(225,242,255,.6)");
      ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(RX, sy + 3, RW, H - sy); ctx.clip();
      var ga = ctx.createLinearGradient(0, sy, 0, H - 20); ga.addColorStop(0, "rgba(255,150,80,.8)"); ga.addColorStop(1, "rgba(255,90,60,0)");
      if (ab > 0) beam({ x: mid - (bw * (1 - ab)) / 2, y: sy - 40 }, { x: mid - (bw * (1 - ab)) / 2 + 30, y: H - 20 }, bw * ab, bw * ab * 1.4, ga);
      ctx.restore();
      ctx.restore();
      K.pill(ctx, "햇빛 100은 어디로 갈까", RX + 14, 28, { s: 13, c: KC.blue });
      K.pill(ctx, "들어온 햇빛 100", RX + 16, 66, { s: 11.5, c: KC.yellow });
      K.pill(ctx, "반사 " + Math.round((1 - ab) * 100) + " → 우주로", RX + RW - 16, 66, { a: "right", s: 11.5, c: "#dff1ff" });
      K.t(ctx, "표면: 얼음 " + Math.round(fi * 100) + "% · 바다 " + (100 - Math.round(fi * 100)) + "%", RX + 18, sy + 24, { s: 10.5, c: KC.mute });
      K.pill(ctx, "흡수 " + Math.round(ab * 100) + " → 바다를 데움", mid + 44, H - 18, { s: 11.5, c: KC.orange, box: [RX, W] });
      K.pill(ctx, "모두 얼음이면 흡수 " + Math.round(full * 100), RX + 16, H - 18, { s: 11, c: KC.mute });
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
      /* ── 왼쪽: 되먹임 고리 ── */
      var LW = 320, cx = 172, cy = 182, R = 88;
      var col = g > 0 ? KC.red : (g < 0 ? KC.blue : KC.dim), dotc = g > 0 ? "rgba(255,120,140,.95)" : "rgba(127,211,255,.95)";
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 12 });
      ctx.strokeStyle = "rgba(200,210,255,.12)"; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
      ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = g ? 10 : 0;
      ctx.strokeStyle = col; ctx.globalAlpha = g ? .45 + .55 * Math.min(1, Math.abs(g) / .4) : .5; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke(); ctx.restore();
      for (k = 0; k < 4; k++) {
        var aa = k * Math.PI / 2 + Math.PI / 4, px = cx + R * Math.cos(aa), py = cy + R * Math.sin(aa);
        K.arrow(ctx, { x: px + 8 * Math.sin(aa), y: py - 8 * Math.cos(aa) }, { x: px - 8 * Math.sin(aa), y: py + 8 * Math.cos(aa) }, col, 2.4, 10);
      }
      var n = g === 0 ? 0 : Math.round(5 + Math.abs(g) * 30);
      for (k = 0; k < n; k++) { var a2 = ang + k / n * 6.2832; K.glow(ctx, cx + R * Math.cos(a2), cy + R * Math.sin(a2), 2.2, dotc, 3.6); }
      K.arrow(ctx, { x: 30, y: 74 }, { x: cx - 52, y: cy - R + 2 }, KC.yellow, 2.4, 11);
      K.pill(ctx, "되먹임 고리", 14, 28, { s: 13, c: KC.blue });
      K.pill(ctx, "처음 +1 ℃ · CO₂", 14, 62, { s: 11.5, c: KC.yellow });
      K.pill(ctx, "🌡 기온 상승", cx + 14, cy - R + 5, { s: 12, c: KC.yellow, box: [0, LW] });
      K.pill(ctx, g > 0 ? "키우는 고리 (양)" : (g < 0 ? "누르는 고리 (음)" : "켠 고리 없음"), cx, cy + R + 5, { a: "center", s: 12, c: g ? col : KC.mute });
      K.pill(ctx, "g = " + (g >= 0 ? "+" : "−") + Math.abs(g).toFixed(2), cx, cy - 2, { a: "center", s: 16, c: g ? col : KC.mute });
      K.t(ctx, "한 바퀴마다 앞 변화 × g", cx, cy + 24, { s: 10.5, a: "center", c: KC.mute });
      K.pill(ctx, "최종 약 " + fin.toFixed(2) + " ℃", cx, H - 14, { a: "center", s: 13, c: fin >= 1.9 ? KC.red : (fin < 1 ? KC.blue : KC.ink) });

      /* ── 오른쪽: 바퀴마다 쌓이는 기온 상승 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 13 });
      K.pill(ctx, "바퀴마다 쌓이는 기온 상승", RX + 14, 28, { s: 13, c: KC.blue });
      var lg = K.pill(ctx, "┄ 수렴 " + fin.toFixed(2) + " ℃", W - 14, 28, { a: "right", s: 11.5, c: KC.violet });
      K.pill(ctx, "┄ 처음 1 ℃", lg.x - 8, 28, { a: "right", s: 11.5, c: KC.yellow });
      var gc = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 8, h: H - 48, x0: 0, x1: 8, y0: 0, y1: 2, xt: 8, yt: 4, xf: function () { return ""; }, yf: function (vv) { return vv.toFixed(1) + " ℃"; } });
      var bw = (gc.X(1) - gc.X(0)) * .62, c0 = g > 0 ? ["#ff8a9c", "#b8324a"] : (g < 0 ? ["#9fe0ff", "#2a6ea8"] : ["#b9c3e6", "#55608a"]);
      rounds.forEach(function (t, i) {
        var bx = gc.X(i + .5) - bw / 2, top = gc.Y(Math.min(t, 2)), bg = ctx.createLinearGradient(0, top, 0, gc.B);
        bg.addColorStop(0, c0[0]); bg.addColorStop(1, c0[1]);
        ctx.save(); ctx.shadowColor = c0[0]; ctx.shadowBlur = 8; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(bx, top, bw, gc.B - top, [5, 5, 0, 0]); ctx.fill(); ctx.restore();
        K.t(ctx, t.toFixed(2), gc.X(i + .5), top - 6, { s: 10.5, a: "center", c: KC.ink });
        K.t(ctx, i === 0 ? "처음" : i + "바퀴", gc.X(i + .5), gc.B + 16, { s: 10.5, a: "center", c: KC.mute });
      });
      clipRect(ctx, gc);
      ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]);
      ctx.strokeStyle = KC.yellow; ctx.beginPath(); ctx.moveTo(gc.L, gc.Y(1)); ctx.lineTo(gc.R, gc.Y(1)); ctx.stroke();
      ctx.strokeStyle = KC.violet; ctx.beginPath(); ctx.moveTo(gc.L, gc.Y(fin)); ctx.lineTo(gc.R, gc.Y(fin)); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
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
    function draw() {
      var L = limit(dT), yl = Y(clamp(L, 33, 39)), la;
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 한반도 ── */
      var LW = 420;
      K.stage(ctx, 0, 0, LW, H, "ocean", { seed: 14 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      ctx.strokeStyle = "rgba(170,200,255,.16)"; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      for (la = 34; la <= 39; la++) { ctx.beginPath(); ctx.moveTo(0, Y(la)); ctx.lineTo(LW, Y(la)); ctx.stroke(); }
      ctx.setLineDash([]);
      land();
      var lgd = ctx.createLinearGradient(0, 0, LW, H); lgd.addColorStop(0, "#3f5c3a"); lgd.addColorStop(1, "#2d4329");
      ctx.fillStyle = lgd; ctx.fill("evenodd");
      ctx.save(); land(); ctx.clip("evenodd");
      var hg = ctx.createLinearGradient(0, yl, 0, H); hg.addColorStop(0, "rgba(63,211,163,.75)"); hg.addColorStop(1, "rgba(63,211,163,.35)");
      ctx.fillStyle = hg; ctx.fillRect(0, yl, LW, H - yl);
      ctx.fillStyle = "rgba(150,170,230,.12)"; ctx.fillRect(0, 0, LW, yl);
      ctx.restore();
      land(); ctx.strokeStyle = "rgba(230,240,210,.55)"; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.save(); ctx.shadowColor = KC.red; ctx.shadowBlur = 10; ctx.strokeStyle = KC.red; ctx.lineWidth = 2.6; ctx.setLineDash([9, 6]);
      ctx.beginPath(); ctx.moveTo(0, yl); ctx.lineTo(LW, yl); ctx.stroke(); ctx.restore();
      ctx.restore();
      for (la = 34; la <= 39; la++) K.t(ctx, la + "°N", LW - 8, Y(la) - 4, { s: 10, a: "right", c: KC.mute });
      dfly(X(129.9), yl - 16);
      K.pill(ctx, "한계선", 10, yl + 5, { s: 11, c: KC.red });
      PLACES.forEach(function (p) {
        var ok = p[1] <= L, x = X(p[2]), y = Y(p[1]);
        if (ok) K.glow(ctx, x, y, 4, "rgba(120,255,200,.95)", 4); else { ctx.fillStyle = "#8a93b5"; ctx.beginPath(); ctx.arc(x, y, 4, 0, 6.2832); ctx.fill(); }
        K.pill(ctx, p[0] + " " + T(p[1], dT).toFixed(1) + " ℃", p[3] === "l" ? x - 10 : x + 10, y + 4, { a: p[3] === "l" ? "right" : "left", s: 11, c: ok ? "#9ff5d2" : "#aab3d6", box: [0, LW - 40] });
      });
      K.pill(ctx, "한반도 · 실잠자리가 살 수 있는 곳", 14, 28, { s: 13, c: KC.blue });
      K.warn(ctx, 14, H - 12, "⚠ 해안선은 단순화한 모양");

      /* ── 오른쪽: 위도에 따른 연평균 기온 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 15 });
      K.pill(ctx, "위도에 따른 연평균 기온", RX + 14, 28, { s: 13, c: KC.blue });
      var lg = K.pill(ctx, "━ +" + dT.toFixed(1) + " ℃", W - 14, 28, { a: "right", s: 11.5, c: KC.orange });
      K.pill(ctx, "┄ 지금(평년)", lg.x - 8, 28, { a: "right", s: 11.5, c: "#c9d3f5" });
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 8, h: H - 48, x0: 33, x1: 39, y0: 10, y1: 20, xt: 6, yt: 5, xl: "위도(°N)", yl: "기온(℃)", xf: function (vv) { return vv + "°"; } });
      clipRect(ctx, g);
      if (L > 33) { ctx.fillStyle = "rgba(63,211,163,.10)"; ctx.fillRect(g.L, g.T, Math.min(g.X(L), g.R) - g.L, g.B - g.T); }
      ctx.strokeStyle = KC.green; ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(g.L, g.Y(TH)); ctx.lineTo(g.R, g.Y(TH)); ctx.stroke(); ctx.setLineDash([]);
      K.plot(ctx, g, [[33, T(33, 0)], [39, T(39, 0)]], "rgba(200,212,255,.6)", { w: 1.6, dash: [5, 5], glow: false });
      K.plot(ctx, g, [[33, T(33, dT)], [39, T(39, dT)]], KC.orange, { w: 3 });
      ctx.restore();
      K.pill(ctx, "실잠자리 월동 기준 " + TH + " ℃", g.R - 6, g.Y(TH) + 20, { a: "right", s: 11, c: KC.green });
      if (L >= 33 && L <= 39) {
        var lx = g.X(L);
        ctx.strokeStyle = "rgba(255,107,129,.8)"; ctx.lineWidth = 1.4; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(lx, g.Y(TH)); ctx.lineTo(lx, g.B); ctx.stroke(); ctx.setLineDash([]);
        K.glow(ctx, lx, g.Y(TH), 4, "rgba(255,140,150,.95)", 4);
        K.pill(ctx, "북위 " + L.toFixed(2) + "°", lx + 8, g.B - 10, { s: 11.5, c: KC.red, box: [RX, W] });
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
    function draw() {
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
