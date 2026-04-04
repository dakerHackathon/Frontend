import { mailHandlers } from "./mailHandlers";
import { mypageHandlers } from "./mypageHandlers";
import { skillHandlers } from "./skillHandlers";
import { userHandlers } from "./userHandlers";
import { hackathonHandlers } from "./hackathonHandlers";
import { rankingHandlers } from "./rankingHandlers";
import { teamHandlers } from "./teamHandlers";
import { recruitHandlers } from "./recruitHandlers";
import { temperatureHandlers } from "./temperatureHandlers";

export const totalHandlers = [
  ...userHandlers,
  ...hackathonHandlers,
  ...rankingHandlers,
  ...mailHandlers,
  ...mypageHandlers,
  ...skillHandlers,
  ...temperatureHandlers,
  ...teamHandlers,
  ...recruitHandlers,
];
