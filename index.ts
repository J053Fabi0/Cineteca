import "./initBot.ts";
import Cron from "cron";
import bot from "./initBot.ts";
import nlToDate from "./utils/nlToDate.ts";
import handleError from "./utils/handleError.ts";
import { cron, timezone, users } from "./constants.ts";
import moment from "moment";

// new Cron(cron, { timezone: timezone }, () => doProcess(true));

async function doProcess(sendMessages: boolean) {
  try {
    // code
  } catch (e) {
    handleError(e);
  }
}

bot.on("message", (ctx) => {
  (async () => {
    if (!users.includes(ctx.chat.id)) return;
    const { text } = ctx.message;

    const incorrectText = () =>
      ctx.reply('¿De qué día quieres los resultados?\n\nPor ejemplo: "<code>En dos días</code>"', {
        parse_mode: "HTML",
      });

    if (!text) return incorrectText();

    const date = nlToDate(text);
    if (!date) return incorrectText();
    if (date.isBefore(moment().startOf("day"))) return ctx.reply("No puedo ver el pasado 😅");

    date.locale("es");
    const day = date.get("date");
    const monthName = date.format("MMMM");
    const dayName = date.format("dddd");

    await ctx.reply(`Resultados del día ${dayName} ${day} de ${monthName}`);
  })();
});
