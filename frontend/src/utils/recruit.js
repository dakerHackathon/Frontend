import { getCurrentUser } from "./auth";

export const recruitPositionMeta = {
  1: { tag: "FE", filterValue: "frontend", label: "프론트엔드" },
  2: { tag: "BE", filterValue: "backend", label: "백엔드" },
  3: { tag: "AI", filterValue: "ai", label: "AI" },
  4: { tag: "DB", filterValue: "data", label: "데이터 / DB" },
  5: { tag: "DESIGNER", filterValue: "designer", label: "디자이너" },
};

export const recruitSearchFilterMap = {
  titleAndContent: "title",
  hackathon: "hack",
};

export const getRecruitUserId = () => {
  const currentUser = getCurrentUser();
  return currentUser?.userId ?? currentUser?.id ?? 1;
};

export const getPositionTag = (positionId) => recruitPositionMeta[positionId]?.tag ?? null;

export const getPositionFilterValue = (positionId) =>
  recruitPositionMeta[positionId]?.filterValue ?? "all";

export const getPositionIdByFilter = (filterValue) => {
  if (!filterValue || filterValue === "all") {
    return null;
  }

  const matchedEntry = Object.entries(recruitPositionMeta).find(
    ([, meta]) => meta.filterValue === filterValue,
  );

  return matchedEntry ? Number(matchedEntry[0]) : null;
};

const parseRecruitCreatedAt = (createdAt) => {
  if (!createdAt) {
    return null;
  }

  return new Date(createdAt.replace(" ", "T"));
};

export const formatRecruitCreatedAt = (createdAt) => {
  const parsedDate = parseRecruitCreatedAt(createdAt);

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return "방금 전";
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - parsedDate.getTime()) / 60000));

  if (diffMinutes < 1) {
    return "방금 전";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
};

export const mapRecruitArticleToPost = ({ article, team }) => {
  const positionSlots = (article.positions ?? []).reduce((acc, positionInfo) => {
    const tag = getPositionTag(positionInfo.position);

    if (!tag) {
      return acc;
    }

    acc[tag] = {
      current: 0,
      total: positionInfo.headCount ?? 0,
    };

    return acc;
  }, {});

  const tags = Object.keys(positionSlots);

  return {
    id: article.id,
    articleId: article.id,
    teamId: team?.id,
    version: formatRecruitCreatedAt(article.createdAt),
    title: article.title,
    accent: team?.name ?? "팀 정보 없음",
    description: article.content,
    content: article.content,
    tags,
    positionSlots,
    status: article.isOpen ? "open" : "closed",
    hackathonName: team?.hackathon?.hackathonTitle ?? "",
    contact: article.contact ?? "",
    rawArticle: article,
  };
};

export const mapRecruitArticlesResponse = (articles = []) =>
  articles.map(mapRecruitArticleToPost);

export const buildRecruitCreatePayload = (form) => ({
  title: form.title.trim(),
  content: form.description.trim(),
  lookingFor: form.tags
    .map((tag) => ({
      positionId: Number(
        Object.entries(recruitPositionMeta).find(([, meta]) => meta.tag === tag)?.[0] ?? 0,
      ),
      headCount: Number(form.positionSlots[tag]?.recruit ?? 0),
    }))
    .filter((item) => item.positionId > 0 && item.headCount > 0),
  contact: form.contact.trim(),
});

export const validateRecruitCreateForm = (form) => {
  if (!form.title.trim()) {
    return "모집 제목을 입력해 주세요.";
  }

  if (!form.description.trim()) {
    return "팀 소개를 입력해 주세요.";
  }

  if (!form.contact.trim()) {
    return "연락 받을 URL을 입력해 주세요.";
  }

  const payload = buildRecruitCreatePayload(form);

  if (payload.lookingFor.length === 0) {
    return "최소 한 개 이상의 모집 포지션과 인원을 설정해 주세요.";
  }

  return "";
};
