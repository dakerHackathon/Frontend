import { http, HttpResponse } from "msw";
import {
  getStoredRecruitArticles,
  mockRecruitTeams,
  saveStoredRecruitArticles,
} from "../data/recruits";

const shouldFail = false;

const success = (data) => ({
  isSuccess: true,
  code: "200",
  message: "요청이 성공적입니다.",
  data,
});

const filterRecruitArticles = (articles, { open, position, filter, query }) => {
  const normalizedQuery = (query ?? "").trim().toLowerCase();

  return articles.filter(({ article, team }) => {
    const matchesOpen =
      open === null || open === undefined ? true : article.isOpen === Boolean(Number(open));
    const matchesPosition =
      !position || article.positions.some((item) => item.position === Number(position));
    const searchableText =
      filter === "hack"
        ? team.hackathon.hackathonTitle
        : `${article.title} ${article.content}`;
    const matchesQuery =
      normalizedQuery.length === 0 || searchableText.toLowerCase().includes(normalizedQuery);

    return matchesOpen && matchesPosition && matchesQuery;
  });
};

export const recruitHandlers = [
  http.get("/camp/:userId/recruit", ({ request, params }) => {
    console.log(`✅ MSW intercepted: GET /camp/${params.userId}/recruit`);

    if (shouldFail) {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "500",
          message: "팀원 모집 목록을 불러오는 중 오류가 발생했습니다.",
          data: null,
        },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const open = url.searchParams.get("open");
    const position = url.searchParams.get("position");
    const articles = filterRecruitArticles(getStoredRecruitArticles(), {
      open,
      position,
    });

    return HttpResponse.json(success({ articles }));
  }),
  http.get("/camp/:userId/recruit/search", ({ request, params }) => {
    console.log(`✅ MSW intercepted: GET /camp/${params.userId}/recruit/search`);

    const url = new URL(request.url);
    const filter = url.searchParams.get("filter") ?? "title";
    const query = url.searchParams.get("query") ?? "";
    const articles = filterRecruitArticles(getStoredRecruitArticles(), {
      filter,
      query,
    });

    return HttpResponse.json(success({ articles }));
  }),
  http.post("/camp/:userId/recruit/:teamId", async ({ request, params }) => {
    console.log(`✅ MSW intercepted: POST /camp/${params.userId}/recruit/${params.teamId}`);

    const body = await request.json();
    const storedArticles = getStoredRecruitArticles();
    const team = mockRecruitTeams.find((item) => item.id === Number(params.teamId));

    if (!team) {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "404",
          message: "등록할 팀 정보를 찾을 수 없습니다.",
          data: null,
        },
        { status: 404 },
      );
    }

    const nextArticleId =
      storedArticles.reduce((maxId, item) => Math.max(maxId, item.article.id), 0) + 1;
    const createdArticle = {
      article: {
        id: nextArticleId,
        title: body.title,
        content: body.content,
        positions: (body.lookingFor ?? []).map((item) => ({
          position: item.positionId,
          headCount: item.headCount,
        })),
        isOpen: true,
        createdAt: "2026-04-04 12:00",
        contact: body.contact,
      },
      team,
    };

    saveStoredRecruitArticles([createdArticle, ...storedArticles]);

    return HttpResponse.json(success({ articleId: nextArticleId }));
  }),
  http.patch("/camp/:userId/recruit/:articleId", async ({ request, params }) => {
    console.log(`✅ MSW intercepted: PATCH /camp/${params.userId}/recruit/${params.articleId}`);

    const body = await request.json();
    const articleId = Number(params.articleId);
    const updatedArticles = getStoredRecruitArticles().map((item) =>
      item.article.id === articleId
        ? {
            ...item,
            article: {
              ...item.article,
              title: body.title,
              content: body.content,
              positions: (body.lookingFor ?? []).map((positionInfo) => ({
                position: positionInfo.positionId,
                headCount: positionInfo.headCount,
              })),
              contact: body.contact,
            },
          }
        : item,
    );

    saveStoredRecruitArticles(updatedArticles);

    return HttpResponse.json(success({ articleId }));
  }),
  http.delete("/camp/:userId/recruit", async ({ request, params }) => {
    console.log(`✅ MSW intercepted: DELETE /camp/${params.userId}/recruit`);

    const body = await request.json();
    const articleId = Number(body.articleId);
    const filteredArticles = getStoredRecruitArticles().filter(
      (item) => item.article.id !== articleId,
    );

    saveStoredRecruitArticles(filteredArticles);

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),
  http.post("/camp/:userId/recruit/close", async ({ request, params }) => {
    console.log(`✅ MSW intercepted: POST /camp/${params.userId}/recruit/close`);

    const body = await request.json();
    const articleId = Number(body.articleId);
    const updatedArticles = getStoredRecruitArticles().map((item) =>
      item.article.id === articleId
        ? {
            ...item,
            article: {
              ...item.article,
              isOpen: false,
            },
          }
        : item,
    );

    saveStoredRecruitArticles(updatedArticles);

    return HttpResponse.json(success({ articleId }));
  }),
];
