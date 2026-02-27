import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/usersApislice";

import Loader from "../../components/Loader.jsx";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiHide, BiShowAlt } from "react-icons/bi";

const inputClasses =
  "w-full p-2.5 border rounded-lg bg-brand-dark text-text-primary placeholder-text-placeholder outline-none border-surface-border-light focus:border-accent-pink transition-colors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
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
      toast.error("Please fill all the fields");
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

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">
          Log In
        </h1>
        <p className="text-lg font-medium text-text-secondary mb-1">
          Welcome to LuxeHaven! 👋🏻
        </p>
        <p className="text-text-secondary mb-8">
          Sign in to your account to continue
        </p>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <HiOutlineMail size={20} className="text-accent-cyan" />
              Email
            </label>
            <input
              type="email"
              id="email"
              className={inputClasses}
              placeholder="john.doe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <RiLockPasswordLine size={20} className="text-accent-cyan" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
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
            className="w-full bg-accent-pink-hover hover:bg-accent-pink transition-colors text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Login"}
          </button>

          {isLoading && <Loader />}
        </form>

        <p className="mt-6 text-text-secondary">
          New Customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-accent-purple hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
