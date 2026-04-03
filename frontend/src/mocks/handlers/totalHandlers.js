import { mailHandlers } from "./mailHandlers";
import { mypageHandlers } from "./mypageHandlers";
import { skillHandlers } from "./skillHandlers";
import { userHandlers } from "./userHandlers";
import { hackathonHandlers } from "./hackathonHandlers";
import { teamHandlers } from "./teamHandlers";
import { recruitHandlers } from "./recruitHandlers";

export const totalHandlers = [
  ...userHandlers,
  ...hackathonHandlers,
  ...mailHandlers,
  ...mypageHandlers,
  ...skillHandlers,
  ...teamHandlers,
  ...recruitHandlers,
];