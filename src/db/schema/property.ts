
import { usersTable } from "@/db/schema/user";
import { relations } from "drizzle-orm";
import type { Column } from "drizzle-orm/column";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export enum PropertyTreeType {
  Admin = 'Admin',
  AdminUser = 'AdminUser',
  AdminHomePage = 'AdminHomePage',
  AdminLibrary = 'AdminLibrary',
  AdminLibraryDocky = 'AdminLibraryDocky',
  AdminLibraryDockyDiv = 'AdminLibraryDockyDiv',
  AdminDocky = 'AdminDocky',
  AdminLibraryArticle = 'AdminLibraryArticle',
  AdminLibraryArticleDiv = 'AdminLibraryArticleDiv',
  AdminArticle = 'AdminArticle',
  Library = 'Library',
  LibraryDocky = 'LibraryDocky',
  LibraryDockyDiv = 'LibraryDockyDiv',
  Docky = 'Docky',
  LibraryArticle = 'LibraryArticle',
  LibraryArticleDiv = 'LibraryArticleDiv',
  Article = 'Article',
  Calendar = 'Calendar',
  CalendarHistory = 'CalendarHistory',
  CalendarUpComming = 'CalendarUpComming',
  CalendarEvent = 'CalendarEvent',
  Events = 'Events',
  EventsDiv = 'EventsDiv',
  Event = 'Event',
}

export interface IPropertiesTable {
  id?: number
  name: string
  icon?: string
  type: PropertyTreeType
  content: string
  parentId?: number
  children?: IPropertiesTable[]
  userId: number
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IDrizzleTreeProperty<TColumn extends Column = Column<any>> {
  name: string;
  schema: string | undefined;
  columns: Record<string, TColumn>;
  dialect: string;
}

export const propertiesTable = pgTable('property', {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  type: text("type"),
  content: text("content"),
  parentId: integer("parent_id"),
  userId: integer("user_id"),
});

export const propertiesRelations = relations(propertiesTable, ({ one, many }) => ({
  parentId: one(propertiesTable, {
    fields: [propertiesTable.parentId],
    references: [propertiesTable.id],
  }),
  children: many(propertiesTable),
  userId: one(usersTable, {
    fields: [propertiesTable.userId],
    references: [usersTable.id],
  }),
}));

//------------------------------
// import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   name: text("name"),
//   invitedBy: integer("invited_by").references(() => users.id, { onDelete: "set null" }),
// });

// // Relations
// export const usersRelations = relations(users, ({ one, many }) => ({
//   inviter: one(users, {
//     fields: [users.invitedBy],
//     references: [users.id],
//   }),
//   invitees: many(users),
// }));

// 🔎 Explications

//     invitedBy → une colonne qui référence un autre user.id (ManyToOne)

//     inviter → relation pour savoir qui a invité ce user

//     invitees → relation inverse pour savoir qui a été invité par ce user

//     Pas besoin de invitations: integer[].array() : Drizzle gère ça via la relation many(users).