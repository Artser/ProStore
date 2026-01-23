import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function NewPromptPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container max-w-3xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Добавить фильм</CardTitle>
          <CardDescription>
            Здесь будет форма создания фильма/промпта. Пока заглушка.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Форма еще не реализована. Вернуться к списку или на главную.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/my-prompts">К моим фильмам</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




