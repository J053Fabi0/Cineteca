import moment, { Moment } from "moment";
import { timezone } from "../constants.ts";
import Recognizers from "recognizers-text-suite";
import DateTimeRecognizers from "recognizers-text-date-time";

const modules = [Recognizers.Culture.Spanish, Recognizers.Culture.English].map((culture) =>
  new DateTimeRecognizers.DateTimeRecognizer(culture).getDateTimeModel()
);

// This has to be added
const utcOffsetDiff = moment().tz(timezone).utcOffset() - moment().utcOffset();

const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const timeRegex = /\d{2}:\d{2}:\d{2}/;

/**
 * Parses a natural language string to a date.
 * @param nl The natural language to parse
 */
export default function nlToDate(nl: string): Moment | null {
  for (const timeModule of modules) {
    const result = timeModule.parse(nl)[0]?.resolution?.values[0].value;
    // result can be 2023-11-27 03:00:00, just 2023-11-27, or just 03:00:00
    // it can also be a number, which is how many seconds to subtract to the current time,
    // but we don't care about that

    const hasDate = dateRegex.exec(result);
    if (!hasDate) {
      if (timeRegex.test(result)) return moment().tz(timezone).startOf("day");
      continue;
    }

    const [year, month, date, hour, minute] = moment()
      .format("YYYY M D H m")
      .split(" ")
      .map((x) => +x);

    return moment()
      .tz(timezone)
      .set({ year, month: month - 1, date, hour, minute })
      .add(utcOffsetDiff, "minutes")
      .startOf("day");
  }

  return null;
}
