import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(),
  directory: text("directory").notNull(),
  directoryFields: jsonb("directory_fields").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  contactId: text("contact_id").notNull().references(() => contacts.id),
  activity: text("activity").notNull(),
  activityFields: jsonb("activity_fields"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const surveys = pgTable("surveys", {
  id: text("id").primaryKey(),
  contactId: text("contact_id").notNull().references(() => contacts.id),
  activityId: text("activity_id").references(() => activities.id),
  surveyTitle: text("survey_title").notNull(),
  feedbackRecipient: jsonb("feedback_recipient"),
  channel: text("channel").notNull(),
  sentAt: timestamp("sent_at").notNull(),
  language: text("language").default("English"),
  status: text("status").notNull(),
  participationMethod: text("participation_method"),
  participationDate: timestamp("participation_date"),
  surveyResponseLink: text("survey_response_link"),
  metricScores: jsonb("metric_scores"),
  driverScores: jsonb("driver_scores"),
  openEndedSentiment: text("open_ended_sentiment"),
  openEndedThemes: jsonb("open_ended_themes"),
  openEndedEmotions: jsonb("open_ended_emotions"),
});

export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  contactId: text("contact_id").notNull().references(() => contacts.id),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  authorInitials: text("author_initials").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  createdAt: true,
});

export const insertSurveySchema = createInsertSchema(surveys);

export const insertNoteSchema = createInsertSchema(notes).omit({
  createdAt: true,
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

// Extended types for frontend
export interface ContactWithData extends Contact {
  activities: Activity[];
  surveys: Survey[];
  notes: Note[];
  communicationMetrics: {
    emailReadRate: number;
    responseRate: number;
    lastContact: string;
  };
  tags: {
    type: 'ai' | 'system';
    label: string;
    color: string;
  }[];
  nlpInsights: {
    overallSentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    themes: string[];
    emotions: string[];
    analysis: {
      theme: string;
      sentiment: 'positive' | 'neutral' | 'negative';
      quote: string;
      emotions: string[];
    }[];
  };
}
