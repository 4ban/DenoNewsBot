import "https://deno.land/x/dotenv/load.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

const botToken: string = Deno.env.get("BOT_TOKEN") || "";
const chatID: string = Deno.env.get("CHAT_ID") || "";

export const sendMessage = async (content: string, options: object = {}) => {
  return await axiod.get(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      params: {
        chat_id: chatID,
        text: content,
        parse_mode: "MarkdownV2",
      },
    }
  );
};
