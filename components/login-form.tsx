'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (isLogin) {
      // Вход
      try {
        const response = await fetch('/api/auth/signin/credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            email,
            password,
            redirect: 'false',
            json: 'true',
          }),
        });

        const data = await response.json();

        if (response.ok) {
          router.push('/');
          router.refresh();
        } else {
          setError(data.error || 'Неверный email или пароль');
        }
      } catch (err) {
        setError('Произошла ошибка при входе');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Регистрация
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // После регистрации автоматически входим
          const loginResponse = await fetch('/api/auth/signin/credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              email,
              password,
              redirect: 'false',
              json: 'true',
            }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
            router.push('/');
            router.refresh();
          } else {
            setError('Регистрация успешна, но вход не удался. Попробуйте войти вручную.');
          }
        } else {
          setError(data.error || 'Ошибка при регистрации');
        }
      } catch (err) {
        setError('Произошла ошибка при регистрации');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isLogin ? 'Вход в FilmStore' : 'Регистрация в FilmStore'}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? 'Войдите, чтобы добавлять и управлять своими фильмами'
            : 'Создайте аккаунт, чтобы начать работу'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading
              ? 'Загрузка...'
              : isLogin
              ? 'Войти'
              : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">или</span>
          </div>
        </div>

        <form action="/api/auth/signin/google" method="post">
          <Button type="submit" variant="outline" className="w-full" disabled={isLoading}>
            Войти через Google
          </Button>
        </form>

        <div className="text-center text-sm">
          {isLogin ? (
            <>
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                }}
                className="text-primary hover:underline"
              >
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
                className="text-primary hover:underline"
              >
                Войти
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

