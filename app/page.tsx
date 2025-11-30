import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (token) {
      redirect('/dashboard');
    } else {
      redirect('/login');
    }
  } catch (error) {
    // Fallback to login if there's any error
    redirect('/login');
  }
}

