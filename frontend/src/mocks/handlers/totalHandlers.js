<<<<<<< HEAD
import { mailHandlers } from "./mailHandlers";
import { mypageHandlers } from "./mypageHandlers";
import { skillHandlers } from "./skillHandlers";
import { userHandlers } from "./userHandlers";

// 메일, 마이페이지, 스킬, 유저 핸들러를 모두 합칩니다.
export const totalHandlers = [
  ...userHandlers,
  ...mailHandlers,
  ...mypageHandlers,
  ...skillHandlers,
=======
import { userHandlers } from "./userHandlers";
import { hackathonHandlers } from "./hackathonHandlers";
import { mailHandlers } from "./mailHandlers";
import { teamHandlers } from "./teamHandlers";
import { recruitHandlers } from "./recruitHandlers";

// 도메인별 핸들러들을 하나로 합칩니다.
export const totalHandlers = [
  ...userHandlers,
  ...hackathonHandlers,
  ...mailHandlers,
  ...teamHandlers,
  ...recruitHandlers,
>>>>>>> origin/main
];
