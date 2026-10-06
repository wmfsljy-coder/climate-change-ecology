/* 기후변화와 환경생태 Ⅱ 기후위기와 환경생태 변화 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 해수면 상승 → 방조제 */
  {
    id: "c1", tag: "해수면 상승", title: "2100년까지 버틸 방조제", short: "방조제 높이",
    who: "🏗️", name: "해안 도시 방재과",
    say: "“우리 도시 방조제를 새로 짓습니다. 지금 가장 높은 만조 때 바닷물은 기준면에서 <b>2.0 m</b>, 태풍 때 해일이 여기에 <b>1.2 m</b>를 더합니다. 2100년까지 버텨야 하니 <b>해수면 상승</b>도 넣어야 해요. 최악의 경로(SSP5-8.5)에도 넘치지 않되, 필요한 높이보다 <b>0.3 m</b> 넘게 높이면 예산이 모자랍니다.”",
    predict: {
      q: "2100년에 대비한 방조제를 설계할 때 가장 알맞은 생각은?",
      options: ["㉠ 지금의 만조 높이에만 맞추면 된다", "㉡ 만조 + 해일 + 앞으로의 해수면 상승까지 더해야 한다", "㉢ 해수면 상승은 떠 있는 얼음 때문이라 무시해도 된다"],
      answer: 1
    },
    task: "시나리오를 확인하고 방조제 높이를 정하세요. <b>SSP5-8.5</b>에서 넘치지 않고, 필요한 높이보다 0.3 m 넘게 높지 않아야 합니다.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, sc = "s5", wall = 3.0;
      var RISE = { s1: 0.72, s5: 1.1 }, NM = { s1: "SSP1-2.6", s5: "SSP5-8.5" };
      function need() { return 2.0 + 1.2 + RISE[sc]; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var y1 = 270, sc2 = 45, x0 = 80;
        function Y(m) { return y1 - m * sc2; }
        var water = need();
        H.box(ctx, x0, Y(water), 300, y1 - Y(water), H.v("--brand"), 0.35);
        H.box(ctx, x0 + 300, Y(wall), 36, y1 - Y(wall), H.v("--mist"), 1);
        H.box(ctx, x0 + 336, Y(1.0), 200, y1 - Y(1.0), H.v("--green"), 0.35);
        H.text(ctx, "🏘️ 도시", x0 + 400, Y(1.0) - 10, { s: 13, w: "800" });
        [[2.0, "만조 2.0 m"], [3.2, "+ 해일 1.2 m"], [water, "+ 해수면 " + RISE[sc] + " m (" + NM[sc] + ")"]].forEach(function (l) {
          H.dash(ctx, x0, Y(l[0]), x0 + 300, Y(l[0]), H.v("--amber"), 1.5);
          H.text(ctx, l[1], x0 + 6, Y(l[0]) - 5, { s: 10.5, w: "800", c: H.v("--amber-700") });
        });
        [0, 1, 2, 3, 4, 5].forEach(function (m) { H.text(ctx, m + " m", x0 - 8, Y(m) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        var ok = wall >= need() - 1e-9 && wall <= need() + 0.3 + 1e-9;
        H.rows(ctx, 640, 60, [["필요한 높이", need().toFixed(2) + " m"], ["방조제", wall.toFixed(1) + " m", ok ? "--green-700" : "--rose-700", true], ["여유", (wall - need() >= 0 ? "+" : "") + (wall - need()).toFixed(2) + " m"]], 60);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "2100년 시나리오", value: "s5", options: [{ v: "s1", t: "SSP1-2.6 (+0.72 m)" }, { v: "s5", t: "SSP5-8.5 (+1.1 m)" }], onPick: function (x) { sc = x; draw(); api.changed(); } });
      api.slider({ label: "방조제 높이", min: 2.0, max: 5.0, step: 0.1, value: 3.0, fmt: function (x) { return x.toFixed(1) + " m"; }, onInput: function (x) { wall = Math.round(x * 10) / 10; draw(); api.changed(); } });
      api.info("해수면 상승 전망은 우리나라 주변 바다의 2100년 값입니다. 해수면이 오르면 같은 해일도 더 높은 곳까지 올라옵니다.");
      draw();
      return {
        judge: function () {
          var n = 2.0 + 1.2 + RISE.s5;
          if (sc !== "s5") return { ok: false, msg: "최악의 경로에도 버텨야 합니다. 시나리오를 SSP5-8.5로 두고 확인하세요." };
          if (wall >= n - 1e-9 && wall <= n + 0.3 + 1e-9) return { ok: true, msg: "방조제 " + wall.toFixed(1) + " m — 2100년 최악의 경로에서도 넘치지 않고 예산 안입니다." };
          return { ok: false, msg: "방조제 " + wall.toFixed(1) + " m — " + (wall < n ? "해일이 넘칩니다." : "필요보다 너무 높아 예산을 넘깁니다.") };
        }
      };
    },
    hints: ["필요한 높이 = 만조 2.0 + 해일 1.2 + 해수면 상승.", "SSP5-8.5 에서는 2.0 + 1.2 + 1.1 = 4.3 m입니다."],
    solution: "시나리오 <b>SSP5-8.5</b>에서 방조제 <b>4.3~4.6 m</b>.",
    why: "해수면 상승은 그 자체로 땅을 잠기게 할 뿐 아니라, 태풍 해일이 시작하는 <b>바닥 높이</b>를 올려 같은 태풍도 더 큰 피해를 줍니다. 그래서 해안 시설은 앞으로 수십 년의 해수면 상승까지 넣어 설계합니다.<br>" +
      "어느 시나리오를 기준으로 삼을지는 비용과 위험 사이의 선택입니다. 감축에 성공해 SSP1-2.6을 따르면 필요한 높이가 약 0.4 m 낮아집니다. ※ 만조·해일 높이는 가상의 값입니다."
  },

  /* ------------------------------------------------------------------ 2. 극한 호우 → 배수관 */
  {
    id: "c2", tag: "극한 기상", title: "더 세진 비를 받아낼 빗물관", short: "빗물관 설계",
    who: "🌧️", name: "도시 하수도 설계팀",
    say: "“지금 빗물관은 시간당 <b>100 mm</b> 비에 맞춰 설계되어 있어요. 이 도시는 2100년까지 기온이 <b>3 ℃</b> 오를 것으로 봅니다. 기온 1 ℃마다 공기가 품을 수 있는 수증기가 약 <b>7%</b> 늘어 가장 센 비도 그만큼 세진다고 할 때, 새 빗물관의 처리 용량을 정해 주세요. 너무 크게 지으면 도로를 두 번 파야 할 만큼 공사비가 늘어요(필요량보다 10% 넘게 크면 안 됨).”",
    predict: {
      q: "기온이 3 ℃ 오르면 가장 센 비의 세기는 대략 어떻게 될까요?",
      options: ["㉠ 변하지 않는다", "㉡ 약 20% 넘게 세진다", "㉢ 3배가 된다"],
      answer: 1
    },
    task: "빗물관 처리 용량을 정하세요. 2100년의 가장 센 비를 받아내되, 필요량보다 10% 넘게 크지 않게.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, cap = 100;
      function need() { return 100 * Math.pow(1.07, 3); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 80, y1 = 250, s = 1.15;
        H.axes(ctx, x0, 30, 560, y1);
        [["지금 설계", 100, "--mist"], ["2100년 필요", need(), "--rose"], ["새 빗물관", cap, cap >= need() && cap <= need() * 1.1 ? "--green" : "--amber"]].forEach(function (b, k) {
          var bx = x0 + 30 + k * 160;
          H.box(ctx, bx, y1 - b[1] * s, 110, b[1] * s, H.v(b[2]), 0.85);
          H.text(ctx, Math.round(b[1]) + " mm/h", bx + 55, y1 - b[1] * s - 8, { s: 13, w: "900", a: "center" });
          H.text(ctx, b[0], bx + 55, y1 + 18, { s: 11.5, a: "center", c: H.v("--mist") });
        });
        H.text(ctx, "참고: 2022년 8월 서울 시간당 141.5 mm", 600, 80, { s: 11.5, c: H.v("--mist") });
        H.text(ctx, "여유 " + ((cap / need() - 1) * 100).toFixed(0) + "%", 600, 130, { s: 22, w: "900", c: cap >= need() && cap <= need() * 1.1 ? H.v("--green-700") : H.v("--rose-700") });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "새 빗물관의 처리 용량 (시간당 mm)", min: 80, max: 180, step: 1, value: 100, fmt: function (x) { return x + " mm/h"; }, onInput: function (x) { cap = x; draw(); api.changed(); } });
      api.info("7%가 세 번 겹치므로 1.07 × 1.07 × 1.07 배입니다. 늘어난 양이 다시 늘어나는 복리 구조입니다.");
      draw();
      return {
        judge: function () {
          var n = need();
          if (cap >= n && cap <= n * 1.1) return { ok: true, msg: cap + " mm/h — 2100년 약 " + n.toFixed(1) + " mm/h의 비를 받아내고 공사비도 알맞습니다." };
          return { ok: false, msg: cap + " mm/h — " + (cap < n ? "2100년의 폭우를 감당하지 못합니다." : "필요보다 너무 커 공사비가 과합니다.") };
        }
      };
    },
    hints: ["100 × 1.07³을 계산하세요.", "약 122.5 mm/h. 그보다 크고 약 134.8 mm/h보다 작게."],
    solution: "처리 용량 <b>123~134 mm/h</b>.",
    why: "기온이 오르면 공기가 품을 수 있는 수증기가 1 ℃에 약 6~7% 늘어 <b>극한 호우</b>의 재료가 많아집니다. 3 ℃면 20% 넘게 세집니다. 실제로 2022년 서울의 시간당 141.5 mm처럼 기존 설계 기준을 넘는 비가 이미 내리고 있어, 도시는 빗물 저류 시설과 투수성 포장 같은 <b>적응</b> 대책도 함께 씁니다.<br>※ 가장 센 비가 포화 수증기량과 같은 비율로 세진다는 것은 단순화한 가정입니다."
  },

  /* ------------------------------------------------------------------ 3. 매개 감염병 → 고지대 말라리아 */
  {
    id: "c3", tag: "곤충 매개 감염병", title: "산으로 올라오는 말라리아", short: "고지대 말라리아",
    who: "🦟", name: "고원 마을 보건소",
    say: "“적도 부근 고원의 우리 마을은 해발 <b>1,700 m</b> 라 서늘해서 말라리아가 거의 없었어요. 이 모형에서는 연평균 기온이 <b>18 ℃</b> 이상인 곳에서만 말라리아가 퍼진다고 할게요. 해안은 연평균 27 ℃, 높이 1 km마다 6.5 ℃씩 낮아집니다. 우리 마을이 <b>아직 안전한 가장 큰 기온 상승</b>은 얼마일까요? 대비를 시작할 기준으로 쓰려고요.”",
    predict: {
      q: "기온이 오르면 말라리아가 퍼지는 지역은 산에서 어떻게 변할까요?",
      options: ["㉠ 더 높은 곳까지 올라간다", "㉡ 더 낮은 곳으로 내려간다", "㉢ 기온과 관계없다"],
      answer: 0
    },
    task: "기온 상승을 조절해, 위험 지역의 윗경계가 마을 <b>바로 아래</b>(마을은 아직 안전)에 오는 가장 큰 값을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, dT = 0, TOWN = 1700;
      function top(d) { return (27 + d - 18) / 6.5 * 1000; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 70, x1 = 500, yb = 280, yt = 30;
        function Y(m) { return yb - m / 3000 * (yb - yt); }
        ctx.fillStyle = H.v("--green-700"); ctx.globalAlpha = .25; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo((x0 + x1) / 2, Y(2900)); ctx.lineTo(x1, yb); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        var t = Math.min(top(dT), 2900);
        H.box(ctx, x0, Y(t), x1 - x0, yb - Y(t), H.v("--rose"), 0.22);
        H.dash(ctx, x0, Y(t), x1 + 20, Y(t), H.v("--rose"), 2);
        H.text(ctx, "위험 지역 윗경계 " + Math.round(top(dT)).toLocaleString() + " m", x1 + 24, Y(t) + 4, { s: 11.5, w: "800", c: H.v("--rose-700") });
        H.text(ctx, "🏠 마을 1,700 m", (x0 + x1) / 2 + 40, Y(TOWN) + 4, { s: 12.5, w: "900" });
        H.dot(ctx, (x0 + x1) / 2 + 30, Y(TOWN), 5, H.v("--ink"));
        [0, 1000, 2000, 3000].forEach(function (m) { H.text(ctx, m + " m", x0 - 6, Y(m) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        var safe = top(dT) < TOWN;
        H.text(ctx, "기온 +" + dT.toFixed(1) + " ℃ · 마을 " + (safe ? "안전" : "위험"), 560, 60, { s: 16, w: "900", c: safe ? H.v("--green-700") : H.v("--rose-700") });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "기온 상승", min: 0, max: 4, step: 0.1, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " ℃"; }, onInput: function (x) { dT = x; draw(); api.changed(); } });
      api.info("18 ℃가 되는 높이 = (해안 기온 − 18) ÷ 6.5 km. 기온이 1 ℃ 오르면 그 높이가 약 154 m 올라갑니다.");
      draw();
      return {
        judge: function () {
          var t = top(dT), gap = TOWN - t;
          if (gap > 0 && gap <= 60) return { ok: true, msg: "+" + dT.toFixed(1) + " ℃ → 윗경계 " + Math.round(t) + " m. 마을 바로 아래까지 왔습니다 — 이때부터 대비해야 합니다." };
          return { ok: false, msg: "+" + dT.toFixed(1) + " ℃ → 윗경계 " + Math.round(t) + " m — " + (gap <= 0 ? "이미 마을이 위험 지역에 들어갔습니다." : "아직 마을보다 한참 아래입니다. 더 큰 값도 안전할 수 있습니다.") };
        }
      };
    },
    hints: ["지금 윗경계는 (27 − 18) ÷ 6.5 ≈ 1.385 km.", "1,700 m까지 약 315 m 남았습니다. 1 ℃에 154 m씩 올라가니 약 2 ℃가 한계입니다."],
    solution: "기온 상승 <b>+1.7 ~ +2.0 ℃</b> (윗경계 약 1,650~1,690 m).",
    why: "기온이 오르면 모기와 말라리아 원충이 살 수 있는 범위가 <b>고위도</b>뿐 아니라 <b>높은 곳</b>으로 넓어집니다. 실제로 에티오피아와 콜롬비아의 고원에서는 따뜻한 해에 말라리아가 더 높은 곳까지 나타났다는 연구(2014년)가 있습니다. 그동안 말라리아가 없던 곳의 주민은 면역이 없어 피해가 더 클 수 있습니다.<br>※ 18 ℃ 기준과 기온 감률은 수업용 모형 값입니다."
  }
  ]
});
})();
