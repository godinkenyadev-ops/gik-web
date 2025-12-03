import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { CONTACT_PHONE } from "src/config/constants";


export default function RegistrationFooter() {
  return (
    <div className="mt-12 pt-8 border-t border-slate-200 bg-slate-50 rounded-2xl px-6 py-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Need Help?</h3>
        <p className="text-sm text-slate-600">Contact us for any questions about registration</p>
      </div>

      <div className="flex flex-col md:flex-row md:justify-around gap-4 text-center">
        <div className="flex flex-col items-center">
          <FaPhoneAlt className="w-5 h-5 text-primary mb-2" />
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <a href={`tel:${CONTACT_PHONE}`} className="text-sm text-slate-600 hover:text-primary transition-colors">
            {CONTACT_PHONE}
          </a>
        </div>

        <div className="flex flex-col items-center">
          <FaMapMarkerAlt className="w-5 h-5 text-primary mb-2" />
          <span className="text-sm font-medium text-slate-700">Location</span>
          <span className="text-sm text-slate-600">Nairobi, Kenya</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} God in Kenya Missions. All rights reserved.
        </p>
      </div>
    </div>
  );
}