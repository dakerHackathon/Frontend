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
];
