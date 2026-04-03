import { userHandlers } from "./userHandlers";
import { mailHandlers } from "./mailHandlers";

// 도메인별 핸들러들을 하나로 합칩니다.
export const totalHandlers = [...userHandlers, ...mailHandlers];
