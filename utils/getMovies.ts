import axiod from "axiod";
import moment, { Moment } from "moment";
import Movie from "../types/movie.type.ts";
import { DOMParser, Element } from "deno-dom";

export default async function getMovies(
  date: number | Date | Moment | Parameters<typeof moment>[0]
): Promise<Movie[]> {
  const dateMoment = moment(date);
  const dateFormatted = dateMoment.format("YYYYMMDD");
  const { data } = await axiod.get<string>(`https://conarte.org.mx/cineteca/?fecha=${dateFormatted}`);

  const doc = new DOMParser().parseFromString(data, "text/html");
  if (!doc) throw new Error("No document");

  const parentDiv = doc.querySelector("#result_area div.internal ul");
  if (!parentDiv) throw new Error("No parent div");

  const movies: Movie[] = [];
  const moviesElements = Array.from(parentDiv.querySelectorAll("li")) as Element[];

  for (const movieElement of moviesElements) {
    const title = movieElement.querySelector(".title strong")?.textContent;
    if (!title) continue;
    const description = movieElement.querySelector(".title .kicker p")?.textContent;
    const location = movieElement.querySelector(".location p strong")?.textContent;
    const schedulesText = movieElement.querySelector(".schedule_hours")?.textContent;
    const url = movieElement.querySelector("a.max_wrap")?.getAttribute("href") ?? undefined;
    const imageElement = movieElement.querySelector("img.attachment-medium.size-medium.wp-post-image");
    const image =
      imageElement?.getAttribute("srcset")?.split(" ")[0] ?? imageElement?.getAttribute("src") ?? undefined;

    // schedulesText has the format 17:00 h., 19:30 h., 21:00 h.

    const schedules: Moment[] = [];
    if (schedulesText) {
      const schedulesTextSplitted = schedulesText.split(", ");
      for (const scheduleText of schedulesTextSplitted) {
        const scheduleMoment = moment(`${dateFormatted} ${scheduleText.replace(" h.", "")}`, "YYYYMMDD HH:mm");
        schedules.push(scheduleMoment);
      }
    }
    schedules.sort((a, b) => a.diff(b));

    movies.push({ title, location, schedules, description, url, image });
  }

  // sort by the first schedule
  movies.sort((a, b) => a.schedules[0].diff(b.schedules[0]));

  // filter movies that have already passed
  return movies.filter((movie) => movie.schedules[0].isAfter(moment()));
}
