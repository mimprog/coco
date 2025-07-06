import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { ADMIN_PLOTS } from "../../routes/clientRoutes";

const PLOT_URL = "/api/v1/plots/plots";

// Initial form state
const initialFormState = {
  statut: "",
  operateur: "",
  subdivision: "",
  landstatus: "",
  name: "",
  surname: "",
  matrimonia: "",
  residence: "",
  education: "",
  lieuedit: "",
  ageplantat: "",
  plantnumber: "",
  output: "",
  fertilizer: "",
  nbfertil: "",
  insecticid: "",
  nbinsect: "",
  problems: "",
  region: "",
  departement: "",
  village: "",
  surface: "",
  cooperative: "",
  sex: "",
  tel: "",
};

const AdminEditPlot = () => {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const [plotId, setPlotId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [message, setMessage] = useState({ error: "", success: "" });

  // Extract plotId from URL
  useEffect(() => {
    const { plotId } = queryString.parse(location.search);
    if (plotId) {
      setPlotId(plotId);
    } else {
      setError("No plot ID provided");
      setIsLoading(false);
    }
  }, [location.search]);

  // Process API data to form fields
  const processPlotData = (plotData) => {
    return Object.keys(initialFormState).reduce((acc, key) => {
      let value = plotData[key];
      
      // Handle null/undefined values
      if (value === null || value === undefined) {
        value = "";
      }
      // Handle stringified JSON arrays
      else if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        try {
          const parsed = JSON.parse(value);
          value = Array.isArray(parsed) ? parsed.join(", ") : parsed;
        } catch {
          // If parsing fails, keep original value
        }
      }
      
      return { ...acc, [key]: value };
    }, {});
  };

  // Fetch plot data
  useEffect(() => {
    if (!plotId) return;

    const fetchPlotData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${PLOT_URL}/${plotId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data) {
          throw new Error("Plot data not found in response");
        }

        const processedData = processPlotData(response.data);
        setForm(processedData);
        
      } catch (err) {
        console.error("Error fetching plot data:", err);
        setError(err.message || "Failed to load plot data");
        setMessage({ error: "Failed to load plot", success: "" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlotData();
  }, [plotId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ error: "", success: "" });

    try {
      await axios.put(
        `${PLOT_URL}/${plotId}`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ success: "Plot updated successfully", error: "" });
      setTimeout(() => {
        window.location.href = ADMIN_PLOTS;
      }, 1000);
    } catch (err) {
      console.error("Error updating plot:", err);
      setMessage({ 
        error: err.response?.data?.message || "Error updating plot", 
        success: "" 
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading plot data...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <section className="px-4 py-6 md:px-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit Plot</h1>

      {message.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {message.error}
        </div>
      )}
      {message.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message.success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(form).map(([field, value]) => (
          <div key={field} className="flex flex-col">
            <label htmlFor={field} className="capitalize text-sm text-gray-700">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <input
              type="text"
              name={field}
              id={field}
              value={value}
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        ))}
        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminEditPlot;