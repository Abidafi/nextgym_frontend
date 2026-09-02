'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string; 
}

interface GearItem {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  providerName?: string;
}

interface RentalOrder {
  id: string;
  gearName: string;
  renterName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [gearListings, setGearListings] = useState<GearItem[]>([]);
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'gear' | 'rentals'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, gearRes, rentalsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/gear'),
        api.get('/admin/rentals'),
      ]);

      const usersData = usersRes.data.users || usersRes.data.data || usersRes.data;
      const gearData = gearRes.data.gear || gearRes.data.data || gearRes.data;
      const rentalsData = rentalsRes.data.rentals || rentalsRes.data.data || rentalsRes.data;

      const rawUsersList = Array.isArray(usersData) ? usersData : [];
      const rawGearList = Array.isArray(gearData) ? gearData : [];
      const rawRentalsList = Array.isArray(rentalsData) ? rentalsData : [];
      
      const formattedUsers = rawUsersList.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.isSuspended ? 'SUSPENDED' : 'ACTIVE',
      }));

      const formattedGear = rawGearList.map((item: any) => ({
        id: item.id,
        name: item.title || item.name || 'N/A',
        category: 
          item.categoryName || 
          item.category?.name || 
          item.category?.title || 
          item.category || 
          'General',
        pricePerDay: item.pricePerDay || item.price || 0,
        providerName: item.provider?.name || item.providerName || 'N/A',
      }));

      const formattedRentals = rawRentalsList.map((order: any) => ({
        id: order.id,
        gearName: order.gearItem?.title || order.gearItem?.name || order.gearName || 'N/A',
        renterName: order.customer?.name || order.renterName || 'N/A',
        startDate: order.startDate ? order.startDate.split('T')[0] : '',
        endDate: order.endDate ? order.endDate.split('T')[0] : '',
        totalPrice: order.totalPrice || order.total || 0,
        status: order.status || 'PENDING',
      }));

      setUsers(formattedUsers);
      setGearListings(formattedGear);
      setRentals(formattedRentals);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load admin data.');
      setUsers([]);
      setGearListings([]);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusToggle = async (userId: string, currentStatus?: string) => {
    const willBeSuspended = currentStatus !== 'SUSPENDED';
    try {
      await api.patch(`/admin/users/${userId}`, { isSuspended: willBeSuspended });
      const newStatus = willBeSuspended ? 'SUSPENDED' : 'ACTIVE';
      toast.success(`User successfully ${newStatus.toLowerCase()}!`);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse font-medium">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard 🛡️</h1>
            <p className="text-gray-500 mt-1 text-sm">Platform moderation, user management, and statistics overview</p>
          </div>
        </div>

        {/* Global Platform Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Total Registered Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Active Gear Listings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{gearListings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Total Rentals Processed</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{rentals.length}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === 'users' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('gear')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === 'gear' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            Gear Listings Moderation ({gearListings.length})
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === 'rentals' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            Platform Rentals ({rentals.length})
          </button>
        </div>

        {/* Tab 1: User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden space-y-4">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
                <p className="text-sm text-gray-500 mt-0.5">Search and update status for platform accounts</p>
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-black">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const status = user.status || 'ACTIVE';
                      return (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 font-medium">{user.name}</td>
                          <td className="p-4 text-gray-600">{user.email}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                status === 'SUSPENDED'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-green-50 text-green-700'
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleStatusToggle(user.id, status)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                                status === 'SUSPENDED'
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                            >
                              {status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Gear Moderation */}
        {activeTab === 'gear' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Content Moderation: Gear Listings</h2>
              <p className="text-sm text-gray-500 mt-0.5">Inspect all active sports gear listings across providers</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="p-4">Listing ID</th>
                    <th className="p-4">Gear Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / Day</th>
                    <th className="p-4">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-black">
                  {gearListings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">No gear listings found.</td>
                    </tr>
                  ) : (
                    gearListings.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium">#{item.id.slice(-6)}</td>
                        <td className="p-4 text-gray-800 font-semibold">{item.name}</td>
                        <td className="p-4 text-gray-600">{item.category}</td>
                        <td className="p-4">${item.pricePerDay}</td>
                        <td className="p-4 text-gray-600">{item.providerName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Platform Rentals */}
        {activeTab === 'rentals' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Platform Rentals Overview</h2>
              <p className="text-sm text-gray-500 mt-0.5">Monitor global rental orders across the marketplace</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Gear</th>
                    <th className="p-4">Renter</th>
                    <th className="p-4">Rental Dates</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-black">
                  {rentals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">No rental orders recorded.</td>
                    </tr>
                  ) : (
                    rentals.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium">#{order.id.slice(-6)}</td>
                        <td className="p-4 text-gray-800 font-semibold">{order.gearName}</td>
                        <td className="p-4 text-gray-600">{order.renterName}</td>
                        <td className="p-4 text-gray-600">{order.startDate} to {order.endDate}</td>
                        <td className="p-4">${order.totalPrice}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}