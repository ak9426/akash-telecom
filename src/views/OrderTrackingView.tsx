import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import type { Order, OrderStatus } from '../types/index.js';
import { formatBDT, formatDate, getWhatsAppLink } from '../utils/formatters.js';

interface OrderTrackingViewProps {
  initialOrderId?: string;
  initialPhone?: string;
  onSelectProduct?: (productId: string) => void;
}

const STATUS_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderId = '',
  initialPhone = '',
}) => {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [phoneInput, setPhoneInput] = useState(initialPhone);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTrack = async (id: string, ph: string) => {
    if (!id.trim() && !ph.trim()) {
      setErrorMessage('Please enter either Order ID or Phone number.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (id.trim()) params.append('orderId', id.trim());
      if (ph.trim()) params.append('phone', ph.trim());

      const res = await fetch(`/api/track?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'No matching order found');
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err: any) {
      setOrders([]);
      setErrorMessage(err.message || 'No orders matched your search criteria.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId || initialPhone) {
      fetchTrack(initialOrderId, initialPhone);
    }
  }, [initialOrderId, initialPhone]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrack(orderIdInput, phoneInput);
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStepStatus = (currentStatus: OrderStatus, step: OrderStatus) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    const currentIndex = STATUS_STEPS.indexOf(currentStatus);
    const stepIndex = STATUS_STEPS.indexOf(step);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-3">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-time Courier Dispatch Tracking</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          Track Your Akash Telecom Order
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Enter your Order ID (e.g. AKT-2026-8942) or mobile number used during checkout.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md mb-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
              placeholder="e.g. AKT-2026-8942"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-12">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Searching Records...' : 'Track Order Status'}</span>
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Order Not Found</div>
              <div>{errorMessage}</div>
              <div className="mt-1 text-slate-600">
                Need immediate help? WhatsApp us at{' '}
                <a
                  href={getWhatsAppLink('01864015928', 'Hello! I need help tracking my order.')}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 underline"
                >
                  +8801864015928
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Display */}
      {orders.length > 0 && (
        <div className="space-y-8">
          {orders.map((order) => {
            const isCancelled = order.orderStatus === 'Cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden"
              >
                {/* Header Strip */}
                <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-cyan-400 font-mono">ORDER</span>
                      <span className="text-xl font-black font-mono tracking-tight">{order.id}</span>
                      <button
                        onClick={() => handleCopy(order.id)}
                        className="text-slate-400 hover:text-white p-1"
                        title="Copy Order ID"
                      >
                        {copiedId === order.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Placed on {formatDate(order.createdAt)} · Receiver: {order.customerName} ({order.phone})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-500 text-white'
                          : isCancelled
                          ? 'bg-rose-500 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Stepper */}
                {!isCancelled ? (
                  <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/50">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                      {STATUS_STEPS.map((step, idx) => {
                        const statusType = getStepStatus(order.orderStatus, step);
                        return (
                          <div key={step} className="flex flex-col items-center text-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                                statusType === 'completed'
                                  ? 'bg-emerald-600 text-white'
                                  : statusType === 'current'
                                  ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {statusType === 'completed' ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>
                            <span
                              className={`text-xs font-semibold ${
                                statusType === 'current'
                                  ? 'text-blue-600 font-bold'
                                  : statusType === 'completed'
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-rose-50 text-rose-800 text-xs flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>This order has been cancelled. Please contact Akash Telecom support if this was unintended.</span>
                  </div>
                )}

                {/* Order Details & Courier info */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Courier Card */}
                  {order.courierService && (
                    <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            Courier Partner: {order.courierService}
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            Tracking Code: <strong className="font-mono text-slate-900">{order.courierTrackingCode || 'Assigned / In Transit'}</strong>
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-blue-200">
                        Home Delivery to {order.district}
                      </span>
                    </div>
                  )}

                  {/* Items List */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Parcel Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                    </h3>
                    <div className="divide-y divide-slate-100">
                      {order.items.map((it, i) => (
                        <div key={i} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-3">
                            <img
                              src={it.image}
                              alt=""
                              className="w-12 h-12 object-cover rounded-xl bg-slate-100 border border-slate-200"
                            />
                            <div>
                              <div className="font-semibold text-slate-900">{it.name}</div>
                              <div className="text-slate-500 text-xs">
                                Quantity: {it.quantity} {it.color ? `· Color: ${it.color}` : ''}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-slate-900 tabular-nums">
                            {formatBDT(it.price * it.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address & Payment summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="font-bold text-slate-800 mb-1">Destination Address</div>
                      <div className="text-slate-600">
                        {order.address}, {order.cityArea}, {order.district}, {order.division}
                      </div>
                      {order.notes && (
                        <div className="text-slate-500 mt-1 italic">Note: "{order.notes}"</div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="font-bold text-slate-800 mb-1">Payment & Total</div>
                      <div className="text-slate-600">
                        Method: <strong className="uppercase">{order.paymentMethod}</strong> (Status: {order.paymentStatus})
                      </div>
                      {order.transactionId && (
                        <div className="text-slate-600 font-mono mt-0.5">TrxID: {order.transactionId}</div>
                      )}
                      <div className="mt-2 text-sm font-bold text-blue-600">
                        Total Paid / Due: {formatBDT(order.total)}
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Support Action */}
                  <div className="pt-2 flex justify-end">
                    <a
                      href={getWhatsAppLink(
                        '01864015928',
                        `Hello! Regarding my order ${order.id} (${order.customerName}). Could you please update me on delivery time?`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Store Help (+8801864015928)</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
