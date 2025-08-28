import { usersTable } from '@/db/schema/user';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, primaryKey, serial, text } from "drizzle-orm/pg-core";
import { propertiesTable, PropertyTreeType } from './property';

export enum DockyFileTypeEnum {
    Docky = PropertyTreeType.Docky,
    Article = PropertyTreeType.Article,
}

export enum DockyFileCatEnum {
    //Le catégorie de Docky
    Docky_HomePage = 'HomePage',
    Docky_Perso = 'Perso',
    //Le catégorie d'article
    Article_MD = 'MarkDown',
    Article_Graph = 'Graph',
    Article_Board = 'Board',
    Article_IMG = 'Img',
    Article_AUDIO = 'Audio',
    Article_VIDEO = 'video',
    Article_Survey = 'Survey',
    Article_App = 'App', // TODO exemple for next step
}

export const dockyFileTypeEnum = pgEnum(
    'DockyFileTypeEnum',
    [DockyFileTypeEnum.Docky, DockyFileTypeEnum.Article]
);

export interface DockyFileDataChildren {
    id: number,
    order: number
}

export interface DockyFileData {
    id?: number
    name: string
    slug: string
    description: string
    /* eslint-disable @typescript-eslint/no-explicit-any */
    type: DockyFileTypeEnum | string | any
    /* eslint-disable @typescript-eslint/no-explicit-any */
    cat: DockyFileCatEnum | string | any
    isPublic: number
    /* eslint-disable @typescript-eslint/no-explicit-any */
    data: DockyFileData | any
    userId?: number
    treeId: number
    children?: DockyFileDataChildren[]

    // constructor(name: string, description: string, type: DockyFileTypeEnum, data: {}, userId: number) {
    //     this.name = name;
    //     this.description = description;
    //     this.type = type;
    //     this.data = data;
    //     this.userId = userId;
    // }
}
export interface UpdateDockyFileData {
    id?: number
    name: string
    description: string
    isPublic: number
    /* eslint-disable @typescript-eslint/no-explicit-any */
    data: DockyFileData | any
    treeId: number
    children?: DockyFileDataChildren[]
}
export interface PostDockyFileData {
    name: string
    description: string
    isPublic: number
    type: DockyFileTypeEnum
    cat: DockyFileCatEnum | string | any
    /* eslint-disable @typescript-eslint/no-explicit-any */
    data: DockyFileData | any
    treeId: number
    children?: DockyFileDataChildren[]
}



// Table principale
export const dockiesTable = pgTable("dockies", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    type: text("type"),//dockyFileTypeEnum(),
    cat: text("cat"),//dockyFileCatEnum(),
    isPublic: integer("is_public"),
    data: jsonb("data").$type<DockyFileData>(),
    userId: integer("user_id").references(() => usersTable.id, { onDelete: "set null" }),
    treeId: integer("tree_id").references(() => propertiesTable.id, { onDelete: "set null" }),
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
