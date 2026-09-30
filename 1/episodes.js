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
      paper(ctx, W, H);
      var x0 = 60, x1 = W - 30, y0 = 40, y1 = H - 46, s = series(win);
      function Y(t) { return y1 - (t + 5) / 35 * (y1 - y0); }
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      [0, 10, 20, 30].forEach(function (t) { text(ctx, t + " ℃", x0 - 8, Y(t) + 4, { s: 10.5, c: v("--mist"), a: "right" }); });
      for (var yr = 0; yr <= 10; yr += 2) text(ctx, yr + "년", x0 + yr / 10 * (x1 - x0), y1 + 18, { s: 10.5, c: v("--mist"), a: "center" });
      ctx.strokeStyle = v("--mist"); ctx.globalAlpha = .4; ctx.lineWidth = 1; ctx.beginPath();
      for (var p = 0; p < 400; p++) { var xx = x0 + p / 400 * (x1 - x0), yy = Y(daily[Math.floor(p / 400 * N)]); if (p) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
      ctx.stroke(); ctx.globalAlpha = 1;
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 2.6; ctx.beginPath();
      s.forEach(function (val, k) { var xx = x0 + k / 400 * (x1 - x0), yy = Y(val); if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); });
      ctx.stroke();
      var d = sd(s);
      text(ctx, "회색: 매일의 기온(날씨)  ·  주황: " + win + "일 평균", x0 + 10, 24, { s: 12.5, w: "800" });
      text(ctx, "변동 폭(표준 편차) " + d.toFixed(2) + " ℃", x1, 24, { s: 13, w: "900", a: "right", c: d < 0.5 ? v("--green-700") : v("--coral-700") });
      return d;
    }
    function update() {
      var d = draw();
      $("avg-info").innerHTML = win === 1
        ? "평균 기간 <b>1일</b> — 매일의 기온 그대로, 곧 <b>날씨</b>입니다. 변동 폭이 약 <b>" + rawSd.toFixed(1) + " ℃</b> 로 큽니다."
        : "평균 기간 <b>" + win + "일</b> — 변동 폭 <b>" + d.toFixed(2) + " ℃</b>. " + (win < 300 ? "짧은 변동은 사라졌지만 여름·겨울의 큰 물결(계절 변화)은 남아 있습니다." : (d < 0.5 ? "계절 변화까지 지워져 거의 평평합니다. 실제 기후는 이보다 훨씬 긴 <b>30년(약 10,950일)</b> 평균을 씁니다." : "1년의 배수에서 조금 벗어나면 계절의 흔적이 다시 나타납니다."));
      var ch = false;
      if (win === 1 && !got.a) { got.a = ch = true; }
      if (win <= 400 && d < 0.5 && !got.b) { got.b = ch = true; got.w = win; }
      if (ch) { window.sthState("avgGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.b) done("m1-2b");
      if (got.a && got.b) { window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>약 <b>1년(" + (got.w || 365) + "일)</b> 을 평균하면 계절 변화까지 지워집니다. 날씨는 날마다 크게 변하지만, 여러 해를 평균한 <b>기후</b>는 거의 변하지 않는 기준값이 됩니다."); ep.clear(1); }
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
    function draw() {
      paper(ctx, W, H);
      var r = clim(), x0 = 70, x1 = 560, y0 = 40, y1 = H - 44;
      function Y(t) { return y1 - (t + 30) / 65 * (y1 - y0); }
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      [-30, -15, 0, 15, 30].forEach(function (t) { text(ctx, t + " ℃", x0 - 8, Y(t) + 4, { s: 10.5, c: v("--mist"), a: "right" }); ctx.globalAlpha = .3; ctx.beginPath(); ctx.moveTo(x0, Y(t)); ctx.lineTo(x1, Y(t)); ctx.stroke(); ctx.globalAlpha = 1; });
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 3; ctx.beginPath();
      for (var m = 0; m <= 12; m += 0.1) {
        var T = r.mean - (r.rng / 2) * Math.cos(2 * Math.PI * m / 12), xx = x0 + 20 + m / 12 * (x1 - x0 - 40);
        if (m === 0) ctx.moveTo(xx, Y(T)); else ctx.lineTo(xx, Y(T));
      }
      ctx.stroke();
      ["1월", "4월", "7월", "10월", "1월"].forEach(function (s, k) { text(ctx, s, x0 + 20 + k * 3 / 12 * (x1 - x0 - 40), y1 + 18, { s: 10.5, c: v("--mist"), a: "center" }); });
      text(ctx, "가상 도시의 월평균 기온", x0 + 8, 26, { s: 12.5, w: "800" });
      /* 오른쪽 수치판 */
      var rx = 610;
      text(ctx, "북위 " + lat + "° · " + CN[cur] + " · 해안에서 " + cont + "%", rx, 50, { s: 12, w: "800", c: v("--mist") });
      text(ctx, "1월 평균", rx, 92, { s: 12, c: v("--mist") });
      text(ctx, r.jan.toFixed(1) + " ℃", rx, 120, { s: 22, w: "900", c: r.jan < 0 ? v("--brand-700") : v("--coral-700") });
      text(ctx, "7월 평균", rx, 156, { s: 12, c: v("--mist") });
      text(ctx, r.jul.toFixed(1) + " ℃", rx, 184, { s: 22, w: "900" });
      text(ctx, "연교차", rx, 220, { s: 12, c: v("--mist") });
      text(ctx, r.rng.toFixed(1) + " ℃", rx, 248, { s: 22, w: "900", c: v("--violet") });
      text(ctx, r.jan >= 5 && r.rng <= 12 ? "🌴 야자나무가 겨울을 날 만함" : (r.jan <= -15 ? "❄️ 혹독한 겨울" : ""), rx, 290, { s: 13, w: "800", c: v("--green-700") });
      return r;
    }
    function update() {
      var r = draw(), inLat = lat >= 45 && lat <= 55, ch = false;
      $("cl-info").innerHTML = "바다는 육지보다 천천히 데워지고 천천히 식어 겨울을 덜 춥게, 여름을 덜 덥게 만듭니다. 난류는 연안을 데우고 한류는 식힙니다. " + (inLat ? "" : "<b>미션은 북위 45~55° 에서 판정합니다.</b>");
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
    update(); mission();
  })();

  /* 장면 5 — 결말 */
  function finish() { window.sthState("r1", "해결 · " + (window.sthState("climBest") || "기후인자로 두 도시 재현")); }
  function vs() {
    var p = window.sthState("p1") || "";
    $("e1-vs").innerHTML = "<b>나의 첫 추리</b> " + (p || "기록 없음") + "<br>" +
      (p.indexOf("㉢") === 0 ? "처음부터 정확했습니다. 이제 평균 기온 자료와 모형으로 증거까지 갖췄습니다." : "하루의 날씨나 위도만으로는 설명되지 않았지요. 30년 평균(기후)과 기후인자를 함께 봐야 합니다.");
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
    function draw() {
      paper(ctx, W, H);
      var ab = absorb(A), full = absorb(TOT);
      /* 북극해 원 */
      var cx = 190, cy = 175, R = 130;
      ctx.fillStyle = v("--brand-700"); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      var r = R * Math.sqrt(A / TOT);
      ctx.fillStyle = "#f4f8fb"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      text(ctx, "북극해 (위에서 본 모습)", cx, 30, { s: 12.5, w: "800", a: "center" });
      text(ctx, "해빙 " + A.toFixed(1) + " · 바다 " + (TOT - A).toFixed(1) + " (백만 km²)", cx, H - 12, { s: 11.5, a: "center", c: v("--mist") });
      /* 막대 */
      var bx = 400, bw = 440;
      text(ctx, "햇빛 100 가운데 북극해가 흡수하는 양", bx, 60, { s: 12.5, w: "800" });
      ctx.fillStyle = v("--card-2"); ctx.fillRect(bx, 76, bw, 30);
      ctx.fillStyle = v("--coral"); ctx.fillRect(bx, 76, bw * ab, 30);
      text(ctx, Math.round(ab * 100) + "", bx + bw * ab - 8, 97, { s: 15, w: "900", a: "right", c: v("--on-accent") });
      text(ctx, "반사되어 우주로 돌아가는 양 " + Math.round((1 - ab) * 100), bx, 130, { s: 12, c: v("--mist") });
      text(ctx, "모두 얼음일 때(흡수 " + Math.round(full * 100) + ")보다", bx, 180, { s: 12.5, c: v("--mist") });
      text(ctx, "× " + (ab / full).toFixed(2) + " 배 흡수", bx, 214, { s: 24, w: "900", c: v("--coral-700") });
      text(ctx, "반사율: 해빙 약 60% · 바닷물 약 6%", bx, 262, { s: 11.5, c: v("--mist") });
      return ab;
    }
    function update() {
      var ab = draw(), ch = false;
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
      why: ["결과(흡수 증가)가 원인(기온 상승·얼음 감소)을 다시 키우는 <b>양의 되먹임</b>입니다.", "더 많이 흡수하면 더 따뜻해집니다. 얼음이 다시 얼 까닭이 없어요.", "막대가 움직이는 것을 보았지요? 얼음 면적이 흡수량을 바꾸고, 흡수량이 기온을 바꿉니다."],
      onDone: function () { got.q = true; window.sthState("iceGot", got); mission(); }
    });
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
    function draw() {
      paper(ctx, W, H);
      var g = gain(), rounds = [], add = 1, tot = 0, k;
      for (k = 0; k < 8; k++) { tot += add; rounds.push(tot); add *= g; }
      var fin = 1 / (1 - g), x0 = 70, x1 = W - 40, y0 = 50, y1 = H - 50;
      function Y(t) { return y1 - t / 2.2 * (y1 - y0); }
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      [0, 1, 2].forEach(function (t) { text(ctx, t + " ℃", x0 - 8, Y(t) + 4, { s: 10.5, c: v("--mist"), a: "right" }); });
      ctx.strokeStyle = v("--amber"); ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(x0, Y(1)); ctx.lineTo(x1, Y(1)); ctx.stroke(); ctx.setLineDash([]);
      var bw = (x1 - x0) / 8 - 16;
      rounds.forEach(function (t, i) {
        var bx = x0 + 10 + i * (bw + 16);
        ctx.fillStyle = g > 0 ? v("--coral") : (g < 0 ? v("--teal") : v("--mist"));
        ctx.fillRect(bx, Y(t), bw, y1 - Y(t));
        text(ctx, i === 0 ? "처음" : i + "바퀴", bx + bw / 2, y1 + 18, { s: 10.5, c: v("--mist"), a: "center" });
        text(ctx, t.toFixed(2), bx + bw / 2, Y(t) - 6, { s: 10.5, w: "800", a: "center" });
      });
      text(ctx, "고리를 돌 때마다 쌓이는 기온 상승 (처음 CO₂ 효과 1 ℃)", x0, 26, { s: 12.5, w: "800" });
      text(ctx, "최종 약 " + fin.toFixed(2) + " ℃", x1, 26, { s: 15, w: "900", a: "right", c: fin >= 1.9 ? v("--rose-700") : (fin < 1 ? v("--teal-700") : v("--ink")) });
      return { g: g, fin: fin };
    }
    function update() {
      var r = draw(), ch = false;
      var names = LOOPS.filter(function (L) { return on[L.id]; }).map(function (L) { return L.t.replace(/^\S+\s/, ""); });
      $("fb-info").innerHTML = (names.length ? "켠 고리: " + names.join(", ") + " → 합친 되먹임 <b>" + (r.g >= 0 ? "+" : "") + r.g.toFixed(2) + "</b>, 최종 기온 상승 <b>" + r.fin.toFixed(2) + " ℃</b>. " : "아직 켠 고리가 없습니다. 처음 1 ℃ 가 그대로입니다. ") +
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
        { t: "기온이 올라 구름이 늘고, 늘어난 구름이 햇빛을 더 반사해 기온이 다시 내려간다", a: "n", why: "결과가 처음 원인을 약화합니다." },
        { t: "영구 동토층이 녹으며 메테인이 나와 온실 효과가 커지고 기온이 더 오른다", a: "p", why: "메테인도 온실 기체입니다." },
        { t: "해빙이 녹아 어두운 바다가 드러나 햇빛 흡수가 늘고 얼음이 더 빨리 녹는다", a: "p", why: "방금 반사율 실험에서 본 고리입니다." },
        { t: "산불로 늘어난 에어로졸이 햇빛을 반사해 기온 상승이 억제된다", a: "n", why: "반사가 늘어 기온 상승을 누릅니다.", hint: "산불 자체가 아니라, 늘어난 에어로졸이 무엇을 하는지 보세요." },
        { t: "기온이 오르고 이산화 탄소가 늘자 식물의 광합성이 활발해져 이산화 탄소를 더 흡수한다", a: "n", why: "온실 기체를 줄여 처음 원인을 약화합니다." }
      ],
      onDone: function () { got.s = true; window.sthState("fbGot", got); mission(); }
    });
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
    var PLACES = [["제주", 33.5], ["부산", 35.1], ["광주", 35.2], ["대전", 36.35], ["서울·경기", 37.5], ["춘천", 37.9], ["휴전선 부근", 38.3]];
    function Y(lat) { return 350 - (lat - 33) / 6 * 320; }
    function draw() {
      paper(ctx, W, H);
      var L = limit(dT), yl = Y(clamp(L, 33, 39));
      ctx.fillStyle = v("--green"); ctx.globalAlpha = .18; ctx.fillRect(60, yl, 420, 350 - yl); ctx.globalAlpha = 1;
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(60, 30); ctx.lineTo(60, 350); ctx.stroke();
      for (var la = 33; la <= 39; la++) { text(ctx, la + "°N", 52, Y(la) + 4, { s: 10.5, c: v("--mist"), a: "right" }); ctx.globalAlpha = .25; ctx.beginPath(); ctx.moveTo(60, Y(la)); ctx.lineTo(480, Y(la)); ctx.stroke(); ctx.globalAlpha = 1; }
      PLACES.forEach(function (p, k) {
        var ok = p[1] <= L, y = Y(p[1]);
        ctx.fillStyle = ok ? v("--green-700") : v("--mist"); ctx.beginPath(); ctx.arc(120 + (k % 2) * 160, y, 6, 0, Math.PI * 2); ctx.fill();
        text(ctx, (ok ? "🪰 " : "") + p[0] + " " + T(p[1], dT).toFixed(1) + " ℃", 132 + (k % 2) * 160, y + 4, { s: 11.5, w: ok ? "800" : "500", c: ok ? v("--green-700") : v("--mist") });
      });
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 3; ctx.setLineDash([8, 5]); ctx.beginPath(); ctx.moveTo(60, yl); ctx.lineTo(480, yl); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "서식 한계선 북위 " + L.toFixed(2) + "°", 478, yl - 8, { s: 12, w: "900", a: "right", c: v("--coral-700") });
      var rx = 540;
      text(ctx, "연평균 기온 " + TH + " ℃ 선 = 서식 한계선", rx, 60, { s: 12.5, w: "800" });
      text(ctx, "기온 상승", rx, 110, { s: 12, c: v("--mist") });
      text(ctx, "+" + dT.toFixed(1) + " ℃", rx, 142, { s: 26, w: "900", c: v("--coral-700") });
      text(ctx, "한계선이 북쪽으로 옮겨 간 거리", rx, 190, { s: 12, c: v("--mist") });
      text(ctx, "약 " + Math.round((L - limit(0)) * 111) + " km", rx, 222, { s: 22, w: "900" });
      text(ctx, "(위도 1° ≈ 111 km)", rx, 246, { s: 11, c: v("--mist") });
      return L;
    }
    function update() {
      var L = draw();
      $("map-info").innerHTML = "위도 1°마다 약 0.8 ℃ 낮아지므로, 전체 기온이 0.8 ℃ 오르면 같은 기온의 선이 북쪽으로 약 1° (약 111 km) 옮겨 갑니다. 지금 한계선은 <b>북위 " + L.toFixed(2) + "°</b> 입니다.";
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
    function draw() {
      paper(ctx, W, H);
      var r = calc();
      /* 바다와 모듈 */
      ctx.fillStyle = v("--brand"); ctx.globalAlpha = .25; ctx.fillRect(0, 200, 470, H - 200); ctx.globalAlpha = 1;
      var cx = 240, cy = 150, R = 120, a0 = -Math.PI / 2;
      [[s, "--amber", "☀️ 태양광"], [f, "--green", "🥬 농장"], [Math.max(0, r.h), "--violet", "🏘️ 주거"]].forEach(function (p) {
        if (p[0] <= 0) return;
        var a1 = a0 + Math.min(p[0], 100) / 100 * Math.PI * 2;
        ctx.fillStyle = v(p[1]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.fill();
        var am = (a0 + a1) / 2;
        if (p[0] >= 6) text(ctx, p[2], cx + Math.cos(am) * R * .62, cy + Math.sin(am) * R * .62 + 4, { s: 11.5, w: "900", a: "center", c: v("--on-accent") });
        a0 = a1;
      });
      text(ctx, "해상 도시 한 모듈 (위에서 본 모습)", cx, 22, { s: 12.5, w: "800", a: "center" });
      if (r.h < 0) text(ctx, "⚠️ 면적 합이 100%를 넘었습니다", cx, 300, { s: 12.5, w: "800", a: "center", c: v("--rose-700") });
      var rx = 520, rows = [
        ["⚡ 전력 자급률", Math.round(r.pow) + "%", r.pow >= 100],
        ["🥬 채소 자급률", Math.round(r.food) + "%", r.food >= 60],
        ["🏘️ 살 수 있는 주민", Math.round(r.people).toLocaleString() + "명", r.people >= 12000]
      ];
      rows.forEach(function (w, k) {
        text(ctx, w[0], rx, 60 + k * 80, { s: 12.5, w: "800", c: v("--mist") });
        text(ctx, w[1] + (w[2] ? "  ✅" : "  ✗"), rx, 92 + k * 80, { s: 22, w: "900", c: w[2] ? v("--green-700") : v("--rose-700") });
      });
      text(ctx, "기준: 전력 100% · 채소 60% · 주민 12,000명", rx, 300, { s: 11, c: v("--mist") });
      return r;
    }
    function update() {
      var r = draw(), ok = r.pow >= 100 && r.food >= 60 && r.people >= 12000 && r.h >= 0;
      $("city-info").innerHTML = "태양광 1% 마다 전력 약 3.3%, 농장 1% 마다 채소 3%, 남은 면적 1% 마다 주민 300명이 살 수 있다고 가정했습니다. 한쪽을 늘리면 다른 쪽이 줄어듭니다.";
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
    { key: "rLab", label: "응용 실험실" }
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
    { key: "rLab", label: "응용 실험실" }
  ],
  line: { id: "all", label: "세 사건을 꿰는 한 문장" }
});

})();
