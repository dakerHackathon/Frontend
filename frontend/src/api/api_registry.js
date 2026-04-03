//api 紐⑥쓬吏?
import { authApi } from "./auth";
import { hackathonApi } from "./hackathon";
import { mypageApi } from "./mypage";
import { teamApi } from "./team";
import { mailApi } from "./mail";
import { recruitApi } from "./recruit";

export const API = {
  auth: authApi,
  hackathon: hackathonApi,
  mypage: mypageApi,
  team: teamApi,
  mail: mailApi,
  recruit: recruitApi,
};
