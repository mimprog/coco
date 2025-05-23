import {useState, useEffect} from "react"
import "./css/index.css";
import { FaExclamation, FaUser, FaUpload, FaFacebook, FaSnapchat, FaWhatsapp, FaDownload } from "react-icons/fa6";
import { FaInstagram, FaTiktok, FaYoutube, FaGithub, FaTwitter } from "react-icons/fa6";;
import { useMimlyrics } from "./context/AppProvider";

import { logout, selectCurrentToken } from "../slices/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../slices/auth/usersApiSlice";
import { IoIosHelp, IoMdAlbums, IoMdLogOut, IoMdHelp, IoMdLogIn, IoMdSave, IoMdSettings } from "react-icons/io";
import AppProvider from "./context/AppProvider";
const IMAGE_URL = "/api/v1/upload/avatar";
import axios from "./api/axios";
import AudioLogo from "../assets/audiologo.png"
import { selectCurrentUser } from "../slices/auth/authSlice";
import coco1 from "../../assets/cocoa_pic.jpg";
import { QRCodeCanvas } from "qrcode.react";

import administration from "../assets/administration.png";
import map from "../assets/map.png";
import buy from "../assets/buy.png";
import purchase from "../assets/purchase.png";
import CLIENT_URL from './routes/clientRoutes';

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [file, setFile] = useState();
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo ,setUserInfo] = useState(null);

  const [isRun, setIsRun] = useState(true);  
  const [logOutApiCall, {isLoading}] = useLogoutMutation();
  const [errMsg, setErrMsg] = useState("");
  const location = useLocation();
  const {pathname} = location;
  //console.log(location);
  let userStorage = JSON.parse(window.localStorage.getItem("userInfo"));
  let [userCode, setUserCode] = useState(null);
  let [userGenCode, setUserGenCode] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if(userStorage != null)
    {
      setUserCode(userStorage.user.code);
      console.log({"userCode": userCode});
    }
  }, []); //http://localhost:3000/map/${userCode}

  useEffect(() => {
    setUrl(`${CLIENT_URL}/#/map?code=${userCode}`);
  }, [userCode]);

  const genNewCode = () => {
    let genBtn = document.getElementById("gen-qr-btn");
    let genValue = document.getElementById("qr-id-value").value;

    if(genValue != null && genValue != undefined)  
      setUserCode(genValue);
  }
  //console.log("IS: ", isActiveModalNavbar);

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

  const handleShowProfile = () => {
    setShowProfile(!showProfile);
  }

  const handleDownload = () => {
    // Sélectionner le canvas contenant le QR Code
    const canvas = document.querySelector("canvas");
    const pngUrl = canvas.toDataURL("image/png"); // Convertir en URL d'image PNG
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png"; // Nom du fichier téléchargé
    downloadLink.click(); // Simuler un clic pour déclencher le téléchargement
  };

  console.log(showProfile, userInfo);

  const {isActiveModalNavbar, setIsActiveModalNavbar} = useMimlyrics();

  return ( 
    <div className="">
        <div className="h-[60vh] md:h-[400px] relative">
          {/* <img className="w-[100%] h-[100%]" src={coco1} alt="x"/> */}
          <div className="w-[100%] h-[100%] rounded-bl-[100px]" 
            style={{ backgroundImage: `url(${coco1})`, backgroundSize: `cover`, backgroundAttachment: `fixed`, backgroundPosition: `center` }}>
            <div className="text-white font-bold text-center font-mono text-4xl flex items-center justify-center w-full h-full">
              <h1 className="text-2xl font-bold font-mono shadow-2xl shadow-gray-300 md:text-[80px] text-white opacity-40">CACAO CAMEROUN</h1>
            </div>
          </div>
          <div className=" bg-[rgba(119,85,84)] absolute top-0 left-0 bottom-0 right-0 opacity-40 rounded-bl-[100px]"> </div>
        </div>
        
      <section className={ isActiveModalNavbar ? " relative opacity-60 -z-50 " :  "flex flex-col z-50 font-medium space-x-1 mx-1 mt-5" }>
      
        <div className=' mt-2 md:mt-2 pl-2 pr-14 py-1'>
          {userCode ? 
          <div className=" ">
            <h1 className="border-l text-4xl md:text-[2.5rem]">Bienvenue sur  <strong>Trace Cocoa</strong></h1>
              <p className="text-gray-900 ">
              Plateforme de vente et d'achat de cacao en ligne chez des commerçants de confiance<br/>

              Que souhaitez vous faire ?
              </p>

            <div id="operations"
              className="w-[90vw] m-auto md:w-4/5 p-5 relative">

                <div className="flex flex-row border-y-2 py-3 float-end my-3 items-center justify-between">
                  <img src={ purchase } className="border mr-8 w-20 h-20 md:w-40 md:h-40"/>
                  <div>
                    <h1 className="text-center text-black text-lg md:text-2xl"><strong>Effectuer un achat</strong></h1>
                    Vous êtes une coopérative ou un exportateur de cacao et vous souhaitez acheter du cacao à un producteur, alors cette rubrique est faite pour vous.<br/>
                    <Link to="/admin/purchase" className="text-blue-700 underline font-bold">Plus...</Link>
                  </div>
                </div>

                <div className="flex flex-row border-y-2 py-3 float-end my-3 items-center justify-between">
                  <div>
                    <h1 className="text-center text-black text-lg md:text-2xl"><strong>Effectuer une vente</strong></h1>
                    Vous êtes un producteur et vous souhaitez vendre vos produits. Cette rubrique est faite pour vous.<br/>
                    <Link to="/admin/sale" className="text-blue-700 underline font-bold">Plus...</Link>
                  </div>
                  <img src={ buy } className="border mr-8 w-20 h-20 md:w-40 md:h-40"/>
                </div>

                <div className="flex flex-row w-full border-y-2 py-3 float-end my-3 items-center justify-between">
                  <img src={ map } className="border mr-8 w-20 h-20 md:w-40 md:h-40"/>
                  <div>
                    <h1 className="text-center text-black text-lg md:text-2xl"><strong>Voir les parcelles</strong></h1>
                    Ici vous pourrez visualiser les données de votre parcelle dans une carte. <br/>
                    <Link to="/map" className="text-blue-700 underline font-bold">Plus...</Link>
                  </div>
                </div>

                <div className="flex flex-row border-y-2 py-3 float-end my-3 items-center justify-between">
                  <div>
                    <h1 className="text-center text-black text-lg md:text-2xl"><strong>Module Statistique</strong></h1>
                    Ici vous aurez un compte rendu de votre activité (nombre/quantité de ventes, nombre/quantité d'achats, ...).<br/>
                    <Link to="/admin/dashboard" className="text-blue-700 underline font-bold">Plus...</Link>
                  </div>
                  <img src={ administration } className="border mr-8 w-20 h-20 md:w-40 md:h-40"/>
                </div>


          </div>
        </div> : 
        
        <div className="text-center my-12">
          <Link className="text-9xl text-teal-900 font-bold font-mono hover:text-amber-900" to="/login">Login</Link>
        </div>
         
        
        }

        </div>

        <div className="m-0 box-border flex flex-col md:text-lg md:py-1 text-white bg-[brown]">
          <div className="flex justify-around text-gray-100 jus p-4 flex-wrap">
            <div className="mx-2">
              <h2 className="text-center text-gray-300 mt-3">Contacts</h2>
              <h3 className="text-center">(+237) 656 10 10 91</h3>
              <h3 className="text-center">(+237) 671 96 39 41</h3>
            </div>
            <div className="mx-2">
                <h2 className="text-center text-gray-300 mt-3">Adresses email</h2>
                <h3 className="text-center">hornelamane@gmail.com</h3>

                <h2 className="text-center text-gray-300 mt-3">Infos supplémentaires</h2>
                <h3 className="text-center">Ingénieure en Topographie et Cadastres</h3>
            </div>
            <div className="mx-2">
                { userCode ? 
                    <div>
                      <h2 className="text-center text-gray-300 mt-2">QR Code producteur</h2><br/>
                      <div>
                        <div className="flex flex-col md:flex-row"> 
                          <input type="text" id="qr-id-value" placeholder="Code..." className="text-black text-lg px-2 py-1 border rounded mx-1"/>
                          <button id="gen-qr-btn" onClick={ genNewCode } className="bg-white text-black text-lg py-1 px-2 border rounded mt-2 md:mt-0 md:ml-2 active:bg-amber-200">Générer</button>
                        </div>
                        <QRCodeCanvas
                          value={ url }
                          size={200}
                          bgColor="white"
                          fgColor="brown"
                          className="border rounded mt-2 m-auto"
                          id="qr-canvas"
                        />
                        <div className="mt-3"> 
                          <button id="save-qr" onClick={ handleDownload } className="bg-white m-auto text-black text-lg py-1 px-2 border rounded mt-2 md:mt-0 md:ml-2 active:bg-amber-200
                          flex flex-row">
                            <FaDownload className="mr-2"/>
                            Enregistrer le QR
                            </button>
                        </div>
                      </div>
                    </div>
                  : "" }
                
            </div>
          </div>
          <div className="text-center border-t">
            Copyright © 2024 Tous droits reservés
          </div>

           <div className=" text-white font-mono w-[80%] flex space-x-24 mx-2 mb-1">
            {/* <p className=''> _______</p> */}
            {/* <Link className="text-gray-200" to="/admin/dashboard" >Admin DashBoard</Link> */}
          </div>
        </div>

      </section>
    </div>

  );
}

export default Home