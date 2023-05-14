# A Deno based parsing service
It parses few sources with using cheerio or source API is possible and sends news into a Telegram channel via its REST API

## Installation and Running
```bash
deno run --allow-read --allow-net --allow-env src/app.ts

# or
docker compose up --build
```