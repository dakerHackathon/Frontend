import { hackathonHandlers } from "./hackathonHandlers";
import { userHandlers } from "./userHandlers";

// 도메인별 핸들러들을 하나로 합칩니다.
export const totalHandlers = [...userHandlers, ...hackathonHandlers];
