// [unchanged imports]
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./css/index.css";
import { useGlobalState} from "./context/AppProvider";
import { Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import BASE_URL from "./routes/serverRoutes";
import classNames from "classnames";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiFilter, FiX } from "react-icons/fi";
import Footer from "./Footer";
import 'leaflet/dist/leaflet.css';
import { translations, t } from "../constants/translation";
import queryString from "query-string";
import {motion} from "framer-motion";
// [tile and theme options]

const tileOptions = {
  OSM: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "Black & White": "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
  Satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

const themeColors = {
  Light: "bg-white text-black",
  Dark: "bg-gray-900 text-teal-900",
  Forest: "bg-green-900 text-green-900",
};

const teamColorMap = {
  farmlands: "red",
  Massock_And_Ngambe_Subdiviions: "teal"
};

const Map = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [errMsg, setErrMsg] = useSt("");
  const [tileType, setTileType] = useState("Satellite");
  const [theme, setTheme] = useState("Light");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("producerCode");
  const [selectedData, setSelectedData] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [userCode, setUserCode] = uateseState("");
  const [features, setFeatures] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
   const [limitGeojsonData, setLimitGeojsonData] = useState(null);
   const mapRef = useRef();
  const [credentials, setCredentials] = useState({username: "", password: ""});
  const [validCredentials, setValidCredentials] = useState(false);

  //console.log(BASE_URL);

  const [filter, setFilter] = useState({
    producerCode: "",
    village: "",
    region: "",
    sex: "",
    cooperativ: "",
    statut: "",
  });

  const {language} = useGlobalState();

  const { isActiveModalNavbar } = useGlobalState();
  const location = useLocation();

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      credentials.username.trim() === "audrey" && credentials.password.trim() === "audrey123"
    ) {
      setValidCredentials(true);
    } else {
      setError("Invalid credentials. Please try again.");
      setValidCredentials(false);
    }
  };


 useEffect (() => {
  const {producerCode} = queryString.parse(location.search);
  setUserCode(producerCode);
    /*const hash = location.hash || "";
    const queryIndex = hash.indexOf("?");
    const searchParams = new URLSearchParams(queryIndex !== -1 ? hash.substring(queryIndex) : "");
    setUserCode( searchParams.get("producerCode"));*/

 }, [location])

 useEffect(()=> {
  const fetchLimitGeojsonData = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/v1/static/Massock_NgambeG.geojson`);
        setLimitGeojsonData(res?.data);
        console.log(limitGeojsonData);
    }catch(err) {
      console.warn(err);
    }
  }

  fetchLimitGeojsonData();

 }, [])

 const FitBoundsOnFilter = ({ geojson }) => {
  const map = useMap();

  useEffect(() => {
    if (!geojson || geojson.length === 0) return;

    const bounds = geojson.reduce((acc, feature) => {
      const coords = feature.geometry.coordinates[0][0];
      coords.forEach(([lng, lat]) => acc.push([lat, lng]));
      return acc;
    }, []);

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geojson, map]);

  return null;
};




  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/static/geodatas-gps.geojson`);
        
        const all = response.data.features;

        // Step 1: Apply filters
        let filtered = all;

        if (userCode) {
          filtered = filtered.filter(f => f.properties.producerCode === userCode);
        }

        if (searchQuery) {
          filtered = filtered.filter(f =>
            f.properties[searchMode]?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        Object.entries(filter).forEach(([key, value]) => {
          if (value.trim()) {
            filtered = filtered.filter(f =>
              f.properties[key]?.toLowerCase().includes(value.toLowerCase())
            );
          }
        });

        if (filtered.length === 0) {
          setErrMsg("No features match your criteria.");
          setTimeout(() => setErrMsg(""), 3000);
        }

        // Step 2: Style each feature with __highlighted
        /*const styled = all.map(f => {
          const match = filtered.find(m => m.properties.id === f.properties.id);
          return {
            ...f,
            properties: {
              ...f.properties,
              __highlighted: !!match,
            },
          };
        });

        setGeojsonData(styled);
        setFeatures(styled);*/
    setGeojsonData(filtered); 
setFeatures(filtered);    

      } catch (error) {
        setErrMsg("Failed to load GeoJSON data");
        setTimeout(() => setErrMsg(""), 3000);
      }
    };

    fetchGeoJson();
  }, [userCode, searchQuery, searchMode, filter]);

  const cleanValue = (val) => {
    if (!val || (typeof val === "object" && Object.keys(val).length === 0)) return "?";
    return typeof val === "object" ? JSON.stringify(val) : String(val);
  };

  const fieldLabels = {
    id: `${t(language, "fieldLabels.id")}`,
    producerCode: `${t(language, "fieldLabels.producerCode")}`,
    name: `${t(language, "fieldLabels.name")}`,
    surname: `${t(language, "fieldLabels.surname")}`,
    sex: `${t(language, "fieldLabels.sex")}`,
    ageplantat: `${t(language, "fieldLabels.ageplantat")}`,
    plantnumbe: `${t(language, "fieldLabels.plantnumbe")}`,
    output: `${t(language, "fieldLabels.output")}`,
    fertilizer: `${t(language, "fieldLabels.fertilizer")}`,
    nberfertil: `${t(language, "fieldLabels.nberfertil")}`,
    insecticid: `${t(language, "fieldLabels.inserticid")}`,
    nberinsect: `${t(language, "fieldLabels.nberinsect")}`,
    problems: `${t(language, "fieldLabels.problems")}`,
    tel: `${t(language, "fieldLabels.tel")}`,
    region: `${t(language, "fieldLabels.region")}`,
    departemen: `${t(language, "fieldLabels.departemen")}`,
    village: `${t(language, "fieldLabels.village")}`,
    residence:`${t(language, "fieldLabels.residence")}`,
    lieudit: `${t(language, "fieldLabels.lieuedit")}`,
    education: `${t(language, "fieldLabels.education")}`,
    matrimonia: `${t(language, "fieldLabels.matrimonia")}`,
    Statut: `${t(language, "fieldLabels.Statut")}`,
    Operateur: `${t(language, "fieldLabels.Operateur")}`,
    subdivisio: `${t(language, "fieldLabels.subdivisio")}`,
    landstatus: `${t(language, "fieldLabels.landstatus")}`,
    cooperativ: `${t(language, "fieldLabels.cooperativ")}`,
    x: `${t(language, "fieldLabels.x")}`,
    y: `${t(language, "fieldLabels.y")}`
  };

  const onEachFeature = (feature, layer) => {
    layer.on("click", () => {
      const props = feature.properties || {};
      const coords = feature.geometry?.coordinates?.[0]?.[0]?.[0] || [props.x || 0, props.y || 0];
      setSelectedData(props);
      let popupHtml = `<div style="max-height: 300px; overflow-y: auto;">`;
      for (const key in fieldLabels) {
        popupHtml += `<p><strong>${fieldLabels[key]}:</strong> ${cleanValue(props[key])}</p>`;
      }
      popupHtml += `</div>`;
      layer._map.setView([coords[1], coords[0]], 15);
      layer.bindPopup(popupHtml).openPopup();
    });
  };


