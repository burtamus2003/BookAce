import { pgTable, uuid, text, timestamp, uniqueIndex, boolean, smallint } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("user"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shelves = pgTable("shelves", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const books = pgTable("books", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  shelfId: uuid("shelf_id").references(() => shelves.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  author: text("author"),
  isbn: text("isbn"),
  publishedDate: text("published_date"),
  coverUrl: text("cover_url"),
  notes: text("notes"),
  condition: text("condition"),
  format: text("format"),
  edition: text("edition"),
  signed: boolean("signed").notNull().default(false),
  readingStatus: text("reading_status").notNull().default("unread"),
  rating: smallint("rating"),
  loanedToName: text("loaned_to_name"),
  loanedToEmail: text("loaned_to_email"),
  loanedAt: timestamp("loaned_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
