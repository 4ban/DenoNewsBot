// @deno-types="https://esm.sh/express:@types/express@4"
import express, { Request, Response } from "https://esm.sh/express@4.18.2";
import bodyParser from "https://esm.sh/body-parser@latest";
import { cron } from "https://deno.land/x/deno_cron/cron.ts";
import dayjs, { Dayjs } from "https://esm.sh/dayjs";
import "./lib/parser.ts";
import { sendMessage } from "./lib/telegram.ts";
import { serverTime, curiocityParser } from "./lib/parser.ts";
import { historyLog, logger } from "./lib/logger.ts";
import { escape, delay } from "./lib/utils.ts";

type LastUpdated = {
  curiocity: Dayjs | string | undefined;
  twitter: Dayjs | string | undefined;
};
export const lastUpdated: LastUpdated = {
  curiocity: "",
  twitter: "",
};

let lastCheck: Dayjs | string | undefined;

logger({
  date: dayjs(),
  message: "App starting",
});
cron("30 5 * * *", async () => {
  lastCheck = dayjs();
  const { data, latestPost } = await curiocityParser();
  logger({
    date: lastCheck,
    message: "Run CRON job 30 5 * * *",
    data,
    latestPost,
  });
  if (data.length) {
    lastUpdated.curiocity = latestPost;
    for await (const item of data) {
      const message = `${escape(item.title)}\n\n[Open in browser](${item.url})`;
      await sendMessage(message);
      await delay(4000);
      logger({
        date: dayjs(),
        message: "Message sent!",
        data: message,
      });
    }
  }
});

cron("30 0 * * *", async () => {
  lastCheck = dayjs();
  const { data, latestPost } = await curiocityParser();
  logger({
    date: lastCheck,
    message: "Run CRON job 30 0 * * *",
    data,
    latestPost,
  });
  if (data.length) {
    lastUpdated.curiocity = latestPost;
    for await (const item of data) {
      const message = `${escape(item.title)}\n\n[Open in browser](${item.url})`;
      await sendMessage(message);
      await delay(4000);
      logger({
        date: dayjs(),
        message: "Message sent!",
        data: message,
      });
    }
  }
});

const app = express();
app.use(bodyParser.json());

app.get("/", (_req: Request, res: Response) => {
  logger({
    date: dayjs(),
    message: "GET / request",
  });
  res.json({
    serverTime,
    time: dayjs().toString(),
    lastCheck,
    lastUpdated,
    historyLog,
  });
});

app.post("/", (req: Request, res: Response) => {
  try {
    const { title, url } = req.body;
    let message = "";
    if (title) {
      message = `${escape(title)}`;
    }
    if (url) {
      message += `\n\n[Open in browser](${url})`;
    }
    if (message) {
      sendMessage(message);
      res.json({ message: "Successfully sent" });
      logger({
        date: dayjs(),
        message: "POST / request message was sent",
      });
    } else {
      throw new Error("Nothing to send");
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(8000);
