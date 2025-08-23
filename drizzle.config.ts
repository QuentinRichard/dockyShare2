import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema/schemas.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://postgres:postgres@localhost:5432/docky_share2',
        //process.env.DATABASE_URL!,
    },
});
