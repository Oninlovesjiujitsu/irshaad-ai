import { AuthWidget } from "@/components/auth/AuthWidget";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <AuthWidget view="sign_in" title="Welcome Back" />
    </main>
  );
}
