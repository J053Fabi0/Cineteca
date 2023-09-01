import { Moment } from "moment";

export default function getDateDescription(date: Moment, addYear = false) {
  date.locale("es");
  const day = date.get("date");
  const monthName = date.format("MMMM");
  const dayName = date.format("dddd");

  return `${dayName} ${day} de ${monthName}` + (addYear ? ` del año ${date.get("year")}` : "");
}
