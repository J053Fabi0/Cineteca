import Cron, { CronOptions } from "cron";
import handleError from "../utils/handleError.ts";
import { cron, timezone } from "../constants.ts";
import sendMovies from "./sendMovies.ts";
import moment from "moment";

const options: CronOptions = { catch: handleError, timezone };

new Cron(cron, options, () => sendMovies(moment().add(1, "day")));
