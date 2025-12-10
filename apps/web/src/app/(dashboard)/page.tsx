import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s your store overview.</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today&apos;s Sales</p>
              <p className="text-2xl font-bold">$1,234.00</p>
            </div>
            <div className="text-green-500 text-sm">+12%</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <div className="text-green-500 text-sm">+5%</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">$4,567.00</p>
            </div>
            <Link href="/dashboard/balance" className="text-blue-600 text-sm">
              View
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Balance</p>
              <p className="text-2xl font-bold text-yellow-600">$2,340.00</p>
            </div>
            <Link href="/dashboard/payouts" className="text-blue-600 text-sm">
              View
            </Link>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-blue-600">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Order #ORD-2024-00{i}</p>
                  <p className="text-sm text-gray-500">John Doe - 2 items</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$89.99</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-semibold">Top Products</h2>
            <Link href="/dashboard/products" className="text-sm text-blue-600">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded" />
                  <div>
                    <p className="font-medium">Product Name {i}</p>
                    <p className="text-sm text-gray-500">{10 + i * 3} sold</p>
                  </div>
                </div>
                <p className="font-medium">${(29.99 * i).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/products/new"
            className="p-4 border rounded-lg text-center hover:bg-gray-50"
          >
            <span className="text-2xl">📦</span>
            <p className="mt-2 text-sm font-medium">Add Product</p>
          </Link>
          <Link
            href="/dashboard/store/customize"
            className="p-4 border rounded-lg text-center hover:bg-gray-50"
          >
            <span className="text-2xl">🎨</span>
            <p className="mt-2 text-sm font-medium">Customize Store</p>
          </Link>
          <Link
            href="/dashboard/discounts/new"
            className="p-4 border rounded-lg text-center hover:bg-gray-50"
          >
            <span className="text-2xl">🏷️</span>
            <p className="mt-2 text-sm font-medium">Create Discount</p>
          </Link>
          <Link
            href="https://my.peeap.com/merchant/withdraw"
            className="p-4 border rounded-lg text-center hover:bg-gray-50"
          >
            <span className="text-2xl">💸</span>
            <p className="mt-2 text-sm font-medium">Withdraw Funds</p>
          </Link>
        </div>
      </div>

      {/* Store Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Your Store</h2>
          <Link
            href="https://demo-store.shop.peeap.com"
            target="_blank"
            className="text-sm text-blue-600"
          >
            Visit Store →
          </Link>
        </div>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              D
            </div>
            <div>
              <p className="font-semibold">Demo Store</p>
              <p className="text-sm text-gray-500">demo-store.shop.peeap.com</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-500">Products</p>
              <p className="font-semibold">24</p>
            </div>
            <div>
              <p className="text-gray-500">Views Today</p>
              <p className="font-semibold">156</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
