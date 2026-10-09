/* 기후변화와 환경생태 Ⅱ 기후위기와 환경생태 변화 — 실제 자료
   r1 위성이 잰 해수면, 한 해에 몇 mm 오를까 — 1993~2025 지구 평균 해수면
   r2 해수면 상승은 빨라지고 있을까 — 처음 10년과 최근 10년의 속도 비교
   r3 우리 동네 여름 — 2026년 창원 폭염일은 평년(1991~2020)의 몇 배였나
   r4 우리 동네 벚꽃 — 600 °C 법칙으로 진해 개화일 맞히기, 개화 기온과 변인(기상청 창원·서울)
   자료: data/gmsl.js (NOAA 위성 고도계 연구실), data/cw155.js (기상청 창원 155), data/bloom.js */
(function () {
"use strict";
var G = (window.REAL_GMSL || { rows: [] }).rows;                    /* [연도, mm] */
function fit(rows) { var n = rows.length, mx = 0, my = 0, b = 0, q = 0; rows.forEach(function (r) { mx += r[0]; my += r[1]; }); mx /= n; my /= n; rows.forEach(function (r) { b += (r[0] - mx) * (r[1] - my); q += (r[0] - mx) * (r[0] - mx); }); return { b: q ? b / q : 0, mx: mx, my: my }; }
var ALL = fit(G), EARLY = fit(G.filter(function (r) { return r[0] < 2003; })), LATE = fit(G.filter(function (r) { return r[0] >= 2015 && r[0] < 2025; }));
var SRC = "<small>출처: 미국 해양대기청(NOAA) 위성 고도계 연구실(LSA) — TOPEX/Poseidon · Jason-1·2·3 · Sentinel-6 위성이 잰 지구 평균 해수면 편차(계절 변화 뺌), 1993~2025. 사본은 data/gmsl.js.</small>";
var CWD = window.REAL_CW155 || { rows: [], season: [], summer2026: [] }, CR = CWD.rows, S26 = CWD.summer2026 || [];   /* rows: [연도, 평균기온, 폭염일, 열대야, 영하일, 강수, 호우일] */
function cwYear(y) { for (var i = 0; i < CR.length; i++) if (CR[i][0] === y) return CR[i]; return [y, 0, 0, 0, 0, 0, 0]; }
var NORM = (function () { var h = 0, t = 0, n = 0; CR.forEach(function (r) { if (r[0] >= 1991 && r[0] <= 2020) { h += r[2]; t += r[3]; n++; } }); return { hotSum: h, tropSum: t, hot: n ? h / n : 0, trop: n ? t / n : 0 }; })();
var Y24 = cwYear(2024), Y25 = cwYear(2025), Y26 = CWD.y2026 || { hot: 0, trop: 0, jja: 0 }, K26 = NORM.hot ? Y26.hot / NORM.hot : 0;
var JJA = (CWD.season || []).filter(function (r) { return r[1] != null; });
var JJA_N = (function () { var s = 0, n = 0; JJA.forEach(function (r) { if (r[0] >= 1991 && r[0] <= 2020) { s += r[1]; n++; } }); return n ? s / n : 0; })();
var JJA_RANK = JJA.filter(function (r) { return r[1] > Y26.jja; }).length + 1, JJA_TOP = JJA.slice().sort(function (a, b) { return b[1] - a[1]; })[0] || [0, 0];
var SRC3 = "<small>출처: 기상청 날씨누리 과거 관측 일별 자료, 창원(155) 날마다의 최고·최저 기온으로 센 값(2026년은 10월 8일까지). 사본은 data/cw155.js.</small>";
var BL = window.REAL_BLOOM || { cases: [], normalJH: [], coldDays: {} };
function blDay(i) { var t = new Date(Date.UTC(2001, 1, 1) + i * 864e5); return (t.getUTCMonth() + 1) + "월 " + t.getUTCDate() + "일"; }
function blIdx(md) { return Math.round((Date.UTC(2001, +md.slice(0, 2) - 1, +md.slice(3)) - Date.UTC(2001, 1, 1)) / 864e5); }
function blCum(xs, j) { var s = 0; return xs.map(function (r) { s += (j == null ? r : r[j]); return s; }); }
function blReach(cum) { for (var i = 0; i < cum.length; i++) if (cum[i] >= 600) return i; return cum.length - 1; }
BL.cases.forEach(function (c) { c.cum = blCum(c.x, 0); c.rule = blReach(c.cum); c.b = blIdx(c.bloom); var s = 0, t = 0; for (var i = c.b - 10; i < c.b; i++) { s += c.x[i][0]; t += c.x[i][1]; } c.preX = s / 10; c.preT = t / 10; });
var BL_N = blCum(BL.normalJH || []), BL_NR = blReach(BL_N), BL_JH = BL.cases[0] || { rule: 48, b: 51, cum: [], x: [], preX: 16, preT: 10 };
var BL_PRE = BL.cases.map(function (c) { return c.preT; }), BL_PMIN = Math.min.apply(null, BL_PRE.length ? BL_PRE : [10]), BL_PMAX = Math.max.apply(null, BL_PRE.length ? BL_PRE : [10]);
var SRC_BL = "<small>출처: 기온 — 기상청 날씨누리 과거 관측 일별 자료, 창원(155)·서울(108). 개화일 — " + BL.cases.map(function (c) { return c.place.replace(/\(.*\)/, "") + " " + c.y + "년 " + blDay(c.b) + "(" + c.src + ")"; }).join(" · ") + ". 600 °C 법칙은 일본 웨더뉴스가 소개한 도쿄 표본목의 경험칙입니다. 사본은 data/bloom.js.</small>";

function chart(H, ctx, W, CH, lines) {
  H.paper(ctx, W, CH);
  var x0 = 60, x1 = 620, y0 = 24, y1 = CH - 36;
  function X(y) { return x0 + (y - 1992) / 34 * (x1 - x0); }
  function Y(v) { return y1 - (v + 30) / 130 * (y1 - y0); }
  H.axes(ctx, x0, y0, x1, y1);
  [-20, 0, 20, 40, 60, 80, 100].forEach(function (v) { H.text(ctx, v + " mm", x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
  [1995, 2005, 2015, 2025].forEach(function (y) { H.text(ctx, y, X(y), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
  G.forEach(function (r) { H.dot(ctx, X(r[0]), Y(r[1]), 1.6, H.v("--brand")); });
  (lines || []).forEach(function (L) { H.line(ctx, [[X(L[0]), Y(L[2].my + L[3] * (L[0] - L[2].mx))], [X(L[1]), Y(L[2].my + L[3] * (L[1] - L[2].mx))]], H.v(L[4]), 2.5); });
  return { X: X, Y: Y };
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 해수면 상승의 원인과 영향을 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 해수면 상승", title: "위성이 잰 해수면, 한 해에 몇 mm 오를까", short: "해수면 상승",
    who: "🛰️", name: "해양 위성 연구실",
    say: "“1993년부터 인공위성이 레이더로 바다 높이를 재 왔어요. 아래는 <b>지구 평균 해수면</b>이 기준보다 몇 mm 높은지입니다. 직선을 맞춰 <b>한 해에 몇 mm</b> 올랐는지 구해 주세요.”",
    predict: {
      q: "지구 평균 해수면은 한 해에 대략 얼마나 오르고 있을까요?",
      options: ["㉠ 0.03 mm 쯤", "㉡ 3 mm 쯤", "㉢ 30 mm 쯤"],
      answer: 1
    },
    task: "직선의 기울기(한 해 상승량)를 맞추세요(± 0.2 mm/년).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, sl = 1;
      function draw() {
        chart(H, ctx, W, cv.H, [[1993, 2025.3, ALL, sl, "--amber-700"]]);
        H.rows(ctx, 660, 60, [["내 답", sl.toFixed(1) + " mm / 년", null, true], ["30년이면", (sl * 30 / 10).toFixed(1) + " cm"]], 60);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "한 해 해수면 상승량", min: 0, max: 8, step: 0.1, value: 1, fmt: function (x) { return x.toFixed(1) + " mm/년"; }, onInput: function (x) { sl = x; api.changed(); draw(); } });
      api.info("점은 약 열흘마다 잰 값입니다. " + SRC
        + "<div data-link='{\"id\":\"nasa-svs-sealevel\",\"title\":\"NASA — 창문으로 본 해수면 (교과서 연결 자료)\",\"src\":\"NASA 과학 시각화 스튜디오 · 비상교육 기후변화와 환경생태 191쪽\",\"url\":\"https://svs.gsfc.nasa.gov/5114\",\"ask\":\"1993~2022년 동안 둥근 창 너머로 물이 얼마나 차오르는지 영상을 보고, 이 사례에서 구한 상승량(30년에 약 10 cm)과 견주어 한 문장으로 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(sl - ALL.b) <= 0.2 + 1e-9) return { ok: true, msg: "가장 잘 맞는 기울기는 약 " + ALL.b.toFixed(1) + " mm/년 — 30여 년 동안 약 " + Math.round(ALL.b * 32) / 10 + " cm 올랐습니다." };
          return { ok: false, msg: sl.toFixed(1) + " mm/년은 " + (sl < ALL.b ? "너무 완만합니다" : "너무 가파릅니다") + "." };
        }
      };
    },
    hints: ["1993년 약 −20 mm, 2025년 약 +85 mm입니다.", "약 105 mm ÷ 32년 ≈ ?"],
    solution: "약 <b>" + ALL.b.toFixed(1) + " mm/년</b>.",
    why: "해수면이 오르는 까닭은 크게 둘입니다. 바닷물이 데워져 부피가 커지는 <b>열팽창</b>, 그리고 그린란드·남극의 빙상과 산악 빙하가 녹아 바다로 흘러드는 물입니다(바다에 떠 있는 해빙이 녹는 것은 해수면을 거의 바꾸지 않아요).<br>"
      + "한 해 3 mm는 작아 보이지만, 해안의 낮은 땅에서는 폭풍 해일과 겹쳐 침수 피해가 커지고 바닷물이 지하수로 스며듭니다."
  },
  {
    id: "r2", tag: "실제 자료 · 빨라지는 상승", title: "해수면 상승은 빨라지고 있을까", short: "가속",
    who: "📈", name: "기후 분석가",
    say: "“같은 자료를 두 기간으로 나눠 보세요. <b>1993~2002년</b>과 <b>2015~2024년</b> 각각에 직선을 맞추면 기울기가 같을까요? 최근 10년의 상승 속도가 처음 10년의 <b>몇 배</b>인지 구해 주세요.”",
    predict: {
      q: "최근의 해수면 상승 속도는 1990년대보다?",
      options: ["㉠ 느려졌다", "㉡ 비슷하다", "㉢ 빨라졌다"],
      answer: 2
    },
    task: "두 기간의 기울기를 읽고, 최근 속도 ÷ 처음 속도를 슬라이더로 맞추세요(± 0.1 배).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, g = 1;
      function draw() {
        chart(H, ctx, W, cv.H, [[1993, 2002.9, EARLY, EARLY.b, "--teal"], [2015, 2024.9, LATE, LATE.b, "--coral-700"]]);
        H.rows(ctx, 660, 40, [["1993~2002", EARLY.b.toFixed(2) + " mm/년", "--teal-700"], ["2015~2024", LATE.b.toFixed(2) + " mm/년", "--coral-700"], ["내 답 (몇 배)", g.toFixed(1) + " 배", null, true]], 58);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "최근 속도는 처음의 몇 배", min: 0.5, max: 3, step: 0.05, value: 1, fmt: function (x) { return x.toFixed(2) + " 배"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("두 직선은 각 기간 자료만으로 맞춘 것입니다. " + SRC);
      draw();
      return {
        judge: function () {
          var R = LATE.b / EARLY.b;
          if (Math.abs(g - R) <= 0.1 + 1e-9) return { ok: true, msg: LATE.b.toFixed(2) + " ÷ " + EARLY.b.toFixed(2) + " ≈ " + R.toFixed(2) + " 배 — 해수면 상승이 빨라지고 있습니다(가속)." };
          return { ok: false, msg: g.toFixed(2) + " 배는 " + (g < R ? "작습니다" : "큽니다") + ". 최근 기울기를 처음 기울기로 나누세요." };
        }
      };
    },
    hints: ["처음 10년은 약 " + EARLY.b.toFixed(1) + " mm/년, 최근 10년은 약 " + LATE.b.toFixed(1) + " mm/년입니다.", LATE.b.toFixed(1) + " ÷ " + EARLY.b.toFixed(1) + " ≈ ?"],
    solution: "약 <b>" + (LATE.b / EARLY.b).toFixed(2) + " 배</b>.",
    why: "빙상이 녹는 속도가 빨라지고 바다가 흡수하는 열이 늘면서 해수면 상승도 빨라지고 있습니다. 같은 속도로 오른다고 가정한 예측은 실제보다 낮게 나올 수 있다는 뜻입니다. IPCC 제6차 보고서는 배출이 아주 많으면(SSP5-8.5) 2100년 해수면이 1995~2014년보다 약 0.6~1.0 m, 배출을 크게 줄여도(SSP1-2.6) 약 0.3~0.6 m 오를 가능성이 높다고 봅니다(NASA는 초기 위성 오차를 바로잡은 자료로 1993년 약 2.1 mm/년에서 2024년 약 4.4 mm/년으로 두 배 넘게 빨라졌다고 발표했습니다).<br>"
      + "※ 10년 기간의 기울기는 엘니뇨·라니냐 같은 자연 변동에도 흔들립니다. 그래서 과학자들은 더 긴 자료와 여러 방법으로 가속을 확인합니다."
  },
  {
    id: "r3", tag: "실제 자료 · 우리 동네 여름", title: "2026년 창원의 여름은 평년의 몇 배였나", short: "2026 폭염",
    who: "📍", name: "창원기상대(기상청)",
    say: "“기상청은 30년 평균을 <b>평년값</b>이라 부르고, 올해가 보통보다 어땠는지 잴 때 잣대로 씁니다. 아래 빨간 선은 진해와 가까운 <b>창원기상대</b>(마산합포구 가포동)의 <b>2026년 여름 날마다 최고 기온</b>, 회색 선은 1991 ~ 2020년 같은 날 최고 기온의 평균이에요. 올여름 <b>폭염일</b>(낮 최고 33 °C 이상)은 평년의 몇 배였는지 구해 주세요.”",
    predict: {
      q: "평년보다 훨씬 더운 여름이 한 번 온 것을 두고 할 수 있는 말로 가장 알맞은 것은?",
      options: ["㉠ 한 해만 보고도 기후가 바뀌었다고 단정할 수 있다", "㉡ 한 해는 날씨의 들쭉날쭉일 수 있으니, 그런 해가 얼마나 자주 오는지 긴 기간을 보아야 한다", "㉢ 평년값은 오래된 숫자라 비교할 필요가 없다"],
      answer: 1
    },
    task: "표로 평년 폭염일을 구한 뒤 <b>2026년 폭염일 ÷ 평년 폭염일</b>을 슬라이더로 맞추세요(± 0.2 배).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, k = 1.0;
      var x0 = 50, x1 = 640, y0 = 24, y1 = 262, n = S26.length || 1;
      function X(i) { return x0 + i / (n - 1) * (x1 - x0); }
      function Y(t) { return y1 - (t - 18) / 24 * (y1 - y0); }
      function draw() {
        H.paper(ctx, W, cv.H); H.axes(ctx, x0, y0, x1, y1);
        [20, 25, 30, 35, 40].forEach(function (t) { H.text(ctx, t + "°", x0 - 8, Y(t) + 4, { s: 10, a: "right", c: H.v("--mist") }); H.dash(ctx, x0, Y(t), x1, Y(t), H.v("--line"), 0.6); });
        H.dash(ctx, x0, Y(33), x1, Y(33), H.v("--amber-700"), 1.6);
        H.text(ctx, "33 °C", x1 - 4, Y(33) - 5, { s: 11, w: "800", a: "right", c: H.v("--amber-700") });
        S26.forEach(function (r, i) { if (r[0].slice(3) === "01") H.text(ctx, +r[0].slice(0, 2) + "월", X(i) + 4, y1 + 15, { s: 10, c: H.v("--mist") }); });
        H.line(ctx, S26.map(function (r, i) { return [X(i), Y(r[3])]; }), H.v("--mist"), 2);
        H.line(ctx, S26.map(function (r, i) { return [X(i), Y(r[1])]; }), H.v("--coral-700"), 1.8);
        var top = 0; S26.forEach(function (r, i) { if (r[1] >= 33) H.dot(ctx, X(i), Y(r[1]), 2.6, H.v("--coral-700")); if (r[1] > S26[top][1]) top = i; });
        if (S26.length) H.text(ctx, (+S26[top][0].slice(0, 2)) + "월 " + (+S26[top][0].slice(3)) + "일 " + S26[top][1] + " °C", X(top) + 8, Y(S26[top][1]) + 2, { s: 11, w: "800", c: H.v("--coral-700") });
        H.text(ctx, "최고 기온 (°C)", x0 + 6, y0 - 8, { s: 11, w: "700", c: H.v("--mist") });
        H.rows(ctx, 680, 34, [["2026년 폭염일", Y26.hot + "일", "--coral-700"], ["2026년 열대야", Y26.trop + "일", "--brand"], ["평년 폭염일", "아래 표로 구하세요", "--mist"], ["내 답 (몇 배)", k.toFixed(1) + " 배", null, true]], 54);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "2026년 ÷ 평년", min: 1, max: 5, step: 0.1, value: 1, fmt: function (x) { return x.toFixed(1) + " 배"; }, onInput: function (x) { k = x; api.changed(); draw(); } });
      var tb = "<table style='border-collapse:collapse;margin:6px 0;font-size:13px' cellpadding='4' border='1'><tr><th>1991~2020</th><th>폭염일 합</th><th>열대야 합</th></tr><tr><td>30년</td><td>" + NORM.hotSum + "일</td><td>" + NORM.tropSum + "일</td></tr></table>";
      api.info("평년값 = 30년 동안의 합 ÷ 30. 빨간 점이 33 °C를 넘은 날입니다. " + tb + SRC3
        + "<div data-link='{\"id\":\"kma-cw155\",\"title\":\"창원 과거 관측 일별 자료\",\"src\":\"기상청 날씨누리\",\"url\":\"https://www.weather.go.kr/w/weather/land/past-obs/obs-by-day.do?stn=155&obs=1\",\"ask\":\"2026년 8월을 골라 최저 기온이 25 °C 이상인 밤(열대야)이 며칠인지 세어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(k - K26) <= 0.2) return { ok: true, msg: "평년 " + NORM.hot.toFixed(1) + "일 → 2026년 " + Y26.hot + "일, 약 " + K26.toFixed(1) + " 배입니다. 열대야도 " + NORM.trop.toFixed(1) + "일 → " + Y26.trop + "일로 약 " + (Y26.trop / NORM.trop).toFixed(1) + " 배였습니다." };
          return { ok: false, msg: k.toFixed(1) + " 배는 " + (k < K26 ? "적습니다" : "많습니다") + ". 먼저 30년 합을 30으로 나눠 평년값을 구하세요." };
        }
      };
    },
    hints: ["평년 폭염일 = " + NORM.hotSum + " ÷ 30", Y26.hot + " ÷ (평년 폭염일) = ?"],
    solution: "평년 " + NORM.hotSum + " ÷ 30 ≈ " + NORM.hot.toFixed(1) + "일, 2026년 " + Y26.hot + "일 → <b>약 " + K26.toFixed(1) + " 배</b>.",
    why: "2026년 창원의 여름(6 ~ 8월) 평균 기온은 " + Y26.jja.toFixed(1) + " °C로 평년(" + JJA_N.toFixed(1) + " °C)보다 " + (Y26.jja - JJA_N).toFixed(1) + " °C 높았고, 1986년 이후 " + JJA_RANK + "번째로 더웠습니다" + (JJA_RANK > 1 ? "(가장 더웠던 여름은 " + JJA_TOP[0] + "년 " + JJA_TOP[1].toFixed(1) + " °C)" : "") + ". 폭염일과 열대야는 모두 7 ~ 8월에 몰렸고, 7월 29일 ~ 8월 2일 닷새는 내내 38.5 °C를 넘었으며 8월 1일 <b>40.4 °C</b>는 1985년 관측을 시작한 뒤 가장 높은 기온입니다.<br>"
      + "한 해만 이랬다면 날씨의 들쭉날쭉일 수도 있습니다. 그런데 2024년 폭염일 " + Y24[2] + "일, 2025년 " + Y25[2] + "일, 2026년 " + Y26.hot + "일로 평년의 두 배 넘는 여름이 세 해 이어졌습니다. 그런 해가 잦아진다는 것이 기후가 바뀌고 있다는 신호입니다.<br>"
      + "열대야는 밤에도 몸이 식지 못하게 해 온열 질환의 위험을 키우고, 폭염은 사람뿐 아니라 가축·농작물·바닷가 생물에게도 스트레스가 됩니다. ※ 평년값도 고정된 것이 아닙니다. 기상청은 10년마다 평년값을 새로 계산하는데, 더운 해가 쌓이면 ‘보통’의 기준 자체가 올라갑니다."
  },
  {
    id: "r4", tag: "실제 자료 · 우리 동네 벚꽃", title: "진해 벚꽃은 몇 °C에 필까", short: "벚꽃 기온",
    who: "🌸", name: "창원기상대 벚꽃 관측",
    say: "“창원기상대는 해마다 진해 여좌천 로망스다리 위쪽 벚나무 세 그루를 지켜보다가, 한 가지에 꽃이 세 송이 넘게 피면 ‘개화’라고 발표합니다. 2026년에는 <b>3월 24일</b>이었어요. 기상학자들이 쓰는 어림법이 있습니다. <b>2월 1일부터 날마다 낮 최고 기온을 더해 600 °C쯤 되면 벚꽃이 핀다</b>는 ‘600 °C 법칙’이에요. 진해의 2026년 기온으로 600 °C가 되는 날을 찾아, 실제 개화일과 맞는지 따져 주세요.”",
    predict: {
      q: "벚꽃이 필 무렵(피기 전 열흘) 하루 평균 기온은 대략 몇 °C였을까요?",
      options: ["㉠ 약 5 °C — 아직 쌀쌀할 때 핀다", "㉡ 약 10 °C — 낮에는 15 °C를 넘는 봄날", "㉢ 약 20 °C — 초여름 같은 날씨"],
      answer: 1
    },
    task: "날짜를 옮겨 <b>진해 2026년의 누적 낮 최고 기온이 600 °C에 이르는 날</b>을 찾으세요(± 1일). 위 단추로 다른 해·다른 곳도 견주어 볼 수 있습니다.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, day = blIdx("03-01"), sel = 0;
      var x0 = 60, x1 = 640, y0 = 24, y1 = 262, n = (BL_JH.x || []).length || 69;
      function X(i) { return x0 + i / (n - 1) * (x1 - x0); }
      function Y(v) { return y1 - v / 900 * (y1 - y0); }
      function draw() {
        var c = BL.cases[sel] || BL_JH;
        H.paper(ctx, W, cv.H); H.axes(ctx, x0, y0, x1, y1);
        [0, 200, 400, 600, 800].forEach(function (v) { H.text(ctx, v + "°", x0 - 8, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); H.dash(ctx, x0, Y(v), x1, Y(v), H.v("--line"), 0.5); });
        H.dash(ctx, x0, Y(600), x1, Y(600), H.v("--amber-700"), 1.6);
        H.text(ctx, "600 °C", x0 + 6, Y(600) - 6, { s: 11, w: "800", c: H.v("--amber-700") });
        ["02-01", "02-15", "03-01", "03-15", "04-01"].forEach(function (md) { var i = blIdx(md); H.text(ctx, blDay(i), X(i), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
        H.text(ctx, "2월 1일부터 더한 낮 최고 기온", x0 + 6, y0 - 8, { s: 11, w: "700", c: H.v("--mist") });
        if (sel < 2 && BL_N.length) H.line(ctx, BL_N.map(function (v, i) { return [X(i), Y(v)]; }), H.v("--mist"), 2);
        H.line(ctx, c.cum.map(function (v, i) { return [X(i), Y(v)]; }), H.v("--coral-700"), 2.5);
        H.dash(ctx, X(day), y0, X(day), y1, H.v("--brand"), 1.4);
        H.dot(ctx, X(day), Y(c.cum[day]), 5, H.v("--brand"));
        var shown = api.isDone ? api.isDone() : false;
        if (sel > 0 || shown || Math.abs(day - BL_JH.rule) <= 1) { H.text(ctx, "🌸", X(c.b) - 8, Y(c.cum[c.b]) - 6, { s: 16 }); H.text(ctx, "실제 개화 " + blDay(c.b), X(c.b) + 10, Y(c.cum[c.b]) + 16, { s: 11, w: "800", c: H.v("--coral-700") }); }
        H.rows(ctx, 680, 34, [[c.place + " " + c.y + "년", "", "--coral-700"], ["고른 날 " + blDay(day), Math.round(c.cum[day]) + " °C", null, true], ["그날까지 날 수", (day + 1) + "일"], [sel < 2 ? "회색 = 평년(1991~2020)" : "", sel < 2 ? "평년엔 " + blDay(BL_NR) + "쯤 600" : ""]], 50);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "어느 해·어디", options: BL.cases.map(function (c, i) { return { v: i, t: c.place.replace(/\(.*\)/, "") + " " + c.y }; }), value: 0, onPick: function (v) { sel = +v; draw(); } });
      api.slider({ label: "날짜", min: blIdx("02-20"), max: n - 1, step: 1, value: day, fmt: function (i) { return blDay(i); }, onInput: function (i) { day = i; api.changed(); draw(); } });
      var tb = "<table style='border-collapse:collapse;margin:6px 0;font-size:13px' cellpadding='4' border='1'><tr><th>곳·해</th><th>600 °C 되는 날</th><th>실제 개화</th><th>피기 전 열흘 평균 기온</th><th>그 열흘 낮 최고 평균</th></tr>"
        + BL.cases.map(function (c, i) { return "<tr><td>" + c.place.replace(/\(.*\)/, "") + " " + c.y + "</td><td>" + (i ? blDay(c.rule) : "?") + "</td><td>" + blDay(c.b) + "</td><td>" + c.preT.toFixed(1) + " °C</td><td>" + c.preX.toFixed(1) + " °C</td></tr>"; }).join("") + "</table>";
      api.info("빨간 선은 2월 1일부터 그날까지 낮 최고 기온을 더한 값입니다. 파란 세로선을 옮겨 600 °C 선과 만나는 날을 찾으세요. " + tb + SRC_BL
        + "<div data-link='{\"id\":\"kma-cw155-mar\",\"title\":\"창원 2026년 3월 일별 기온\",\"src\":\"기상청 날씨누리\",\"url\":\"https://www.weather.go.kr/w/weather/land/past-obs/obs-by-day.do?stn=155&yy=2026&mm=3&obs=1\",\"ask\":\"3월 14일 ~ 23일(개화 전 열흘)의 평균 기온을 찾아 평균을 내 보세요. 표의 값과 같나요?\"}'></div>");
      draw();
      return {
        judge: function () {
          var c = BL_JH;
          if (Math.abs(day - c.rule) <= 1) return { ok: true, msg: "2026년 진해는 " + blDay(c.rule) + "에 600 °C를 넘었고, 실제 개화는 " + blDay(c.b) + "로 " + (c.b - c.rule) + "일 차이입니다. 평년 기온이었다면 " + blDay(BL_NR) + "쯤이었을 테니, 따뜻한 봄 덕분에 며칠 일찍 핀 셈입니다." };
          return { ok: false, msg: blDay(day) + "까지의 합은 " + Math.round(c.cum[day]) + " °C로 " + (c.cum[day] < 600 ? "아직 600 °C에 못 미칩니다. 뒤로 옮기세요." : "이미 600 °C를 넘었습니다. 처음 넘는 날을 찾으세요.") };
        }
      };
    },
    hints: ["빨간 선과 주황 점선(600 °C)이 처음 만나는 곳의 날짜를 읽으세요.", "단추가 ‘진해 2026’인지 먼저 확인하세요."],
    solution: "진해 2026년은 <b>" + blDay(BL_JH.rule) + "</b>에 600 °C를 넘었습니다(실제 개화 " + blDay(BL_JH.b) + ").",
    why: "네 경우 모두 600 °C 법칙이 실제 개화일과 사흘 안으로 맞았고, 피기 전 열흘의 하루 평균 기온은 " + BL_PMIN.toFixed(1) + " ~ " + BL_PMAX.toFixed(1) + " °C, 낮 최고는 16 ~ 18 °C였습니다. <b>낮에는 15 °C를 넘고 하루 평균이 10 °C쯤인 날</b>이 이어질 때 벚꽃이 핀다고 기억하면 됩니다. 진해의 3월 평년 낮 최고 기온은 13.8 °C이고, 2026년 3월은 15.2 °C였습니다.<br>"
      + "<b>개화에 영향을 주는 변인</b><br>"
      + "① <b>봄 기온(가장 큼)</b> — 2 ~ 3월이 따뜻할수록 일찍 핍니다. 600 °C 법칙이 바로 이 변인을 잰 것입니다.<br>"
      + "② <b>겨울 추위</b> — 벚나무 꽃눈은 겨울 동안 충분히 추위를 겪어야 잠(휴면)에서 깹니다. 그래서 겨울이 너무 따뜻하면 오히려 늦어질 수도 있습니다. 2025 ~ 26년 겨울 창원에서 하루 평균 5 °C 이하인 날은 " + BL.coldDays["2026"] + "일로 평년(" + BL.coldDays.normal + "일)보다 적었지만, 봄이 따뜻해 일찍 피었습니다.<br>"
      + "③ <b>위도</b> — 2026년 서울은 3월 29일로 진해보다 닷새 늦었습니다. 남쪽일수록 봄 기온이 빨리 쌓이기 때문입니다.<br>"
      + "④ <b>같은 동네 안의 차이(미기후)</b> — 2026년 4월 3일 여좌천은 만개했는데 경화역은 아직 절정이 아니었습니다(경향신문). 햇볕이 드는 정도, 바람, 둘레의 건물·물에 따라 나무가 느끼는 기온이 다릅니다. 그래서 기상청은 정해 둔 같은 나무(표준목)만 관측합니다.<br>"
      + "⑤ <b>낮 길이</b> — 해마다 같은 날의 낮 길이는 같습니다. 그런데 서울의 개화일은 2023년 3월 25일, 2025년 4월 4일로 열흘이나 달랐습니다. 해마다 같은 낮 길이로는 이런 차이를 설명할 수 없으니, 벚꽃의 날짜를 주로 정하는 것은 낮 길이가 아니라 기온입니다.<br>"
      + "⑥ <b>비와 바람</b> — 피는 날보다는 꽃이 지는 날에 더 큰 영향을 줍니다.<br>"
      + "※ 600 °C 법칙은 도쿄 표본목에서 얻은 어림법이라 늘 맞지는 않습니다. 개화 직전이 추우면 크게 어긋나서, 2024년 도쿄에서는 11일이나 틀렸습니다(웨더뉴스)."
  }
  ]
});
})();
