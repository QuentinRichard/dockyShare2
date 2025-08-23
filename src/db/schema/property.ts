
import { PgTable, pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable, User } from "./user";
import type { Column } from "drizzle-orm/column";


export interface ITropertiesTable {
  id: number
  name: string
  content: string
  parentId: ITropertiesTable
  children: ITropertiesTable[]
  userId: number
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IDrizzleTreeProperty<TColumn extends Column = Column<any>> {
  name: string;
  schema: string | undefined;
  columns: Record<string, TColumn>;
  dialect: string;
}

export interface CTreeProperty {
  id: number
  name: string
  content: string
  parentId: ITropertiesTable
  children: ITropertiesTable[]
  userId: User
}

export const propertiesTable: PgTable<IDrizzleTreeProperty> = pgTable("property", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content"),
  /* eslint-disable @typescript-eslint/no-explicit-any */
  parentId: integer("parent_id").references(() => propertiesTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "set null" }),
});

export const treeRelations = relations(propertiesTable, ({ one, many }) => ({
  parent: one(propertiesTable, {
    fields: [propertiesTable.$inferInsert.parentId],
    references: [propertiesTable.$inferInsert.id],
  }),
  children: many(propertiesTable),
  user: one(usersTable, {
    fields: [propertiesTable.$inferInsert.userId],
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