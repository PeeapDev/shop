import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white border-b fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600">Peeap Shop</h1>
            <span className="text-sm text-gray-500">Vendor Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="https://my.peeap.com"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Go to Peeap
            </Link>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r fixed left-0 top-14 bottom-0 overflow-y-auto">
          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-900 bg-blue-50 rounded-lg"
            >
              <span className="mr-3">📊</span>
              Dashboard
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">📦</span>
              Orders
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">🏷️</span>
              Products
            </Link>
            <Link
              href="/dashboard/customers"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">👥</span>
              Customers
            </Link>

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                Store
              </p>
            </div>
            <Link
              href="/dashboard/store/themes"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">🎨</span>
              Themes
            </Link>
            <Link
              href="/dashboard/store/customize"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">✏️</span>
              Customize
            </Link>
            <Link
              href="/dashboard/store/pages"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">📄</span>
              Pages
            </Link>
            <Link
              href="/dashboard/store/domains"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">🌐</span>
              Domains
            </Link>

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                Finance
              </p>
            </div>
            <Link
              href="/dashboard/balance"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">💰</span>
              Balance
            </Link>
            <Link
              href="/dashboard/payouts"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">💸</span>
              Payouts
            </Link>

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                Settings
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3">⚙️</span>
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
