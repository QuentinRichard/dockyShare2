import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { rulesTable } from "./rules";

export class User {

    id?: number | undefined
    email: string
    password: string
    name: string
    rulesId: number

    constructor(email: string, password: string, name: string, rulesId: number) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.rulesId = rulesId;
    }
}

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    rulesId: integer("rules_id").references(() => rulesTable.id, { onDelete: "set null" }),
});
