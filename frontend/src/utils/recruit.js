import { getCurrentUser } from "./auth";
import axiosInstance from "../api/axiosInstance";

const recruitBasePositionMeta = {
  pm: { tag: "PM", filterValue: "pm", label: "PM" },
  frontend: { tag: "FE", filterValue: "frontend", label: "프론트엔드" },
  backend: { tag: "BE", filterValue: "backend", label: "백엔드" },
  ai: { tag: "AI", filterValue: "ai", label: "AI" },
  data: { tag: "DB", filterValue: "data", label: "데이터 / DB" },
  designer: { tag: "DESIGNER", filterValue: "designer", label: "디자이너" },
};

const fallbackRecruitPositions = [
  { id: 1, name: "Project Manager", abb: "PM" },
  { id: 2, name: "FrontEnd", abb: "FE" },
  { id: 3, name: "BackEnd", abb: "BE" },
  { id: 4, name: "AI", abb: "AI" },
  { id: 5, name: "Database", abb: "DB" },
  { id: 6, name: "Designer", abb: "DESIGNER" },
];

const isLocalMockApiMode = () => {
  const baseURL = String(axiosInstance.defaults.baseURL ?? "");
  return baseURL.includes("localhost:5173") || baseURL.includes("127.0.0.1:5173");
};

const normalizeRecruitPositionName = (name = "") => {
  const normalized = String(name).trim().toLowerCase().replace(/[\s/_-]/g, "");

  if (normalized === "pm") return "pm";
  if (normalized === "fe") return "frontend";
  if (normalized === "frontend" || normalized === "front") return "frontend";
  if (normalized === "be") return "backend";
  if (normalized === "backend" || normalized === "back") return "backend";
  if (normalized === "ai") return "ai";
  if (normalized === "db" || normalized === "database" || normalized === "data") return "data";
  if (normalized === "designer" || normalized === "design") return "designer";

  return normalized;
};

const mapApiPositionToCatalogItem = (position) => {
  const abb = String(position?.abb ?? "").trim().toUpperCase();
  const baseMeta =
    recruitBasePositionMeta[
      normalizeRecruitPositionName(position?.abb || position?.name)
    ] ?? null;

  if (baseMeta) {
    return {
      id: Number(position.id),
      name: position.name,
      abb,
      tag: abb || baseMeta.tag,
      filterValue: abb ? abb.toLowerCase() : baseMeta.filterValue,
      label: abb || baseMeta.tag,
    };
  }

  const normalizedName = String(position?.name ?? "").trim();

  return {
    id: Number(position.id),
    name: normalizedName,
    abb,
    tag: abb || normalizedName.toUpperCase(),
    filterValue: abb ? abb.toLowerCase() : normalizedName.toLowerCase(),
    label: abb || normalizedName,
  };
};

export const getDefaultRecruitPositionCatalog = () =>
  isLocalMockApiMode() ? fallbackRecruitPositions.map(mapApiPositionToCatalogItem) : [];

export const mapRecruitPositionsResponse = (positions = []) => {
  const catalog = positions
    .map(mapApiPositionToCatalogItem)
    .filter((position) => Number.isFinite(position.id) && position.tag);

  if (catalog.length > 0) {
    return catalog;
  }

  // 로컬 MSW 개발 모드에서만 기본 포지션 목업을 사용하고,
  // 실제 백엔드와 직접 통신할 때는 임의 데이터를 섞지 않는다.
  return getDefaultRecruitPositionCatalog();
};

export const createRecruitPositionSlots = (positionCatalog = getDefaultRecruitPositionCatalog()) =>
  positionCatalog.reduce((acc, position) => {
    acc[position.tag] = { recruit: 0 };
    return acc;
  }, {});

export const getRecruitTagOptions = (positionCatalog = getDefaultRecruitPositionCatalog()) =>
  positionCatalog.map((position) => position.tag);

export const getRecruitPositionOptions = (positionCatalog = getDefaultRecruitPositionCatalog()) => [
  { value: "all", label: "포지션" },
  ...positionCatalog.map((position) => ({
    value: position.filterValue,
    label: position.label,
  })),
];

const findCatalogItemById = (positionId, positionCatalog = getDefaultRecruitPositionCatalog()) =>
  positionCatalog.find((position) => position.id === Number(positionId));

const findCatalogItemByTag = (tag, positionCatalog = getDefaultRecruitPositionCatalog()) =>
  positionCatalog.find((position) => position.tag === tag);

export const recruitSearchFilterMap = {
  titleAndContent: "title",
  hackathon: "hack",
};

export const getRecruitUserId = () => {
  const currentUser = getCurrentUser();
  return currentUser?.userId ?? currentUser?.id ?? 1;
};

