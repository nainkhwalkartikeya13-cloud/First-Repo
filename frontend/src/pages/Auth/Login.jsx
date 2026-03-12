import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation, useGoogleAuthMutation } from "../../redux/api/usersApislice";
import { GoogleLogin } from "@react-oauth/google";

import Loader from "../../components/Loader.jsx";
import { BiHide, BiShowAlt } from "react-icons/bi";

const inputClasses =
  "w-full px-4 py-3 border border-[#E5E5E5] bg-white text-[#212A2C] placeholder-[#BDBDBD] outline-none focus:border-[#212A2C] transition-colors text-[14px]";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const [googleAuth] = useGoogleAuthMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleAuth({ credential: credentialResponse.credential }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Logged in seamlessly via Google!");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Google Login failed");
    }
  };

  const handleGuestCheckout = () => {
    // If the user wants to check out as a guest, we just funnel them directly to shipping
    // The Shipping process handles unauthenticated usage safely
    navigate("/shipping?guest=true");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="w-full max-w-[420px]">
        <h1
          className="text-2xl md:text-3xl font-light text-[#212A2C] tracking-tight mb-2"
          style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
        >
          {redirect === "/shipping" ? "Secure Checkout" : "Log In"}
        </h1>
        <p className="text-[14px] text-[#767676] mb-8">
          Sign in to your AEROLITH account
        </p>

        <div className="mb-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error("Google Login Failed");
            }}
            useOneTap
            shape="rectangular"
            theme="outline"
            text="continue_with"
            size="large"
            width="420"
          />
        </div>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-[#E5E5E5]"></div>
          <span className="flex-shrink-0 mx-4 text-[#BDBDBD] text-xs uppercase tracking-widest font-bold">Or</span>
          <div className="flex-grow border-t border-[#E5E5E5]"></div>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-[12px] font-bold uppercase tracking-[0.1em] text-[#767676] mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={inputClasses}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[12px] font-bold uppercase tracking-[0.1em] text-[#767676] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={isVisiblePass ? "text" : "password"}
                id="password"
                className={inputClasses}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BDBDBD] hover:text-[#212A2C] transition-colors"
                onClick={() => setIsVisiblePass(!isVisiblePass)}
                aria-label={isVisiblePass ? "Hide password" : "Show password"}
              >
                {isVisiblePass ? <BiShowAlt size={20} /> : <BiHide size={20} />}
              </button>
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-[#212A2C] hover:bg-[#1a2022] transition-colors text-white py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Log In"}
          </button>

          {isLoading && <Loader />}
        </form>

        {redirect === "/shipping" && (
          <div className="mt-6">
            <button
              onClick={handleGuestCheckout}
              className="w-full bg-[#F5F5F2] hover:bg-[#eaeaea] transition-colors text-[#212A2C] border border-[#E5E5E5] py-3.5 text-[12px] font-bold uppercase tracking-[0.14em]"
            >
              Continue as Guest
            </button>
          </div>
        )}

        <p className="mt-6 text-[#767676] text-[14px]">
          New here?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-[#212A2C] underline underline-offset-2 font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
