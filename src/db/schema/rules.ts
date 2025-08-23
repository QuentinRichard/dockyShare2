import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";


export enum DockyType {
  Management,
  HomePageDocky,
  Docky,
  Survey,
  Calendar,
  Event,
}
export enum DockAction {
  Create,
  Edit,
  Delete,
  Share,
  AcceuilPageMng,
  UserMng,
}


export interface BasicRules {
  create: boolean
  edit: boolean
  delete: boolean
  share: boolean
}

export interface AdminRules {
  AcceuilPageMng: boolean
  userMng: boolean
}

export class Permissions {
  management: AdminRules
  homePage: BasicRules
  docky: BasicRules
  survey: BasicRules
  calendar: BasicRules
  event: BasicRules

  constructor(management: AdminRules, homePage: BasicRules, docky: BasicRules, survey: BasicRules, calendar: BasicRules, event: BasicRules) {
    this.management = management;
    this.homePage = homePage;
    this.docky = docky;
    this.survey = survey;
    this.calendar = calendar;
    this.event = event;

  }
}

export interface Rules {
  id?: number
  name: string
  permissions: Permissions
}

export const rulesTable = pgTable("rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  permissions: jsonb("permissions").$type<Permissions>(),
});
