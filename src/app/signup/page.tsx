'use client'
import { signup } from '@/app/actions/auth'

export default function SignupForm() {
    return (
        <div>
            <form action={async (formData) => { await signup(formData) }}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" placeholder="Name" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="Email" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}