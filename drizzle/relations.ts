import { relations } from "drizzle-orm/relations";
import { property, users, rules } from "./schema";

export const propertyRelations = relations(property, ({one, many}) => ({
	property: one(property, {
		fields: [property.parentId],
		references: [property.id],
		relationName: "property_parentId_property_id"
	}),
	properties: many(property, {
		relationName: "property_parentId_property_id"
	}),
	user: one(users, {
		fields: [property.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	properties: many(property),
	rule: one(rules, {
		fields: [users.rulesId],
		references: [rules.id]
	}),
}));

export const rulesRelations = relations(rules, ({many}) => ({
	users: many(users),
}));