/** Converts "HH:MM" (24h) to "h:MM AM/PM" (12h) */
export function formatTime(time: string): string {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}
