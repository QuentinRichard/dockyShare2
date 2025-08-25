import { relations } from "drizzle-orm/relations";
import { rules, users, dockies, property } from "./schema";

export const usersRelations = relations(users, ({one, many}) => ({
	rule: one(rules, {
		fields: [users.rulesId],
		references: [rules.id]
	}),
	dockies: many(dockies),
}));

export const rulesRelations = relations(rules, ({many}) => ({
	users: many(users),
}));

export const dockiesRelations = relations(dockies, ({one}) => ({
	user: one(users, {
		fields: [dockies.userId],
		references: [users.id]
	}),
	property: one(property, {
		fields: [dockies.treeId],
		references: [property.id]
	}),
}));

export const propertyRelations = relations(property, ({many}) => ({
	dockies: many(dockies),
}));