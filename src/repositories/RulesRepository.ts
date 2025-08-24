import dbConnexion from "@/db/connexion";
import { AdminRules, BasicRules, DockAction, DockyType, Permissions, Rules, rulesTable } from "@/db/schema/rules";
import { like } from 'drizzle-orm';


function checkBasicRight(action: DockAction, userPerms: BasicRules): boolean {
    switch (action) {
        case DockAction.Create:
            return userPerms.create === true;
        case DockAction.Edit:
            return userPerms.edit === true;
        case DockAction.Share:
            return userPerms.share === true;
        case DockAction.Delete:
            return userPerms.delete === true;
        default:
            return false;
    }
}

function checkAdminRight(action: DockAction, userPerms: AdminRules): boolean {
    switch (action) {
        case DockAction.AcceuilPageMng:
            return userPerms.AcceuilPageMng === true;
        case DockAction.UserMng:
            return userPerms.userMng === true;
        default:
            return false;
    }
}

export function haveRight(docky: DockyType, action: DockAction, userPermissions: Permissions): boolean {
    switch (docky) {
        case DockyType.HomePageDocky:
            return checkBasicRight(action, userPermissions.homePage);
        case DockyType.Calendar:
            return checkBasicRight(action, userPermissions.calendar);
        case DockyType.Docky:
            return checkBasicRight(action, userPermissions.docky);
        case DockyType.Event:
            return checkBasicRight(action, userPermissions.event);
        case DockyType.Management:
            return checkAdminRight(action, userPermissions.management);
        case DockyType.Survey:
            return checkBasicRight(action, userPermissions.survey);
        default:
            return false;
    }
}

export enum EnumBasicRules {
    UserRules = 'UserRules',
    ProRules = 'ProRules',
    AdminRules = 'AdminRules'
}


export async function findRuleByName(name: string) {
    const post = await dbConnexion.query.rulesTable.findFirst({
        with: {
            comments: true,
        },
        where: like(rulesTable.name, name)
    });
    return post;
}

export async function addRule(rule: Rules) {
    const newRule: typeof rulesTable.$inferInsert = {
        name: rule.name,
        permissions: rule.permissions
    };

    const id = await dbConnexion.insert(rulesTable).values(newRule).returning({ id: rulesTable.id });
    return id[0].id
}


