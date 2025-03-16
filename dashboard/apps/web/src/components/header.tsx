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
      <nav className=" flex dark:bg-gray-950 dark:text-white bg-red-500 h-16 items-center justify-between px-6 py-4 w-full">
        <div>
          <h1>Bem vindo, {month} </h1>
        </div>
        <div className="flex gap-6 items-center justify-center">
        <div>
          <ModeToggle />
        </div>
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
