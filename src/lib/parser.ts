import axiod from "https://deno.land/x/axiod/mod.ts";
import dayjs, { Dayjs } from "https://esm.sh/dayjs";
import utc from "https://esm.sh/dayjs/plugin/utc";
import timezone from "https://esm.sh/dayjs/plugin/timezone";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { findUserId, getTweets } from "./twitter.ts";

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
  const data: {
    url: string | undefined;
    title: string;
    date?: Dayjs | string;
  }[] = [];
  const errors: string[] = [];

  if (sourceTable.curiocity) {
    for (const source of sourceTable.curiocity) {
      try {
        const response = await axiod.get(source.url);
        const $ = cheerio.load(response.data);
        const posts = $("div.latest-stories").find("article.card");
        posts.each((_i: number, post: any) => {
          data.push({
            url: $(post).find("a.card__link").attr("href"),
            title: $(post).find("h3.card__title").text().trim(),
          });
        });
      } catch (err) {
        errors.push(err);
      }
    }

    if (data) {
      for (const source of data) {
        try {
          const html = await axiod.get(source.url ? source.url : "");
          const $ = cheerio.load(html.data);
          const postDate = $("dl.post__date time").text().trim();
          source.date = dayjs(postDate);
        } catch (err) {
          errors.push(err);
        }
      }
    }
  }

  const filteredData = data.filter((item) =>
    lastUpdated.curiocity
      ? dayjs(item.date).isAfter(lastUpdated.curiocity)
      : item
  );
  const sortedData = filteredData.sort((a, b) =>
    dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
  );

  return {
    data: sortedData,
    errors,
    latestPost: sortedData.length ? sortedData[sortedData.length - 1].date : "",
  };
};

export const twitterParser = async () => {
  const resultData: {
    url: string | undefined;
    title: string;
    date?: Dayjs | string;
  }[] = [];
  const errors: string[] = [];

  if (sourceTable.twitter) {
    for (const source of sourceTable.twitter) {
      try {
        const {
          data: {
            data: { id },
          },
        } = await findUserId(source.url);
        if (id) {
          const {
            data: { data },
          } = await getTweets(id);
          data.forEach((tweet: any) => {
            if (
              !lastUpdated.twitter ||
              dayjs(tweet.created_at).isAfter(lastUpdated.twitter, "minute")
            ) {
              resultData.push({
                date: dayjs(tweet.created_at),
                title: tweet.text,
                url: `https://twitter.com/${source.url}/status/${tweet.id}`,
              });
            }
          });
        } else {
          throw new Error("No id found");
        }
      } catch (err) {
        errors.push(err);
      }
    }
  }

  const sortedData = resultData.sort((a, b) =>
    dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
  );

  return {
    data: sortedData,
    errors,
    latestPost: sortedData.length ? sortedData[sortedData.length - 1].date : "",
  };
};
