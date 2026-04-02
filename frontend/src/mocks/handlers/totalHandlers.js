import { mypageHandlers } from "./mypageHandlers";
import { skillHandlers } from "./skillHandlers";
import { userHandlers } from "./userHandlers";

export const totalHandlers = [...userHandlers, ...mypageHandlers, ...skillHandlers];
