import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ModeToggle } from "./ui/mode-toggle";
import { getDateNowAndFormat } from "@/utils/format-date-now";

const { day, month, year } = getDateNowAndFormat();

export default function Header() {
  return (
    <header>
      <nav className=" flex dark:bg-gray-950 dark:text-white items-center justify-between w-full">
        <div className="flex flex-col gap-4">
          <h1 className="font-extralight text-5xl text-purple-900 dark:text-purple-500">Bem vindo, <span className="font-semibold text-purple-950 dark:text-purple-400">{"Sabrina"}</span></h1>
          <p className="text-gray-text font-light dark:text-white ">Hoje, dia {day} de {year}.</p>
        </div>
        <div className="flex gap-6 items-center justify-center">
        <div className="flex items-center">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        </div>
      </nav>
    </header>
  );
}
