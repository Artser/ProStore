import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function MyPromptsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container max-w-4xl py-12 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Мои фильмы</h1>
        <p className="text-muted-foreground">
          Здесь будут ваши фильмы и промпты. Добавьте новый, чтобы начать.
        </p>
      </div>
      <Button asChild>
        <Link href="/my-prompts/new">Добавить фильм</Link>
      </Button>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Список пока пуст.
      </div>
    </div>
  );
}




