import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../api/axios";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { COOPERATIVE_URL, USERS_URL, PLOT_URL } from "../../routes/serverRoutes";
import CLIENT_URL from "../../routes/clientRoutes";

const AdminAddPlot = () => {
  const [form, setForm] = useState({
    id: "",
    x: "",
    y: "",
    QR_URL: "",
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
    region: "centre",
    departement: "",
    village: "",
    surface: "",
    cooperative: "",
    sex: "",
    tel: ""
  });

  const token = useSelector(selectCurrentToken);
  const [cooperatives, setCooperatives] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCooperatives = async () => {
      try {
        const res = await axios.get(COOPERATIVE_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCooperatives(res.data);
        setForm((prev) => ({ ...prev, cooperative: res.data[0]?.id || "" }));
      } catch (err) {
        setErrMsg(err?.response?.data?.message || "Failed to fetch cooperatives.");
      }
    };
    fetchCooperatives();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    console.log(form);
    e.preventDefault();
    try {
      const res = await axios.post(PLOT_URL, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setSuccess("Plot successfully created.");
      setTimeout(() => {
        window.location.href = `${CLIENT_URL}/#/admin/plot`;
      }, 1000);
    } catch (err) {
      setErrMsg(err?.response?.data?.message || "Error creating plot.");
    }
  };

  return (
    <section className="md:ml-[21%] md:w-[55vw] bg-zinc-100 px-4 py-6">
      <h1 className="text-2xl font-semibold text-center mb-4">Admin Plot Dashboard</h1>
      {errMsg && <div className="text-red-600 font-bold animate-pulse mb-2">{errMsg}</div>}
      {success && <div className="text-green-600 font-bold animate-pulse mb-2">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          key === "problems" || key === "fertilizer" || key === "insecticid" ? (
            <div key={key}>
              <label className="block font-medium capitalize" htmlFor={key}>{key}</label>
              <textarea
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-blue-300"
              />
            </div>
          ) : key === "cooperative" ? (
            <div key={key}>
              <label className="block font-medium capitalize" htmlFor={key}>Cooperative</label>
              <select
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-blue-300"
              >
                {cooperatives.map((coop) => (
                  <option key={coop.id} value={coop.id}>{coop.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div key={key}>
              <label className="block font-medium capitalize" htmlFor={key}>{key}</label>
              <input
                id={key}
                name={key}
                type={key === "tel" || key === "surface" || key === "plantnumber" || key === "ageplantat" || key === "output" || key.startsWith("nb") ? "number" : "text"}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-blue-300"
              />
            </div>
          )
        ))}

        <button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-500 p-3 rounded text-white font-semibold"
        >
          Submit Plot
        </button>
      </form>
    </section>
  );
};

export default AdminAddPlot;