import { auth } from '@/app/api/auth/[...nextauth]/auth';

export async function getSession() {
  return await auth();
}




