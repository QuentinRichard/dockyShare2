import { eq, like } from 'drizzle-orm';
import { usersTable, User } from "@/db/schema/user";
import { rulesTable, Rules } from "@/db/schema/rules";
import dbConnexion from '@/db/connexion';
import { EnumBasicRules } from './RulesRepository';
import bcrypt from 'bcryptjs';


export interface UsersRules {
  users: User,
  rules: Rules | null
}

export async function findUserByIdentifiant(email: string): Promise<UsersRules> {
  const user = await dbConnexion.select().from(usersTable).where(like(usersTable.email, email)).leftJoin(rulesTable, eq(usersTable.rulesId, rulesTable.id)).limit(1);
  if (user !== null && user.length === 1) {
    return user[0] as UsersRules;
  }
  else {
    throw new Error("not rule defines!!");
  }
}

export async function createUser(user: User): Promise<UsersRules> {

  const rule = await dbConnexion.select().from(rulesTable).where(like(rulesTable.name, EnumBasicRules.UserRules));
  if ((rule !== null) && (rule.length == 1)) {
    const pwd = await bcrypt.hash(user.password, 10);
    const newUser: typeof usersTable.$inferInsert = {
      name: user.name,
      password: pwd,
      email: user.email,
      rulesId: rule[0].id
    };
    const inserted = await dbConnexion.insert(usersTable).values(newUser).returning({ id: usersTable.id });
    user.id = inserted[0].id;
    return { users: user, rules: rule[0] as unknown as Rules };
  }
  else {
    throw new Error("not rule defines!!");
  }
}
