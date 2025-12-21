import Profile from '@/components/user/Profile';


export const metadata = {
    title: 'My Profile | Last Moment Tuitions',
    description: 'Manage your account settings',
};

export default function ProfilePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <main className="flex-grow py-8 bg-gray-50">
                <Profile />
            </main>
        </div>
    );
}
