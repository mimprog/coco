import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/auth/authSlice";
import { useLogoutMutation } from "../slices/auth/usersApiSlice";
import { QRCodeCanvas } from "qrcode.react";
import { t } from "../constants/translation";
import Footer from "./Footer";
import { useGlobalState } from "./context/AppProvider";
// Assets
import purchaseImg from "../assets/purchase.png";
import buyImg from "../assets/buy.png";
import mapImg from "../assets/map.png";
import adminImg from "../assets/administration.png";
import cocoaBackground from "../../assets/cocoa_pic.jpg";

// Constants
const COLORS = {
  brownDark: "#4B2E20",
  brownMedium: "#6A4227",
  brownLight: "#8B5E3C",
  cream: "#F4EFEA",
  accent: "#D9C4B2",
  teal: "#0d9488"
};

const actionCards = [
  {
    img: purchaseImg,
    key: "purchase",
    to: "/admin/purchase"
  },
  {
    img: buyImg,
    key: "sale",
    to: "/admin/sale"
  },
  {
    img: mapImg,
    key: "map",
    to: "/map"
  },
  {
    img: adminImg,
    key: "stats",
    to: "/admin/dashboard"
  }
];

const Home = () => {

  const [userCode, setUserCode] = useState(null);
  const [url, setUrl] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [logOutApiCall, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("userInfo"));
    userStorage?.user?.code && setUserCode(userStorage.user.code);
  }, []);

  useEffect(() => {
    userCode && setUrl(`${window.location.origin}/map?producerCode=${userCode}`);
  }, [userCode]);
  const { lang, setLang } = useGlobalState();
  const genNewCode = () => {
    const val = document.getElementById("qr-id-input")?.value?.trim();
    val && setUserCode(val);
  };

  console.log(lang);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logOutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      setErrMsg(err?.data?.message || t(lang, 'errors.logoutFailed'));
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    
    const pngUrl = canvas.toDataURL("image/png");
    const dlLink = document.createElement("a");
    dlLink.href = pngUrl;
    dlLink.download = `${t(language, 'qrCode.filename')}.png`;
    dlLink.click();
  };

  // Render functions
  const renderHeroSection = () => (
    <header
      className="relative flex items-center justify-center h-64 md:h-80 rounded-b-3xl shadow-lg select-none"
      style={{
        backgroundImage: `url(${cocoaBackground})`,
        backgroundBlendMode: "multiply",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: COLORS.brownDark,
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-extrabold tracking-widest uppercase drop-shadow-2xl"
        style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
      >
        {t(lang, 'appName')}
      </motion.h1>
    </header>
  );

  const renderWelcomeSection = () => (
    <section className="mb-14 text-center max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-4xl font-bold mb-3 text-[#D9C4B2]"
        style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
      >
        {t(lang, 'welcome.title')}, <span className="font-extrabold text-teal-900">
          {t(lang, 'welcome.subtitle')}
        </span>
      </motion.h2>
      <p className="text-blue-900 text-lg leading-relaxed tracking-wide max-w-xl mx-auto">
        {t(lang, 'welcome.description')}
      </p>
    </section>
  );

  const renderActionCards = () => (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
      {actionCards.map(({ img, key, to }) => (
        <motion.div
          key={key}
          whileHover={{ scale: 1.05, backgroundColor: COLORS.brownMedium }}
          className="bg-[#8B5E3C] rounded-xl shadow-xl p-20 flex flex-col items-center text-center cursor-pointer select-none transition-colors duration-300"
          style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
        >
          <img
            src={img}
            alt={t(lang, `actions.${key}.alt`)}
            className="w-20 h-24 mb-5 filter brightness-90"
            draggable={false}
          />
          <h3 className="text-2xl font-semibold mb-3">
            {t(lang, `actions.${key}.title`)}
          </h3>
          <p className="text-[#D9C4B2] mb-6 text-sm max-w-[260px]">
            {t(lang, `actions.${key}.description`)}
          </p>
          <Link
            to={to}
            className="bg-[#4B2E20] text-white px-6 py-2 rounded-full font-semibold tracking-wide shadow-md hover:bg-[#3a2418] transition-colors duration-300"
          >
            {t(lang, 'actions.learnMore')}
          </Link>
        </motion.div>
      ))}
    </section>
  );

  const renderQRGenerator = () => (
    <section className="bg-[#6A4227] rounded-xl p-10 shadow-lg max-w-xl mx-auto mb-20">
      <h3 className="text-white text-3xl font-semibold mb-8 text-center tracking-wide drop-shadow-lg">
        {t(lang, 'qrCode.title')}
      </h3>

      <div className="flex flex-col md:flex-row gap-5 justify-center items-center mb-8">
        <input
          id="qr-id-input"
          type="text"
          placeholder={t(lang, 'qrCode.placeholder')}
          className="border border-[#D9C4B2] rounded-md px-4 py-3 text-[#F4EFEA] bg-transparent placeholder-[#D9C4B2] focus:outline-none focus:ring-2 focus:ring-[#D9C4B2] w-full md:w-auto transition-colors"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={genNewCode}
          className="bg-[#4B2E20] text-white px-8 py-3 rounded-full font-semibold tracking-wide shadow-md hover:bg-[#3a2418] transition-colors duration-300 whitespace-nowrap"
        >
          {t(lang, 'qrCode.generate')}
        </motion.button>
      </div>

      <div className="flex flex-col items-center">
        <QRCodeCanvas
          value={url || ""}
          size={190}
          bgColor={COLORS.brownMedium}
          fgColor={COLORS.cream}
          className="border-4 border-white rounded-lg shadow-lg"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="mt-8 bg-[#4B2E20] text-white px-7 py-3 rounded-full hover:bg-[#3a2418] transition-colors duration-300 flex items-center gap-3 shadow-md"
          aria-label={t(lang, 'qrCode.saveButton')}
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
          {t(lang, 'qrCode.saveButton')}
        </motion.button>
      </div>
    </section>
  );

  const renderLoginPrompt = () => (
    <div className="text-center mt-40">
      <motion.Link
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        to="/login"
        className="text-8xl font-extrabold tracking-wide text-[#D9C4B2] hover:text-white transition-colors cursor-pointer select-none"
      >
        {t(lang, 'login')}
      </motion.Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-white flex flex-col">
      {renderHeroSection()}

      <main className="flex-grow max-w-6xl mx-auto px-6 py-10">
        {userCode ? (
          <>
            {renderWelcomeSection()}
            {renderActionCards()}
            {renderQRGenerator()}
          </>
        ) : (
          renderLoginPrompt()
        )}
      </main>

      <Footer userCode={userCode} url={url} language={lang} />
    </div>
  );
};

export default Home;