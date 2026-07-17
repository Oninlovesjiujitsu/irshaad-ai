import { AuthWidget } from "@/components/auth/AuthWidget";

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <AuthWidget view="sign_up" title="Create Your Account" />
    </main>
  );
}
