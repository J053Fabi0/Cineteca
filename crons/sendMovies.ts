import { Moment } from "moment";
import bot from "../telegram/initBot.ts";
import getMovies from "../utils/getMovies.ts";
import { subscribers } from "../constants.ts";
import handleError from "../utils/handleError.ts";
import getDateDescription from "../utils/getDateDescription.ts";
import sendMessage, { sendHTMLMessage } from "../utils/sendMessage.ts";

const picturesSent: Record<string, string> = {};

export default async function sendMovies(date: Moment, sendTo = subscribers) {
  const movies = await getMovies(date);
  const { length } = movies;

  for (const user of sendTo) {
    try {
      await sendHTMLMessage(`Resultados del día <code>${getDateDescription(date)}</code>`, user);

      if (length === 0) {
        await sendMessage("No hay películas disponibles.", user);
        continue;
      }

      for (let i = 0; i < length; i++) {
        const movie = movies[i];

        let caption = `${i + 1}/${length} <b>${movie.title}</b>\n\n`;
        if (movie.description) caption += `${movie.description}\n\n`;
        if (movie.schedules.length > 0) {
          const schedulesText = movie.schedules.map((schedule) => schedule.format("h:mm A")).join(", ");
          caption += `<b>Horario${movie.schedules.length === 1 ? "" : "s"}:</b> ${schedulesText}\n`;
        }
        if (movie.location) caption += `<b>Lugar:</b> ${movie.location}\n`;
        if (movie.url) caption += `\n<a href="${movie.url}">Más información</a>`;

        if (movie.image) {
          const { photo } = await bot.api.sendPhoto(user, picturesSent[movie.image] || movie.image, {
            caption,
            parse_mode: "HTML",
          });

          if (!picturesSent[movie.image]) picturesSent[movie.image] = photo[photo.length - 1].file_id;
        } else {
          await sendHTMLMessage(caption, user, { disable_web_page_preview: true });
        }
      }
    } catch (e) {
      handleError(e);
    }
  }
}
