import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BaseInfoCard from "../components/common/BaseInfoCard";
import PrimaryActionButton from "../components/common/PrimaryActionButton";
import SearchFilterBar from "../components/common/SearchFilterBar";
import { useRecruit } from "../hooks/useRecruit";
import {
  getDefaultRecruitPositionCatalog,
  getPositionDisplayLabel,
  getPositionIdByFilter,
  getPositionTagByFilterValue,
  getRecruitPositionOptions,
} from "../utils/recruit";

const searchOptions = [
  { value: "titleAndContent", label: "제목 + 내용" },
  { value: "hackathon", label: "해커톤" },
];

const statusOptions = [
  { value: "all", label: "모집 상태", dotTone: "neutral" },
  { value: "open", label: "모집중", dotTone: "active" },
  { value: "closed", label: "마감", dotTone: "closed" },
];

const ownershipOptions = [
  { value: "all", label: "전체 글" },
  { value: "mine", label: "내가 작성한 글" },
];

const recruitStatusMeta = {
  open: {
    label: "모집중",
    className: "bg-[#EEF9F1] text-[#1E9F46]",
    dotClassName: "bg-[#28C840]",
  },
  closed: {
    label: "마감",
    className: "bg-[#FFF1F1] text-[#D93A3A]",
    dotClassName: "bg-[#EB3B3B]",
  },
};

const tagColorMap = {
  PM: "bg-[#7E57C2] text-white",
  FE: "bg-[#2A3FFF] text-white",
  BE: "bg-[#4CD137] text-white",
  AI: "bg-[#666666] text-white",
  DB: "bg-[#FFB547] text-white",
  DESIGNER: "bg-[#FF7AB6] text-white",
};

const getTotalCounts = (post) =>
  Object.values(post.positionSlots ?? {}).reduce(
    (acc, slot) => ({
      current: acc.current + (slot.current ?? 0),
      total: acc.total + (slot.total ?? 0),
    }),
    { current: 0, total: 0 },
  );

const getRecruitDisplayCount = (post) => {
  const totalCounts = getTotalCounts(post);
  return Math.max(0, totalCounts.total - totalCounts.current);
};

const getPositionSlotEntries = (post) =>
  Object.entries(post.positionSlots ?? {}).filter(([, slot]) => (slot?.total ?? 0) > 0);

const MemberCountIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`stroke-current ${className}`}>
    <circle cx="12" cy="8" r="4" strokeWidth="1.7" />
    <path
      d="M4.5 19C5.5 15.7 8.2 14 12 14C15.8 14 18.5 15.7 19.5 19"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const HackathonIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`stroke-current ${className}`}>
    <rect x="4.5" y="6" width="15" height="13.5" rx="2.5" strokeWidth="1.7" />
    <path d="M8 4.5V8" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M16 4.5V8" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M4.5 10.5H19.5" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const CloseIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`stroke-current ${className}`}>
    <path d="M7 7L17 17" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 7L7 17" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PositionSlotList = ({ post, compact = false, titled = false }) => (
  <div className={`${compact ? "pt-3" : ""}`}>
    <div className={`flex flex-wrap gap-2 ${titled ? "mt-1" : ""}`}>
      {getPositionSlotEntries(post).map(([tag, slot]) => (
        <div
          key={`${post.id}-${tag}`}
          className={`inline-flex items-center gap-2 rounded-xl border font-black ${
            compact ? "px-2.5 py-2 text-xs" : "px-3 py-2 text-sm"
          } border-slate-200 bg-white text-slate-600`}
        >
          <span
            className={`inline-flex min-w-9 items-center justify-center rounded-md px-2 py-1 text-[10px] font-black ${
              tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
            }`}
          >
            {tag}
          </span>
          <span>{slot.total - slot.current}명</span>
        </div>
      ))}
    </div>
  </div>
);

