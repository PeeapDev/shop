import Link from 'next/link';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">Peeap Shop</h1>
              <nav className="hidden md:flex space-x-6">
                <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                  Categories
                </Link>
                <Link href="/vendors" className="text-gray-600 hover:text-gray-900">
                  Vendors
                </Link>
                <Link href="/deals" className="text-gray-600 hover:text-gray-900">
                  Deals
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
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
          <h2 className="text-4xl font-bold mb-4">
            Discover Amazing Products from Local Vendors
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Shop from thousands of verified vendors. Pay securely with Peeap.
          </p>
          <div className="flex justify-center space-x-4">
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
          <h3 className="text-2xl font-bold mb-6">Featured Vendors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                <h4 className="font-semibold">Vendor Store {i}</h4>
                <p className="text-sm text-gray-500">50+ Products</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-6">Popular Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded-t-lg" />
                <div className="p-4">
                  <h4 className="font-medium truncate">Product Name {i}</h4>
                  <p className="text-sm text-gray-500">Vendor Name</p>
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

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-6">Shop by Category</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat.toLowerCase()}`}
                className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2" />
                <span className="text-sm font-medium">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-4">Peeap Shop</h5>
              <p className="text-sm text-gray-400">
                Your trusted marketplace for local vendors.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Buyers</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products">Browse Products</Link></li>
                <li><Link href="/vendors">Find Vendors</Link></li>
                <li><Link href="/deals">Deals & Offers</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Vendors</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="https://my.peeap.com/merchant/signup">Become a Vendor</Link></li>
                <li><Link href="https://dashboard.shop.peeap.com">Vendor Dashboard</Link></li>
                <li><Link href="/vendor-guide">Seller Guide</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
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
