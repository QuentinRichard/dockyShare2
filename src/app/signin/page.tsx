'use client'
import { signin } from '@/app/actions/auth'

export default function SigninForm() {
    return (
        <div>
            <form action={async (formData) => { await signin(formData) }}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="Email" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}