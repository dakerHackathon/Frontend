import { mypageHandlers } from "./mypageHandlers";
import { skillHandlers } from "./skillHandlers";
import { userHandlers } from "./userHandlers";
import { mailHandlers } from "./mailHandlers";

<<<<<<< HEAD
export const totalHandlers = [...userHandlers, ...mypageHandlers, ...skillHandlers];
=======
// 도메인별 핸들러들을 하나로 합칩니다.
export const totalHandlers = [...userHandlers, ...mailHandlers];
>>>>>>> main
