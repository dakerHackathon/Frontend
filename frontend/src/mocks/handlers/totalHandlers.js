import { mailHandlers } from "./mailHandlers";
import { mypageHandlers } from "./mypageHandlers";
import { skillHandlers } from "./skillHandlers";
import { userHandlers } from "./userHandlers";
import { hackathonHandlers } from "./hackathonHandlers";
import { rankingHandlers } from "./rankingHandlers";
import { teamHandlers } from "./teamHandlers";
import { recruitHandlers } from "./recruitHandlers";

export const totalHandlers = [
  ...userHandlers,
  ...hackathonHandlers,
  ...rankingHandlers,
  ...mailHandlers,
  ...mypageHandlers,
  ...skillHandlers,
  ...teamHandlers,
  ...recruitHandlers,
];
