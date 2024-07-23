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
  errors?: string[];
  latestPost?: Dayjs | string;
};

export let historyLog: LogType[] = [];
export const logger = (record: LogType) => {
  const storeDate = dayjs().subtract(14, "day");
  const updatedLog = historyLog.filter((item) =>
    dayjs(item.date).isAfter(storeDate)
  );
  historyLog = [...updatedLog, record];
  if (record) console.log(`[${record.date}] ${record.message}`);
  if (record.errors) {
    console.error(`[${record.date}] ${record.message}-> ${record.errors}`);
  }
};
