import React from 'react';
import { CheckCircle, ShieldCheck, RotateCcw, CreditCard, User, Globe } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-red-500 mb-8 text-center">📜 Terms & Conditions</h1>

        <p className="text-gray-300 mb-8 text-lg text-center">
          Please read these terms carefully. By using our services, you agree to be bound by them.
        </p>

        <div className="space-y-6">

          <Section
            icon={<ShieldCheck className="text-green-400 w-6 h-6" />}
            title="Warranty & Installation"
            text="Products must be installed by certified professionals to qualify for warranty claims. Improper use or DIY installation voids warranty."
          />

          <Section
            icon={<RotateCcw className="text-yellow-400 w-6 h-6" />}
            title="Return & Refund Policy"
            text="Returns are accepted within 7 days of delivery, only for unused items in original packaging. Refunds are processed within 5-7 business days."
          />

          <Section
            icon={<CreditCard className="text-purple-400 w-6 h-6" />}
            title="Pricing & Payments"
            text="All prices are listed in USD. We accept major credit/debit cards, UPI, and cash on delivery. Prices are subject to change without notice."
          />

          <Section
            icon={<User className="text-blue-400 w-6 h-6" />}
            title="User Account Responsibility"
            text="You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
          />

          <Section
            icon={<Globe className="text-red-400 w-6 h-6" />}
            title="Governing Law"
            text="These terms are governed by the laws of the United States. Any disputes will be resolved in accordance with U.S. legal jurisdictions."
          />

          <Section
            icon={<CheckCircle className="text-green-500 w-6 h-6" />}
            title="Changes to Terms"
            text="We reserve the right to update these terms at any time. Continued use of our platform indicates your acceptance of the latest terms."
          />
        </div>

        <p className="text-sm text-gray-500 mt-12 text-right">Last updated: May 12, 2025</p>
      </div>
    </div>
  );
};

const Section = ({ icon, title, text }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-300">{text}</p>
    </div>
  </div>
);

export default Terms;
