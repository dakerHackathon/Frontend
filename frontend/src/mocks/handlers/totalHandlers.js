import { userHandlers } from "./userHandlers";
import { hackathonHandlers } from "./hackathonHandlers";
import { mailHandlers } from "./mailHandlers";
import { teamHandlers } from "./teamHandlers";

// 도메인별 핸들러들을 하나로 합칩니다.
export const totalHandlers = [...userHandlers, ...hackathonHandlers, ...mailHandlers, ...teamHandlers];
