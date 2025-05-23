import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/auth/authSlice";
import { useLogoutMutation } from "../slices/auth/usersApiSlice";
import { QRCodeCanvas } from "qrcode.react";

import purchaseImg from "../assets/purchase.png";
import buyImg from "../assets/buy.png";
import mapImg from "../assets/map.png";
import adminImg from "../assets/administration.png";
import cocoaBackground from "../../assets/cocoa_pic.jpg";

const brownDark = "#4B2E20";
const brownMedium = "#6A4227";
const brownLight = "#8B5E3C";
const cream = "#F4EFEA";

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [userCode, setUserCode] = useState(null);
  const [url, setUrl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [errMsg, setErrMsg] = useState("");
  const [logOutApiCall, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("userInfo"));
    if (userStorage) {
      setUserCode(userStorage.user.code);
    }
  }, []);

  useEffect(() => {
    if (userCode) {
      setUrl(`${window.location.origin}/#/map?code=${userCode}`);
    }
  }, [userCode]);

  const genNewCode = () => {
    const val = document.getElementById("qr-id-input")?.value;
    if (val) setUserCode(val);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logOutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      setErrMsg(err?.data?.message || "Logout failed");
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const dlLink = document.createElement("a");
    dlLink.href = pngUrl;
    dlLink.download = "producer-qrcode.png";
    dlLink.click();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-white flex flex-col">
      {/* Hero Section */}
      <header
        className="relative flex items-center justify-center h-64 md:h-80 rounded-b-3xl shadow-lg select-none"
        style={{
          backgroundImage: `url(${cocoaBackground})`,
          backgroundBlendMode: "multiply",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: brownDark,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extrabold tracking-widest uppercase drop-shadow-2xl"
          style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
        >
          Audrey Cocoa Cameroon
        </motion.h1>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-6 py-10">
        {userCode ? (
          <>
            <section className="mb-14 text-center max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="text-4xl font-bold mb-3 text-[#D9C4B2]"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
              >
                Welcome, <span className="font-extrabold text-teal-900">Audrey Cocoa</span>
              </motion.h2>
              <p className="text-blue-900 text-lg leading-relaxed tracking-wide max-w-xl mx-auto">
                Trusted platform for buying and selling cocoa beans and related products.
                Choose an action below to get started.
              </p>
            </section>

            {/* Action Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
              {/* Card Template */}
              {[
                {
                  img: purchaseImg,
                  alt: "Purchase",
                  title: "Make a Purchase",
                  desc: "If you are a cooperative or exporter, buy directly from producers.",
                  to: "/admin/purchase",
                },
                {
                  img: buyImg,
                  alt: "Sale",
                  title: "Make a Sale",
                  desc: "Producers can list their products and connect with buyers here.",
                  to: "/admin/sale",
                },
                {
                  img: mapImg,
                  alt: "Map",
                  title: "View Parcels",
                  desc: "Access detailed maps of your cocoa parcels and their locations.",
                  to: "/map",
                },
                {
                  img: adminImg,
                  alt: "Statistics",
                  title: "Statistics Module",
                  desc: "View your sales and purchases summaries and detailed statistics.",
                  to: "/admin/dashboard",
                },
              ].map(({ img, alt, title, desc, to }) => (
                <motion.div
                  key={title}
                  whileHover={{ scale: 1.05, backgroundColor: brownMedium }}
                  className="bg-[#8B5E3C] rounded-xl shadow-xl p-20 flex flex-col items-center text-center cursor-pointer select-none transition-colors duration-300"
                  style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
                >
                  <img
                    src={img}
                    alt={alt}
                    className="w-20 h-24 mb-5 filter brightness-90"
                    draggable={false}
                  />
                  <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                  <p className="text-[#D9C4B2] mb-6 text-sm max-w-[260px]">{desc}</p>
                  <Link
                    to={to}
                    className="bg-[#4B2E20] text-white px-6 py-2 rounded-full font-semibold tracking-wide shadow-md hover:bg-[#3a2418] transition-colors duration-300"
                  >
                    Learn More
                  </Link>
                </motion.div>
              ))}
            </section>

            {/* QR Code Generator & Profile Section */}
            <section className="bg-[#6A4227] rounded-xl p-10 shadow-lg max-w-xl mx-auto mb-20">
              <h3 className="text-white text-3xl font-semibold mb-8 text-center tracking-wide drop-shadow-lg">
                Producer QR Code Generator
              </h3>

              <div className="flex flex-col md:flex-row gap-5 justify-center items-center mb-8">
                <input
                  id="qr-id-input"
                  type="text"
                  placeholder="Enter code..."
                  className="border border-[#D9C4B2] rounded-md px-4 py-3 text-[#F4EFEA] bg-transparent placeholder-[#D9C4B2] focus:outline-none focus:ring-2 focus:ring-[#D9C4B2] w-full md:w-auto transition-colors"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={genNewCode}
                  className="bg-[#4B2E20] text-white px-8 py-3 rounded-full font-semibold tracking-wide shadow-md hover:bg-[#3a2418] transition-colors duration-300 whitespace-nowrap"
                >
                  Generate
                </motion.button>
              </div>

              <div className="flex flex-col items-center">
                <QRCodeCanvas
                  value={url || ""}
                  size={190}
                  bgColor={brownMedium}
                  fgColor={cream}
                  className="border-4 border-white rounded-lg shadow-lg"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="mt-8 bg-[#4B2E20] text-white px-7 py-3 rounded-full hover:bg-[#3a2418] transition-colors duration-300 flex items-center gap-3 shadow-md"
                  aria-label="Save QR Code"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                    />
                  </svg>
                  Save QR
                </motion.button>
              </div>
            </section>
          </>
        ) : (
          <div className="text-center mt-40">
            <motion.Link
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              to="/login"
              className="text-8xl font-extrabold tracking-wide text-[#D9C4B2] hover:text-white transition-colors cursor-pointer select-none"
            >
              Login
            </motion.Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#4B2E20] text-[#D9C4B2] py-8 mt-auto select-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-around text-center md:text-left gap-10 px-6">
          <div>
            <h4 className="font-semibold mb-3 text-white text-lg tracking-wide">Contacts</h4>
            <p>(+237) 656 10 10 91</p>
            <p>(+237) 671 96 39 41</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white text-lg tracking-wide">Email Address</h4>
            <p>Audrey@gmail.com</p>
            <h4 className="font-semibold mt-8 mb-3 text-white text-lg tracking-wide">Additional Info</h4>
            <p>Engineer in Topography and Cadastre</p>
          </div>
          {userCode && (
            <div className="flex flex-col items-center">
              <h4 className="font-semibold mb-3 text-white text-lg tracking-wide">Producer QR Code</h4>
              <QRCodeCanvas
                value={url || ""}
                size={120}
                bgColor={brownMedium}
                fgColor={cream}
                className="rounded-lg border-2 border-[#D9C4B2] shadow-md"
              />
            </div>
          )}
        </div>
        <p className="text-center text-sm mt-10 opacity-70 tracking-wide">
          &copy; 2024 Audrey Cocoa Cameroon. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;

