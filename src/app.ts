import express from "https://esm.sh/express@4.18.2";
import { cron } from "https://deno.land/x/deno_cron/cron.ts";
import { Dayjs } from "https://esm.sh/dayjs";
import "./lib/parser.ts";
import { sendMessage } from "./lib/telegram.ts";
import { curiocityParser } from "./lib/parser.ts";
import { escape, delay } from "./lib/utils.ts";

type LastUpdated = {
  curiocity: Dayjs | string | undefined;
  twitter: Dayjs | string | undefined;
};
export const lastUpdated: LastUpdated = {
  curiocity: "",
  twitter: "",
};

console.log("Start CRON schedules!");
cron("30 0 * * *", async () => {
  console.log("RUN curiocity parser");
  const { data, latestPost } = await curiocityParser();
  if (data.length) {
    lastUpdated.curiocity = latestPost;
    for await (const item of data) {
      const message = `${escape(item.title)}\n\n[Open in browser](${item.url})`;
      await sendMessage(message);
      await delay(4000);
    }
  }
});

const app = express();

app.get("/", (req, res) => {
  res.json({ lastUpdated });
});

app.listen(8000);
