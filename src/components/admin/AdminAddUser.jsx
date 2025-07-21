import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../slices/auth/authSlice";
import { useRegisterMutation } from "../../slices/auth/usersApiSlice";
import { FaRegEyeSlash, FaRegEye, FaInfo } from "react-icons/fa6";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX = /^[A-Za-z]\w{7,14}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const AdminAddUser = () => {
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("");
  const [validRole, setValidRole] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errMessage, setErrMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusField, setFocusField] = useState({});

  const { userInfo } = useSelector((state) => state.auth);
  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => setValidUsername(USERNAME_REGEX.test(username)), [username]);
  useEffect(() => setValidEmail(EMAIL_REGEX.test(email)), [email]);
  useEffect(() => setValidPassword(PASSWORD_REGEX.test(password)), [password]);
  useEffect(() => setValidRole(["ADMIN", "MANAGER", "USER"].includes(role.toUpperCase())), [role]);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validUsername && validEmail && validPassword && validRole) {
      try {
        const res = await register({
          username,
          phone,
          email,
          password,
          role: role.toUpperCase(),
          code,
        }).unwrap();
        setSuccess(true);

        navigate("/admin/user");

      } catch (error) {
        setSuccess(false);
        setErrMessage(error?.data?.message || "Unexpected error");
        setTimeout(() => {
          setSuccess(false)
          setErrMessage(false);
        }, [3000])
      }
    }
  };

  return (
    <section className="relative text-gray-800">
      <div className="text-center mx-20 text-amber-700 p-2 rounded-xl shadow-lg animate-fade-in">
        <h1 className="text-lg md:text-xl font-extrabold">Admin: Add User</h1>
      </div>

      {(success || errMessage) && (
        <div
          className={`absolute right-4 top-4 px-4 py-2 rounded shadow transition duration-300 animate-fade-in ${
            success ? "bg-green-400 text-white" : "bg-red-400 text-white"
          }`}
        >
          {success ? "User added successfully!" : `Failed: ${errMessage}`}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-3 md:mx-auto md:w-2/3 lg:w-1/2 bg-yellow-100 shadow-md rounded-xl p-6 mt-6 space-y-4 animate-slide-in"
      >
        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocusField({ ...focusField, username: true })}
            onBlur={() => setFocusField({ ...focusField, username: false })}
            className="w-full px-3 py-2 border rounded text-blue-700"
            required
          />
          {!validUsername && focusField.username && (
            <p className="text-sm text-red-600 flex items-center">
              <FaInfo className="mr-1" /> Only letters and numbers allowed.
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusField({ ...focusField, email: true })}
            onBlur={() => setFocusField({ ...focusField, email: false })}
            className="w-full px-3 py-2 border rounded text-blue-700"
            required
          />
          {!validEmail && focusField.email && (
            <p className="text-sm text-red-600 flex items-center">
              <FaInfo className="mr-1" /> Invalid email format.
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium">Phone Number</label>
          <PhoneInput
            defaultCountry="us"
            value={phone}
            onChange={(phone) => setPhone(phone)}
            className="rounded border w-full"
            onFocus={() => setFocusField({ ...focusField, phone: true })}
            onBlur={() => setFocusField({ ...focusField, phone: false })}
          />
        </div>

        <div>
          <label className="block font-medium">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border rounded text-blue-700"
            placeholder="e.g., EMP1234"
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusField({ ...focusField, password: true })}
              onBlur={() => setFocusField({ ...focusField, password: false })}
              className="w-full px-3 py-2 border rounded text-blue-700"
              required
            />
            <button type="button" className="absolute right-2 top-2" onClick={handleShowPassword}>
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          {!validPassword && focusField.password && (
            <p className="text-sm text-red-600 flex items-center">
              <FaInfo className="mr-1" /> Password must be 8–15 characters, start with a letter.
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onFocus={() => setFocusField({ ...focusField, role: true })}
            onBlur={() => setFocusField({ ...focusField, role: false })}
            className="w-full px-3 py-2 border rounded text-blue-700"
            required
          >
            <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="USER">User</option>
          </select>
          {!validRole && focusField.role && (
            <p className="text-sm text-red-600 flex items-center">
              <FaInfo className="mr-1" /> Role must be ADMIN, MANAGER, or USER.
            </p>
          )}
        </div>

        <button
          disabled={!validUsername || !validEmail || !validPassword || !validRole}
          className="mt-4 w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded shadow-md transition duration-300"
        >
          Add User
        </button>
      </form>
    </section>
  );
};

export default AdminAddUser;