export const getPositionTag = (positionId, positionCatalog = getDefaultRecruitPositionCatalog()) =>
  findCatalogItemById(positionId, positionCatalog)?.tag ?? null;

export const getPositionIdByTag = (
  tag,
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => findCatalogItemByTag(tag, positionCatalog)?.id ?? null;

export const getPositionDisplayLabel = (
  tag,
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => findCatalogItemByTag(tag, positionCatalog)?.label ?? tag;

export const getPositionTagByFilterValue = (
  filterValue,
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => {
  if (!filterValue || filterValue === "all") {
    return null;
  }

  return positionCatalog.find((position) => position.filterValue === filterValue)?.tag ?? null;
};

export const getPositionFilterValue = (
  positionId,
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => findCatalogItemById(positionId, positionCatalog)?.filterValue ?? "all";

export const getPositionIdByFilter = (
  filterValue,
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => {
  if (!filterValue || filterValue === "all") {
    return null;
  }

  return (
    positionCatalog.find((position) => position.filterValue === filterValue)?.id ?? null
  );
};

const parseRecruitCreatedAt = (createdAt) => {
  if (!createdAt) {
    return null;
  }

  const normalizedValue = String(createdAt).trim().replace(" ", "T");

  if (!normalizedValue) {
    return null;
  }

  // 백엔드가 timezone 없이 UTC 기준 시각을 내려주는 경우가 있어,
  // 오프셋 정보가 없는 문자열은 UTC로 간주해 KST 기준 상대 시간을 맞춘다.
  if (!/[zZ]|[+-]\d{2}:\d{2}$/.test(normalizedValue)) {
    return new Date(`${normalizedValue}Z`);
  }

  return new Date(normalizedValue);
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

export const mapRecruitArticleToPost = (
  { article, team },
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => {
  const currentUserId = getRecruitUserId();
  const isArticleOpen = article.open ?? article.isOpen;
  const positionSlots = (article.positions ?? []).reduce((acc, positionInfo) => {
    const tag = getPositionTag(positionInfo.position, positionCatalog);

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
    // 모집 상태는 응답의 open 값을 우선 사용하고,
    // 이전 응답 shape와의 호환을 위해 isOpen도 함께 허용한다.
    status: isArticleOpen === false ? "closed" : "open",
    hackathonName: team?.hackathon?.hackathonTitle ?? "",
    contact: article.contact ?? "",
    writer: article.writer ?? null,
    isMine: Number(article.writer) === Number(currentUserId),
    rawArticle: article,
  };
};

export const mapRecruitArticlesResponse = (
  articles = [],
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => articles.map((article) => mapRecruitArticleToPost(article, positionCatalog));

export const buildRecruitCreatePayload = (
  form,
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => ({
  title: form.title.trim(),
  content: form.description.trim(),
  lookingFor: form.tags
    .map((tag) => ({
      positionId: Number(findCatalogItemByTag(tag, positionCatalog)?.id ?? 0),
      headCount: Number(form.positionSlots[tag]?.recruit ?? 0),
    }))
    .filter((item) => item.positionId > 0 && item.headCount > 0),
  contact: form.contact.trim(),
});

export const mapRecruitPostToForm = (
  post,
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => {
  const positionSlots = createRecruitPositionSlots(positionCatalog);

  post.tags.forEach((tag) => {
    positionSlots[tag] = {
      recruit: Math.max(1, Number(post.positionSlots?.[tag]?.total ?? 1)),
    };
  });

  return {
    title: post.title ?? "",
    teamId: post.teamId ?? "",
    tags: post.tags ?? [],
    description: post.content ?? post.description ?? "",
    contact: post.contact ?? "",
    status: post.status ?? "open",
    positionSlots,
  };
};

export const mergeRecruitPositionSlots = (
  positionSlots,
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => {
  const nextSlots = createRecruitPositionSlots(positionCatalog);

  positionCatalog.forEach((position) => {
    nextSlots[position.tag] = {
      recruit: Number(positionSlots?.[position.tag]?.recruit ?? 0),
    };
  });

  return nextSlots;
};

export const validateRecruitCreateForm = (
  form,
  positionCatalog = getDefaultRecruitPositionCatalog(),
) => {
  if (!form.teamId) {
    return "내 팀을 선택해 주세요.";
  }

  if (!form.title.trim()) {
    return "모집 제목을 입력해 주세요.";
  }

  if (!form.description.trim()) {
    return "팀 소개를 입력해 주세요.";
  }

  if (!form.contact.trim()) {
    return "연락 받을 URL을 입력해 주세요.";
  }

  const payload = buildRecruitCreatePayload(form, positionCatalog);

  if (payload.lookingFor.length === 0) {
    return "최소 한 개 이상의 모집 포지션과 인원을 설정해 주세요.";
  }

  return "";
};
