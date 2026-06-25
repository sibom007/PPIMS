import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// date-fns handles both Date and string inputs perfectly out of the box
export const formattedDate = (dateVal: Date | string) =>
  format(dateVal, "MMM d, yyyy");
