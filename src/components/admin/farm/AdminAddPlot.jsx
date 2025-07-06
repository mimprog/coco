import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../api/axios";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { COOPERATIVE_URL, PLOT_URL } from "../../routes/serverRoutes";
import { ADMIN_ADD_PLOT } from "../../routes/clientRoutes";

const AdminAddPlot = () => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    surname: "",
    sex: "MASCULIN",
    ageplantat: "",
    plantnumber: "",
    output: "",
    fertilizer: "",
    nbfertil: "",
    insecticid: "",
    nbinsect: "",
    problems: "",
    tel: "",
    region: "centre",
    departement: "",
    village: "",
    surface: "",
    cooperativeName: "",
    matrimonia: "CÉLIBATAIRE",
    education: "Secondaire",
    statut: "",
    operateur: "",
    subdivision: "",
    landstatus: "",
    residence: "",
    lieuedit: "",
    x: "0.0",
    y: "0.0",
    QR_URL: ""
  });

  const token = useSelector(selectCurrentToken);
  const [cooperatives, setCooperatives] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCooperatives = async () => {
      try {
        const res = await axios.get(COOPERATIVE_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCooperatives(res.data);
        if (res.data.length > 0) {
          setForm(prev => ({ ...prev, cooperativeName: res.data[0].name }));
        }
      } catch (err) {
        setErrMsg(err?.response?.data?.message || "Failed to fetch cooperatives.");
      }
    };
    fetchCooperatives();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.id) {
      setErrMsg("Plot ID is required");
      return false;
    }
    if (!form.name) {
      setErrMsg("Name is required");
      return false;
    }
    if (!form.surname) {
      setErrMsg("Surname is required");
      return false;
    }
    if (!form.tel) {
      setErrMsg("Phone number is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare data with proper types
      const plotData = {
        ...form,
        id: String(form.id),
        ageplantat: form.ageplantat ? Number(form.ageplantat) : null,
        plantnumber: form.plantnumber ? Number(form.plantnumber) : null,
        output: form.output ? Number(form.output) : null,
        nbfertil: form.nbfertil ? Number(form.nbfertil) : null,
        nbinsect: form.nbinsect ? Number(form.nbinsect) : null,
        surface: form.surface ? Number(form.surface) : null,
        x: form.x ? Number(form.x) : 0.0,
        y: form.y ? Number(form.y) : 0.0,
        tel: String(form.tel)
      };

      const res = await axios.post(PLOT_URL, plotData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setSuccess("Plot successfully created!");
      setTimeout(() => {
        window.location.href = ADMIN_ADD_PLOT;
      }, 1500);
    } catch (err) {
      console.error("Submission error:", err.response?.data);
      setErrMsg(err?.response?.data?.message || "Error creating plot. Please check all fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldGroups = [
    {
      title: "Basic Information",
      fields: [
        { name: 'id', label: 'Plot ID', type: 'text', required: true },
        { name: 'name', label: 'First Name', type: 'text', required: true },
        { name: 'surname', label: 'Last Name', type: 'text', required: true },
        { name: 'sex', label: 'Gender', type: 'select', options: ['MASCULIN', 'FEMININ'] },
        { name: 'matrimonia', label: 'Marital Status', type: 'select', options: ['CÉLIBATAIRE', 'MARIÉ(E)', 'DIVORCÉ(E)', 'VEUF(VE)'] },
        { name: 'education', label: 'Education Level', type: 'select', options: ['Primaire', 'Secondaire', 'Universitaire', 'Aucun'] },
        { name: 'tel', label: 'Phone Number', type: 'tel', required: true }
      ]
    },
    {
      title: "Plot Details",
      fields: [
        { name: 'ageplantat', label: 'Plant Age (years)', type: 'number' },
        { name: 'plantnumber', label: 'Number of Plants', type: 'number' },
        { name: 'output', label: 'Output (kg)', type: 'number' },
        { name: 'surface', label: 'Surface Area', type: 'number' },
        { name: 'fertilizer', label: 'Fertilizers Used', type: 'textarea' },
        { name: 'nbfertil', label: 'Fertilizer Applications', type: 'number' },
        { name: 'insecticid', label: 'Insecticides Used', type: 'textarea' },
        { name: 'nbinsect', label: 'Insecticide Applications', type: 'number' },
        { name: 'problems', label: 'Problems Encountered', type: 'textarea' }
      ]
    },
    {
      title: "Location Information",
      fields: [
        { name: 'region', label: 'Region', type: 'text' },
        { name: 'departement', label: 'Department', type: 'text' },
        { name: 'village', label: 'Village', type: 'text' },
        { name: 'subdivision', label: 'Subdivision', type: 'text' },
        { name: 'landstatus', label: 'Land Status', type: 'text' },
        { name: 'residence', label: 'Residence', type: 'text' },
        { name: 'lieuedit', label: 'Location Details', type: 'text' },
        { name: 'x', label: 'Longitude (X)', type: 'number', step: "0.0000001" },
        { name: 'y', label: 'Latitude (Y)', type: 'number', step: "0.0000001" }
      ]
    },
    {
      title: "Administrative Information",
      fields: [
        { name: 'cooperativeName', label: 'Cooperative', type: 'select', 
          options: cooperatives.map(c => c.name) },
        { name: 'statut', label: 'Status', type: 'text' },
        { name: 'operateur', label: 'Operator', type: 'text' },
        { name: 'QR_URL', label: 'QR Code URL', type: 'text' }
      ]
    }
  ];

  return (
    <section className="md:ml-[21%] md:w-[55vw] bg-zinc-100 px-4 py-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Add New Plot</h1>
      
      {errMsg && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{errMsg}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p className="font-bold">Success</p>
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {fieldGroups.map((group, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.fields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="block font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:outline-blue-300"
                      required={field.required}
                      rows={3}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:outline-blue-300"
                      required={field.required}
                    >
                      {field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:outline-blue-300"
                      required={field.required}
                      step={field.step}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded text-white font-semibold ${
              isSubmitting ? 'bg-amber-500 opacity-70' : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {isSubmitting ? 'Creating Plot...' : 'Create Plot'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminAddPlot;