import queryString from "query-string";
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { EXPORTER_URL } from "../../routes/serverRoutes";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { ADMIN_EXPORTERS } from "../../routes/clientRoutes";

const AdminEditExporter = () => {
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [id, setId] = useState("");

  const token = useSelector(selectCurrentToken);

useEffect(() => {
  //const hash = window.location.hash;
  //const query = hash.includes('?') ? hash.split('?')[1] : '';
  const { exporterId } = queryString.parse(location.search);
  console.log("exporterId:", exporterId);

  if (exporterId) {
    setId(exporterId);
  }
}, []);


  useEffect(() => {
    const getExporter = async () => {
      try {
        const res = await axios.get(`${EXPORTER_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        });
        setName(res.data.name);
      } catch (err) {
        console.error(err?.response?.data?.error);
        setErrMsg("Failed to load exporter data.");
      }
    };

    if (id) getExporter();
  }, [id, token]);

  const editExporter = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${EXPORTER_URL}/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );

      if (res?.data) {
        setSuccess(`Exporter "${name}" updated successfully.`);
        setErrMsg("");
                setTimeout(() => {
                  setSuccess("");
          window.location.href = ADMIN_EXPORTERS;
        }, [2000])
      }
    } catch (err) {
      console.error(err);
      setErrMsg(err?.response?.data?.message || "An error occurred.");
      setSuccess("");
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto mt-10 p-4">
      <div className="text-center bg-amber-300 rounded-md shadow-md py-4">
        <h1 className="text-xl font-bold text-gray-800">Edit Exporter</h1>
      </div>

      <form
        onSubmit={editExporter}
        className="bg-amber-50 shadow-md rounded-md p-6 mt-4"
      >
        {errMsg && (
          <div className="mb-4 text-red-600 font-medium">{errMsg}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 font-medium">{success}</div>
        )}

        <div className="flex flex-col md:flex-row md:items-center mb-4 gap-2">
          <label htmlFor="name" className="text-lg font-medium text-gray-700">
            Exporter Name:
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            className="flex-1 p-2 border border-amber-300 rounded-md text-blue-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Enter exporter name"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-40 bg-amber-300 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-amber-400 transition-all"
        >
          Confirm
        </button>
      </form>
    </section>
  );
};

export default AdminEditExporter;
