export function sortByDateDesc<T>(
  items: T[],
  getValue: (item: T) => string,
): T[] {
  return [...items].sort((a, b) => {
    return new Date(getValue(b)).getTime() - new Date(getValue(a)).getTime();
  });
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
