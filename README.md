# A Deno based parsing service
It parses few sources with using cheerio or source API is possible and sends news into a Telegram channel via its REST API

## Installation and Running
```bash
deno run --allow-read --allow-write --allow-net --allow-env src/app.ts

# or
docker compose up --build
```

## Deployment
The bot is deployed on a private server under firewall and there is no public access to its API from the internet. 

The bot is installed in this Telegram channel: [https://t.me/shortbc](https://t.me/shortbc)

