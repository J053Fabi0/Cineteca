import moment, { Moment } from "moment";
import { timezone } from "../constants.ts";
import Recognizers from "recognizers-text-suite";
import DateTimeRecognizers from "recognizers-text-date-time";

const modules = [Recognizers.Culture.English, Recognizers.Culture.Spanish].map((culture) =>
  new DateTimeRecognizers.DateTimeRecognizer(culture).getDateTimeModel()
);

const utcOffsetDiff = Math.abs(moment().tz(timezone).utcOffset() * -1 - moment().utcOffset() * -1);

/**
 * Parses a natural language string to a date.
 * @param nl The natural language to parse
 */
export default function nlToDate(nl: string): Moment | null {
  for (const timeModule of modules) {
    const result = timeModule.parse(nl)[0]?.resolution?.values[0].value;

    if (result) {
      const date = moment(result).tz(timezone).add(utcOffsetDiff, "minutes");

      if (date.isValid())
        // the result comes in the current timezone, so we need to convert it to UTC
        return moment()
          .tz(timezone)
          .set({ year: date.year(), month: date.month(), date: date.date() })
          .startOf("day");

      // if the result is a number, it's how many seconds to add to the current time
      if (!Number.isNaN(result)) return moment().tz(timezone).add(+result, "seconds");
    }
  }
  return null;
}
