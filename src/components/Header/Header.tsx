'use client'
import { signout } from "@/app/actions/auth";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://avatars.githubusercontent.com/u/6506376?v=4" className="h-8" alt="DockyShare Logo" width={48} height={48} />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DockyShare</span>
        </Link>
      </h1>
      {/* <!-- Menu desktop --> */}
      <nav className="hidden md:flex gap-4">
        <Link href="/signin" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500 hover:underline">Sign In</Link>
        <Link href="/signup" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent hover:underline">Sign Up</Link>
        <Link href="/dashboard" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent hover:underline">Dashboard</Link>

        <form className="space-y-4 md:space-y-6" action={async () => { await signout() }}>
          <button type="submit" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sign out</button>
        </form>
      </nav>

      {/* <!-- Menu mobile --> */}
      <button className="md:hidden bg-blue-500 px-4 py-2 rounded">Menu</button>
    </header >
  );
}