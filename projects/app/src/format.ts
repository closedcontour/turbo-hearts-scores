export function formatDateTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  return date.toLocaleString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
