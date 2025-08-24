import { usersTable } from '@/db/schema/user';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, primaryKey, serial, text } from "drizzle-orm/pg-core";

export enum DockyFileTypeEnum {
    HomePage = 'HomePage',
    Docky = 'Docky',
    Article = 'Article',
    App = 'App'
}

export const dockyFileTypeEnum = pgEnum(
    'DockyFileTypeEnum',
    [DockyFileTypeEnum.HomePage, DockyFileTypeEnum.Docky,
    DockyFileTypeEnum.Article, DockyFileTypeEnum.App]
);

export interface DockyFileDataChildren {
    id: number,
    order: number
}

export interface DockyFileData {
    id?: number
    name: string
    description: string
    /* eslint-disable @typescript-eslint/no-explicit-any */
    type: DockyFileTypeEnum | string | any
    /* eslint-disable @typescript-eslint/no-explicit-any */
    data: DockyFileData | any
    userId: number
    children?: DockyFileDataChildren[]

    // constructor(name: string, description: string, type: DockyFileTypeEnum, data: {}, userId: number) {
    //     this.name = name;
    //     this.description = description;
    //     this.type = type;
    //     this.data = data;
    //     this.userId = userId;
    // }
}


// Table principale
export const dockiesTable = pgTable("dockies", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    type: text("type"),//dockyFileTypeEnum(),
    data: jsonb("data").$type<DockyFileData>(),
    userId: integer("user_id").references(() => usersTable.id, { onDelete: "set null" }),
});


export interface DockyFileChildren {
    order: number,
    parentId: number,
    childId: number
}

// Table de liaison parent ↔ enfant
export const dockiesChildrenTable = pgTable("dockies_children", {
    order: integer("order"),
    parentId: integer("parent_id").notNull(),
    childId: integer("child_id").notNull(),
}, (table) => [
    primaryKey({ columns: [table.parentId, table.childId] }),
]);

// Relations
export const dockiesRelations = relations(dockiesTable, ({ many }) => ({
    children: many(dockiesChildrenTable, { relationName: "children" }),
    parents: many(dockiesChildrenTable, { relationName: "parents" }),
}));

export const dockiesChildrenRelations = relations(dockiesChildrenTable, ({ one }) => ({
    parent: one(dockiesTable, {
        fields: [dockiesChildrenTable.parentId],
        references: [dockiesTable.id],
        relationName: "children",
    }),
    child: one(dockiesTable, {
        fields: [dockiesChildrenTable.childId],
        references: [dockiesTable.id],
        relationName: "parents",
    }),
}));
