
import { Permissions, Rules } from '@/db/schema/rules';
import { addRule, EnumBasicRules } from '@/repositories/RulesRepository';


export async function seedRules1() {
    console.log("Insert Default Rules: User, Pro, Admin");
    const userRule: Rules = {
        name: EnumBasicRules.UserRules,
        permissions: new Permissions(
            { AcceuilPageMng: false, userMng: false }/*Management*/,
            { create: true, delete: true, edit: true, share: false }/*HomePage*/,
            { create: true, delete: true, edit: true, share: false }/*Dock*/,
            { create: false, delete: false, edit: false, share: false }/*Sharing*/,
            { create: false, delete: false, edit: false, share: false }/*Calendar*/,
            { create: false, delete: false, edit: false, share: false }/*Event*/)
    };
    await addRule(userRule);

    const proRule: Rules = {
        name: EnumBasicRules.ProRules,
        permissions: new Permissions(
            { AcceuilPageMng: false, userMng: false }/*Management*/,
            { create: true, delete: true, edit: true, share: false }/*HomePage*/,
            { create: true, delete: true, edit: true, share: true }/*Dock*/,
            { create: true, delete: true, edit: true, share: true }/*Sharing*/,
            { create: true, delete: true, edit: true, share: true }/*Calendar*/,
            { create: true, delete: true, edit: true, share: true }/*Event*/)
    };
    await addRule(proRule);

    const adminRule: Rules = {
        name: EnumBasicRules.AdminRules,
        permissions: new Permissions(
            { AcceuilPageMng: false, userMng: false }/*Management*/,
            { create: true, delete: true, edit: true, share: false }/*HomePage*/,
            { create: true, delete: true, edit: true, share: true }/*Dock*/,
            { create: true, delete: true, edit: true, share: true }/*Sharing*/,
            { create: true, delete: true, edit: true, share: true }/*Calendar*/,
            { create: true, delete: true, edit: true, share: true }/*Event*/)
    };
    await addRule(adminRule);
}

