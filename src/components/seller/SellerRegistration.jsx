import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSellerDetails } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  User,
  IdCard,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import {
  SHIPPING_METHODS,
  DELIVERY_OPTIONS,
} from "../../utils/constants";

const DEMO_OTP = "123456";

const SellerRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [kyc, setKyc] = useState({
    aadhaar: "",
    pan: "",
    phone: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [details, setDetails] = useState({
    storeName: "",
    email: "",
    address: "",
    shippingMethod: SHIPPING_METHODS.STANDARD,
    deliveryOption: DELIVERY_OPTIONS.PAID,
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
  });

  const handleKycChange = (e) => {
    setKyc({ ...kyc, [e.target.name]: e.target.value });
  };

  const handleDetailsChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!kyc.phone || kyc.phone.length < 10) return;

    setOtpSent(true);
    setStep(2);
    setOtpError("");

    alert(
      `Demo OTP: ${DEMO_OTP}\n\n(In a real app this would be sent to ${kyc.phone}.`
    );
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp === DEMO_OTP) {
      setOtpError("");
      setStep(3);
    } else {
      setOtpError("Incorrect OTP. Try 123456 for demo.");
    }
  };

  const handleFinish = (e) => {
    e.preventDefault();

    dispatch(
      updateSellerDetails({
        ...kyc,
        ...details,
        isSeller: true,
        sellerId: `SELL${Date.now()}`,
        gstRate: 0,
      })
    );

    alert("You are now a registered thrift seller! 🎉");
    navigate("/seller-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Thrift Seller Registration
            </h1>
            <p className="text-xs text-gray-500">
              Step {step} of 3 • KYC and payout details
            </p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-between text-xs font-medium">
          <div className={`flex-1 flex items-center gap-2 ${step >= 1 ? "text-purple-600" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center border border-current">
              1
            </span>
            <span>KYC & Phone</span>
          </div>
          <div className={`flex-1 flex items-center justify-center gap-2 ${step >= 2 ? "text-purple-600" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center border border-current">
              2
            </span>
            <span>OTP Verify</span>
          </div>
          <div className={`flex-1 flex items-center justify-end gap-2 ${step >= 3 ? "text-purple-600" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center border border-current">
              3
            </span>
            <span>Store & Bank</span>
          </div>
        </div>

        {/* Step 1: KYC */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Aadhaar Number</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
                <IdCard className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="aadhaar"
                  pattern="[0-9]{12}"
                  required
                  placeholder="12 digit Aadhaar"
                  value={kyc.aadhaar}
                  onChange={handleKycChange}
                  className="w-full bg-transparent outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">PAN Number</label>
              <input
                type="text"
                name="pan"
                required
                placeholder="ABCDE1234F"
                value={kyc.pan}
                onChange={handleKycChange}
                className="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Phone (OTP will be sent)</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
                <Phone className="w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  pattern="[0-9]{10}"
                  required
                  placeholder="10 digit number"
                  value={kyc.phone}
                  onChange={handleKycChange}
                  className="w-full bg-transparent outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <p className="text-sm text-gray-600">
              We’ve (pretend) sent an OTP to{" "}
              <span className="font-semibold">{kyc.phone}</span>.  
              For this demo, use <span className="font-mono font-bold">123456</span>.
            </p>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Enter OTP</label>
              <input
                type="text"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none text-sm tracking-widest text-center font-mono"
                placeholder="••••••"
              />
            </div>

            {otpError && (
              <p className="text-xs text-red-500">{otpError}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-xl font-semibold text-sm"
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Store + bank + GST */}
        {step === 3 && (
          <form className="space-y-4" onSubmit={handleFinish}>
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Store Name</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
                <User className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="storeName"
                  required
                  placeholder="Your thrift store name"
                  value={details.storeName}
                  onChange={handleDetailsChange}
                  className="w-full bg-transparent outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Seller Email</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
                <Mail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="store@email"
                  value={details.email}
                  onChange={handleDetailsChange}
                  className="w-full bg-transparent outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Pickup Address</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Full pickup address"
                  value={details.address}
                  onChange={handleDetailsChange}
                  className="w-full bg-transparent outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            {/* Shipping / delivery */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-sm text-gray-600">
                  Preferred shipping
                </label>
                <select
                  name="shippingMethod"
                  value={details.shippingMethod}
                  onChange={handleDetailsChange}
                  className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none"
                >
                  {Object.values(SHIPPING_METHODS).map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-sm text-gray-600">
                  Delivery charges
                </label>
                <select
                  name="deliveryOption"
                  value={details.deliveryOption}
                  onChange={handleDetailsChange}
                  className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none"
                >
                  <option value={DELIVERY_OPTIONS.FREE}>
                    I will offer free delivery
                  </option>
                  <option value={DELIVERY_OPTIONS.PAID}>
                    Buyer pays delivery
                  </option>
                </select>
              </div>
            </div>

            {/* Bank details */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">
                Bank account holder
              </label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
                <Banknote className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="accountHolder"
                  required
                  placeholder="Name on bank account"
                  value={details.accountHolder}
                  onChange={handleDetailsChange}
                  className="w-full bg-transparent outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-sm text-gray-600">Account number</label>
                <input
                  type="text"
                  name="accountNumber"
                  required
                  placeholder="XXXXXXXXXXXX"
                  value={details.accountNumber}
                  onChange={handleDetailsChange}
                  className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-sm text-gray-600">IFSC</label>
                <input
                  type="text"
                  name="ifsc"
                  required
                  placeholder="SBIN000000"
                  value={details.ifsc}
                  onChange={handleDetailsChange}
                  className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>

            {/* GST info */}
            <div className="flex items-start gap-2 text-xs bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5" />
              <p className="text-[11px] text-purple-900">
                For individual thrifters, default GST rate is <b>0%</b>.  
                If you become a registered business later, you can update GST with support.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-xl font-semibold text-sm"
              >
                Complete Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerRegistration;
