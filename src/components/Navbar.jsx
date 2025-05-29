import { useState, useEffect, useContext } from "react";
import {
  FaLanguage, FaList, FaX, FaUser, 
  FaMessage, FaAlignJustify, FaHouse, 
  FaMusic, FaVideo, FaExclamation, FaRegistered} from "react-icons/fa6";
import { logout } from "../slices/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../slices/auth/usersApiSlice";
import { IoIosHelp, IoMdAlbums, IoMdLogOut, IoMdHelp, IoMdLogIn, IoMdSave, IoMdSettings } from "react-icons/io";
import { Outlet } from "react-router-dom";
import AppProvider from "./context/AppProvider";
import { useMimlyrics } from "./context/AppProvider";
const IMAGE_URL = "/api/v1/upload/avatar";
import axios from "./api/axios";
import AudioLogo from "../assets/audiologo.png"
import { selectCurrentUser } from "../slices/auth/authSlice";
import logo from "../../dist/assets/logor.png";
const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const location = useLocation();
  const {pathname} = location;
  const {isActiveModalNavbar, setIsActiveModalNavbar} = useMimlyrics();
  const [logOutApiCall, {isLoading}] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScrollHeaderEvent = (e) => {
      const header = document.getElementById("header");
      if(window.scrollY <= 0)
      {
        header.style.backgroundColor = "transparent";
        header.classList.remove("text-white");
        header.classList.add("text-blue-600");
      } else {
        header.classList.add("text-white");
        header.classList.remove("text-blue-600");
        header.style.backgroundColor = "#4B2E20";
        
      }
    };
 
    window.addEventListener("scroll", (e) => {
      onScrollHeaderEvent(e);
    });

    document.getElementById("logo").addEventListener("click", (e) => {
      navigate("/");
    });
  }, []);

  const handleModalNavbar = async () => {
    setShowModal(!showModal); 
    setIsActiveModalNavbar(!showModal);        
  }

const {token} = useSelector(selectCurrentUser) || {};
  useEffect(() => {
    //console.log(token);
  }, [token])

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logOutApiCall().unwrap();
      dispatch(logout());      
      navigate("/");
    }catch(err) {
      //console.log("huumm");
      console.log(err?.data?.message);
      setErrMsg(err?.data?.message);
    }
  }

   return (    
      <div className="fixed top-0 left-0 right-0 text-white font-bold font-mono z-[1100]">
       <nav id="header" className=" transition-all md:py-1 bg-transparent relative md:flex-row md:justify-between flex items-center">
          <img src={logo} id="logo" className="cursor-pointer bg-[rgba(255,255,255,0.4)] w-20 h-20 md:w-24 md:rounded-lg md:h-20 ml-5 md:ml-20"></img>

          {!token ? 

          <div className="text-2xl flex flex-row flex-1 justify-end mr-5 items-center">
              <Link className="flex flex-row items-center justify-center mr-4 transition-transform hover:scale-110 hover:text-green-300" to="/register "> 
                <IoMdLogIn className="mr-2 text-xl md:text-3xl"/>
                <div>Register</div>
              </Link>
              <Link className="flex flex-row items-center justify-center ml-4 transition-transform hover:scale-110 hover:text-green-300" to="/login "> 
                <IoMdLogIn className="mr-2 text-xl md:text-3xl"/>
                <div>Login</div>
              </Link>
          </div> : 
          <div onClick={handleLogout} className=" text-xl text-white font-bold font-mono relative flex z-50 flex-row flex-1 justify-end mr-5 items-center">
              <button className="flex flex-row items-center justify-center mr-4 transition-transform hover:scale-110 hover:text-red-300"  > 
                <IoMdLogOut className="mr-2 text-xl md:text-3xl"/>
                <div>Logout</div>
              </button>
          </div>       
          }

         {showModal ? (
           <div className=" absolute top-1/2 -translate-y-1/2 left-3 md:invisible">
             <button className="" onClick={() => handleModalNavbar()}>
               <FaX />
             </button>
           </div>
         ) : (
           <div className="absolute top-1/2 -translate-y-1/2 left-3 md:invisible">
             <button className="" onClick={() => handleModalNavbar()}>
               <FaAlignJustify />
             </button>
           </div>
         )}
        
            

        </nav>
        <Outlet/>
      </div>    
   );
}

export default Navbar