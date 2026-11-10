import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  Banknote,
  Printer,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { formatBDT, getWhatsAppLink } from '../utils/formatters.js';
import {
  BANGLADESH_DIVISIONS,
  validateBdPhone,
} from '../data/bangladeshDistricts.js';
import type { Order, PaymentMethod } from '../types/index.js';

interface CheckoutViewProps {
  onBack: () => void;
  onNavigateHome: () => void;
  onTrackOrder: (orderId: string, phone: string) => void;
  directBuyItem?: {
    product: any;
    quantity: number;
    color?: string;
  };
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBack,
  onNavigateHome,
  onTrackOrder,
  directBuyItem,
}) => {
  const { cart, subtotal: cartSubtotal, appliedCoupon, clearCart } = useCart();

  // If user came via "Buy Now", use direct buy item, otherwise use full cart
  const items = directBuyItem
    ? [
        {
          productId: directBuyItem.product.id,
          name: directBuyItem.product.name,
          image: directBuyItem.product.images[0],
          price: directBuyItem.product.discountedPrice,
          quantity: directBuyItem.quantity,
          color: directBuyItem.color,
        },
      ]
    : cart.map((i) => ({
        productId: i.productId,
        name: i.product.name,
        image: i.product.images[0],
        price: i.product.discountedPrice,
        quantity: i.quantity,
        color: i.selectedColor,
      }));

  const subtotal = directBuyItem
    ? directBuyItem.product.discountedPrice * directBuyItem.quantity
    : cartSubtotal;

  const discount = directBuyItem ? 0 : appliedCoupon ? appliedCoupon.discount : 0;

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [cityArea, setCityArea] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<'inside_dhaka' | 'outside_dhaka' | 'express_dhaka'>('inside_dhaka');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync delivery method when district changes
  useEffect(() => {
    if (selectedDistrict.toLowerCase() === 'dhaka') {
      if (deliveryMethod === 'outside_dhaka') {
        setDeliveryMethod('inside_dhaka');
      }
    } else {
      setDeliveryMethod('outside_dhaka');
    }
  }, [selectedDistrict]);

  // Available districts based on division
  const currentDistricts =
    BANGLADESH_DIVISIONS.find((d) => d.division === selectedDivision)?.districts || [];

  // Calculate delivery fee
  const deliveryCharge =
    deliveryMethod === 'inside_dhaka'
      ? 70
      : deliveryMethod === 'outside_dhaka'
      ? 130
      : 150;

  const total = Math.max(0, subtotal - discount + deliveryCharge);

  const isPhoneValid = validateBdPhone(phone);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(text);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setPhoneTouched(true);

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!validateBdPhone(phone)) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01864015928).');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Please provide your complete delivery street address.');
      return;
    }

    if (paymentMethod !== 'cod') {
      if (!transactionId.trim()) {
        setErrorMessage(`Please enter your ${paymentMethod.toUpperCase()} Transaction ID (TrxID).`);
        return;
      }
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      division: selectedDivision,
      district: selectedDistrict,
      cityArea: cityArea.trim() || selectedDistrict,
      address: address.trim(),
      notes: notes.trim() || undefined,
      items,
      subtotal,
      deliveryMethod,
      deliveryCharge,
      discount,
      couponCode: appliedCoupon?.code,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      transactionId: transactionId.trim() || undefined,
      senderNumber: senderNumber.trim() || phone.trim(),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('Server error placing order');
      }

      const createdOrder: Order = await res.json();
      setConfirmedOrder(createdOrder);
      if (!directBuyItem) {
        clearCart();
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#06B6D4', '#101828', '#10B981'],
        });
      } catch {}
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (confirmedOrder) {
    const waText = `Hello Akash Telecom! I have just placed order #${confirmedOrder.id} for ${formatBDT(
      confirmedOrder.total
    )}. Name: ${confirmedOrder.customerName}, Phone: ${confirmedOrder.phone}. Please confirm dispatch!`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Order Confirmed!
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Thank you for shopping with <strong className="text-slate-900">Akash Telecom</strong>. Your order has been placed successfully and is being prepared for dispatch.
          </p>

          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block text-left min-w-[280px]">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Your Order ID</div>
            <div className="text-xl font-black text-blue-600 font-mono tracking-tight mt-0.5">
              {confirmedOrder.id}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Status: <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Pending Verification / Processing</span>
            </div>
          </div>

          {/* Delivery & Payment details summary */}
          <div className="mt-8 text-left border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Order Summary</h3>
            <div className="space-y-3">
              {confirmedOrder.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.image}
                      alt=""
                      className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{it.name}</div>
                      <div className="text-slate-500 text-xs">
                        Qty: {it.quantity} {it.color ? `· Color: ${it.color}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 tabular-nums">
                    {formatBDT(it.price * it.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 tabular-nums">{formatBDT(confirmedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge ({confirmedOrder.district})</span>
                <span className="font-semibold text-slate-800 tabular-nums">{formatBDT(confirmedOrder.deliveryCharge)}</span>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-semibold tabular-nums">-{formatBDT(confirmedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-blue-600 tabular-nums">{formatBDT(confirmedOrder.total)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1">
              <div><strong>Delivery To:</strong> {confirmedOrder.customerName} ({confirmedOrder.phone})</div>
              <div><strong>Address:</strong> {confirmedOrder.address}, {confirmedOrder.cityArea}, {confirmedOrder.district}</div>
              <div><strong>Payment Method:</strong> {confirmedOrder.paymentMethod.toUpperCase()} {confirmedOrder.transactionId ? `(TrxID: ${confirmedOrder.transactionId})` : '(Cash on Delivery)'}</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 py-3 px-5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Receipt</span>
            </button>

            <a
              href={getWhatsAppLink('01864015928', waText)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send WhatsApp Update (+8801864015928)</span>
            </a>

            <button
              onClick={() => onTrackOrder(confirmedOrder.id, confirmedOrder.phone)}
              className="inline-flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Order</span>
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={onNavigateHome}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors underline"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT FORM VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Cart / Store</span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Express Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your order in 60 seconds with Cash on Delivery or Mobile Financial Services (bKash/Nagad).
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-600">Your bag is empty. Please add items to checkout.</p>
          <button
            onClick={onNavigateHome}
            className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Customer Info, Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Contact & Location */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                  1
                </span>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Delivery Details & Contact
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mobile Number <span className="text-rose-500">* (01XXXXXXXXX)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onBlur={() => setPhoneTouched(true)}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01864015928"
                    className={`w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 text-slate-900 text-sm ${
                      phoneTouched && !isPhoneValid
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-blue-600/30 focus:border-blue-600'
                    }`}
                  />
                  {phoneTouched && !isPhoneValid && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      Must be valid 11-digit Bangladeshi number starting with 013-019.
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional for order invoice)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-sm"
                  />
                </div>

                {/* Division & District */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Division <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedDivision}
                    onChange={(e) => {
                      const div = e.target.value;
                      setSelectedDivision(div);
                      const divObj = BANGLADESH_DIVISIONS.find((d) => d.division === div);
                      if (divObj && divObj.districts.length > 0) {
                        setSelectedDistrict(divObj.districts[0]);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d.division} value={d.division}>
                        {d.division}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    {currentDistricts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Area / Thana / Upazila <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    placeholder="e.g. Dhanmondi 27 / Agrabad / Mirpur 10 / Zindabazar"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Full Delivery Street Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, Road number, Flat / Building name, landmark..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Order Notes <span className="text-slate-400 font-normal">(Optional instruction for rider)</span>
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please deliver after 3 PM or call before arriving"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-900 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Options */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                  2
                </span>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Courier Delivery Method
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === 'inside_dhaka'
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'inside_dhaka'}
                      onChange={() => setDeliveryMethod('inside_dhaka')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Inside Dhaka Delivery</div>
                      <div className="text-xs text-slate-500">24-48 Hours · Steadfast / Pathao Courier</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">৳70</span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === 'outside_dhaka'
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'outside_dhaka'}
                      onChange={() => setDeliveryMethod('outside_dhaka')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Outside Dhaka (All 64 Districts)</div>
                      <div className="text-xs text-slate-500">48-72 Hours · Home delivery across Bangladesh</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">৳130</span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === 'express_dhaka'
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'express_dhaka'}
                      onChange={() => setDeliveryMethod('express_dhaka')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Express Same-Day Dhaka Priority</div>
                      <div className="text-xs text-slate-500">Delivered within 6-12 hours in Dhaka City</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">৳150</span>
                </label>
              </div>
            </div>

            {/* 3. Payment Methods */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                  3
                </span>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* Option 1: Cash on Delivery */}
                <label
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-blue-600"
                      />
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</div>
                          <div className="text-xs text-slate-500">Pay cash to rider upon doorstep inspection</div>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Most Popular
                    </span>
                  </div>
                </label>

                {/* Option 2: bKash */}
                <label
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-500 bg-pink-50/30 ring-1 ring-pink-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="text-pink-600"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-pink-600 font-extrabold">bKash</span>
                          <span>Send Money / Payment</span>
                        </div>
                        <div className="text-xs text-slate-500">Instant verification via TrxID</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      01864015928
                    </span>
                  </div>

                  {paymentMethod === 'bkash' && (
                    <div className="mt-4 pt-4 border-t border-pink-100 text-xs space-y-3 text-slate-700 bg-pink-50/50 p-3 rounded-xl">
                      <div className="font-semibold text-slate-900">bKash Payment Steps:</div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600">
                        <li>Open your bKash app or dial <strong>*247#</strong></li>
                        <li>Choose <strong>Send Money</strong> or <strong>Payment</strong></li>
                        <li className="flex items-center gap-2">
                          <span>To Account Number: <strong className="font-mono text-slate-900">01864015928</strong></span>
                          <button
                            type="button"
                            onClick={() => handleCopy('01864015928')}
                            className="text-pink-600 hover:text-pink-800 font-bold inline-flex items-center gap-1"
                          >
                            {copiedAccount === '01864015928' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedAccount === '01864015928' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </li>
                        <li>Enter Amount: <strong className="text-blue-600 font-mono">{formatBDT(total)}</strong></li>
                        <li>Reference: <strong className="font-mono">AKASH</strong></li>
                      </ol>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">
                            Your bKash Number <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            placeholder="e.g. 01712345678"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">
                            bKash Transaction ID (TrxID) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                            placeholder="e.g. BK9X77L2Q4"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Option 3: Nagad */}
                <label
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="text-orange-600"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-orange-600 font-extrabold">Nagad</span>
                          <span>Send Money / Payment</span>
                        </div>
                        <div className="text-xs text-slate-500">Fast digital processing</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      01864015928
                    </span>
                  </div>

                  {paymentMethod === 'nagad' && (
                    <div className="mt-4 pt-4 border-t border-orange-100 text-xs space-y-3 text-slate-700 bg-orange-50/50 p-3 rounded-xl">
                      <div className="font-semibold text-slate-900">Nagad Payment Steps:</div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600">
                        <li>Open Nagad App or dial <strong>*167#</strong></li>
                        <li>Send Money / Payment of <strong className="text-blue-600 font-mono">{formatBDT(total)}</strong> to <strong className="font-mono">01864015928</strong></li>
                        <li>Reference: <strong className="font-mono">AKASH</strong></li>
                      </ol>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">Your Nagad Number</label>
                          <input
                            type="tel"
                            required
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">Nagad TrxID</label>
                          <input
                            type="text"
                            required
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                            placeholder="e.g. 7N9K3B29"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Option 4: Rocket */}
                <label
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'rocket'
                      ? 'border-purple-600 bg-purple-50/30 ring-1 ring-purple-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'rocket'}
                        onChange={() => setPaymentMethod('rocket')}
                        className="text-purple-600"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-purple-700 font-extrabold">Rocket</span>
                          <span>(DBBL Mobile Banking)</span>
                        </div>
                        <div className="text-xs text-slate-500">Pay to 01864015928-6</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      01864015928-6
                    </span>
                  </div>

                  {paymentMethod === 'rocket' && (
                    <div className="mt-4 pt-4 border-t border-purple-100 text-xs space-y-3 text-slate-700 bg-purple-50/50 p-3 rounded-xl">
                      <div className="font-semibold text-slate-900">Rocket Payment Steps:</div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600">
                        <li>Dial <strong>*322#</strong> or open Rocket App</li>
                        <li>Send Money to <strong className="font-mono">01864015928-6</strong> (Amount: {formatBDT(total)})</li>
                      </ol>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">Your Rocket Number</label>
                          <input
                            type="tel"
                            required
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">Rocket TrxID</label>
                          <input
                            type="text"
                            required
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                            placeholder="e.g. RKT78921"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirm CTA */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
              <h2 className="text-lg font-bold text-slate-900 font-display pb-3 border-b border-slate-100">
                Order Review ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
              </h2>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
                {items.map((it, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={it.image}
                      alt=""
                      className="w-12 h-12 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">{it.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Qty: {it.quantity} {it.color ? `· ${it.color}` : ''}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-900 tabular-nums">
                      {formatBDT(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({selectedDistrict})</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatBDT(deliveryCharge)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold tabular-nums">-{formatBDT(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-blue-600 tabular-nums text-lg">{formatBDT(total)}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Your Order...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Order ({formatBDT(total)})</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-400 space-y-1">
                <div>🔒 256-bit Encrypted Checkout · Official Akash Telecom Guarantee</div>
                <div>Questions? Call our Dhaka hotline: <strong>01864015928</strong></div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
