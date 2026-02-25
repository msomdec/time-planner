import { z } from "zod";

export const createTimelineSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(1000).optional(),
});

export const updateTimelineSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).optional(),
  description: z.string().max(1000).optional(),
});

export const createTimelineItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color")
    .optional(),
  startDate: z.string().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format").optional(),
  endDate: z.string().optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format").optional(),
});

export const updateTimelineItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).optional(),
  description: z.string().max(2000).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color")
    .optional(),
  startDate: z.string().nullable().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format").nullable().optional(),
  endDate: z.string().nullable().optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format").nullable().optional(),
});

export const reorderItemsSchema = z.object({
  itemIds: z.array(z.number().int().positive()),
});
