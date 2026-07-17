import { AuthWidget } from "@/components/auth/AuthWidget";

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <AuthWidget view="forgotten_password" title="Reset Password" />
    </main>
  );
}
