"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import API_BASE_URL from '@/lib/config';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [status, setStatus] = useState('Processing login...');

    const processed = useRef(false);

    useEffect(() => {
        const handleAuthCallback = async () => {
            if (processed.current) return;
            processed.current = true;

            try {
                // 1. Get the session from Supabase (this parses the hash fragment)
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;
                if (!session) {
                    // Sometimes the session is not immediately available, or we might need to handle the hash manually
                    // But in most cases, supabase-js handles the hash parsing automatically
                    throw new Error('No session found');
                }

                // 2. Send the access token to our backend
                const res = await fetch(`${API_BASE_URL}/auth/google`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: session.access_token,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Backend verification failed');
                }

                const data = await res.json();

                // 3. Login the user in our app context
                // Store opaque session ID in cookie (secure, path=/)
                document.cookie = `sessionId=${data.accessToken}; path=/; max-age=${data.expiresIn}; SameSite=Lax; Secure`;

                login(data.user);

                setStatus('Success! Redirecting...');
                router.push('/');

            } catch (error) {
                console.error('Login Callback Error:', error);
                setStatus(`Login failed: ${error.message}`);
                // Optional: Redirect back to login after a delay
                setTimeout(() => router.push('/signin'), 3000);
            }
        };

        handleAuthCallback();
    }, [router, login]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Please wait</h2>
                <div className="mb-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                </div>
                <p className="text-gray-600">{status}</p>
            </div>
        </div>
    );
}
