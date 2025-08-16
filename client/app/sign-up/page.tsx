import { SignUp, SignedOut } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <SignedOut>
        <SignUp />
      </SignedOut>
    </div>
  );
}
