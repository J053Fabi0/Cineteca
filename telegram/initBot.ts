import { Bot } from "grammy/mod.ts";
import { BOT_TOKEN } from "../env.ts";

const bot = new Bot(BOT_TOKEN);

export default bot;

bot.start();

import("./messagesHandler.ts");
