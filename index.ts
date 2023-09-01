import Cron from "cron";
import "./telegram/initBot.ts";
import nlToDate from "./utils/nlToDate.ts";
import handleError from "./utils/handleError.ts";
import { cron, timezone, users } from "./constants.ts";
import moment from "moment";

new Cron(cron, { timezone: timezone }, () => doProcess(true));

async function doProcess(sendMessages: boolean) {
  try {
    // code
  } catch (e) {
    handleError(e);
  }
}
