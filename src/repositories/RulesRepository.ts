import dbConnexion from "@/db/connexion";
import { AdminRules, BasicRules, DockyRulesAction, DockyRulesType, Permissions, Rules, rulesTable } from "@/db/schema/rules";
import { like } from 'drizzle-orm';


function checkBasicRight(action: DockyRulesAction, userPerms: BasicRules): boolean {
    switch (action) {
        case DockyRulesAction.Create:
            return userPerms.create === true;
        case DockyRulesAction.Edit:
            return userPerms.edit === true;
        case DockyRulesAction.Share:
            return userPerms.share === true;
        case DockyRulesAction.Delete:
            return userPerms.delete === true;
        default:
            return false;
    }
}

function checkAdminRight(action: DockyRulesAction, userPerms: AdminRules): boolean {
    switch (action) {
        case DockyRulesAction.AcceuilPageMng:
            return userPerms.AcceuilPageMng === true;
        case DockyRulesAction.UserMng:
            return userPerms.userMng === true;
        default:
            return false;
    }
}

export function haveRight(docky: DockyRulesType, action: DockyRulesAction, userPermissions: Permissions): boolean {
    switch (docky) {
        case DockyRulesType.HomePageDocky:
            return checkBasicRight(action, userPermissions.homePage);
        case DockyRulesType.Calendar:
            return checkBasicRight(action, userPermissions.calendar);
        case DockyRulesType.Docky:
            return checkBasicRight(action, userPermissions.docky);
        case DockyRulesType.Event:
            return checkBasicRight(action, userPermissions.event);
        case DockyRulesType.Management:
            return checkAdminRight(action, userPermissions.management);
        case DockyRulesType.Survey:
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


