'use client'
import { signout } from "@/app/actions/auth";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-emerald-500 border-gray-200 dark:bg-gray-900 w-full">
      <div className="w-full flex flex-row items-center justify-between p-4">
        {/* Partie gauche : logo + titre */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://avatars.githubusercontent.com/u/6506376?v=4" className="h-8" alt="DockyShare Logo" width={48} height={48} />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DockyShare</span>
        </Link>
        {/* Partie droite : menu + bouton mobile */}
        <div className="flex items-center">
          {/* Bouton menu mobile */}
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-emerald-400 focus:outline-none focus:ring-2  dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          {/* Menu principal */}
          <div className="hidden md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col md:flex-row md:space-x-8 p-4 md:p-0 mt-4 md:mt-0 border border-gray-100 rounded-lg md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link href="/signin" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">signin</Link>
              </li>
              <li>
                <Link href="/signup" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">signup</Link>
              </li>
              <li>
                <Link href="/dashboard" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Dashboard</Link>
              </li>
              <li>
                <form className="space-y-4 md:space-y-6" action={async () => { await signout() }}>
                  <button type="submit" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sign out</button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}