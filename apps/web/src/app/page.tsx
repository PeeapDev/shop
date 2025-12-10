import Link from 'next/link';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">Peeap Shop</Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                  Categories
                </Link>
                <Link href="/vendors" className="text-gray-600 hover:text-gray-900">
                  Vendors
                </Link>
                <Link href="/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Link
                href="/cart"
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                Cart (0)
              </Link>
              <Link
                href="https://my.peeap.com/auth/login?redirect=shop.peeap.com"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Products from Local Vendors
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Shop from thousands of verified vendors. Pay securely with Peeap.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/products"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
            >
              Browse Products
            </Link>
            <Link
              href="https://my.peeap.com/merchant/signup"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Vendors</h2>
            <Link href="/vendors" className="text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link
                key={i}
                href={`/store/vendor-${i}`}
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                  V{i}
                </div>
                <h3 className="font-semibold">Vendor Store {i}</h3>
                <p className="text-sm text-gray-500">{20 + i * 10} Products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Popular Products</h2>
            <Link href="/products" className="text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded-t-lg" />
                <div className="p-4">
                  <h3 className="font-medium truncate">Product Name {i}</h3>
                  <Link href={`/store/vendor-${(i % 4) + 1}`} className="text-sm text-gray-500 hover:text-blue-600">
                    Vendor {(i % 4) + 1}
                  </Link>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">${(19.99 + i * 10).toFixed(2)}</span>
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

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: 'Electronics', icon: '📱' },
              { name: 'Fashion', icon: '👕' },
              { name: 'Home', icon: '🏠' },
              { name: 'Beauty', icon: '💄' },
              { name: 'Sports', icon: '⚽' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/categories/${cat.name.toLowerCase()}`}
                className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Vendors */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Selling Today</h2>
          <p className="text-lg mb-8 text-purple-100">
            Join thousands of vendors and reach customers across the platform.
          </p>
          <Link
            href="https://my.peeap.com/merchant/signup"
            className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Create Your Store
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Peeap Shop</h4>
              <p className="text-sm text-gray-400">
                Your trusted marketplace for local vendors.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products" className="hover:text-white">Browse Products</Link></li>
                <li><Link href="/vendors" className="hover:text-white">Find Vendors</Link></li>
                <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="https://my.peeap.com/merchant/signup" className="hover:text-white">Become a Vendor</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Vendor Dashboard</Link></li>
                <li><Link href="/help/sellers" className="hover:text-white">Seller Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Peeap Shop. Powered by Peeap Payments.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
