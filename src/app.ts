// @deno-types="https://esm.sh/express:@types/express@4"
import express, { Request, Response } from "https://esm.sh/express@4.18.2";
import bodyParser from "https://esm.sh/body-parser@latest";
import { cron } from "https://deno.land/x/deno_cron/cron.ts";
import dayjs, { Dayjs } from "https://esm.sh/dayjs";
import "./lib/parser.ts";
import { sendMessage } from "./lib/telegram.ts";
import { serverTime, curiocityParser, twitterParser } from "./lib/parser.ts";
import { historyLog, logger } from "./lib/logger.ts";
import { escape, delay, readState, saveState } from "./lib/utils.ts";

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

const state = await readState();
for (const key in state) {
  (lastUpdated as any)[key] = state[key];
}

// Curiocity job
cron("30 0 * * *", async () => {
  lastCheck = dayjs();
  const { data, errors, latestPost } = await curiocityParser();
  logger({
    date: lastCheck,
    message: "Run CRON Curiocity job 30 0 * * *",
    data,
    errors,
    latestPost,
  });
  if (data.length) {
    lastUpdated.curiocity = latestPost;
    const res = await saveState(lastUpdated);
    logger({
      date: dayjs(),
      message: res,
    });
    for await (const item of data) {
      const message = `${escape(item.title)}\n\n[Open in browser](${item.url})`;
      await sendMessage(message);
      await delay(4000);
    }
  }
});

cron("0 8 * * 5", async () => {
  lastCheck = dayjs();
  logger({
    date: lastCheck,
    message: "Run CRON job 0 8 * * 1",
    data: "Weekly post",
  });
  const message = `${escape(
    "Еженедельный пост знакомство! Оставляйте анкеты в комментариях: город (район), возраст, интересы"
  )}`;
  await sendMessage(message);
});

// Twitter job
cron("30 8 * * *", async () => {
  lastCheck = dayjs();
  const { data, errors, latestPost } = await twitterParser();
  logger({
    date: lastCheck,
    message: "Run CRON Twitter job 30 8 * * *",
    data,
    errors,
    latestPost,
  });
  if (data.length) {
    lastUpdated.twitter = latestPost;
    const res = await saveState(lastUpdated);
    logger({
      date: dayjs(),
      message: res,
    });
    for await (const item of data) {
      const message = `${escape(item.title)}\n\n[Open in browser](${item.url})`;
      await sendMessage(message);
      await delay(4000);
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

// Service endpoint
app.get("/wakeup", (_req: Request, res: Response) => {
  res.json({
    wakeupTime: dayjs().toString(),
    lastUpdated,
    historyLog,
  });
});

app.listen(8000);
