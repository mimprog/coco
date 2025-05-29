import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { selectCurrentToken } from "../../../slices/auth/authSlice";

const PLOT_URL = "/api/v1/plots/plots";
const CLIENT_URL = "/admin/plot"; // update if needed

const AdminEditPlot = () => {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const [code, setCode] = useState("");

  const [form, setForm] = useState({
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
  });

  const [message, setMessage] = useState({ error: "", success: "" });

  useEffect(() => {
    const { searchId } = queryString.parse(location.search);
    setCode(searchId);

    const fetchData = async () => {
      try {
        const res = await axios.get(`${PLOT_URL}/${searchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const plot = res.data.plot;

        // Only set the allowed fields
        setForm((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.keys(form).map((key) => [key, plot[key] || ""])
          ),
        }));
      } catch (err) {
        setMessage({ error: "Failed to load plot", success: "" });
      }
    };

    fetchData();
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${PLOT_URL}/${code}`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ success: "Plot updated successfully", error: "" });
      setTimeout(() => {
        window.location.href = CLIENT_URL;
      }, 1000);
    } catch (err) {
      setMessage({ error: "Error updating plot", success: "" });
    }
  };

  return (
    <section className="px-4 py-6 md:px-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit Plot</h1>

      {message.error && <div className="text-red-600">{message.error}</div>}
      {message.success && <div className="text-green-600">{message.success}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(form).map((field) => (
          <div key={field} className="flex flex-col">
            <label htmlFor={field} className="capitalize text-sm text-gray-700">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type="text"
              name={field}
              id={field}
              value={form[field]}
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        ))}
        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminEditPlot;
