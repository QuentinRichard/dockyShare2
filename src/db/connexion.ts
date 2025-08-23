import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@/db/schema/schemas";

const dbConnexion = drizzle({
    connection: {
        connectionString: "postgresql://postgres:postgres@localhost:5432/docky_share2"
        //process.env.DATABASE_URL!,
        //ssl: true
    },
    schema
});

export default dbConnexion;