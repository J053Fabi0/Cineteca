import moment from "moment";
import bot from "./initBot.ts";
import { allUsers } from "../constants.ts";
import nlToDate from "../utils/nlToDate.ts";
import sendMovies from "../crons/sendMovies.ts";
import getDateDescription from "../utils/getDateDescription.ts";

const ejemplos = ["En dos días", "Este sábado", "El siguiente sábado", "Hoy"];

bot.on("message", (ctx) => {
  if (!allUsers.includes(ctx.chat.id)) return;

  const { text } = ctx.message;

  const incorrectText = () =>
    ctx.reply(
      `¿De qué día quieres los resultados?\n\n` +
        `Por ejemplo:\n - <code>${ejemplos.join("</code>\n - <code>")}</code>`,
      { parse_mode: "HTML" }
    );

  if (!text) return incorrectText();

  const date = nlToDate(text);
  if (!date) return incorrectText();
  if (date.isBefore(moment().startOf("day")))
    return ctx.reply(
      `No puedo ver el pasado 😅.\n\nEste fue el día que entendí: <code>${getDateDescription(date, true)}</code>`,
      { parse_mode: "HTML" }
    );

  sendMovies(date, [ctx.chat.id]);
});
