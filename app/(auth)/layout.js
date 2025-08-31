export const metadata = {
    title: 'Authentication - Hey Humanz',
    description: 'Login or create your Hey Humanz account'
};

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-black">
            {children}
        </div>
    );
}