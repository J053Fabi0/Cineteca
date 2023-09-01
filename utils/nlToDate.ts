import Recognizers from "recognizers-text-suite";
import DateTimeRecognizers from "recognizers-text-date-time";
import moment, { Moment } from "moment";

const modules = [Recognizers.Culture.English, Recognizers.Culture.Spanish].map((culture) =>
  new DateTimeRecognizers.DateTimeRecognizer(culture).getDateTimeModel()
);

export default function nlToDate(nl: string): Moment | null {
  for (const timeModule of modules) {
    const result = timeModule.parse(nl)[0]?.resolution?.values[0].value;

    if (result) {
      const date = moment(result);

      if (date.isValid())
        // the result comes in the current timezone, so we need to convert it to UTC
        return moment().set({ year: date.year(), month: date.month(), date: date.date() }).startOf("day");

      // if the result is a number, it's how many seconds to add to the current time
      if (!Number.isNaN(result)) return moment().add(+result, "seconds");
    }
  }
  return null;
}
