import { format, parseISO } from "date-fns";

export const getMessageTime = datetime => format(parseISO(datetime), "H:mm a");
