import moment from "moment";
import Cron, { CronOptions } from "cron";
import sendMovies from "./sendMovies.ts";
import { cron, timezone } from "../constants.ts";
import handleError from "../utils/handleError.ts";

const options: CronOptions = { catch: handleError, timezone };

new Cron(cron, options, () => sendMovies(moment().add(1, "day")));
