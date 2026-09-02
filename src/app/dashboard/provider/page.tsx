"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export default function ProviderDashboard() {
  const [gearList, setGearList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const res = await api.get("/provider/gear");
        setGearList(res.data.gear || res.data);
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Failed to load your inventory.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/provider/gear/${deleteId}`);
      setGearList((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("Gear listing deleted successfully.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete gear listing.",
      );
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-black">
        Loading provider dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header - Fixed to wrap cleanly on mobile screens */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Provider Dashboard 🏪
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your gear listings and track performance
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/provider/gear/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
            >
              + Add New Gear
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-gray-500 text-sm font-semibold">
              Total Inventory Listed
            </h3>
            <p className="text-3xl font-bold text-black mt-2">
              {gearList.length}
            </p>
          </div>
          <Link
            href="/dashboard/provider/orders"
            className="bg-white p-6 rounded-lg shadow-sm border block hover:border-blue-500 transition"
          >
            <h3 className="text-gray-500 text-sm font-semibold">
              Incoming Orders
            </h3>
            <p className="text-3xl font-bold text-black mt-2">
              View Orders &rarr;
            </p>
          </Link>
        </div>

        {/* Inventory Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Gear Listings
            </h2>
          </div>

          {gearList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              You haven&apos;t added any gear listings yet. Click &quot;+ Add
              New Gear&quot; to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / Day</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-black">
                  {gearList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-medium">{item.title}</td>
                      <td className="p-4 text-gray-600">
                        {item.category?.name || "N/A"}
                      </td>
                      <td className="p-4">${item.pricePerDay}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                          {item.status || "AVAILABLE"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          href={`/dashboard/provider/gear/edit/${item.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2.5 py-1 rounded border border-blue-200 hover:bg-blue-50 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs px-2.5 py-1 rounded border border-red-200 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Custom Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-gray-900">Are you sure?</h3>
              <p className="text-sm text-gray-600">
                Do you really want to delete this gear listing? This process
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
                >
                  Yes, Delete Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}