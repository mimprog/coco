import { useState, useEffect } from "react";
import axios from "axios";
import "./css/index.css";
import { useMimlyrics } from "./context/AppProvider";
import { useLocation } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import BASE_URL from "./routes/serverRoutes";

const Map = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [plotData, setPlotData] = useState({});
  const { isActiveModalNavbar } = useMimlyrics();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userCode = searchParams.get("code");

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/static/geodatas-gps.geojson`);
        console.log(response);
        if (!response.data || !response.data.features) {
          throw new Error("Invalid GeoJSON data");
        }
        const features = userCode
          ? response.data.features.filter(({ properties }) => properties.CODE_PRODUCTEUR === userCode)
          : response.data.features;
        setGeojsonData(features);
      } catch (error) {
        setErrMsg(error.message || "Failed to load GeoJSON data");
      }
    };
    fetchGeoJson();
  }, [userCode]);

  const onEachFeature = (feature, layer) => {
    layer.on('click', () => {
      try {
        const {
          id = "",
          STATUT: statut = "",
          OPERATEUR: operateur = "",
          SUBDIVISION: subdivision = "",
          STATUT_FONCIER: landstatus = "",
          NOM: name = "",
          PRENOM: surname = "",
          SITUATION_MATRIMONIALE: matrimonia = "",
          RESIDENCE: residence = "",
          NIVEAU_ETUDE: education = "",
          LIEU_DIT: lieuedit = "",
          "AGE MOYENNE DE LA PLANTATION": ageplantat = "",
          "NOMBRE DE PLANTS": plantnumber = "",
          "PRODUCTION PAR AN": output = "",
          "ENGRAIS UTILISES": fertilizer = "",
          "FREQUENCE D'UTILISATION DES ENGRAIS": nbfertil = "",
          "INTRANTS CHIMIQUES UTILISES": insecticid = "",
          "FREQUENCE D'UTILISATION DES INTRANTS CHIMIQUES": nbinsect = "",
          "DIFFICULTES RENCONTREES": problems = "",
          REGION: region = "",
          DEPARTEMENT: departement = "",
          VILLAGE: village = "",
          SUPERFICIE_HA: surface = "",
          COOPERATIVE: cooperative = "",
          SEXE: sex = "",
          TELEPHONE: tel = "",
          PHOTO: photo = "",
          X: x,
          Y: y,
          QR_CODE_URL: QR_URL = "",
          CODE_PARCELLE,
          CODE_PRODUCTEUR
        } = feature.properties;

        // Fallback coords if not available
        const coords = feature.geometry?.coordinates?.[0]?.[0]?.[0] || [x || 0, y || 0];

        setPlotData({
          id,
          statut,
          operateur,
          subdivision,
          landstatus,
          name,
          surname,
          matrimonia,
          residence,
          education,
          lieuedit,
          ageplantat,
          plantnumber,
          output,
          fertilizer,
          nbfertil,
          insecticid,
          nbinsect,
          problems,
          region,
          departement,
          village,
          surface,
          cooperative,
          sex,
          tel,
          photo,
          x: x || coords[0],
          y: y || coords[1],
          QR_URL
        });

        layer._map.setView([coords[1], coords[0]], 15);
        layer.bindPopup(`<h1>Parcelle : ${CODE_PARCELLE}</h1><b>Producteur :</b> ${CODE_PRODUCTEUR}`).openPopup();
      } catch (err) {
        console.error("Error processing GeoJSON feature:", err);
      }
    });
  };

  const dynamicStyle = (feature) => ({
    color: feature.properties.color || 'brown',
    weight: 2,
    fillOpacity: 0.7,
  });

  console.log(plotData);

  return (
    <div>
      <section className={isActiveModalNavbar ? "relative opacity-60 -z-50 mt-24" : "flex flex-col z-50 font-medium mt-24"}>
        <div className="pl-2 pr-14 py-1">
          <h1 className="border-l text-4xl"><strong>Parcelles</strong></h1>
        </div>

        {errMsg && <div className="text-red-500 pl-4">{errMsg}</div>}

        <MapContainer center={[4.16934, 10.632949]} zoom={13} style={{ height: '60vh', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geojsonData && <GeoJSON data={geojsonData} style={dynamicStyle} onEachFeature={onEachFeature} />}
        </MapContainer>

        {plotData?.name && (
          <div className="mt-8 px-4">
            <h1 className="text-xl font-semibold">Détails sur la parcelle</h1>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {Object.entries(plotData).map(([key, value]) => (
                <div key={key}><strong>{key.replace(/_/g, " ")}:</strong> {value}</div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-12 text-white bg-[brown] p-4 text-center">
          <div>Contact: (+237) 6xx xx xx xx | Email: tracecocoa.camer@gmail.com</div>
          <div>Ministère de l'agriculture - Tous droits réservés © 2024</div>
        </footer>
      </section>
    </div>
  );
};

export default Map;
