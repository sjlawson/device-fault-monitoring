import Link from 'next/link';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md p-4">
                <div className="max-w-7xl mx-auto flex gap-4">
                    <Link href="/" className="hover:text-blue-600">
                        Whisker Labs Data
                    </Link>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto p-4">
                {children}
            </main>
        </div>
    );
};

export default Layout; 