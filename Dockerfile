FROM denoland/deno:1.33.3
WORKDIR /app
EXPOSE 8100
ADD . /app
USER deno
RUN deno cache src/app.ts
CMD ["run", "--allow-net","--allow-read","--allow-write", "--allow-env", "src/app.ts"]
