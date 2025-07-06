import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../slices/auth/authSlice";
import {
  useRegisterMutation,
  useGetEmailCodeMutation,
  useVerifyEmailCodeMutation,
} from "../../slices/auth/usersApiSlice";
import {
  FaRegEyeSlash,
  FaRegEye,
  FaCheck,
  FaX,
  FaInfo,
} from "react-icons/fa6";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useGlobalState } from "../context/AppProvider";

const FIRSTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const CODE_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX = /^[A-Za-z]\w{7,14}$/;
const EMAIL_REGEX =
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const Register = () => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  useEffect(() => {
    setValidUsername(FIRSTNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidCode(CODE_REGEX.test(code));
  }, [code]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      return setErrMsg("You must accept the Terms of Service.");
    }
    if (!validUsername || !validCode || !validEmail || !validPassword) {
      return setErrMsg("Please correct the form errors.");
    }

    try {
      setLoading(true);
      const res = await register({ code, username, phone, email, password }).unwrap();
      setSuccess(true);
      setUsername(""); setCode(""); setPhone(""); setEmail(""); setPassword("");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setErrMsg(error?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl p-8 bg-yellow-200 shadow-2xl rounded-3xl transition-all duration-500 animate-fade-in"
      >
        <h2 className="text-3xl font-semibold text-center text-yellow-900 mb-4">
          Create an Account
        </h2>

        {errMsg && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 animate-pulse">
            {errMsg}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 animate-bounce">
            Registration successful!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              className="w-full p-2 rounded border border-yellow-500 focus:outline-yellow-700"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Code</label>
            <input
              className="w-full p-2 rounded border border-yellow-500 focus:outline-yellow-700"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded border border-yellow-500 focus:outline-yellow-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <PhoneInput
              defaultCountry="ua"
              value={phone}
              onChange={setPhone}
              className="rounded border border-yellow-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 rounded border border-yellow-500 focus:outline-yellow-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-2 right-2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
            {!validPassword && password && (
              <p className="text-sm text-red-600 mt-1 animate-pulse">
                Password must be 8-15 characters, start with a letter, and use only letters, digits or underscores.
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 mt-4">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1"
            />
            <p className="text-sm">
              I agree to the{' '}
              <Link to="/termsofuse" className="underline text-yellow-800">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="underline text-yellow-800">Privacy Policy</Link>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 rounded-lg text-white font-bold transition-all duration-300 ${
              loading
                ? 'bg-yellow-400 cursor-not-allowed'
                : 'bg-yellow-600 hover:bg-yellow-700 hover:scale-105'
            }`}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </div>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="underline text-yellow-800 font-medium">
            Log In
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;