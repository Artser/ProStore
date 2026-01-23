import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoginForm } from '@/components/login-form';

export default async function LoginPage() {
  const session = await getSession();

  // Если уже авторизован, перенаправляем на главную
  if (session) {
    redirect('/');
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <LoginForm />
    </div>
  );
}

