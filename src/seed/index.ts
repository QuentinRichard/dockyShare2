//import { seedDocky1 } from './seedDocky';
import { seedAdminTrees1 } from './seedAdminTrees';
//import { seedRules1 } from './seedRules1';

//History
// seedRules1: to set the default profile for creating User account
// await seedAdminTrees1: to set the default Property

async function main() {
    console.log("Seed Start !!");
    await seedAdminTrees1();
    console.log("Seed End !!");
}

main();