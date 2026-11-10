import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { getWhatsAppLink } from '../utils/formatters.js';

export const ContactView: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const faqs = [
    {
      q: 'How long does delivery take inside and outside Dhaka?',
      a: 'Inside Dhaka city, deliveries are fulfilled within 24 to 48 hours via Steadfast or Pathao courier. For outside Dhaka across all 64 districts of Bangladesh, deliveries take 48 to 72 hours with doorstep delivery.',
    },
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'You do not have to pay anything in advance. When the delivery rider arrives at your doorstep, you may inspect the intact brand packaging and then pay the exact payable amount in cash.',
    },
    {
      q: 'How do I pay with bKash, Nagad, or Rocket?',
      a: 'During checkout, choose bKash, Nagad, or Rocket. You will see our official account number (01864015928). Simply Send Money or Make Payment with reference AKASH, and paste your 10-character Transaction ID (TrxID) in the checkout box for instant verification.',
    },
    {
      q: 'What is Akash Telecom’s warranty and replacement policy?',
      a: 'All our branded products (Anker, Soundcore, Baseus, Kieslect, Joyroom, Havit, Remax) come with official 6 to 18 months replacement warranty against manufacturing defects. If you face any issues, simply contact us via WhatsApp or phone with your Order ID.',
    },
    {
      q: 'Are all products 100% authentic and original?',
      a: 'Yes, absolutely. We source exclusively from authorized regional distributors. Every product includes an official manufacturer barcode, serial number, and scratch-code for online verification on the brand’s global website.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Official Support & Showroom
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
          Contact Akash Telecom
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          We are here to help you choose the right gadget, verify warranty claims, or answer wholesale and courier questions.
        </p>
      </div>

      {/* 3 Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* WhatsApp & Call Card */}
        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-start justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">WhatsApp & Phone</h3>
            <p className="text-xs text-slate-500 mt-1">Instant support 7 days a week, 9 AM – 11 PM BST</p>
            <div className="mt-4 font-mono text-base font-bold text-slate-900">
              +8801864015928
            </div>
          </div>
          <a
            href={getWhatsAppLink('01864015928', 'Hello Akash Telecom! I have a question about tech products.')}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            <span>Chat on WhatsApp</span>
            <span>→</span>
          </a>
        </div>

        {/* Official Email Card */}
        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-start justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Email Support</h3>
            <p className="text-xs text-slate-500 mt-1">For corporate orders, bulk tech supply, and warranty</p>
            <div className="mt-4 text-sm font-semibold text-slate-900">
              khanakash9426@gmail.com
            </div>
          </div>
          <a
            href="mailto:khanakash9426@gmail.com"
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Send Email Message</span>
            <span>→</span>
          </a>
        </div>

        {/* Operating Hours & Dispatch */}
        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-start justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Central Hub & Dispatch</h3>
            <p className="text-xs text-slate-500 mt-1">Same-day courier dispatch across Bangladesh</p>
            <div className="mt-4 text-xs font-medium text-slate-700 space-y-1">
              <div>📍 Dhaka Hub: Sector-07, Uttara, Dhaka-1230</div>
              <div>⏱️ Order Processing: 9:00 AM – 8:00 PM Daily</div>
            </div>
          </div>
          <div className="mt-6 text-xs font-bold text-slate-500">
            Official Trade License Registered
          </div>
        </div>
      </div>

      {/* Interactive Form & FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Form */}
        <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 font-display mb-2">Send Us a Direct Message</h2>
          <p className="text-xs text-slate-500 mb-6">
            Have a custom query or want to request a product not listed in the catalog?
          </p>

          {formSent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Message Received!</h4>
              <p className="text-xs text-emerald-700">
                Our support team will contact you at <strong>{phone || email}</strong> shortly.
              </p>
              <button
                onClick={() => setFormSent(false)}
                className="mt-4 text-xs font-bold text-emerald-800 underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Farhan Chowdhury"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Topic / Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  <option value="Product Inquiry">Product Inquiry / Stock Check</option>
                  <option value="Order Tracking">Order Tracking & Courier Delivery</option>
                  <option value="Warranty Claim">Warranty Claim / Replacement</option>
                  <option value="bKash/Nagad Payment">bKash / Nagad Payment Verification</option>
                  <option value="Bulk Order">Wholesale / Corporate Tech Supply</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you today? Provide as much detail as possible..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: FAQs */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 font-display mb-2 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Quick answers to our most common delivery, payment, and authenticity questions in Bangladesh.
          </p>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
