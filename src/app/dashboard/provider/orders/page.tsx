'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';

interface Order {
  id: string;
  gearName: string;
  renterName: string;
  startDate: string;
  endDate: string;
  status: 'PLACED' | 'CONFIRMED' | 'PAID' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';
  totalPrice: number;
}

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/provider/orders');
      
      const rawOrders = res.data.orders || res.data.data || res.data;
      const orderList = Array.isArray(rawOrders) ? rawOrders : [];

      const formattedOrders = orderList.map((order: any) => ({
        ...order,
        gearName: order.gearItem?.title || order.gearName || 'N/A',
        renterName: order.customer?.name || order.renterName || 'N/A',
        startDate: order.startDate ? order.startDate.split('T')[0] : '',
        endDate: order.endDate ? order.endDate.split('T')[0] : '',
      }));

      setOrders(formattedOrders);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch incoming orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/provider/orders/${id}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus.toLowerCase()}`);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating order status');
    }
  };

  if (loading) return <div className="p-10 text-center text-black">Loading incoming orders...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-white">Manage Incoming Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-400">No incoming rental orders found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gear</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renter</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-black text-sm">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium">#{order.id.slice(-6)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{order.gearName}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{order.renterName}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                      {order.startDate} to {order.endDate}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">${order.totalPrice}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'PLACED' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PAID' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'PICKED_UP' ? 'bg-green-100 text-green-800' :
                        order.status === 'RETURNED' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end flex-wrap gap-1.5 sm:space-x-2">
                        {order.status === 'PLACED' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                            className="text-green-600 bg-green-50 px-3 py-1 rounded border border-green-200 hover:bg-green-100 text-xs sm:text-sm"
                          >
                            Confirm
                          </button>
                        )}
                        {order.status === 'PAID' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'PICKED_UP')}
                            className="text-purple-600 bg-purple-50 px-3 py-1 rounded border border-purple-200 hover:bg-purple-100 text-xs sm:text-sm"
                          >
                            Mark Picked Up
                          </button>
                        )}
                        {order.status !== 'CANCELLED' && order.status !== 'RETURNED' && order.status !== 'PICKED_UP' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                            className="text-red-600 bg-red-50 px-3 py-1 rounded border border-red-200 hover:bg-red-100 text-xs sm:text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white">Product Review details</h2>

        {orders.length === 0 ? (
          <p className="text-gray-400">No product review entries available.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gear</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renter</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Show Reviews</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-black text-sm">
                {orders.map((order) => (
                  <tr key={`review-${order.id}`} className="hover:bg-gray-50/50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium">#{order.id.slice(-6)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{order.gearName}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{order.renterName}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                      {order.startDate} to {order.endDate}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">${order.totalPrice}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/dashboard/customer/orders/${order.id}/review-details`}
                        className="inline-block bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-black transition"
                      >
                        Show Reviews
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}