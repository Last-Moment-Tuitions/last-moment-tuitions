import RegisterForm from '@/components/auth/RegisterForm';


export const metadata = {
    title: 'Create Account | Last Moment Tuitions',
    description: 'Join Last Moment Tuitions and start your learning journey today.',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Decor Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl translate-y-1/2"></div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <RegisterForm />
                </div>
            </main>
        </div>
    );
}
