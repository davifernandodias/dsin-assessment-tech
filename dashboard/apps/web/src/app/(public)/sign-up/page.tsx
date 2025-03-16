import { SignUp } from "@clerk/nextjs";


export default function SignUpPage() {
  return (
    <div className="flex w-full h-screen justify-center items-center ">
      <SignUp />
    </div>
  )
}
