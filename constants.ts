import joi from "joi";
import { parse } from "std/jsonc/mod.ts";
import Constants from "./types/constants.type.ts";

const constantsSchema = joi.object<Constants>({
  users: joi.array().items(joi.number()).required(),
  subscribers: joi.array().items(joi.number()).required(),
  cron: joi.string().optional().default("0 */1 * * *"),
  timezone: joi.string().optional().default("America/Monterrey"),
});

const constantsRaw = parse(await Deno.readTextFile("./constants.jsonc"));

const { error, value: constants } = constantsSchema.validate(constantsRaw);

if (error || !constants) {
  console.error(error);
  Deno.exit(1);
}

export const { users, cron, timezone, subscribers } = constants;

/** Both users and subscribers */
export const allUsers = [...new Set([...users, ...constants.subscribers])];
