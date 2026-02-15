import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';


export const metadata = {
  title: 'Prepfocus By Last Moment Tuitions',
  description: 'Complete guide for IAS, IPS, IFS aspirants and Engineering students.',
  icons: {
    icon: 'https://play-lh.googleusercontent.com/APeEZa4FLR80Q2huR4dQmpElLaBz_jw7kkkpFF38Kjm6Y_ehZjg3XIqH_8Vvo0WZBg',
    apple: 'https://play-lh.googleusercontent.com/APeEZa4FLR80Q2huR4dQmpElLaBz_jw7kkkpFF38Kjm6Y_ehZjg3XIqH_8Vvo0WZBg',
  },
};

import SessionMonitor from '@/components/SessionMonitor';

import { cookies } from 'next/headers';
import API_BASE_URL from '@/lib/config';

async function getUserOnServer() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'x-session-id': sessionId,
        'Cookie': `sessionId=${sessionId}`
      },
      cache: 'no-store' // Ensure fresh data
    });

    if (res.ok) {
      const responseData = await res.json();
      // Handle nested details structure like login endpoint
      return responseData.details || responseData;
    }
  } catch (error) {
    console.error('SSR Auth Check Failed', error);
  }
  return null;
}

export default async function RootLayout({ children }) {
  const initialUser = await getUserOnServer();

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider initialUser={initialUser}>
          <ToastProvider>
            <SessionMonitor />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
