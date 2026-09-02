"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function EditGearPage() {
  const router = useRouter();
  const params = useParams();
  const gearId = params.id;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, gearRes] = await Promise.all([
          api.get("/categories"),
          api.get("/provider/gear"),
        ]);

        const rawCats =
          catRes.data.categories || catRes.data.data || catRes.data;
        setCategories(Array.isArray(rawCats) ? rawCats : []);

        const gearList = gearRes.data.gear || gearRes.data;
        const gear = Array.isArray(gearList)
          ? gearList.find((item: any) => item.id === gearId)
          : null;

        if (!gear) {
          throw new Error("Gear item not found.");
        }

        reset({
          title: gear.title,
          categoryId: gear.categoryId,
          pricePerDay: gear.pricePerDay,
          stock: gear.stock,
          brand: gear.brand,
          description: gear.description,
          imageUrl: gear.images?.[0] || gear.imageUrl || "",
        });
      } catch (err: any) {
        toast.error("Failed to load gear details for editing.");
      } finally {
        setLoading(false);
      }
    };

    if (gearId) fetchData();
  }, [gearId, reset]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        brand: data.brand,
        pricePerDay: Number(data.pricePerDay),
        stock: Number(data.stock),
        categoryId: data.categoryId,
        images: [data.imageUrl].filter(Boolean),
      };

      await api.put(`/provider/gear/${gearId}`, payload);
      toast.success("Gear listing updated successfully!");
      router.push("/dashboard/provider");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update gear listing.";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-black">
        Loading gear information...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex bg-white">
      {/* Left Half: Full-Height Image Container matching the homepage structure */}
      <div className="relative hidden lg:block w-1/2 min-h-[calc(100vh-80px)] bg-gray-900">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12 text-white">
          <span className="text-blue-400 font-semibold uppercase tracking-wider text-xs mb-2">
            Premium Fitness & Outdoor Rentals
          </span>
          <h2 className="text-4xl font-bold mb-3">
            Rent Sports & Outdoor Gear Instantly
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed max-w-lg">
            Explore high-quality gear from trusted local providers. Book
            securely, track your rentals, and start your fitness adventure
            today.
          </p>
        </div>
      </div>

      {/* Right Half: Clean Form Functionality */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white overflow-y-auto">
        <div className="max-w-xl w-full mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-black">
            Edit Gear Listing
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Title
              </label>
              <input
                {...register("title")}
                required
                className="w-full border p-2 rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Category
              </label>
              <select
                {...register("categoryId")}
                required
                className="w-full border p-2 rounded text-black bg-white"
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat.id || cat} value={cat.id || cat}>
                      {cat.name || cat}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Price Per Day ($)
                </label>
                <input
                  {...register("pricePerDay")}
                  type="number"
                  step="0.01"
                  required
                  className="w-full border p-2 rounded text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Stock
                </label>
                <input
                  {...register("stock")}
                  type="number"
                  required
                  className="w-full border p-2 rounded text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Brand
              </label>
              <input
                {...register("brand")}
                required
                className="w-full border p-2 rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                required
                className="w-full border p-2 rounded text-black"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Image URL
              </label>
              <input
                {...register("imageUrl")}
                required
                className="w-full border p-2 rounded text-black"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard/provider")}
                className="w-1/3 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isSubmitting ? "Saving changes..." : "Update Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}