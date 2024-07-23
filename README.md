# A Deno based parsing service
The goal of this project is to develop a Deno-based parsing service capable of extracting news from multiple sources. Utilizing cheerio or source API, the service gathers news content and transmits it to a Telegram channel via its REST API. 

## Installation and Running
```bash
deno run --allow-read --allow-write --allow-net --allow-env src/app.ts

# or
docker compose up --build
```

## Deployment
Deployed on a private server behind a firewall and doesn't have a public access from the internet.

The bot is installed in this Telegram channel: [https://t.me/shortbc](https://t.me/shortbc)

PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@16.2.0/install.ts