const getStyle = () => ({
  fillColor: "red",     // or any single consistent color
  color: "red",
  weight: 4,
  fillOpacity: 0.6,
});


/*const getStyle = (feature) => {
  const isHighlighted = feature.properties.__highlighted;
  console.log(feature.properties.producerCode, "highlighted:", isHighlighted);
  return {
    fillColor: isHighlighted ? "red" : "yellow", // Red vs Yellow
    color: isHighlighted ? "red": "yellow",
    weight: isHighlighted ? 5 : 2,
    fillOpacity: isHighlighted ? 0.8 : 0.4,
  };
};*/


const downloadPDF = async () => {

    setIsGeneratingPDF(true);
  try {
 if (!selectedData) return;

  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm'
  });

  // Add the map image first (we'll capture it below)
  const mapElement = document.querySelector('.leaflet-container');
  if (mapElement) {
    // Use html2canvas to capture the map
    const canvas = await html2canvas(mapElement, {
      useCORS: true, // Enable cross-origin loading
      allowTaint: true, // Allow tainted canvas
      scale: 2 // Higher quality
    });

    // Convert canvas to image and add to PDF
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 15, 15, 180, 120); // Adjust dimensions as needed
  }

  // Add the property details
  doc.setFontSize(12);
  let y = 140; // Start below the map image
  doc.text(`${t(language, "plotsTitle")} - ${selectedData.name} ${selectedData.surname}`, 15, y);
  y += 10;

  // Add a horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, 195, y);
  y += 10;

  // Add property details in two columns
  const column1X = 15;
  const column2X = 105;
  let currentY = y;
  let column = 0;

  for (const key in fieldLabels) {
    const text = `${fieldLabels[key]}: ${cleanValue(selectedData[key])}`;
    
    if (column === 0) {
      doc.text(text, column1X, currentY);
      column = 1;
    } else {
      doc.text(text, column2X, currentY);
      column = 0;
      currentY += 7;
    }
  }

  // Add summary section
  currentY += 10;
  doc.setFontSize(14);
  doc.text(t(language, "summaryTitle"), 15, currentY);
  currentY += 7;
  doc.setFontSize(10);
  const summaryText = doc.splitTextToSize(generateSummary(selectedData), 180);
  doc.text(summaryText, 15, currentY);

  // Save the PDF
  doc.save(`plot-info-${selectedData.id || selectedData.producerCode}.pdf`);
  } finally {
    setIsGeneratingPDF(false);
  }
 
};

  const generateSummary = (data) => {
    return `This parcel, owned by ${data.name} ${data.surname}, located in ${data.village}, ${data.region}, covers an area of ${data.surface} m². It has been exploited for 
    ${data.ageplantat} and contains about ${data.plantnumber} cocoa trees. Productivity is around ${data.output}. Fertilizer used: ${data.fertilizer}. Contact: ${data.tel}`;
  };

  const renderLegend = () => (
    <div className="fixed bottom-4 left-4 bg-white rounded shadow-md p-4 z-[1000] max-w-xs text-sm">
      <div className="flex justify-between items-center mb-2">
        <strong>{t(language, "legendTitle")}</strong>
        <button onClick={() => setShowLegend(false)} className="text-red-600"><FiX /></button>
      </div>
      {Object.entries(teamColorMap).map(([label, color]) => (
        <div key={label} className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );

  return (

    <>
    
  
    { validCredentials  ? 
    <div className={classNames("min-h-screen", themeColors[theme])}>
      <section className={isActiveModalNavbar ? "relative opacity-60 -z-50 mt-24" : "flex flex-col z-50 mt-24"}>
        <div className="px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold border-l-4 pl-2 border-blue-600">{t(language, "plotsTitle")}</h1>
          <div className="flex flex-wrap gap-2">
            <Link to={"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"}/>
            <input
              type="text"
              placeholder={` ${t(language, "searchPlaceholder")} ${searchMode}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-3 py-1 rounded shadow-sm"
            />
            <select value={searchMode} onChange={(e) => setSearchMode(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option value="producerCode">{t(language, "searchOptions.producerCode")}</option>
              <option value="village">{t(language, "searchOptions.village")}</option>
              <option value="region">{t(language, "searchOptions.region")}</option>
            </select>
            <button
              onClick={() => setSearchQuery(searchQuery)}
              disabled={!searchQuery}
              className={classNames("px-3 py-1 rounded text-white", {
                "bg-blue-600 hover:bg-blue-700": searchQuery,
                "bg-gray-400 cursor-not-allowed": !searchQuery,
              })}
            >
              {t(language, "searchButton")}
            </button>

            <select value={tileType} onChange={(e) => setTileType(e.target.value)} className="border rounded px-2 py-1 text-sm">
              {Object.keys(tileOptions).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="border rounded px-2 py-1 text-sm">
              {Object.keys(themeColors).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded shadow-sm hover:bg-indigo-700"
            >
              <FiFilter /> {showFilterPanel ? `${ t(language, "hideFilters")}` : `${t(language, "showFilters")}` }
            </button>
            <button
              onClick={() => {
                setFilter({
                  producerCode: "",
                  village: "",
                  region: "",
                  sex: "",
                  cooperativ: "",
                  statut: "",
                });
                setSearchQuery("");
              }}
              className="col-span-2 md:col-span-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              {t(language, "resetFilters")}
            </button>
          </div>
        </div>

        {showFilterPanel && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-4 pb-4">
            {["producerCode", "village", "region", "sex", "cooperativ", "statut"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={`Filter by ${field}`}
                value={filter[field]}
                onChange={(e) => setFilter({ ...filter, [field]: e.target.value })}
                className="border px-2 py-1 rounded text-sm"
              />
            ))}
          </div>
        )}
        {errMsg && (
          <div className="px-4 py-2 mx-4 my-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {errMsg}
          </div>
        )}

<MapContainer
  ref={mapRef}
  center={[4.16934, 10.632949]}
  zoom={13}

  className="h-63vh w-[100%] min-h-[63vh] md:h-[75vh] md:min-h-[65vh]"
>
  <TileLayer url={tileOptions[tileType]} />

  {geojsonData && (
    <>
      <GeoJSON
        key={JSON.stringify(geojsonData.map(f => f.properties.__highlighted))}
        data={geojsonData}
        style={getStyle}
        onEachFeature={onEachFeature}
      />
      <FitBoundsOnFilter geojson={geojsonData} />
    </>
  )}

  {limitGeojsonData && (
    <GeoJSON 
      data={limitGeojsonData}
      style={{
        color: "teal",
        weight: 5,
        fillOpacity: 0.1
      }}
      interactive={false}
      pane="shadowPane"
    />
  )}
</MapContainer>


        {selectedData && (
          <div className="mt-8 px-4">
            <div className="bg-white text-black rounded-xl p-6 shadow">
              <h2 className="text-2xl font-bold mb-2">{selectedData.name} {selectedData.surname}</h2>
              <p className="text-sm italic mb-4">{t(language, "location")}: {selectedData.village}, {selectedData.region}</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {Object.entries(fieldLabels).map(([key, label]) => (
                  <div key={key}><strong>{label}:</strong> {cleanValue(selectedData[key])}</div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">{t(language, "summaryTitle")}</h3>
                <p>{generateSummary(selectedData)}</p>
              </div>
              <button onClick={downloadPDF} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{t(language, "downloadPDF")} </button>
            </div>
          </div>
        )}

        {showLegend ? renderLegend() : (
          <button
            onClick={() => setShowLegend(true)}
            className="fixed bottom-4 left-4 bg-white text-black p-2 rounded shadow z-[1000]"
          >
            {t(language, "showLegend")}
          </button>
        )}

        <Footer />
      </section>
    </div>

    : 
    <div className="flex items-center justify-center min-h-screen bg-yellow-500">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4"
    >
      <h2 className="text-2xl font-bold text-center text-yellow-600 mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-sm"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition"
        >
          Login
        </motion.button>
      </form>

      {validCredentials && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-green-600 text-center font-semibold"
        >
          ✅ Logged in successfully!
        </motion.div>
      )}
    </motion.div>
  </div> }
    </>
  );
};

export default Map;
