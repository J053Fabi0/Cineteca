import moment from "moment";
import bot from "./initBot.ts";
import { users } from "../constants.ts";
import nlToDate from "../utils/nlToDate.ts";
import sendMovies from "../crons/sendMovies.ts";

const ejemplos = ["En dos días", "El siguiente sábado", "Hoy"];

bot.on("message", (ctx) => {
  (async () => {
    if (!users.includes(ctx.chat.id)) return;
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
    if (date.isBefore(moment().startOf("day"))) return ctx.reply("No puedo ver el pasado 😅");

    await sendMovies(date, [ctx.chat.id]);
  })();
});
