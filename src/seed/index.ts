import { seedAdminTrees1 } from './seedAdminTrees';

//History
// seedRules1: to set the default profile for creating User account

async function main() {
    console.log("Seed Start !!");
    await seedAdminTrees1();
    console.log("Seed End !!");
}

main();