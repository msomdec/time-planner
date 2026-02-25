import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const timelines = sqliteTable("timelines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").default(""),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const timelineItems = sqliteTable("timeline_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timelineId: integer("timeline_id")
    .notNull()
    .references(() => timelines.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").default(""),
  color: text("color").default("#f43f5e"),
  position: integer("position").notNull().default(0),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timelineItemId: integer("timeline_item_id").references(
    () => timelineItems.id,
    { onDelete: "cascade" }
  ),
  name: text("name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  data: blob("data", { mode: "buffer" }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// Relations
export const timelinesRelations = relations(timelines, ({ many }) => ({
  items: many(timelineItems),
}));

export const timelineItemsRelations = relations(
  timelineItems,
  ({ one, many }) => ({
    timeline: one(timelines, {
      fields: [timelineItems.timelineId],
      references: [timelines.id],
    }),
    documents: many(documents),
  })
);

export const documentsRelations = relations(documents, ({ one }) => ({
  timelineItem: one(timelineItems, {
    fields: [documents.timelineItemId],
    references: [timelineItems.id],
  }),
}));
