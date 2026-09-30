/* 기후변화와 환경생태 Ⅰ 기후와 환경생태의 특성 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 기후인자: 고도 */
  {
    id: "c1", tag: "기후인자 · 고도", title: "적도의 ‘늘 봄’ 도시", short: "고도와 기온",
    who: "🏔️", name: "신도시 설계 위원회",
    say: "“적도 바로 옆 해안은 1년 내내 연평균 <b>27 ℃</b> 로 무덥습니다. 그런데 위원회는 연평균 <b>18 ~ 20 ℃</b>, 늘 봄 같은 새 도시를 원해요. 위도는 바꿀 수 없으니 <b>도시를 세울 높이</b>를 정해 주세요. 이 지역은 높이 1 km 마다 기온이 약 <b>6.5 ℃</b> 낮아집니다.”",
    predict: {
      q: "적도 근처에 있는 아프리카 킬리만자로산(약 5,900 m) 꼭대기에는 무엇이 있을까요?",
      options: ["㉠ 적도니까 열대 우림이 꼭대기까지 덮여 있다", "㉡ 높이 올라갈수록 기온이 낮아져 꼭대기에는 빙하와 눈이 있다", "㉢ 태양에 가까워져 사막처럼 뜨겁다"],
      answer: 1
    },
    task: "도시를 세울 높이를 조절해 연평균 기온 <b>18 ~ 20 ℃</b> 를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, h = 0;
      function T(m) { return 27 - 6.5 * m / 1000; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 70, x1 = 470, y0 = 30, y1 = 270;
        function Y(m) { return y1 - m / 4000 * (y1 - y0); }
        ctx.fillStyle = H.v("--green"); ctx.globalAlpha = .35;
        ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo((x0 + x1) / 2, Y(3800)); ctx.lineTo(x1, y1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = "#f4f8fb"; ctx.beginPath(); ctx.moveTo((x0 + x1) / 2 - 38, Y(3400)); ctx.lineTo((x0 + x1) / 2, Y(3800)); ctx.lineTo((x0 + x1) / 2 + 38, Y(3400)); ctx.closePath(); ctx.fill();
        [0, 1000, 2000, 3000, 4000].forEach(function (m) { H.text(ctx, m + " m", x0 - 8, Y(m) + 4, { s: 10.5, a: "right", c: H.v("--mist") }); });
        H.dash(ctx, x0, Y(h), x1 + 20, Y(h), H.v("--brand"), 2);
        H.text(ctx, "🏙️", (x0 + x1) / 2 + 60, Y(h) - 4, { s: 22 });
        var t = T(h), ok = t >= 18 && t <= 20;
        H.rows(ctx, 560, 60, [["도시의 높이", h.toLocaleString() + " m"], ["연평균 기온", t.toFixed(1) + " ℃", ok ? "--green-700" : "--rose-700", true], ["해안(0 m)과의 차이", (27 - t).toFixed(1) + " ℃"]], 64);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "도시를 세울 높이", min: 0, max: 4000, step: 50, value: 0, fmt: function (x) { return x.toLocaleString() + " m"; },
        onInput: function (x) { h = x; draw(); api.changed(); } });
      api.info("같은 위도라도 <b>고도</b>라는 기후인자가 기온을 바꿉니다. 기온 차이 ÷ 6.5 ℃ = 올라가야 할 높이(km).");
      draw();
      return {
        judge: function () {
          var t = T(h);
          if (t >= 18 && t <= 20) return { ok: true, msg: h.toLocaleString() + " m · 연평균 " + t.toFixed(1) + " ℃ — 적도에서도 늘 봄 같은 도시가 됩니다." };
          return { ok: false, msg: h.toLocaleString() + " m · 연평균 " + t.toFixed(1) + " ℃ — " + (t > 20 ? "아직 덥습니다. 더 높이 올라가세요." : "너무 높아 서늘합니다.") };
        }
      };
    },
    hints: [
      "해안보다 7 ~ 9 ℃ 낮아야 합니다.",
      "7 ÷ 6.5 ≈ 1.08 km, 9 ÷ 6.5 ≈ 1.38 km 사이의 높이를 고르세요."
    ],
    solution: "높이 <b>약 1,100 ~ 1,350 m</b> 에 세우면 연평균 18 ~ 20 ℃ 가 됩니다.",
    why: "기후는 위도만으로 정해지지 않습니다. <b>고도</b>가 높아지면 공기가 희박해지고 지표에서 멀어져 기온이 낮아집니다. 그래서 적도 가까이에 있는 킬리만자로산 꼭대기에도 빙하가 있고, 적도 부근 고원에는 1년 내내 선선한 도시가 발달합니다.<br>" +
      "콘월에서는 <b>해류와 수륙 분포</b>, 이곳에서는 <b>고도</b> — 모두 기후요소(기온)를 바꾸는 기후인자입니다. ※ 1 km 에 6.5 ℃ 는 평균적인 값으로, 실제 기온 감률은 장소와 날씨에 따라 다릅니다."
  },

  /* ------------------------------------------------------------------ 2. 음의 되먹임: 데이지 행성 */
  {
    id: "c2", tag: "되먹임 · 생물권", title: "데이지 행성의 온도 조절", short: "데이지 행성",
    who: "🌼", name: "행성 생태 모형 연구실",
    say: "“가상의 ‘데이지 행성’에는 햇빛을 잘 반사하는 <b>흰 데이지</b>가 자랍니다. 그런데 태양이 <b>20% 더 밝아졌어요.</b> 행성의 평균 기온을 생물이 살기 좋은 <b>20 ~ 25 ℃</b> 로 되돌리려면 흰 데이지가 행성 표면을 얼마나 덮어야 할까요?”",
    predict: {
      q: "행성이 더워질수록 흰 데이지가 더 잘 퍼진다면, 흰 데이지는 행성 기온에 어떤 되먹임을 일으킬까요?",
      options: ["㉠ 흰 데이지가 햇빛을 반사해 기온을 낮추는 음의 되먹임", "㉡ 흰 데이지가 햇빛을 흡수해 기온을 더 올리는 양의 되먹임", "㉢ 식물은 기온에 아무 영향을 주지 못한다"],
      answer: 0
    },
    task: "흰 데이지 면적을 조절해 밝아진 태양 아래에서 행성 기온 <b>20 ~ 25 ℃</b> 를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, w = 0, L = 1.2;
      function alb(x) { return 0.3 + 0.4 * x / 100; }
      function T(x) { return 288 * Math.pow(L * (1 - alb(x)) / 0.7, 0.25) - 273; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 200, cy = 150, R = 110, t = T(w), ok = t >= 20 && t <= 25;
        H.text(ctx, "☀️ 20% 더 밝아진 태양", 30, 30, { s: 13, w: "800", c: H.v("--amber-700") });
        ctx.fillStyle = H.v("--coral-100"); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
        var n = Math.round(w / 100 * 60);
        for (var i = 0; i < 60; i++) {
          var a = i * 2.39996, rr = R * 0.92 * Math.sqrt((i + 0.5) / 60);
          H.dot(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 7, i < n ? "#fbfbf4" : H.v("--coral"));
        }
        H.text(ctx, "흰 데이지 " + w + "%", cx, cy + R + 26, { s: 12.5, w: "800", a: "center" });
        H.rows(ctx, 520, 60, [["행성 반사율", Math.round(alb(w) * 100) + "%"], ["행성 평균 기온", t.toFixed(1) + " ℃", ok ? "--green-700" : "--rose-700", true], ["태양이 밝아지기 전 기온", "15.0 ℃"]], 64);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "흰 데이지가 덮은 면적", min: 0, max: 100, step: 1, value: 0, fmt: function (x) { return x + "%"; },
        onInput: function (x) { w = x; draw(); api.changed(); } });
      api.info("흰 꽃은 햇빛을 반사해 행성의 <b>반사율</b>을 높입니다. 반사율이 높을수록 흡수하는 에너지가 줄어 기온이 내려갑니다.");
      draw();
      return {
        judge: function () {
          var t = T(w);
          if (t >= 20 && t <= 25) return { ok: true, msg: "흰 데이지 " + w + "% · 반사율 " + Math.round(alb(w) * 100) + "% · " + t.toFixed(1) + " ℃ — 생물이 행성의 기온을 살기 좋은 범위로 붙잡았습니다." };
          return { ok: false, msg: "흰 데이지 " + w + "% · " + t.toFixed(1) + " ℃ — " + (t > 25 ? "아직 너무 덥습니다." : "너무 많이 덮어 추워졌습니다.") };
        }
      };
    },
    hints: [
      "데이지가 하나도 없으면 28 ℃ 가 넘습니다. 조금씩 늘려 보세요.",
      "반사율이 약 33 ~ 37% 가 되면 됩니다. 데이지 1% 마다 반사율이 0.4%p 오릅니다."
    ],
    solution: "흰 데이지 <b>약 8 ~ 18%</b> 면 20 ~ 25 ℃ 가 됩니다.",
    why: "이 모형은 과학자 러브록과 왓슨이 1983년에 발표한 ‘데이지 행성’ 모형을 단순하게 바꾼 것입니다. 행성이 더워지면 흰 데이지가 늘고, 흰 데이지가 햇빛을 반사해 행성을 식히니 <b>음의 되먹임</b>입니다.<br>" +
      "생물권이 기권의 에너지 흐름을 바꾸어 기후시스템을 안정하게 만드는 예예요. 실제 지구에서도 식물의 광합성이 이산화 탄소를 흡수하는 것처럼 생물권이 되먹임 고리에 참여합니다. ※ 기온 계산은 복사 평형을 단순화한 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 3. 서식지 이동: 산 위로 */
  {
    id: "c3", tag: "생태계 영향 · 서식지", title: "산꼭대기로 밀려나는 구상나무", short: "구상나무",
    who: "🌲", name: "국립공원 연구원",
    say: "“우리나라 고유종인 <b>구상나무</b>는 한라산의 높은 곳에 삽니다. 이 모형에서는 해발 <b>1,400 m</b> 위부터 정상(약 <b>1,950 m</b>)까지 자란다고 할게요. 기온이 오르면 서식지의 아랫경계가 산 위로 올라갑니다. 서식할 수 있는 높이 폭이 지금의 <b>40 ~ 60%</b> 로 줄어드는 기온 상승은 얼마일까요? 보호 계획의 기준으로 삼으려 합니다.”",
    predict: {
      q: "기온이 오를 때, 산 위에 사는 생물이 평지 생물보다 더 위험한 까닭은?",
      options: ["㉠ 산 위 생물은 더위를 전혀 견디지 못해서", "㉡ 서식지가 위로 옮겨 가다 정상에 닿으면 더 갈 곳이 없어서", "㉢ 산 위에는 기온 상승이 일어나지 않아서"],
      answer: 1
    },
    task: "기온 상승을 조절해 구상나무 서식 폭이 지금의 <b>40 ~ 60%</b> 가 되는 값을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, dT = 0, TOP = 1950, LOW0 = 1400;
      function low(d) { return LOW0 + d / 6.5 * 1000; }
      function frac(d) { return Math.max(0, (TOP - low(d)) / (TOP - LOW0)); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 480, yb = 280, yt = 40;
        function Y(m) { return yb - m / 2000 * (yb - yt); }
        ctx.fillStyle = H.v("--green-700"); ctx.globalAlpha = .25;
        ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo((x0 + x1) / 2, Y(TOP)); ctx.lineTo(x1, yb); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        var L = Math.min(low(dT), TOP), k = (Y(L) - Y(TOP)) / (yb - Y(TOP)), hw = (x1 - x0) / 2 * k;
        if (L < TOP) {
          ctx.fillStyle = H.v("--green"); ctx.beginPath(); ctx.moveTo((x0 + x1) / 2 - hw, Y(L)); ctx.lineTo((x0 + x1) / 2, Y(TOP)); ctx.lineTo((x0 + x1) / 2 + hw, Y(L)); ctx.closePath(); ctx.fill();
        }
        H.dash(ctx, x0, Y(LOW0), x1 + 30, Y(LOW0), H.v("--mist"), 1.5);
        H.text(ctx, "지금 아랫경계 1,400 m", x1 + 34, Y(LOW0) + 4, { s: 10.5, c: H.v("--mist") });
        H.dash(ctx, x0, Y(L), x1 + 30, Y(L), H.v("--coral"), 2);
        H.text(ctx, "새 아랫경계 " + Math.round(L).toLocaleString() + " m", x1 + 34, Y(L) - 6, { s: 11.5, w: "800", c: H.v("--coral-700") });
        [0, 500, 1000, 1500, 2000].forEach(function (m) { H.text(ctx, m + " m", x0 - 6, Y(m) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        var f = frac(dT), ok = f >= 0.4 && f <= 0.6;
        H.text(ctx, "기온 +" + dT.toFixed(1) + " ℃ · 서식 폭 " + Math.round(f * 100) + "%", 620, 250, { s: 16, w: "900", c: ok ? H.v("--green-700") : H.v("--rose-700") });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "기온 상승", min: 0, max: 4, step: 0.1, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " ℃"; },
        onInput: function (x) { dT = x; draw(); api.changed(); } });
      api.info("높이 1 km 마다 기온이 약 6.5 ℃ 낮아진다고 하면, 기온이 1 ℃ 오를 때 같은 기온의 높이는 약 <b>154 m</b> 위로 올라갑니다.");
      draw();
      return {
        judge: function () {
          var f = frac(dT);
          if (f >= 0.4 && f <= 0.6) return { ok: true, msg: "+" + dT.toFixed(1) + " ℃ → 아랫경계 " + Math.round(low(dT)).toLocaleString() + " m, 서식 폭 " + Math.round(f * 100) + "% — 서식지가 절반쯤으로 줄어듭니다." };
          return { ok: false, msg: "+" + dT.toFixed(1) + " ℃ → 서식 폭 " + Math.round(f * 100) + "% — " + (f > 0.6 ? "아직 절반보다 넉넉합니다." : "너무 많이 줄었습니다.") };
        }
      };
    },
    hints: [
      "지금 서식 폭은 1,950 − 1,400 = 550 m. 그 절반은 약 275 m 입니다.",
      "아랫경계가 약 220 ~ 330 m 올라가야 합니다. 기온 1 ℃ 에 약 154 m 씩 올라가요."
    ],
    solution: "기온 상승 <b>약 +1.5 ~ +2.1 ℃</b> 에서 서식 폭이 40 ~ 60% 가 됩니다.",
    why: "기온이 오르면 서식지는 <b>북쪽(고위도)</b>뿐 아니라 <b>위쪽(고지대)</b>으로도 옮겨 갑니다. 평지 생물은 북쪽으로 옮겨 갈 수 있지만, 산꼭대기에 사는 생물은 정상에 닿으면 갈 곳이 없어 사라질 위험이 큽니다.<br>" +
      "실제로 한라산의 구상나무 숲은 최근 수십 년 동안 크게 줄어 기후변화의 영향을 받는 대표 사례로 꼽힙니다(가뭄·태풍·겨울철 적설 변화 등도 함께 원인으로 연구됩니다). ※ 서식 높이와 기온 감률은 수업용 모형 값입니다."
  }
  ]
});
})();
