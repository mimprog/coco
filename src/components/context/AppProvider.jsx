import {useState, useContext, createContext, useEffect} from "react";
const AppContext = createContext();
import { translations } from "../../constants/translation";
export function useGlobalState () {
    return useContext(AppContext);
}
const AppProvider = ({children}) => {
  const [isActiveModalNavbar, setIsActiveModalNavbar] = useState(false);
  const [isActivePage, setIsActivePage] = useState(false);
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', lang);
  }, [lang]);

  const value = {
    lang: lang,
    setLang: setLang,
    isActiveModalNavbar: isActiveModalNavbar,
    setIsActiveModalNavbar: setIsActiveModalNavbar,
    isActivePage: setIsActivePage,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider















/*import axios from "axios";
import {useState, useContext , createContext, useEffect} from "react";
const mimlyricsContext = createContext();
const BASE_URL = "http://localhost:5000/api/v1"
export function useMimlyrics() {
  return useContext(mimlyricsContext);
}

const AppProvider = ({children}) => {
  const [opacity, setOpacity] = useState("");
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getRooms = async () => {
      const res = await axios.get(`${BASE_URL}/room`, {headers: {withCredentials: true}});
      setRooms(res.data.rooms);
    }
    getRooms()
  }, []);

  const value = {
    opacity: opacity,
    setOpacity: setOpacity,
    rooms: rooms,
    setRooms: setRooms,
  }

  return (
    <mimlyricsContext.Provider value={value}>
        {children}      
    </mimlyricsContext.Provider>
  )
}

export default AppProvider*/
