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
    return `State save success: ${text}`;
  } catch (e) {
    return `State save failed: ${e.message}`;
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
