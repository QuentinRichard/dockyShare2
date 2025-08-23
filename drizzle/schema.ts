import { pgTable, foreignKey, serial, text, integer, unique, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const property = pgTable("property", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	content: text(),
	parentId: integer("parent_id"),
	userId: integer("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "property_parent_id_property_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "property_user_id_users_id_fk"
		}).onDelete("set null"),
]);

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
