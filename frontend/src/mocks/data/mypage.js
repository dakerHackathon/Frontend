export const myPageMockResponse = {
  isSuccess: true,
  code: "200",
  message: "요청이 성공적입니다.",
  data: {
    email: "msw-test-user@email.com",
    nickname: "msw-mypage-user",
    description: "mock-data-description",
    portfolio: "https://mock-portfolio.example.com",
    github: "https://github.com/mock-data-user",
    skills: [1, 2, 3],
    point: 200,
    temperature: 37.6,
    rank: 10,
    winCount: 2,
    partCount: 3,
    part_hackathon: [
      {
        hackathonId: 1,
        hackathonName: "mock-hackathon-alpha",
        start: "2025-05-05",
        end: "2026-05-05",
        position: 1,
      },
      {
        hackathonId: 3,
        hackathonName: "mock-hackathon-beta",
        start: "2025-06-01",
        end: "2026-06-01",
        position: 2,
      },
      {
        hackathonId: 5,
        hackathonName: "mock-hackathon-gamma",
        start: "2025-07-10",
        end: "2026-07-10",
        position: 3,
      },
    ],
    teams: [
      {
        teamId: 1,
        teamName: "mock-team-bloom",
        description: "mock-team-description-1",
      },
      {
        teamId: 2,
        teamName: "mock-team-sprint",
        description: "mock-team-description-2",
      },
      {
        teamId: 3,
        teamName: "mock-team-lab",
        description: "mock-team-description-3",
      },
    ],
    save_hackathon: [
      {
        hackathonId: 2,
        hackathonName: "mock-saved-hackathon-a",
        end: "2026-01-01",
      },
      {
        hackathonId: 3,
        hackathonName: "mock-saved-hackathon-b",
        end: "2026-02-01",
      },
      {
        hackathonId: 5,
        hackathonName: "mock-saved-hackathon-c",
        end: "2026-03-01",
      },
    ],
    unread: 2,
  },
};
