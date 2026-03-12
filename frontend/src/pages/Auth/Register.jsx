import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { useRequestOTPMutation, useVerifyOTPMutation } from "../../redux/api/usersApislice";
import { setCredentials } from "../../redux/features/auth/authSlice";

import Loader from "../../components/Loader";
import { BiHide, BiShowAlt } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineVerifiedUser } from "react-icons/md";

const inputClasses =
  "w-full px-4 py-3 border border-[#E5E5E5] bg-white text-[#212A2C] placeholder-[#BDBDBD] outline-none focus:border-[#212A2C] transition-colors text-[14px]";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [requestOTP, { isLoading: isRequestingOTP }] = useRequestOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 5) {
      toast.error("Password must be at least 5 characters");
      return;
    }

    try {
      await requestOTP({ email }).unwrap();
      setStep(2);
      toast.success("Verification code sent to your email");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await verifyOTP({ username, email, password, otp }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Account verified and created successfully");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5 py-20">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <h1
            className="text-3xl font-light text-[#212A2C] tracking-tight mb-3"
            style={{ fontFamily: "serif" }}
          >
            {step === 1 ? "Create Account" : "Verify Email"}
          </h1>
          <p className="text-[14px] text-[#767676]">
            {step === 1
              ? "Join AEROLITH for a premium sustainable experience."
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestOTP}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#767676] mb-2">Name</label>
                  <input
                    type="text"
                    required
                    className={inputClasses}
                    placeholder="Your full name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#767676] mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className={inputClasses}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#767676] mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={isVisiblePass ? "text" : "password"}
                      required
                      className={inputClasses}
                      placeholder="At least 5 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BDBDBD] hover:text-[#212A2C]"
                      onClick={() => setIsVisiblePass(!isVisiblePass)}
                    >
                      {isVisiblePass ? <BiShowAlt size={18} /> : <BiHide size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#767676] mb-2">Confirm Password</label>
                  <input
                    type={isVisiblePass ? "text" : "password"}
                    required
                    className={inputClasses}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={isRequestingOTP}
                type="submit"
                className="w-full bg-[#212A2C] text-white py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50"
              >
                {isRequestingOTP ? "Sending Code..." : "Continue"}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOTP}
              className="space-y-8"
            >
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-4 text-center">Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  className="w-full text-center text-4xl font-bold tracking-[0.5em] border-b-2 border-[#E5E5E5] focus:border-[#212A2C] outline-none py-4 transition-colors"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <div className="space-y-4">
                <button
                  disabled={isVerifyingOTP}
                  type="submit"
                  className="w-full bg-[#212A2C] text-white py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isVerifyingOTP ? "Verifying..." : "Verify & Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[12px] font-bold uppercase tracking-[0.1em] text-[#767676] hover:text-[#212A2C] transition-colors"
                >
                  Back to Details
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-12 text-[#767676] text-[14px] text-center">
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-[#212A2C] underline underline-offset-4 font-bold"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
