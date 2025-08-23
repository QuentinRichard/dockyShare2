import { seedRules1 } from './seedRule1';

//History
// seedRules1: to set the default profile for creating User account

async function main() {
    console.log("Seed Start !!");
    await seedRules1();
    console.log("Seed End !!");
}

main();