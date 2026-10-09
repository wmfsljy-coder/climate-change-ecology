/* 기후변화와 환경생태 Ⅲ 기후위기에 대응하는 우리의 노력 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 산호 복원 */
  {
    id: "c1", tag: "산호의 백화 · 복원", title: "산호 정원사의 계획", short: "산호 복원",
    who: "🪸", name: "산호 복원 연구소",
    say: "“대규모 백화가 요즘처럼 <b>6년마다</b> 온다면 산호초는 처음의 절반쯤(약 30%)밖에 유지하지 못해요. 우리 연구소는 바다 속 묘목장에서 키운 산호 조각을 해마다 옮겨 심습니다. 마지막 20년 평균 덮임률을 <b>40% 이상</b>으로 지키되, 인력과 예산을 아끼려면 <b>가장 적게</b> 심어야 해요(45% 넘게는 필요 없음).”",
    predict: {
      q: "백화가 자주 오는 바다에서 산호를 옮겨 심으면 어떻게 될까요?",
      options: ["㉠ 심어 봐야 소용없다", "㉡ 백화 사이 회복을 앞당겨 평균 덮임률을 끌어올린다", "㉢ 한 번만 심으면 백화가 다시 오지 않는다"],
      answer: 1
    },
    task: "해마다 옮겨 심는 양을 조절해 마지막 20년 평균 덮임률 <b>40 ~ 45%</b> 를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, p = 0;
      function sim(q) { var C = 60, tr = [60], s = 0, c = 0; for (var y = 1; y <= 60; y++) { C = Math.min(60, C + 0.25 * C * (1 - C / 60) + q); if (y % 6 === 0) C *= 0.5; tr.push(C); if (y > 40) { s += C; c++; } } return { tr: tr, avg: s / c }; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var r = sim(p), x0 = 60, x1 = 600, y0 = 30, y1 = 240;
        function X(y) { return x0 + y / 60 * (x1 - x0); }
        function Y(c) { return y1 - c / 60 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        H.box(ctx, X(40), y0, X(60) - X(40), y1 - y0, H.v("--mist"), 0.15);
        H.line(ctx, r.tr.map(function (c, y) { return [X(y), Y(c)]; }), H.v("--coral"), 2.5);
        [0, 30, 60].forEach(function (c) { H.text(ctx, c + "%", x0 - 6, Y(c) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        H.rows(ctx, 650, 60, [["해마다 옮겨 심기", "+" + p.toFixed(1) + " %p"], ["마지막 20년 평균", r.avg.toFixed(1) + "%", r.avg >= 40 && r.avg <= 45 ? "--green-700" : "--rose-700", true]], 70);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "해마다 옮겨 심는 산호 (덮임률 %p)", min: 0, max: 6, step: 0.5, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " %p"; }, onInput: function (x) { p = x; draw(); api.changed(); } });
      api.info("백화 간격은 6년으로 고정되어 있습니다. 심은 산호는 자연 회복에 더해집니다.");
      draw();
      return {
        judge: function () {
          var a = sim(p).avg;
          if (a >= 40 && a <= 45) return { ok: true, msg: "+" + p.toFixed(1) + " %p → 평균 " + a.toFixed(1) + "% — 적은 노력으로 산호초를 지켜 냅니다." };
          return { ok: false, msg: "+" + p.toFixed(1) + " %p → 평균 " + a.toFixed(1) + "% — " + (a < 40 ? "아직 부족합니다." : "필요보다 많이 심고 있습니다.") };
        }
      };
    },
    hints: ["심지 않으면 약 30%. 0.5 %p 씩 올려 보세요.", "평균이 40% 를 처음 넘는 값이 가장 적은 노력입니다."],
    solution: "해마다 <b>+2.0 ~ +2.5 %p</b> 를 옮겨 심으면 평균 40 ~ 45% 입니다.",
    why: "산호 옮겨 심기는 백화 사이의 <b>회복 기간을 줄여</b> 주는 적응 대책입니다. 그러나 이 모형에서도 심는 양을 아무리 늘려도 50% 를 넘기 어렵습니다. 백화를 부르는 수온 상승 자체를 줄이지 않으면 복원만으로는 산호초를 되돌릴 수 없어요.<br>" +
      "실제로 호주·미국 플로리다 등에서 산호 묘목장과 이식이 진행되고 있지만, 과학자들은 온실 기체 감축이 함께 가야 한다고 강조합니다. ※ 이식 효과는 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 2. 가뭄 대비 저수지 */
  {
    id: "c2", tag: "기후 재해 · 가뭄", title: "마른 날을 버틸 저수지", short: "저수지 크기",
    who: "💧", name: "섬마을 물 관리소",
    say: "“우리 섬은 하루에 물 <b>2,000 t</b> 을 씁니다. 비가 오면 저수지가 가득 차지만, 지금까지 가장 길었던 마른 날은 <b>13일</b>이었어요. 기온이 2 ℃ 오른 미래에는 가장 긴 마른 날이 <b>16일</b>로 늘고, 저수지 물의 증발이 1 ℃ 에 약 7% 씩 늘어나니, 계산을 쉽게 하려고 필요한 물 전체를 그만큼(2 ℃ 면 14%) 늘려 잡기로 해요. 미래의 가뭄을 버틸 저수지 용량을 정해 주세요. 너무 크게 지으면(필요량보다 10% 넘게) 예산이 모자랍니다.”",
    predict: {
      q: "기온이 오르면 섬에 필요한 저수지 용량은 어떻게 될까요?",
      options: ["㉠ 연 강수량이 같으니 그대로다", "㉡ 마른 날이 길어지고 증발이 늘어 더 커져야 한다", "㉢ 비가 세게 오니 작아져도 된다"],
      answer: 1
    },
    task: "저수지 용량을 조절해 <b>기온 +2 ℃</b> 미래의 가장 긴 마른 날을 버티게 하세요(필요량의 110% 이하).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, cap = 26000;
      function need() { return 16 * 2000 * (1 + 0.07 * 2); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var n = need(), x0 = 70, y1 = 240, sc = 180 / 60000;
        H.axes(ctx, x0, 30, 560, y1);
        [["지금 필요 (13일)", 26000, "--mist"], ["미래 필요 (16일, 증발 +14%)", n, "--rose"], ["새 저수지", cap, cap >= n && cap <= n * 1.1 ? "--green" : "--amber"]].forEach(function (b, k) {
          var bx = x0 + 20 + k * 160;
          H.box(ctx, bx, y1 - b[1] * sc, 110, b[1] * sc, H.v(b[2]), 0.85);
          H.text(ctx, Math.round(b[1]).toLocaleString() + " t", bx + 55, y1 - b[1] * sc - 8, { s: 12.5, w: "900", a: "center" });
          H.text(ctx, b[0], bx + 55, y1 + 18, { s: 10.5, a: "center", c: H.v("--mist") });
        });
        H.text(ctx, "여유 " + ((cap / n - 1) * 100).toFixed(0) + "%", 620, 120, { s: 22, w: "900", c: cap >= n && cap <= n * 1.1 ? H.v("--green-700") : H.v("--rose-700") });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "저수지 용량", min: 20000, max: 60000, step: 1000, value: 26000, fmt: function (x) { return x.toLocaleString() + " t"; }, onInput: function (x) { cap = x; draw(); api.changed(); } });
      api.info("필요량 = 마른 날 수 × 하루 사용량 × (1 + 증발 증가율).");
      draw();
      return {
        judge: function () {
          var n = need();
          if (cap >= n && cap <= n * 1.1) return { ok: true, msg: cap.toLocaleString() + " t — 미래의 16일 가뭄을 버티고 예산도 지켰습니다." };
          return { ok: false, msg: cap.toLocaleString() + " t — " + (cap < n ? "미래의 가뭄에 물이 바닥납니다." : "필요보다 너무 커 예산을 넘깁니다.") };
        }
      };
    },
    hints: ["16 × 2,000 = 32,000 t 에 증발 증가 14% 를 더하세요.", "32,000 × 1.14 = 36,480 t. 그 이상, 약 40,100 t 이하."],
    solution: "용량 <b>37,000 ~ 40,000 t</b>.",
    why: "기온이 오르면 연 강수량이 비슷해도 <b>비가 오지 않는 날이 길어지고</b>, 저수지와 흙의 물이 더 빨리 증발합니다. 그래서 가뭄 대비 시설은 과거 기록이 아니라 <b>미래 기후</b>에 맞춰 설계해야 합니다. 빗물 재이용, 물을 아끼는 농법, 해수 담수화도 함께 쓰이는 대응입니다.<br>※ 마른 날 수와 증발 증가율은 수업용 가정입니다."
  },

  /* ------------------------------------------------------------------ 3. 늦게 시작한 감축 */
  {
    id: "c3", tag: "탄소예산 · 국제 사회", title: "5년 늦게 출발한 세계", short: "늦은 감축",
    who: "⏱️", name: "기후 총회 사무국",
    say: "“1.5 ℃ 탄소예산은 2020년 기준 약 <b>500 Gt</b>. 해마다 같은 비율로 줄이기 시작하면 8% 면 충분했어요. 그런데 세계가 <b>5년 동안 해마다 40 Gt 을 그대로</b> 내보낸 뒤 2025년에야 감축을 시작한다면요? 예산을 넘지 않는 <b>가장 느린</b> 감축률을 찾아 총회에 보고해 주세요.”",
    predict: {
      q: "감축 시작이 5년 늦어지면 해마다 줄여야 하는 비율은?",
      options: ["㉠ 8% 그대로다", "㉡ 조금만(8.5% 정도) 늘어난다", "㉢ 크게(10% 이상) 늘어난다"],
      answer: 2
    },
    task: "시작 연도를 <b>2025년</b>에 두고, 예산을 넘지 않는 가장 느린 감축률(최소값에서 0.5%p 안)을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, start = 2025, r = 0.08;
      function left() { return 500 - 40 * (start - 2020); }
      function minR() { return 40 / left(); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 600, y0 = 30, y1 = 250, Y0 = 2020, YEARS = 50;
        function X(y) { return x0 + (y - Y0) / YEARS * (x1 - x0); }
        function Y(e) { return y1 - e / 45 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        var pts = [], cum = 0;
        for (var y = Y0; y <= Y0 + YEARS; y += 0.5) { var e = y < start ? 40 : 40 * Math.pow(1 - r, y - start); pts.push([X(y), Y(e)]); }
        ctx.beginPath(); ctx.moveTo(X(Y0), Y(0)); pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); }); ctx.lineTo(X(Y0 + YEARS), Y(0)); ctx.closePath(); ctx.fillStyle = H.v("--coral"); ctx.globalAlpha = .28; ctx.fill(); ctx.globalAlpha = 1;
        H.line(ctx, pts, H.v("--coral"), 2.5);
        [2020, 2030, 2040, 2050, 2060, 2070].forEach(function (yy) { H.text(ctx, yy + "", X(yy), y1 + 16, { s: 10, a: "center", c: H.v("--mist") }); });
        cum = 40 * (start - 2020) + 40 / r;
        var ok = start === 2025 && r >= minR() - 1e-9 && r <= minR() + 0.005 + 1e-9;
        H.rows(ctx, 650, 50, [["시작 연도", start + "년"], ["감축률", (r * 100).toFixed(1) + " %/년"], ["누적 배출", Math.round(cum) + " Gt", cum <= 500 + 1e-6 ? "--green-700" : "--rose-700", true], ["필요한 최소 감축률", (minR() * 100).toFixed(1) + " %"]], 48);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "감축 시작 연도", value: 2025, options: [{ v: 2020, t: "2020년" }, { v: 2025, t: "2025년" }, { v: 2030, t: "2030년" }], onPick: function (x) { start = +x; draw(); api.changed(); } });
      api.slider({ label: "해마다 줄이는 비율", min: 0.03, max: 0.25, step: 0.001, value: 0.08, fmt: function (x) { return (x * 100).toFixed(1) + " %"; }, onInput: function (x) { r = Math.round(x * 1000) / 1000; draw(); api.changed(); } });
      api.info("감축을 시작한 뒤의 누적 배출은 40 ÷ r 에서 멈춥니다. 시작 전까지 쓴 만큼 예산이 줄어듭니다.");
      draw();
      return {
        judge: function () {
          var m = minR(), cum = 40 * (start - 2020) + 40 / r;
          if (start !== 2025) return { ok: false, msg: "사무국이 물은 것은 2025년에 시작하는 경우입니다. 시작 연도를 2025년으로 두세요." };
          if (r >= m - 1e-9 && r <= m + 0.005 + 1e-9) return { ok: true, msg: "2025년 시작 · 해마다 " + (r * 100).toFixed(1) + "% → 누적 " + Math.round(cum) + " Gt. 5년 늦으면 필요한 속도가 8% → 약 13% 로 뜁니다." };
          return { ok: false, msg: "해마다 " + (r * 100).toFixed(1) + "% → 누적 " + Math.round(cum) + " Gt — " + (cum > 500 ? "예산을 넘습니다." : "예산은 지키지만 필요보다 훨씬 빠릅니다(최소값에서 0.5%p 안으로).") };
        }
      };
    },
    hints: ["5년 동안 40 × 5 = 200 Gt 을 먼저 썼습니다. 남은 예산은 300 Gt.", "40 ÷ r ≤ 300 → r ≥ 약 13.3%."],
    solution: "2025년 시작 · 해마다 <b>약 13.4 ~ 13.8%</b>.",
    why: "탄소예산은 은행 잔고와 같습니다. 줄이기를 미루는 동안에도 잔고는 계속 빠져나가, 남은 기간에 훨씬 가파르게 줄여야 합니다. 2020년에 시작하면 해마다 8%, 2025년이면 약 13%, 2030년이면 40% 까지 뛰어오릅니다.<br>" +
      "그래서 파리 협정은 ‘가능한 한 빨리 배출 정점을 지나 감축’할 것을 요구하고, 모든 나라가 5년마다 더 높은 목표를 내도록 합니다. ※ 해마다 같은 비율로 줄인다는 단순화한 계산입니다."
  }
  ]
});
})();
