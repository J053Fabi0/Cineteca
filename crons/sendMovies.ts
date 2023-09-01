import { Moment } from "moment";
import { users } from "../constants.ts";
import bot from "../telegram/initBot.ts";
import getMovies from "../utils/getMovies.ts";
import { sendHTMLMessage } from "../utils/sendMessage.ts";

const picturesSent: Record<string, string> = {};

export default async function sendMovies(date: Moment, sendTo = users) {
  date.locale("es");
  const day = date.get("date");
  const monthName = date.format("MMMM");
  const dayName = date.format("dddd");

  await sendHTMLMessage(`Resultados del día <code>${dayName} ${day} de ${monthName}</code>`, sendTo[0]);

  const movies = await getMovies(date);
  const { length } = movies;

  for (let i = 0; i < length; i++) {
    const movie = movies[i];
    // send the photo
    if (movie.image) {
      let caption = `${i + 1}/${length} <b>${movie.title}</b>\n\n`;
      if (movie.description) caption += `${movie.description}\n\n`;
      if (movie.schedule) caption += `<b>Horario:</b> ${movie.schedule}\n`;
      if (movie.location) caption += `<b>Lugar:</b> ${movie.location}\n`;
      if (movie.url) caption += `\n<a href="${movie.url}">Más información</a>`;

      const { photo } = await bot.api.sendPhoto(users[0], picturesSent[movie.image] || movie.image, {
        caption,
        parse_mode: "HTML",
      });

      if (!picturesSent[movie.image]) picturesSent[movie.image] = photo[photo.length - 1].file_id;
    }
  }
}