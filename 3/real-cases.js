/* 기후변화와 환경생태 Ⅲ 기후위기에 대응하는 우리의 노력 — 실제 자료
   r1 그레이트배리어리프의 가장 뜨거웠던 해 — 위성으로 잰 누적 열 스트레스(DHW)
   r2 산호 백화를 부르는 해는 얼마나 잦아졌나 — 처음 10년과 최근 10년 비교
   자료: data/crw-gbr.js (NOAA Coral Reef Watch) */
(function () {
"use strict";
var C = window.REAL_CRW || { rows: [] };
var R = C.rows.filter(function (r) { return r[0] <= 2025; });          /* 다 끝난 해만 */
var TOP = R.reduce(function (b, r) { return r[1] > b[1] ? r : b; }, R[0] || [2024, 12]);
function cnt(a, b, th) { return R.filter(function (r) { return r[0] >= a && r[0] <= b && r[1] >= th; }).length; }
var N1 = cnt(1985, 1994, 4), N2 = cnt(2015, 2024, 4);
var SRC = "<small>출처: 미국 해양대기청(NOAA) 산호초 감시(Coral Reef Watch) 5 km 지역 가상 관측소 — " + (C.station || "그레이트배리어리프 중부") + ", 해마다 가장 높았던 누적 열 스트레스(DHW, °C-주), 1985~2025. 사본은 data/crw-gbr.js.</small>";

function chart(H, ctx, W, CH, pick, shade) {
  H.paper(ctx, W, CH);
  var x0 = 60, x1 = 640, y0 = 24, y1 = CH - 36;
  function X(y) { return x0 + (y - 1984.5) / 41 * (x1 - x0); }
  function Y(v) { return y1 - v / 14 * (y1 - y0); }
  H.axes(ctx, x0, y0, x1, y1);
  if (shade) shade.forEach(function (s) { ctx.fillStyle = "rgba(255,190,60,.15)"; ctx.fillRect(X(s[0] - 0.5), y0, X(s[1] + 0.5) - X(s[0] - 0.5), y1 - y0); });
  [0, 4, 8, 12].forEach(function (v) { H.text(ctx, v, x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
  H.dash(ctx, x0, Y(4), x1, Y(4), H.v("--amber-700"), 1.2); H.dash(ctx, x0, Y(8), x1, Y(8), H.v("--rose-700"), 1.2);
  H.text(ctx, "4 이상: 백화 경보 1단계 · 8 이상: 2단계(심한 백화)", x0 + 8, y0 + 4, { s: 10.5, w: "800", c: H.v("--mist") });
  [1990, 2000, 2010, 2020].forEach(function (y) { H.text(ctx, y, X(y), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
  R.forEach(function (r) { var on = pick === r[0]; H.box(ctx, X(r[0]) - 5, Y(r[1]), 10, y1 - Y(r[1]), on ? H.v("--amber-700") : (r[1] >= 8 ? H.v("--rose-700") : (r[1] >= 4 ? H.v("--coral-700") : H.v("--brand"))), on ? 1 : 0.8); });
  return { X: X, Y: Y };
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 산호 백화와 기후 위기 대응을 설명해 보세요.",
  cases: [
  {
    id: "r1", sec: "01", tag: "실제 자료 · 산호 백화", title: "그레이트배리어리프의 가장 뜨거웠던 해", short: "가장 뜨거운 해",
    who: "🪸", name: "산호초 감시 센터",
    say: "“산호는 바닷물이 가장 따뜻한 달의 평균보다 1 °C 넘게 뜨거운 날이 이어지면 몸속 조류를 내보내 하얗게 변해요(백화). 위성은 그 뜨거움이 최근 12주 동안 얼마나 쌓였는지를 <b>누적 열 스트레스(DHW, °C-주)</b>로 잽니다. 그레이트배리어리프 중부에서 해마다 가장 높았던 값이에요. <b>가장 뜨거웠던 해</b>를 찾아 주세요.”",
    predict: {
      q: "누적 열 스트레스가 8 °C-주를 넘으면 어떤 일이 일어날 가능성이 클까요?",
      options: ["㉠ 산호가 더 빨리 자란다", "㉡ 넓은 범위에서 심한 백화가 일어나고 산호가 죽기 시작한다", "㉢ 아무 일도 없다"],
      answer: 1
    },
    task: "연도를 옮겨 누적 열 스트레스가 가장 높았던 해를 고르세요(1985~2025).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, y = 1985;
      function val(yy) { for (var i = 0; i < R.length; i++) if (R[i][0] === yy) return R[i][1]; return 0; }
      function draw() {
        chart(H, ctx, W, cv.H, y, null);
        H.rows(ctx, 680, 60, [["고른 해", y + "년", "--amber-700"], ["가장 높은 DHW", val(y).toFixed(1) + " °C-주", null, true]], 60);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "연도", min: 1985, max: 2025, step: 1, value: 1985, fmt: function (x) { return x + "년"; }, onInput: function (x) { y = x; api.changed(); draw(); } });
      api.info("DHW 4 = 평소보다 1 °C 뜨거운 날이 4주 이어진 것과 같은 열입니다. " + SRC
        + "<div data-map='{\"id\":\"gbr\",\"name\":\"그레이트배리어리프 중부 (오스트레일리아)\",\"lat\":-18.8,\"lng\":147.6,\"zoom\":8,\"ask\":\"위성 사진에서 해안과 먼바다 사이에 줄지어 있는 산호초들을 찾아보세요. 산호초는 해안에서 몇 km 쯤 떨어져 있나요?\"}'></div>");
      draw();
      return {
        judge: function () {
          if (y === TOP[0]) return { ok: true, msg: TOP[0] + "년 " + TOP[1].toFixed(1) + " °C-주 — 이 관측소의 1985년 이래 기록에서 가장 강한 열 스트레스로, 그해 산호초 전역에 대규모 백화가 일어났습니다." };
          return { ok: false, msg: y + "년은 " + val(y).toFixed(1) + " °C-주입니다. 더 높은 막대가 있습니다." };
        }
      };
    },
    hints: ["빨간 막대(8 이상) 가운데 가장 높은 것을 찾으세요.", "최근 몇 년 사이입니다."],
    solution: "<b>" + TOP[0] + "년</b> (" + TOP[1].toFixed(1) + " °C-주).",
    why: "산호는 몸속에 사는 작은 조류(공생 조류)가 광합성으로 만든 양분으로 살아갑니다. 바닷물이 오래 뜨거우면 이 조류를 내보내 하얗게 되고(백화), 열 스트레스가 길게 이어지면 산호가 굶어 죽습니다. 산호초는 바다 생물의 약 4분의 1이 기대어 사는 곳이라, 산호가 죽으면 생태계 전체가 흔들립니다.<br>"
      + "그레이트배리어리프에서는 1998 · 2002년에 이어 2016 · 2017 · 2020 · 2022 · 2024년에 대규모 백화가 되풀이되어, 산호가 회복할 시간이 모자라게 되었습니다."
  },
  {
    id: "r2", sec: "01", tag: "실제 자료 · 잦아지는 백화", title: "백화를 부르는 해는 얼마나 잦아졌나", short: "백화 빈도",
    who: "📊", name: "해양 생태 연구실",
    say: "“같은 자료로, 백화 경보 1단계(DHW 4 이상)를 넘은 해가 <b>1985~1994년</b>에는 몇 번, <b>2015~2024년</b>에는 몇 번이었는지 세어 보세요. 최근 10년은 처음 10년의 <b>몇 배</b>일까요?”",
    predict: {
      q: "백화를 일으킬 만큼 뜨거운 해는 어떻게 바뀌었을까요?",
      options: ["㉠ 줄었다", "㉡ 비슷하다", "㉢ 크게 잦아졌다"],
      answer: 2
    },
    task: "두 기간의 4 이상인 해의 수를 세어, 최근 ÷ 처음 을 슬라이더로 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, g = 1;
      function draw() {
        chart(H, ctx, W, cv.H, null, [[1985, 1994], [2015, 2024]]);
        H.rows(ctx, 680, 60, [["내 답 (몇 배)", g + " 배", null, true]], 60);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "최근 10년은 처음 10년의 몇 배", min: 1, max: 10, step: 1, value: 1, fmt: function (x) { return x + " 배"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("노란 띠가 비교할 두 기간입니다. 띠 안에서 노란 점선(4)을 넘은 막대를 세세요. ※ 처음 10년의 1회는 1987년 한 해입니다. 초기 위성 자료는 오차가 더 크고, 한 해 값에 기대는 비교는 흔들리기 쉬우니 배수는 대략으로 읽으세요. " + SRC);
      draw();
      return {
        judge: function () {
          var t = N1 ? N2 / N1 : N2;
          if (Math.abs(g - t) < 0.5) return { ok: true, msg: "1985~1994년 " + N1 + "번, 2015~2024년 " + N2 + "번 — 약 " + t.toFixed(0) + "배로 잦아졌습니다." };
          return { ok: false, msg: g + " 배는 맞지 않습니다. 두 기간에서 4를 넘은 해를 각각 세어 나누세요." };
        }
      };
    },
    hints: ["처음 10년에는 4를 넘은 해가 " + N1 + "번뿐입니다.", "최근 10년의 막대를 세어 " + N1 + " 으로 나누세요."],
    solution: "처음 " + N1 + "번 → 최근 " + N2 + "번, <b>약 " + (N1 ? N2 / N1 : N2).toFixed(0) + "배</b>.",
    why: "바다가 계속 데워지면서 산호가 견딜 수 있는 온도를 넘는 해가 점점 잦아지고 있습니다. 산호초가 백화에서 회복하는 데는 10년쯤 걸리는데, 뜨거운 해가 몇 년마다 찾아오면 회복할 틈이 없습니다. IPCC는 지구 평균 기온이 1.5 °C 오르면 산호초의 70~90%, 2 °C 오르면 99% 넘게 사라질 수 있다고 봅니다.<br>"
      + "온실 기체 배출을 줄이는 것이 산호초를 지키는 가장 근본적인 방법이고, 산호 복원·해양 보호 구역 같은 노력은 시간을 버는 일입니다."
  }
  ]
});
})();
