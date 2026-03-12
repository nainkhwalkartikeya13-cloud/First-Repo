import { useState } from "react";
import {
    useGetCouponsQuery,
    useCreateCouponMutation,
    useDeleteCouponMutation,
} from "../../redux/api/couponApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { FiTrash2, FiPlus, FiTag } from "react-icons/fi";
import Loader from "../../components/Loader";
import moment from "moment";

const CouponList = () => {
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    const { data: coupons, isLoading, refetch } = useGetCouponsQuery();
    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCoupon({ code, discount, expiryDate }).unwrap();
            toast.success("Coupon created successfully");
            setCode("");
            setDiscount("");
            setExpiryDate("");
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                await deleteCoupon(id).unwrap();
                toast.success("Coupon deleted");
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-10 py-10">
            <div className="flex flex-col md:flex-row gap-10">
                <AdminMenu />

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-8">
                        <FiTag className="text-[#212A2C]" size={24} />
                        <h1 className="text-2xl font-serif">Manage Coupons</h1>
                    </div>

                    {/* Create Coupon Form */}
                    <div className="bg-[#F8F7F5] p-6 rounded-xl border border-[#E5E4E0] mb-10">
                        <h2 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-6">Create New Coupon</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold uppercase text-[#212A2C]">Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. SAVE10"
                                    className="bg-white border border-[#E5E4E0] p-3 text-[13px] outline-none focus:border-[#212A2C] transition-colors"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold uppercase text-[#212A2C]">Discount (%)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 10"
                                    className="bg-white border border-[#E5E4E0] p-3 text-[13px] outline-none focus:border-[#212A2C] transition-colors"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold uppercase text-[#212A2C]">Expiry Date</label>
                                <input
                                    type="date"
                                    className="bg-white border border-[#E5E4E0] p-3 text-[13px] outline-none focus:border-[#212A2C] transition-colors"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="w-full flex items-center justify-center gap-2 bg-[#212A2C] text-white p-3.5 text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-[#1a2022] transition-colors"
                                >
                                    <FiPlus size={16} />
                                    {isCreating ? "Creating..." : "Add Coupon"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Coupons List */}
                    <div className="bg-white border border-[#E5E4E0] rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-[#E5E4E0]">
                            <h2 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#767676]">Active Coupons</h2>
                        </div>

                        {isLoading ? (
                            <div className="p-10 flex justify-center"><Loader /></div>
                        ) : coupons?.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">No active coupons found.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-[#F8F7F5] border-b border-[#E5E4E0]">
                                    <tr>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#767676]">Code</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#767676]">Discount</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#767676]">Expires</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#767676] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E4E0]">
                                    {coupons?.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <span className="bg-[#212A2C] text-white px-2 py-1 text-[11px] font-bold tracking-wider rounded">
                                                    {coupon.code}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[13px] font-medium text-[#212A2C]">{coupon.discount}%</td>
                                            <td className="p-4 text-[13px] text-[#767676]">
                                                {moment(coupon.expiryDate).format("MMM DD, YYYY")}
                                                <span className="ml-2">
                                                    {new Date(coupon.expiryDate) < new Date() ? (
                                                        <span className="text-red-500 text-[10px] font-bold uppercase">(Expired)</span>
                                                    ) : (
                                                        <span className="text-green-600 text-[10px] font-bold uppercase">(Active)</span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(coupon._id)}
                                                    className="text-red-500 hover:text-red-700 p-2 transition-colors"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponList;
