// api 레지스트리
import { authApi } from "./auth";
import { hackathonApi } from "./hackathon";
import { mypageApi } from "./mypage";
import { skillApi } from "./skill";
import { teamApi } from "./team";
import { mailApi } from "./mail";
import { recruitApi } from "./recruit";
import { rankingApi } from "./ranking";
import { temperatureApi } from "./temperature";
import { userApi } from "./user";

export const API = {
  auth: authApi,
  hackathon: hackathonApi,
  mypage: mypageApi,
  skill: skillApi,
  team: teamApi,
  mail: mailApi,
  recruit: recruitApi,
  ranking: rankingApi,
  temperature: temperatureApi,
  user: userApi,
};
