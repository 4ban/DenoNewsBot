import dayjs, { Dayjs } from "https://esm.sh/dayjs";

type LogType = {
  date: Dayjs | string;
  message: string;
  data?:
    | string
    | {
        url: string | undefined;
        title: string;
        date?: string | Dayjs | undefined;
      }[];
  latestPost?: Dayjs | string;
};

export let historyLog: LogType[] = [];
export const logger = (record: LogType) => {
  const storeDate = dayjs().subtract(14, "day");
  const updatedLog = historyLog.filter((item) =>
    dayjs(item.date).isAfter(storeDate)
  );
  historyLog = [...updatedLog, record];
};
