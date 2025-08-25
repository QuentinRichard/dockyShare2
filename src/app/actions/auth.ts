'use server'
import { SigninFormSchema, SignupFormSchema } from '@/app/lib/interfaces/signForm';
import { createSession, deleteSession } from '@/app/lib/session';
import { Rules } from '@/db/schema/rules';
import { User } from '@/db/schema/user';
import { createUser, findUserByIdentifiant } from '@/repositories/UserRepository';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export async function signup(formData: FormData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // Call the provider or db to create a user...
    const { name, email, password } = validatedFields.data;
    // e.g. Hash the user's password before storing it

    // 3. Insert the user into the database or call an Auth Library's API
    const userDb = new User(email, password, name, 0);
    userDb.name = name;
    const userId = await createUser(userDb);

    // 4. Create user session
    await createSession(userId.users, userId.rules as Rules);
    // 5. Redirect user
    redirect('/dashboard');
}


export async function signin(formData: FormData) {
    // Validate form fields
    const validatedFields = SigninFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // Call the provider or db to create a user...
    const { email, password } = validatedFields.data

    // 3. search the user into the database or call an Auth Library's API
    const user = await findUserByIdentifiant(email);
    if (!user || !(await bcrypt.compare(password, user.users.password!))) {
        console.log(`Failed login attempt for user: ${email}`);
        return { error: 'Identifiant ou mot de passe incorrect' };
    }

    // 4. Create user session
    await createSession(user.users as User, user.rules as Rules);
    // 5. Redirect user
    redirect('/dashboard')
}


export async function signout() {

    // 4. Create user session
    await deleteSession();
    // 5. Redirect user
    revalidatePath('/')
}
