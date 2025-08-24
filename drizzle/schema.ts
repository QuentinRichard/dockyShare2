import { pgTable, foreignKey, unique, serial, text, integer, jsonb, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	name: text().notNull(),
	rulesId: integer("rules_id"),
}, (table) => [
	foreignKey({
			columns: [table.rulesId],
			foreignColumns: [rules.id],
			name: "users_rules_id_rules_id_fk"
		}).onDelete("set null"),
	unique("users_email_unique").on(table.email),
]);

export const rules = pgTable("rules", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	permissions: jsonb(),
}, (table) => [
	unique("rules_name_unique").on(table.name),
]);

export const property = pgTable("property", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	content: text(),
	parentId: integer("parent_id"),
	userId: integer("user_id"),
	icon: text(),
});

export const dockies = pgTable("dockies", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	data: jsonb(),
	userId: integer("user_id"),
	type: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "dockies_user_id_users_id_fk"
		}).onDelete("set null"),
]);

export const dockiesChildren = pgTable("dockies_children", {
	order: integer(),
	parentId: integer("parent_id").notNull(),
	childId: integer("child_id").notNull(),
}, (table) => [
	primaryKey({ columns: [table.parentId, table.childId], name: "dockies_children_parent_id_child_id_pk"}),
]);
