import Link from 'next/link';
import { notFound } from 'next/navigation';

interface StorePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// This would fetch from database in production
async function getStore(slug: string) {
  // Placeholder - would fetch from Supabase
  const mockStores: Record<string, any> = {
    'demo-store': {
      id: '1',
      name: 'Demo Store',
      slug: 'demo-store',
      description: 'Welcome to our demo store! Browse our amazing products.',
      logo_url: null,
      theme: {
        primaryColor: '#3B82F6',
      },
    },
  };

  return mockStores[slug] || null;
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = await getStore(slug);

  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Store Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {store.name.charAt(0)}
                </div>
              )}
              <h1 className="text-xl font-bold">{store.name}</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href={`/store/${slug}`} className="text-gray-900 font-medium">
                Home
              </Link>
              <Link href={`/store/${slug}/products`} className="text-gray-600 hover:text-gray-900">
                Products
              </Link>
              <Link href={`/store/${slug}/about`} className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href={`/store/${slug}/contact`} className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href={`/store/${slug}/cart`} className="text-gray-600">
                Cart (0)
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{store.name}</h2>
          <p className="text-lg text-blue-100 mb-8">{store.description}</p>
          <Link
            href={`/store/${slug}/products`}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-6">Featured Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded-t-lg" />
                <div className="p-4">
                  <h4 className="font-medium truncate">Product Name {i}</h4>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">$29.99</span>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-6">All Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded-t-lg" />
                <div className="p-4">
                  <h4 className="font-medium truncate">Product {i}</h4>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">$19.99</span>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-semibold">{store.name}</p>
              <p className="text-sm text-gray-400">Powered by Peeap Shop</p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href={`/store/${slug}/terms`}>Terms</Link>
              <Link href={`/store/${slug}/privacy`}>Privacy</Link>
              <Link href={`/store/${slug}/contact`}>Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
