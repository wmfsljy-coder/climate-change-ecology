/* 기후변화와 환경생태 Ⅱ 기후위기와 환경생태 변화 — 실제 자료
   r1 위성이 잰 해수면, 한 해에 몇 mm 오를까 — 1993 ~ 2025 지구 평균 해수면
   r2 해수면 상승은 빨라지고 있을까 — 처음 10년과 최근 10년의 속도 비교
   자료: data/gmsl.js (NOAA 위성 고도계 연구실) */
(function () {
"use strict";
var G = (window.REAL_GMSL || { rows: [] }).rows;                    /* [연도, mm] */
function fit(rows) { var n = rows.length, mx = 0, my = 0, b = 0, q = 0; rows.forEach(function (r) { mx += r[0]; my += r[1]; }); mx /= n; my /= n; rows.forEach(function (r) { b += (r[0] - mx) * (r[1] - my); q += (r[0] - mx) * (r[0] - mx); }); return { b: q ? b / q : 0, mx: mx, my: my }; }
var ALL = fit(G), EARLY = fit(G.filter(function (r) { return r[0] < 2003; })), LATE = fit(G.filter(function (r) { return r[0] >= 2015 && r[0] < 2025; }));
var SRC = "<small>출처: 미국 해양대기청(NOAA) 위성 고도계 연구실(LSA) — TOPEX/Poseidon · Jason-1·2·3 · Sentinel-6 위성이 잰 지구 평균 해수면 편차(계절 변화 뺌), 1993 ~ 2025. 사본은 data/gmsl.js.</small>";

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
        + "<div data-link='{\"id\":\"nasa-svs-sealevel\",\"title\":\"NASA — 창문으로 본 해수면 (교과서 연결 자료)\",\"src\":\"NASA 과학 시각화 스튜디오 · 비상교육 기후변화와 환경생태 191쪽\",\"url\":\"https://svs.gsfc.nasa.gov/5114\",\"ask\":\"1993 ~ 2022년 동안 둥근 창 너머로 물이 얼마나 차오르는지 영상을 보고, 이 사례에서 구한 상승량(30년에 약 10 cm)과 견주어 한 문장으로 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(sl - ALL.b) <= 0.2 + 1e-9) return { ok: true, msg: "가장 잘 맞는 기울기는 약 " + ALL.b.toFixed(1) + " mm/년 — 30여 년 동안 약 " + Math.round(ALL.b * 32) / 10 + " cm 올랐습니다." };
          return { ok: false, msg: sl.toFixed(1) + " mm/년은 " + (sl < ALL.b ? "너무 완만합니다" : "너무 가파릅니다") + "." };
        }
      };
    },
    hints: ["1993년 약 −20 mm, 2025년 약 +85 mm 입니다.", "약 105 mm ÷ 32년 ≈ ?"],
    solution: "약 <b>" + ALL.b.toFixed(1) + " mm/년</b>.",
    why: "해수면이 오르는 까닭은 크게 둘입니다. 바닷물이 데워져 부피가 커지는 <b>열팽창</b>, 그리고 그린란드·남극의 빙상과 산악 빙하가 녹아 바다로 흘러드는 물입니다(바다에 떠 있는 해빙이 녹는 것은 해수면을 거의 바꾸지 않아요).<br>"
      + "한 해 3 mm 는 작아 보이지만, 해안의 낮은 땅에서는 폭풍 해일과 겹쳐 침수 피해가 커지고 바닷물이 지하수로 스며듭니다."
  },
  {
    id: "r2", tag: "실제 자료 · 빨라지는 상승", title: "해수면 상승은 빨라지고 있을까", short: "가속",
    who: "📈", name: "기후 분석가",
    say: "“같은 자료를 두 기간으로 나눠 보세요. <b>1993 ~ 2002년</b>과 <b>2015 ~ 2024년</b> 각각에 직선을 맞추면 기울기가 같을까요? 최근 10년의 상승 속도가 처음 10년의 <b>몇 배</b>인지 구해 주세요.”",
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
        H.rows(ctx, 660, 40, [["1993 ~ 2002", EARLY.b.toFixed(2) + " mm/년", "--teal-700"], ["2015 ~ 2024", LATE.b.toFixed(2) + " mm/년", "--coral-700"], ["내 답 (몇 배)", g.toFixed(1) + " 배", null, true]], 58);
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
    why: "빙상이 녹는 속도가 빨라지고 바다가 흡수하는 열이 늘면서 해수면 상승도 빨라지고 있습니다. 같은 속도로 오른다고 가정한 예측은 실제보다 낮게 나올 수 있다는 뜻이에요. IPCC 는 온실 기체 배출이 많은 시나리오에서 2100년까지 해수면이 수십 cm ~ 1 m 가까이 오를 수 있다고 봅니다.<br>"
      + "※ 10년 기간의 기울기는 엘니뇨·라니냐 같은 자연 변동에도 흔들립니다. 그래서 과학자들은 더 긴 자료와 여러 방법으로 가속을 확인합니다."
  }
  ]
});
})();