const RecruitStatusBadge = ({ status }) => {
  const meta = recruitStatusMeta[status] ?? recruitStatusMeta.open;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${meta.className}`}
    >
      <span className={`h-2 w-2 rounded-full ${meta.dotClassName}`} />
      {meta.label}
    </span>
  );
};

const RecruitDetailModal = ({
  post,
  onClose,
  onEdit,
  onDelete,
  onCloseRecruit,
  onJoin,
  positionCatalog,
  isSubmitting = false,
}) => {
  const recruitDisplayCount = getRecruitDisplayCount(post);
  const availablePositions = useMemo(
    () =>
      getPositionSlotEntries(post).filter(([, slot]) => (slot.total ?? 0) > (slot.current ?? 0)),
    [post],
  );
  const [selectedPosition, setSelectedPosition] = useState(availablePositions[0]?.[0] ?? "");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const currentSelectedPosition =
    availablePositions.some(([tag]) => tag === selectedPosition)
      ? selectedPosition
      : (availablePositions[0]?.[0] ?? "");
  const selectedPositionLabel =
    getPositionDisplayLabel(currentSelectedPosition, positionCatalog);
  const messageLength = message.trim().length;

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = async () => {
    if (availablePositions.length === 0) {
      setErrorMessage("현재 지원 가능한 포지션이 없습니다.");
      return;
    }

    if (!currentSelectedPosition) {
      setErrorMessage("지원할 포지션을 선택해 주세요.");
      return;
    }

    if (messageLength < 10) {
      setErrorMessage("메시지는 10자 이상 입력해 주세요.");
      return;
    }

    setErrorMessage("");
    const result = await onJoin(post, {
      teamId: post.teamId,
      positionTag: currentSelectedPosition,
      content: message,
    });

    if (!result?.isSuccess) {
      setErrorMessage(result?.message || "팀 가입 신청을 보내지 못했습니다.");
      setIsSubmitted(false);
      return;
    }

    setActionMessage(`${selectedPositionLabel} 포지션으로 팀 가입 신청을 보냈습니다.`);
    setIsSubmitted(true);
  };

  const handleDelete = async () => {
    const result = await onDelete(post);

    if (!result?.isSuccess) {
      setErrorMessage(result?.message || "팀원 모집 글을 삭제하지 못했습니다.");
      setIsDeleteConfirmOpen(false);
      setActionMessage("");
    }
  };

  const handleCloseRecruit = async () => {
    const result = await onCloseRecruit(post);

    if (!result?.isSuccess) {
      setErrorMessage(result?.message || "팀원 모집 글을 마감하지 못했습니다.");
      setIsCloseConfirmOpen(false);
      setActionMessage("");
      return;
    }

    setErrorMessage("");
    setActionMessage("팀원 모집이 마감되었습니다.");
    setIsCloseConfirmOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,16,32,0.45)] px-4 py-8 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] rounded-[28px] bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.22)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#7C96FF]">{post.version}</span>
              <RecruitStatusBadge status={post.status} />
            </div>
            <h2 className="truncate text-2xl font-black tracking-tight text-slate-950 sm:text-[2rem]">
              {post.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 min-h-10 w-10 min-w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="팀원 모집 상세 닫기"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 py-6">
          <p className="text-sm font-black tracking-[0.01em] text-[#4E6FD8] sm:text-[15px]">
            {post.accent}
          </p>

          <p className="text-base font-medium leading-7 text-slate-800">{post.description}</p>

          {post.isMine ? (
            <div className="rounded-3xl bg-[#F8FAFF] px-4 py-4">
              <p className="text-xs font-bold tracking-[0.12em] text-[#6B86E8]">모집 포지션</p>
              <PositionSlotList post={post} titled />
            </div>
          ) : (
            <>
              <div className="rounded-3xl bg-[#F8FAFF] px-4 py-4">
                <p className="text-xs font-bold tracking-[0.12em] text-[#6B86E8]">지원 포지션 선택</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availablePositions.length > 0 ? (
                    availablePositions.map(([tag, slot]) => {
                      const isSelected = currentSelectedPosition === tag;

                      return (
                        <button
                          key={`${post.id}-${tag}`}
                          type="button"
                          onClick={() => {
                            setSelectedPosition(tag);
                            setErrorMessage("");
                            setIsSubmitted(false);
                          }}
                          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-black transition ${
                            isSelected
                              ? "border-[#336DFE] bg-[#EEF3FF] text-[#2458E6]"
                              : "border-slate-200 bg-white text-slate-600 hover:border-[#C9D7FF] hover:text-slate-800"
                          }`}
                        >
                          <span
                            className={`inline-flex min-w-9 items-center justify-center rounded-md px-2 py-1 text-[10px] font-black ${
                              tagColorMap[tag] ?? "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {tag}
                          </span>
                          <span>{slot.total - slot.current}명</span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm font-medium text-slate-500">
                      현재 지원 가능한 포지션이 없습니다.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 rounded-3xl border border-[#E5ECFF] bg-white px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold tracking-[0.12em] text-[#6B86E8]">지원 메시지</p>
                  <span className="text-xs font-semibold text-slate-400">{messageLength}/300</span>
                </div>

                <textarea
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value.slice(0, 300));
                    if (errorMessage) {
                      setErrorMessage("");
                    }
                    if (isSubmitted) {
                      setIsSubmitted(false);
                    }
                  }}
                  placeholder="팀에 전하고 싶은 자기소개와 협업 경험을 자유롭게 남겨 주세요."
                  className="min-h-[132px] w-full rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-[#AFC5FF] focus:ring-4 focus:ring-[#EEF3FF]"
                />

                {errorMessage ? (
                  <p className="text-sm font-semibold text-[#D93A3A]">{errorMessage}</p>
                ) : null}

              </div>
            </>
          )}

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-[#E5ECFF] bg-[#F8FAFF] px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-[#6B86E8]">
                <HackathonIcon className="h-3.5 w-3.5" />
                참여 해커톤
              </span>
              <p className="mt-2 truncate text-base font-black text-slate-900 sm:text-[1.05rem]">
                {post.hackathonName}
              </p>
            </div>
            <div className="flex items-center gap-3 border-l border-[#D7E2FF] pl-4 sm:gap-4 sm:pl-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#336DFE] shadow-[0_8px_18px_rgba(51,109,254,0.12)]">
                <MemberCountIcon className="h-4 w-4" />
              </span>
              <div className="text-center">
                <span className="block text-xs font-semibold tracking-[0.12em] text-[#6B86E8]">
                  모집 인원
                </span>
                <span className="mt-1 block text-lg font-black text-slate-900">
                  {recruitDisplayCount}명
                </span>
              </div>
            </div>
          </div>

          {post.isMine ? (
            <p className="text-sm font-semibold text-slate-500">
              내가 작성한 모집 글입니다. 내용을 수정하려면 아래 버튼을 눌러 주세요.
            </p>
          ) : null}

          {actionMessage ? (
            <div className="rounded-2xl bg-[#EEF9F1] px-4 py-3 text-sm font-semibold text-[#1E9F46]">
              {actionMessage}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <div className={`w-full ${post.isMine ? "sm:w-full" : "sm:w-auto"}`}>
            {post.isMine ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {post.status === "open" ? (
                  <button
                    type="button"
                    onClick={() => setIsCloseConfirmOpen(true)}
                    className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-[#CFE0FF] bg-[#F5F8FF] px-5 text-sm font-bold text-[#2458E6] transition duration-200 hover:bg-[#EAF1FF] sm:w-auto sm:min-w-[132px]"
                  >
                    마감하기
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-[#FFD4D4] bg-[#FFF6F6] px-5 text-sm font-bold text-[#D93A3A] transition duration-200 hover:bg-[#FFECEC] sm:w-auto sm:min-w-[132px]"
                >
                  삭제하기
                </button>
                <div className="sm:min-w-[132px]">
                  <PrimaryActionButton fullWidth onClick={() => onEdit(post)}>
                    수정하기
                  </PrimaryActionButton>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={availablePositions.length === 0 || isSubmitting}
                className={`inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-sm font-bold text-white transition duration-200 sm:w-auto ${
                  availablePositions.length === 0 || isSubmitting
                    ? "cursor-not-allowed bg-slate-300"
                    : "cursor-pointer bg-[#336DFE] hover:-translate-y-0.5 hover:bg-[#2458E6] hover:shadow-[0_14px_30px_rgba(51,109,254,0.25)]"
                }`}
              >
                {isSubmitting
                  ? "신청 중..."
                  : currentSelectedPosition
                    ? `${currentSelectedPosition} 포지션 지원하기`
                    : "지원하기"}
              </button>
            )}
          </div>
        </div>

        {isDeleteConfirmOpen ? (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-[28px] bg-[rgba(255,255,255,0.78)] px-6 backdrop-blur-[2px]"
            onClick={() => setIsDeleteConfirmOpen(false)}
          >
            <div
              className="w-full max-w-[360px] rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_24px_50px_rgba(15,23,42,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-lg font-black text-slate-950">팀원 모집 글을 삭제하시겠습니까?</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                삭제한 글은 다시 복구할 수 없습니다.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-2xl bg-[#D93A3A] text-sm font-bold text-white transition hover:bg-[#C52F2F]"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {isCloseConfirmOpen ? (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-[28px] bg-[rgba(255,255,255,0.78)] px-6 backdrop-blur-[2px]"
            onClick={() => setIsCloseConfirmOpen(false)}
          >
            <div
              className="w-full max-w-[360px] rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_24px_50px_rgba(15,23,42,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-lg font-black text-slate-950">팀원 모집 글을 마감하시겠습니까?</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                마감 후에는 더 이상 새로운 지원을 받을 수 없습니다.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCloseConfirmOpen(false)}
                  className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleCloseRecruit}
                  className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-2xl bg-[#2458E6] text-sm font-bold text-white transition hover:bg-[#1E4BC2]"
                >
                  마감
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const RecruitCard = ({ post, onOpen }) => {
  const recruitDisplayCount = getRecruitDisplayCount(post);
  const handleOpen = () => onOpen(post);

  return (
    <BaseInfoCard
      className="group flex min-h-[390px] cursor-pointer flex-col p-5 sm:min-h-[410px] sm:p-6"
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
    >
      <div className="flex flex-1 flex-col">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium text-[#7C96FF]">{post.version}</span>
            <RecruitStatusBadge status={post.status} />
          </div>
          <h2 className="truncate text-[1.2rem] font-black tracking-tight text-slate-950 transition duration-200 group-hover:text-[#2458E6] sm:text-[1.35rem]">
            {post.title}
          </h2>
          <p className="text-sm font-black tracking-[0.01em] text-[#4E6FD8] sm:text-[15px]">
            {post.accent}
          </p>
          <PositionSlotList post={post} compact />
        </div>

        <p className="line-clamp-2 pt-4 text-sm font-medium leading-7 text-slate-800 sm:pt-5 sm:text-base">
          {post.description}
        </p>

        <div className="mt-auto pt-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-[#E5ECFF] bg-[#F8FAFF] px-4 py-4">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-[#6B86E8]">
                <HackathonIcon className="h-3.5 w-3.5" />
                참여 해커톤
              </span>
              <p className="mt-2 truncate text-sm font-black text-slate-900 sm:text-[1rem]">
                {post.hackathonName}
              </p>
            </div>
            <div className="flex items-center gap-3 border-l border-[#D7E2FF] pl-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#336DFE] shadow-[0_8px_18px_rgba(51,109,254,0.12)]">
                <MemberCountIcon className="h-4 w-4" />
              </span>
              <div className="text-center">
                <span className="block text-[11px] font-semibold tracking-[0.12em] text-[#6B86E8]">
                  모집 인원
                </span>
                <span className="mt-1 block text-lg font-black text-slate-900">
                  {recruitDisplayCount}명
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5" onClick={(event) => event.stopPropagation()}>
        <PrimaryActionButton fullWidth onClick={handleOpen}>
          상세보기
        </PrimaryActionButton>
      </div>
    </BaseInfoCard>
  );
};

const RecruitMemberPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    fetchPositions,
    fetchList,
    searchArticles,
    joinTeam,
    removeArticle,
    closeArticle,
    isSubmitting,
    isLoading,
    error: errorMessage,
  } = useRecruit();
  const initialSearchCategory =
    searchParams.get("searchCategory") === "hackathon" ? "hackathon" : "titleAndContent";
  const initialSearchValue = searchParams.get("search") ?? "";
  const [searchCategory, setSearchCategory] = useState(initialSearchCategory);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [ownershipFilter, setOwnershipFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [recruitItems, setRecruitItems] = useState([]);
  const [positionCatalog, setPositionCatalog] = useState(getDefaultRecruitPositionCatalog());
  const positionOptions = useMemo(
    () => getRecruitPositionOptions(positionCatalog),
    [positionCatalog],
  );
  const selectedPositionId = useMemo(
    () => getPositionIdByFilter(positionFilter, positionCatalog),
    [positionCatalog, positionFilter],
  );

  useEffect(() => {
    let isMounted = true;

    const loadPositionCatalog = async () => {
      const result = await fetchPositions();

      if (!isMounted || !result?.isSuccess) {
        return;
      }

      setPositionCatalog(result.data?.positionCatalog ?? getDefaultRecruitPositionCatalog());
    };

    loadPositionCatalog();

    return () => {
      isMounted = false;
    };
  }, [fetchPositions]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (searchValue.trim()) {
      nextParams.set("search", searchValue);
    } else {
      nextParams.delete("search");
    }

    if (searchCategory !== "titleAndContent") {
      nextParams.set("searchCategory", searchCategory);
    } else {
      nextParams.delete("searchCategory");
    }

    const nextQuery = nextParams.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchCategory, searchParams, searchValue, setSearchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadRecruitPosts = async () => {
      const trimmedSearch = searchValue.trim();
      const result = trimmedSearch
        ? await searchArticles({
            filter: searchCategory,
            query: trimmedSearch,
          })
        : await fetchList({
            open:
              statusFilter === "all" ? undefined : statusFilter === "open",
            position: selectedPositionId,
          });

      if (!isMounted || !result?.isSuccess) {
        return;
      }

      if (result.data?.positionCatalog?.length) {
        setPositionCatalog(result.data.positionCatalog);
      }

      setRecruitItems(result.data?.posts ?? []);
    };

    loadRecruitPosts();

    return () => {
      isMounted = false;
    };
  }, [fetchList, searchArticles, searchCategory, searchValue, selectedPositionId, statusFilter]);

  const filteredPosts = useMemo(() => {
    const selectedPositionTag = getPositionTagByFilterValue(positionFilter, positionCatalog);

    return recruitItems.filter((post) => {
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesPosition =
        !selectedPositionTag || post.tags.some((tag) => tag === selectedPositionTag);
      const matchesOwnership = ownershipFilter === "all" || post.isMine;

      return matchesStatus && matchesPosition && matchesOwnership;
    });
  }, [ownershipFilter, positionCatalog, positionFilter, recruitItems, statusFilter]);

  const handleEditPost = (post) => {
    setSelectedPost(null);
    navigate(`/teams/write?articleId=${post.articleId}`);
  };

  const handleDeletePost = async (post) => {
    const result = await removeArticle(post.articleId);

    if (!result?.isSuccess) {
      return result;
    }

    setRecruitItems((prev) => prev.filter((item) => item.articleId !== post.articleId));
    setSelectedPost(null);

    return result;
  };

  const handleClosePost = async (post) => {
    const result = await closeArticle(post.articleId);

    if (!result?.isSuccess) {
      return result;
    }

    setRecruitItems((prev) =>
      prev.map((item) =>
        item.articleId === post.articleId
          ? {
              ...item,
              status: "closed",
              rawArticle: {
                ...item.rawArticle,
                isOpen: false,
              },
            }
          : item,
      ),
    );
    setSelectedPost((prev) =>
      prev?.articleId === post.articleId
        ? {
            ...prev,
            status: "closed",
            rawArticle: {
              ...prev.rawArticle,
              isOpen: false,
            },
          }
        : prev,
    );

    return result;
  };

  const handleJoinPost = async (post, application) =>
    joinTeam({
      teamId: application.teamId ?? post.teamId,
      positionTag: application.positionTag,
      content: application.content,
      positionCatalog,
    });

  return (
    <div className="min-h-screen bg-[#F3F6FF]">
      <div className="mx-auto max-w-[1640px] px-4 py-8 sm:px-5 sm:py-10 lg:px-10 lg:py-12">
        <section className="space-y-8 sm:space-y-10">
          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              팀원 모집
            </h1>
          </div>

          <div className="pt-4 sm:pt-8 lg:pt-10">
            <SearchFilterBar
              searchOptions={searchOptions}
              searchCategory={searchCategory}
              onSearchCategoryChange={setSearchCategory}
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
              searchPlaceholder="제목 또는 내용을 입력해 주세요."
              filters={[
                {
                  key: "status",
                  type: "status",
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: statusOptions,
                },
                {
                  key: "position",
                  value: positionFilter,
                  onChange: setPositionFilter,
                  options: positionOptions,
                },
              ]}
              actionButton={
                <div className="w-full sm:w-auto">
                  <PrimaryActionButton fullWidth onClick={() => navigate("/teams/write")}>
                    + 글쓰기
                  </PrimaryActionButton>
                </div>
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ownershipOptions.map((option) => {
              const isActive = ownershipFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setOwnershipFilter(option.value)}
                  className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-black transition ${
                    isActive
                      ? "bg-[#336DFE] text-white shadow-[0_12px_24px_rgba(51,109,254,0.2)]"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-[#C9D7FF] hover:text-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <BaseInfoCard className="rounded-[28px] p-10 text-center text-sm font-medium text-slate-500">
              팀원 모집 목록을 불러오는 중입니다.
            </BaseInfoCard>
          ) : errorMessage ? (
            <BaseInfoCard className="rounded-[28px] p-10 text-center text-sm font-medium text-red-500">
              {errorMessage}
            </BaseInfoCard>
          ) : filteredPosts.length === 0 ? (
            <BaseInfoCard className="rounded-[28px] p-10 text-center text-sm font-medium text-slate-500">
              {ownershipFilter === "mine"
                ? "내가 작성한 팀원 모집 글이 없습니다."
                : "조건에 맞는 팀원 모집 글이 없습니다."}
            </BaseInfoCard>
          ) : (
            <div className="grid gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post) => (
                <RecruitCard key={post.id} post={post} onOpen={setSelectedPost} />
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedPost ? (
        <RecruitDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onCloseRecruit={handleClosePost}
          onJoin={handleJoinPost}
          positionCatalog={positionCatalog}
          isSubmitting={isSubmitting}
        />
      ) : null}
    </div>
  );
};

export default RecruitMemberPage;
