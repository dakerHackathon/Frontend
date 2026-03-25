import { setupWorker } from "msw/browser";
import { totalHandlers } from "./handlers/totalHandlers";

export const worker = setupWorker(...totalHandlers);
