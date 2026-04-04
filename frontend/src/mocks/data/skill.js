export const skillMockResponse = {
  isSuccess: true,
  code: "200",
  message: "요청이 성공적입니다.",
  data: {
    // 다른 화면에서도 mock 데이터가 보이도록 식별 가능한 값을 사용합니다.
    skills: [
      { id: 1, name: "mock-data-Java" },
      { id: 2, name: "mock-data-JavaScript" },
      { id: 3, name: "mock-data-Spring Boot" },
      { id: 4, name: "mock-data-ReactJs" },
    ],
  },
};
