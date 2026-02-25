import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { timelines, timelineItems, documents } from "@/db/schema";

export type Timeline = InferSelectModel<typeof timelines>;
export type NewTimeline = InferInsertModel<typeof timelines>;

export type TimelineItem = InferSelectModel<typeof timelineItems>;
export type NewTimelineItem = InferInsertModel<typeof timelineItems>;

export type Document = InferSelectModel<typeof documents>;
export type NewDocument = InferInsertModel<typeof documents>;

// Document without BLOB data for list queries
export type DocumentMeta = Omit<Document, "data">;

// Timeline with items included
export type TimelineWithItems = Timeline & {
  items: TimelineItem[];
};

// TimelineItem with documents metadata
export type TimelineItemWithDocs = TimelineItem & {
  documents: DocumentMeta[];
};
