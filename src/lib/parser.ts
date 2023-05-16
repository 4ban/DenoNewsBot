import axiod from "https://deno.land/x/axiod/mod.ts";
import dayjs, { Dayjs } from "https://esm.sh/dayjs";
import utc from "https://esm.sh/dayjs/plugin/utc";
import timezone from "https://esm.sh/dayjs/plugin/timezone";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

import sources from "../sources.json" assert { type: "json" };
import { lastUpdated } from "../app.ts";

dayjs.extend(utc);
dayjs.utc();
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Vancouver");

type SourceItem = {
  type: string;
  url: string;
};
type SourceType = {
  curiocity: SourceItem[] | null;
  twitter: SourceItem[] | null;
};
// Filter out sources by type into sourcaTable
const sourceTable: SourceType = {
  curiocity: null,
  twitter: null,
};

const sourceFilter = () => {
  sourceTable.curiocity = sources.filter((i) => i.type === "curiocity");
  sourceTable.twitter = sources.filter((i) => i.type === "twitter");
};
sourceFilter();
export const serverTime = dayjs();

export const curiocityParser = async () => {
  const data: { url: string; title: string; date?: Dayjs | string }[] = [];
  if (sourceTable.curiocity) {
    for (const source of sourceTable.curiocity) {
      try {
        const response = await axiod.get(source.url);
        const $ = cheerio.load(response.data);
        const posts = $("div.latest-stories").find("article.card");
        posts.each((_i: number, post: any) => {
          const elapsedDate = $(post)
            .find("span.card__date")
            .text()
            .trim()
            .split(" ");

          let newDate: string | Dayjs = dayjs()
            .set("minute", 0)
            .set("second", 0);

          if (["day", "days"].includes(elapsedDate[1])) {
            newDate = newDate.subtract(Number(elapsedDate[0]), "day");
          } else if (["hour", "hours"].includes(elapsedDate[1])) {
            newDate = newDate.subtract(Number(elapsedDate[0]), "hour");
          }
          if (
            !lastUpdated.curiocity ||
            dayjs(newDate).isAfter(lastUpdated.curiocity, "hour")
          ) {
            data.push({
              url: $(post).find("a.card__link").attr("href"),
              title: $(post).find("h3.card__title").text().trim(),
              date: newDate.toString(),
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  const sortedData = data.sort((a, b) =>
    dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
  );

  return {
    data: sortedData,
    latestPost: sortedData[sortedData.length - 1].date,
  };
};

export const twitterParser = () => {};
