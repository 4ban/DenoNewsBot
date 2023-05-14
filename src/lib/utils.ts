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
