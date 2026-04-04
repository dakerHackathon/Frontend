import { getCurrentUser } from "./auth";
import { formatSidebarValue, getRankingProfile } from "../mocks/data/ranking";

export const rankingFilterMap = {
  temperature: "temp",
  mostParticipation: "part",
  mostWins: "win",
};

const rankingTitleMap = {
  temp: "블루밍 온도",
  win: "최다 우승",
  part: "최다 참여",
};

const rankingValueSuffixMap = {
  temp: "°C",
  win: "회",
  part: "회",
};

const rankingValueLabelMap = {
  temp: "온도",
  win: "우승 횟수",
  part: "참여 횟수",
};

export const getRankingUserName = () => {
  const currentUser = getCurrentUser();
  return currentUser?.nickname ?? currentUser?.name ?? "My NickName";
};

export const getRankingUserId = () => {
  const currentUser = getCurrentUser();
  return currentUser?.userId ?? currentUser?.id ?? 1;
};

export const mapRankingRowsResponse = (items = [], filter = "temp") =>
  items.map((item, index) => {
    const profile = getRankingProfile(item.id);

    return {
      id: item.id,
      rank: index + 1,
      name: item.nickname,
      github: item.github,
      points: item.point,
      temperature: Number(item.temperature ?? profile.temperature ?? item.point ?? 0),
      avatar: item.avatar ?? profile.avatar,
      valueSuffix: rankingValueSuffixMap[filter] ?? "점",
      valueLabel: rankingValueLabelMap[filter] ?? "포인트",
    };
  });

export const mapMyRankingResponse = (data = {}) => {
  const currentUser = getRankingUserName();
  const profile = getRankingProfile(18);

  return {
    temp: {
      rank: data.temp?.rank ?? 0,
      point: data.temp?.point ?? 0,
      temperature: Number(data.temp?.temperature ?? profile.temperature ?? data.temp?.point ?? 0),
      name: currentUser,
      github: profile.github,
      avatar: profile.avatar,
    },
    win: {
      rank: data.win?.rank ?? 0,
      point: data.win?.point ?? 0,
      temperature: Number(data.win?.temperature ?? profile.temperature ?? 0),
      name: currentUser,
      github: profile.github,
      avatar: profile.avatar,
    },
    part: {
      rank: data.part?.rank ?? 0,
      point: data.part?.point ?? 0,
      temperature: Number(data.part?.temperature ?? profile.temperature ?? 0),
      name: currentUser,
      github: profile.github,
      avatar: profile.avatar,
    },
  };
};

export const mapRankingSidebarResponse = (data = {}, myRanking = {}) =>
  ["temp", "win", "part"].map((filter) => ({
    title: rankingTitleMap[filter],
    entries: (data[filter] ?? []).map((entry, index) => ({
      rank: entry.rank ?? index + 1,
      name: entry.nickname,
      value: formatSidebarValue(filter, entry.point),
    })),
    currentUser: myRanking[filter]
      ? {
          name: `${getRankingUserName()} - ${myRanking[filter].rank}위`,
          value: formatSidebarValue(filter, myRanking[filter].point),
        }
      : null,
  }));

export const mapCurrentUserRow = (myRanking = {}, periodKey = "temperature") => {
  const filter = rankingFilterMap[periodKey] ?? "temp";
  const item = myRanking[filter];

  if (!item) {
    return null;
  }

  return {
    rank: item.rank,
    name: item.name,
    github: item.github,
    points: item.point,
    temperature: item.temperature,
    avatar: item.avatar,
    valueSuffix: rankingValueSuffixMap[filter],
    valueLabel: rankingValueLabelMap[filter],
  };
};
