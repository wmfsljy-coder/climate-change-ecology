/* 기후변화와 환경생태 Ⅰ 기후와 환경생태의 특성 — 실제 자료
   r1 같은 위도인데 왜 이렇게 다를까 — 영국 콘월과 캐나다 세인트존스의 1월 기온
   r2 우리 동네는 얼마나 따뜻해졌나 — 부산 연평균 기온 44년의 추세
   자료: data/climate-points.js (NASA POWER) */
(function () {
"use strict";
var C = window.REAL_CLIM || { points: [], busan: [] };
var CO = C.points[0] || { name: "콘월", t: [], tmin: [], lat: 50.15, lng: -5.1 }, SJ = C.points[1] || { name: "세인트존스", t: [], tmin: [], lat: 47.56, lng: -52.71 };
var DJ = CO.t[0] - SJ.t[0];
var B = C.busan;
function mean(a) { return a.reduce(function (s, x) { return s + x; }, 0) / (a.length || 1); }
var FIT = (function () { var x = B.map(function (r) { return r[0]; }), y = B.map(function (r) { return r[1]; }), mx = mean(x), my = mean(y), b = 0, q = 0; x.forEach(function (v, i) { b += (v - mx) * (y[i] - my); q += (v - mx) * (v - mx); }); return { b: q ? b / q : 0, mx: mx, my: my }; })();
var DEC = FIT.b * 10;
var M = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
var SRC1 = "<small>출처: NASA 랭글리 연구소 POWER 프로젝트 기후값(2001 ~ 2020, MERRA-2 재분석) — 콘월(북위 " + CO.lat + "°, 서경 " + Math.abs(CO.lng) + "°)과 세인트존스(북위 " + SJ.lat + "°, 서경 " + Math.abs(SJ.lng) + "°) 격자의 월평균 기온. 사본은 data/climate-points.js.</small>";
var SRC2 = "<small>출처: NASA POWER 월별 자료, 부산 격자(북위 35.18°, 동경 129.04°)의 연평균 기온 1981 ~ 2024. 격자(약 50 km) 평균이라 도시 관측소 값과 조금 다릅니다. 사본은 data/climate-points.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 기후를 정하는 요인과 기후 변화를 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 기후를 정하는 요인", title: "같은 위도인데 왜 이렇게 다를까", short: "콘월과 세인트존스",
    who: "🌴", name: "기후 여행가",
    say: "“영국 남서쪽 끝 콘월에는 야자수가 자라요. 그런데 대서양 건너 비슷한 위도의 캐나다 세인트존스는 늦겨울엔 북쪽에서 떠내려온 바다 얼음이 해안에 닿을 만큼 춥습니다. NASA 자료로 두 곳의 <b>월평균 기온</b>을 비교해, <b>1월 기온이 몇 °C 차이</b> 나는지 구해 주세요.”",
    predict: {
      q: "같은 위도의 두 곳이 겨울 기온이 크게 다른 까닭으로 가장 알맞은 것은?",
      options: ["㉠ 해발 고도가 달라서", "㉡ 따뜻한 해류(멕시코 만류·북대서양 해류)와 차가운 해류(래브라도 해류), 그리고 편서풍 때문에", "㉢ 해가 뜨는 시간이 달라서"],
      answer: 1
    },
    task: "두 곳의 1월 평균 기온 차이를 슬라이더로 맞추세요(± 0.5 °C).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 0;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 620, y0 = 24, y1 = cv.H - 36;
        function X(i) { return x0 + (i + 0.5) / 12 * (x1 - x0); }
        function Y(t) { return y1 - (t + 6) / 26 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [-5, 0, 5, 10, 15, 20].forEach(function (t) { H.text(ctx, t + "°C", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        H.dash(ctx, x0, Y(0), x1, Y(0), H.v("--line"), 1);
        M.forEach(function (m, i) { H.text(ctx, m + "월", X(i), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
        H.line(ctx, CO.t.map(function (t, i) { return [X(i), Y(t)]; }), H.v("--coral-700"), 2.5);
        H.line(ctx, SJ.t.map(function (t, i) { return [X(i), Y(t)]; }), H.v("--brand"), 2.5);
        H.text(ctx, "빨강 = " + CO.name, x0 + 8, y0 + 4, { s: 11, w: "800", c: H.v("--coral-700") });
        H.text(ctx, "파랑 = " + SJ.name, x0 + 8, y0 + 20, { s: 11, w: "800", c: H.v("--brand-700") });
        H.rows(ctx, 660, 50, [["콘월 1월", CO.t[0].toFixed(1) + " °C"], ["세인트존스 1월", SJ.t[0].toFixed(1) + " °C"], ["내 답 (차이)", g.toFixed(1) + " °C", null, true]], 58);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "1월 기온 차이", min: 0, max: 20, step: 0.1, value: 0, fmt: function (x) { return x.toFixed(1) + " °C"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("두 곳은 위도가 2 ~ 3° 밖에 차이 나지 않습니다. " + SRC1
        + "<div data-map='{\"id\":\"cornwall\",\"name\":\"영국 콘월 남쪽 해안\",\"lat\":50.15,\"lng\":-5.07,\"zoom\":12,\"ask\":\"해안 마을의 정원이나 길가에 야자수처럼 생긴 나무가 보이는지 찾아보세요. 바다와 얼마나 가까운가요?\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - DJ) <= 0.5 + 1e-9) return { ok: true, msg: CO.t[0].toFixed(1) + " − (" + SJ.t[0].toFixed(1) + ") ≈ " + DJ.toFixed(1) + " °C — 같은 위도라도 1월 기온이 10 °C 넘게 다릅니다." };
          return { ok: false, msg: g.toFixed(1) + " °C 는 " + (g < DJ ? "작습니다" : "큽니다") + ". 음수를 빼면 더하기가 돼요." };
        }
      };
    },
    hints: ["세인트존스의 1월 기온은 0 °C 아래입니다.", CO.t[0].toFixed(1) + " − (" + SJ.t[0].toFixed(1) + ") = ?"],
    solution: "약 <b>" + DJ.toFixed(1) + " °C</b>.",
    why: "기후는 위도만으로 정해지지 않습니다. 콘월은 멕시코 만류에서 이어지는 따뜻한 <b>북대서양 해류</b>가 지나는 바다 옆에 있고, 1년 내내 부는 <b>편서풍</b>이 그 바다의 따뜻한 공기를 육지로 실어 옵니다. 세인트존스 앞바다에는 북극에서 내려오는 차가운 <b>래브라도 해류</b>가 흐르고, 편서풍이 차가운 대륙의 공기를 몰고 와요.<br>"
      + "이렇게 해류·바람·바다와 육지의 분포·지형이 함께 기후를 만듭니다. 기후가 다르면 그곳에 사는 생물도 달라져, 같은 위도에서도 야자수와 얼음 바다가 나뉩니다."
  },
  {
    id: "r2", tag: "실제 자료 · 우리 동네의 기후 변화", title: "부산은 얼마나 따뜻해졌나", short: "부산의 온난화",
    who: "🌡️", name: "지역 기후 연구소",
    say: "“부산 격자의 1981 ~ 2024년 <b>연평균 기온</b>이에요. 해마다 오르내리지만 긴 흐름이 보이나요? 직선을 맞춰 <b>10년마다 몇 °C 올랐는지</b> 구해 주세요.”",
    predict: {
      q: "지난 40여 년 동안 부산의 연평균 기온은?",
      options: ["㉠ 거의 변하지 않았다", "㉡ 해마다 오르내리지만 긴 흐름으로는 꾸준히 올랐다", "㉢ 10년에 3 °C 씩 올랐다"],
      answer: 1
    },
    task: "직선의 기울기(10년마다 기온 변화)를 맞추세요(± 0.05 °C).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, sl = 0;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 620, y0 = 24, y1 = cv.H - 36;
        function X(y) { return x0 + (y - 1980) / 46 * (x1 - x0); }
        function Y(t) { return y1 - (t - 12.5) / 4 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [13, 14, 15, 16].forEach(function (t) { H.text(ctx, t + "°C", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        [1985, 1995, 2005, 2015, 2025].forEach(function (y) { H.text(ctx, y, X(y), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
        B.forEach(function (r) { H.dot(ctx, X(r[0]), Y(r[1]), 3.6, H.v("--brand")); });
        H.line(ctx, [[X(1981), Y(FIT.my + sl / 10 * (1981 - FIT.mx))], [X(2024), Y(FIT.my + sl / 10 * (2024 - FIT.mx))]], H.v("--amber-700"), 2.5);
        H.rows(ctx, 660, 60, [["내 기울기", (sl >= 0 ? "+" : "") + sl.toFixed(2) + " °C / 10년", null, true], ["1981 → 2024(43년)", (sl * 4.3 >= 0 ? "+" : "") + (sl * 4.3).toFixed(1) + " °C"]], 60);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "10년마다 기온 변화", min: -0.5, max: 1, step: 0.01, value: 0, fmt: function (x) { return (x >= 0 ? "+" : "") + x.toFixed(2) + " °C"; }, onInput: function (x) { sl = x; api.changed(); draw(); } });
      api.info("점들 한가운데를 지나는 직선을 찾으세요. " + SRC2);
      draw();
      return {
        judge: function () {
          if (Math.abs(sl - DEC) <= 0.05 + 1e-9) return { ok: true, msg: "가장 잘 맞는 기울기는 약 +" + DEC.toFixed(2) + " °C / 10년 — 1981 ~ 2024년 43년 동안 약 " + (DEC * 4.3).toFixed(1) + " °C 올랐습니다." };
          return { ok: false, msg: (sl >= 0 ? "+" : "") + sl.toFixed(2) + " 는 " + (sl < DEC ? "너무 완만합니다" : "너무 가파릅니다") + "." };
        }
      };
    },
    hints: ["가장 잘 맞는 직선은 1981년 약 13.4 °C, 2024년 약 14.6 °C 근처를 지납니다. 맨 끝 2023 ~ 2024년의 높은 점에만 맞추지 마세요.", "약 1.2 °C ÷ 4.3(십 년 단위) ≈ ?"],
    solution: "약 <b>+" + DEC.toFixed(2) + " °C / 10년</b>.",
    why: "부산의 기온은 해마다 날씨에 따라 오르내리지만, 40여 년의 추세는 10년에 약 0.3 °C 씩 올라 전 지구 평균(10년에 약 0.2 °C)보다 조금 빠릅니다. 기온이 오르면 봄꽃이 일찍 피고, 남쪽에 살던 생물이 북쪽으로 올라오며, 겨울잠·번식 시기가 달라지는 등 생태계가 바뀝니다.<br>"
      + "남방노랑나비·연분홍실잠자리처럼 남쪽에 살던 곤충이 우리나라에서 점점 북쪽으로 발견되는 것도 이런 기온 변화와 관련이 있습니다. ※ 격자 평균값이라 도시의 열섬 효과는 거의 들어 있지 않습니다."
  }
  ]
});
})();
