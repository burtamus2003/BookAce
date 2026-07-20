export const CONDITIONS = ["New", "Like New", "Very Good", "Good", "Fair", "Poor"] as const;

export const FORMATS = [
  "Hardcover",
  "Paperback",
  "Mass Market Paperback",
  "Ebook",
  "Audiobook",
] as const;

export const READING_STATUSES = ["unread", "reading", "read"] as const;

export const READING_STATUS_LABELS: Record<(typeof READING_STATUSES)[number], string> = {
  unread: "Unread",
  reading: "Reading",
  read: "Read",
};
