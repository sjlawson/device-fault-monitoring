import Link from 'next/link';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg mb-8">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex space-x-4">
                        <Link href="/" className="text-gray-700 hover:text-gray-900">
                            Interactive Plot
                        </Link>
                        <Link href="/static-plot" className="text-gray-700 hover:text-gray-900">
                            Max Peaks Heatmap
                        </Link>
                    </div>
                </div>
            </nav>
            <main className="px-4">
                {children}
            </main>
        </div>
    );
}
