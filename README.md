This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Drizzle Migration
npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit push
npx drizzle-kit pull
npx drizzle-kit check
npx drizzle-kit up

drizzle-kit generate	lets you generate SQL migration files based on your Drizzle schema either upon declaration or on subsequent changes, see here.
drizzle-kit migrate	lets you apply generated SQL migration files to your database, see here.
drizzle-kit pull	lets you pull(introspect) database schema, convert it to Drizzle schema and save it to your codebase, see here
drizzle-kit push	lets you push your Drizzle schema to database either upon declaration or on subsequent schema changes, see here
drizzle-kit studio	will connect to your database and spin up proxy server for Drizzle Studio which you can use for convenient database browsing, see here
drizzle-kit check	will walk through all generate migrations and check for any race conditions(collisions) of generated migrations, see here
drizzle-kit up	used to upgrade snapshots of previously generated migrations, see here