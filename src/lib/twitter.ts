import "https://deno.land/x/dotenv/load.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

const apiKey = Deno.env.get("TWITTER_API_KEY");
const apiSecret = Deno.env.get("TWITTER_SECRET");
const bearerToken = Deno.env.get("TWITTER_BEARER");

const baseUrl = "https://api.twitter.com/2";

export const findUserId = async (username: string) => {
  return await axiod.get(`${baseUrl}/users/by/username/${username}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const getTweets = async (id: string) => {
  return await axiod.get(`${baseUrl}/users/${id}/tweets`, {
    params: {
      "tweet.fields": "created_at",
    },
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};
