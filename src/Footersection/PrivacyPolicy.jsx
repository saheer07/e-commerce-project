import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  LockKeyhole,
  UploadCloud,
  FileText,
  CalendarCheck
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-red-500 mb-6 text-center">🔐 Privacy Policy</h1>
        <p className="text-gray-300 mb-8 text-lg text-center">
          We are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.
        </p>

        <div className="space-y-6">

          <PolicyItem
            icon={<UserCheck className="text-blue-400 w-6 h-6" />}
            title="Information We Collect"
            description="We collect your name, email, shipping address, and payment information during checkout or account registration."
          />

          <PolicyItem
            icon={<LockKeyhole className="text-purple-400 w-6 h-6" />}
            title="How We Use Your Data"
            description="Your data is used only to process orders, provide support, and improve our services. We do not sell or rent your data to anyone."
          />

          <PolicyItem
            icon={<UploadCloud className="text-yellow-400 w-6 h-6" />}
            title="Third-Party Services"
            description="We use third-party providers like payment gateways and shipping services. These partners are contractually obligated to protect your data."
          />

          <PolicyItem
            icon={<ShieldCheck className="text-green-400 w-6 h-6" />}
            title="Data Security"
            description="We use SSL encryption, secure servers, and restricted access protocols to protect your information from unauthorized access."
          />

          <PolicyItem
            icon={<FileText className="text-red-400 w-6 h-6" />}
            title="Cookies & Tracking"
            description="Cookies are used to personalize your shopping experience. You may disable them via browser settings, though it may affect functionality."
          />

          <PolicyItem
            icon={<CalendarCheck className="text-cyan-400 w-6 h-6" />}
            title="Data Retention"
            description="We retain your data as long as your account is active or as needed to fulfill our obligations. You can request deletion anytime."
          />

        </div>

        <p className="text-sm text-gray-500 mt-12 text-right">
          Last updated: May 12, 2025
        </p>
      </div>
    </div>
  );
};

const PolicyItem = ({ icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

export default PrivacyPolicy;
