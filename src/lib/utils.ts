export const escape = (text: string) => {
  const SPECIAL_CHARS = [
    "\\",
    "_",
    "*",
    "[",
    "]",
    "(",
    ")",
    "~",
    "`",
    ">",
    "<",
    "&",
    "#",
    "+",
    "-",
    "=",
    "|",
    "{",
    "}",
    ".",
    "!",
  ];
  SPECIAL_CHARS.forEach((char) => (text = text.replaceAll(char, `\\${char}`)));
  return text;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const saveState = async (text: string | {}) => {
  try {
    await Deno.writeTextFile(
      `${Deno.cwd()}/src/config.json`,
      JSON.stringify(text)
    );
  } catch (e) {
    console.error(e);
  }
};

export const readState = async () => {
  try {
    const file = await Deno.readTextFile(`${Deno.cwd()}/src/config.json`);
    return JSON.parse(file || "{}");
  } catch (e) {
    return e;
  }
};
