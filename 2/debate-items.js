/* 기후변화와 환경생태 Ⅱ — 근거 카드 토론(선택 활동). 공용 부품: ../assets/debate.js (sthDebate) · 자료 단추는 ../assets/link.js
   하지 않아도 이야기·문제 진행에는 영향이 없다. */
window.sthDebate({
  mount: "debate", key: "sea",
  title: "차오르는 바다, 해안 도시는 어떻게 할까?",
  issue: "해수면 상승에 맞서 해안 도시는 방조제·방벽을 더 높여 지켜야 할까, 위험한 곳에서 물러나야 할까?",
  sides: [
    { k: "a", label: "막아서 지켜야 한다", say: "방조제·수문으로 도시와 삶터를 그대로 지킨다" },
    { k: "b", label: "물러나야 한다", say: "막는 비용과 위험이 커지므로 높은 곳으로 옮기고 습지를 되살린다" }
  ],
  cards: [
    { id: "sl", title: "전 지구 평균 해수면의 변화", view: "owid:sea-level|전 지구 평균 해수면", hint: "1900년 뒤로 몇 cm 올랐고, 최근에 더 빨라졌나" },
    { id: "ice", title: "빙상의 질량 변화(그린란드·남극)", view: "owid:ice-sheet-mass-balance|빙상 질량", hint: "해마다 얼마나 줄고 있나 — 해수면을 올리는 까닭 ①" },
    { id: "heat", title: "바다가 품은 열(해양 열 함량)", view: "owid:ocean-heat-content-upper|해양 열 함량", hint: "바다가 데워지면 부피가 커진다 — 해수면을 올리는 까닭 ②" },
    { id: "nl", title: "네덜란드 동부 스헬데 방조제(막는 쪽의 예)", view: "place:51.6596,3.7227,12,s", open: "현장 위성 사진 열기", hint: "바다를 막는 수문의 크기, 뒤쪽의 낮은 땅" },
    { id: "vn", title: "베네치아 석호와 바다 입구(MOSE 방벽)", view: "place:45.40,12.35,11,sv", open: "현장 위성 사진 열기", hint: "석호와 바다를 잇는 입구에 방벽을 세운 까닭" },
    { id: "ml", title: "몰디브 수도 말레(국토 평균 높이 약 1.5 m)", view: "place:4.1780,73.5107,14,s", open: "현장 위성 사진 열기", hint: "섬 전체가 도시로 덮인 모습 — 물러날 곳이 있을까" },
    { id: "co2", title: "나라별 이산화 탄소 배출량", view: "owid:annual-co2-emissions-per-country|이산화 탄소 배출량", hint: "해수면을 올린 배출은 주로 어느 나라에서 나왔나 — 비용은 누가 내야 할까" }
  ],
  note: "그래프는 영어입니다. 숫자는 그래프에서 직접 읽어 적고, 언제 자료인지(연도)도 함께 적습니다. 위성 사진은 📍 단추처럼 누르면 바로 아래에 열립니다."
});
