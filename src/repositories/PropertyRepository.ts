import { eq } from 'drizzle-orm';
import dbConnexion from '@/db/connexion';
import { propertiesTable } from '@/db/schema/property';

export interface TreesRecord {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [x: string]: any;
  invitees: never;
  inviter: never;
}

export async function getTrees(userId: number): Promise<TreesRecord[]> {

  const result = await dbConnexion.query.propertiesTable.findMany({
    with: {
      invitees: true,   // liste des users invités par ce user
      inviter: true,    // user qui a invité ce user
    },
    where: eq(propertiesTable.$inferInsert.userId, userId)
  });
  return result;
}
