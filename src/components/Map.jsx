import { useState, useEffect } from "react";
import axios from "axios";
import "./css/index.css";
import { useMimlyrics } from "./context/AppProvider";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import BASE_URL from "./routes/serverRoutes";
import classNames from "classnames";
import jsPDF from "jspdf";

const tileOptions = {
  OSM: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "Black & White": "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
  Satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

const themeColors = {
  Light: "bg-white text-black",
  Dark: "bg-gray-900 text-white",
  Forest: "bg-green-900 text-green-100",
};

const Map = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [tileType, setTileType] = useState("Satellite");
  const [theme, setTheme] = useState("Light");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  const { isActiveModalNavbar } = useMimlyrics();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userCode = searchParams.get("code");

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/static/geodatas-gps.geojson`);
        let features = response.data.features;
        console.log(features)
        if (userCode) {
          features = features.filter(f => f.properties.CODE_PRODUCTEUR === userCode);
        }
        if (searchQuery) {
          features = features.filter(f =>
            f.properties.CODE_PRODUCTEUR?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.properties.village?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setGeojsonData(features);
      } catch (error) {
        setErrMsg(error.message || "Failed to load GeoJSON data");
      }
    };
    fetchGeoJson();
  }, [userCode, searchQuery]);

  const cleanValue = (val) => {
    if (!val || (typeof val === "object" && Object.keys(val).length === 0)) return "?";
    return typeof val === "object" ? JSON.stringify(val) : String(val);
  };

  const fieldLabels = {
    id: "Parcel Code",
    CODE_PRODUCTEUR: "Producer Code",
    name: "First Name",
    surname: "Last Name",
    sex: "Sex",
    ageplantat: "Age of Plantation",
    plantnumbe: "Number of Trees",
    output: "Productivity",
    fertilizer: "Fertilizer Used",
    nberfertil: "Number of Fertilizations",
    insecticid: "Insecticide Used",
    nberinsect: "Number of Insecticide Treatments",
    problems: "Problems Encountered",
    tel: "Phone",
    region: "Region",
    departemen: "Department",
    village: "Village",
    residence: "Residence",
    lieudit: "Edit Location",
    education: "Education Level",
    matrimonia: "Marital Status",
    Statut: "Status",
    Operateur: "Operator",
    subdivisio: "Subdivision",
    landstatus: "Land Status",
    cooperativ: "Cooperative",
    x: "Longitude",
    y: "Latitude",
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

  const downloadPDF = () => {
    if (!selectedData) return;
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(12);
    for (const key in fieldLabels) {
      doc.text(`${fieldLabels[key]}: ${cleanValue(selectedData[key])}`, 10, y);
      y += 7;
    }
    doc.save("plot-info.pdf");
  };

  const generateSummary = (data) => {
    return `This parcel, owned by ${data.name} ${data.surname}, located in ${data.village}, ${data.region}, covers an area of ${data.surface} m². It has been exploited for ${data.ageplantat} and contains about ${data.plantnumber} cocoa trees. Current productivity is estimated at ${data.output}. Fertilizers like ${data.fertilizer} and insecticides such as ${data.insecticid} are used around ${data.nbfertil} times per year. Challenges include ${data.problems}. Contact: ${data.tel}.`;
  };

  return (
    <div className={classNames("min-h-screen", themeColors[theme])}>
      <section className={isActiveModalNavbar ? "relative opacity-60 -z-50 mt-24" : "flex flex-col z-50 mt-24"}>
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-3xl font-bold border-l pl-2">Plots</h1>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search by producer or village"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <select value={tileType} onChange={(e) => setTileType(e.target.value)} className="rounded border px-2 py-1 text-sm">
              {Object.keys(tileOptions).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="rounded border px-2 py-1 text-sm">
              {Object.keys(themeColors).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {errMsg && <div className="text-red-500 pl-4">{errMsg}</div>}

        <MapContainer center={[4.16934, 10.632949]} zoom={13} style={{ height: "60vh", width: "100%" }}>
          <TileLayer url={tileOptions[tileType]} />
          {geojsonData && <GeoJSON data={geojsonData} style={{ color: "brown", weight: 2, fillOpacity: 0.7 }} onEachFeature={onEachFeature} />}
        </MapContainer>

        {selectedData && (
          <div className="mt-8 px-4">
            <div className="bg-gray-100 rounded-xl p-6 shadow-none">
              <h2 className="text-2xl font-bold mb-2">{selectedData.name} {selectedData.surname}</h2>
              <p className="text-sm italic mb-4">Location: {selectedData.village}, {selectedData.region}</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {Object.entries(fieldLabels).map(([key, label]) => (
                  <div key={key}><strong>{label}:</strong> {cleanValue(selectedData[key])}</div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-white rounded">
                <h3 className="font-semibold mb-2">Summary</h3>
                <p>{generateSummary(selectedData)}</p>
              </div>
              <button onClick={downloadPDF} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Download PDF</button>
            </div>
          </div>
        )}

        <footer className="mt-12 text-white bg-[brown] p-4 text-center">
          <div>Contact: (+237) 6xx xx xx xx | Email: tracecocoa.camer@gmail.com</div>
          <div>Ministry of Agriculture - All rights reserved © 2024</div>
        </footer>
      </section>
    </div>
  );
};

export default Map;
