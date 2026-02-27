import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useRegisterMutation } from "../../redux/api/usersApislice";
import { setCredentials } from "../../redux/features/auth/authSlice";

import Loader from "../../components/Loader";
import { BiHide, BiShowAlt } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";

const inputClasses =
  "w-full p-2.5 border rounded-lg bg-brand-dark text-text-primary placeholder-text-placeholder outline-none border-surface-border-light focus:border-accent-pink transition-colors";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Registered successfully");
      } catch (err) {
        toast.error(err?.data?.message || err?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">
          Create Account
        </h1>
        <p className="text-lg font-medium text-text-secondary mb-6">
          Welcome to LuxeHaven! 👋🏻
        </p>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <AiOutlineUserAdd size={20} className="text-accent-cyan" />
              Username
            </label>
            <input
              type="text"
              id="name"
              className={inputClasses}
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <RiLockPasswordLine size={20} className="text-accent-cyan" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={isVisiblePass ? "text" : "password"}
                id="confirmPassword"
                className={inputClasses}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? "Creating account..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <p className="mt-6 text-text-secondary">
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-accent-purple hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
