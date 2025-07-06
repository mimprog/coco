import { useState, useEffect } from "react";
import { FaLanguage, FaX, FaAlignJustify } from "react-icons/fa6";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { logout } from "../slices/auth/authSlice";
import { useLogoutMutation } from "../slices/auth/usersApiSlice";
import { selectCurrentUser } from "../slices/auth/authSlice";
import { useGlobalState } from "./context/AppProvider";
import { translations, t } from "../constants/translation";
import logo from "../../src/assets/finallogo.jpg";
const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const location = useLocation();
  const { isActiveModalNavbar, setIsActiveModalNavbar, language, setLanguage } = useGlobalState();
  const [logOutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector(selectCurrentUser) || {};

  const availableLanguages = Object.keys(translations);
  console.log(availableLanguages);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    setLanguage(savedLanguage);

    const handleScroll = () => {
      const header = document.getElementById("header");
      if (!header) return;
      
      if (window.scrollY <= 0) {
        header.style.backgroundColor = "transparent";
        header.classList.remove("text-white");
        header.classList.add("text-blue-600");
      } else {
        header.classList.add("text-white");
        header.classList.remove("text-blue-600");
        header.style.backgroundColor = "#4B2E20";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const logoElement = document.getElementById("logo");
    if (!logoElement) return;

    const handleLogoClick = () => navigate("/");
    logoElement.addEventListener("click", handleLogoClick);

    return () => {
      logoElement.removeEventListener("click", handleLogoClick);
    };
  }, [navigate]);

  const handleModalNavbar = () => {
    setShowModal(!showModal);
    setIsActiveModalNavbar(!showModal);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    console.log(language);
    localStorage.setItem('appLanguage', lang);
    setShowLanguageDropdown(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logOutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err?.data?.message);
      setErrMsg(err?.data?.message || t(language, 'logoutError'));
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 text-white font-bold font-mono z-[1100]">
      <nav
        id="header"
        className="transition-all duration-300 md:py-1 bg-transparent relative md:flex-row md:justify-between flex items-center"
      >
        <img
          src={logo}
          id="logo"
          alt="Company Logo"
          className="cursor-pointer bg-[rgba(255,255,255,0.4)] w-20 h-20 md:w-24 md:rounded-lg md:h-20 ml-5 md:ml-20 hover:opacity-90 transition-opacity"
        />

        <div className="flex items-center gap-4 mr-5">
          {/* Language Selector */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3a2418] transition-colors"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              aria-label="Change language"
            >
              <FaLanguage className="text-xl" />
              <span className="hidden md:inline">{language.toUpperCase()}</span>
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-[#4B2E20] rounded-lg shadow-xl border border-[#6A4227] overflow-hidden z-50">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full text-left px-4 py-2 hover:bg-yellow-400 transition-colors ${
                      language === lang ? 'bg-[#3a2418] font-semibold' : ''
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {!token ? (
            <div className="flex items-center gap-4">
              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#3a2418] transition-colors hover:scale-105"
              >
                <IoMdLogIn className="text-xl md:text-2xl" />
                <span className="hidden md:inline">{t(language, 'register')}</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#3a2418] transition-colors hover:scale-105"
              >
                <IoMdLogIn className="text-xl md:text-2xl" />
                <span className="hidden md:inline">{t(language, 'login')}</span>
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-800 transition-colors hover:scale-105"
            >
              <IoMdLogOut className="text-xl md:text-2xl" />
              <span className="hidden md:inline">{t(language, 'logout')}</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden ml-2 p-2 rounded-lg hover:bg-[#3a2418] transition-colors"
            onClick={handleModalNavbar}
            aria-label="Toggle menu"
          >
            {showModal ? <FaX /> : <FaAlignJustify />}
          </button>
        </div>
      </nav>

      {/* Outlet with language context */}
      <Outlet context={{ language }} />
    </div>
  );
};

export default Navbar;