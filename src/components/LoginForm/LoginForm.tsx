'use client'

import { signup } from '@/app/actions/auth';
import { useActionState } from 'react';

interface StateFake {
  errors: {
    name: string
    email: string
    password: []
  }
}

export default function SignupForm() {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [state, action, pending] = useActionState(signup as any, undefined, undefined);

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      {(state as unknown as StateFake)?.errors?.name && <p>{(state as unknown as StateFake)?.errors?.name}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {(state as unknown as StateFake)?.errors?.email && <p>{(state as unknown as StateFake)?.errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {(state as unknown as StateFake)?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {(state as unknown as StateFake)?.errors?.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <button disabled={pending} type="submit">
        Sign Up
      </button>
    </form>
  )
}