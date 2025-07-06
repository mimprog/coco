import queryString from "query-string";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { COOPERATIVE_URL } from "../routes/serverRoutes";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { ADMIN_COOPERATIVES } from "../routes/clientRoutes";

const AdminEditCooperative = () => {
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);


  // ✅ Get cooperativeId from hash-based URL
  useEffect(() => {
    //const hash = window.location.hash;
    //const query = hash.includes("?") ? hash.split("?")[1] : "";
    const { cooperativeId } = queryString.parse(location.search);
    if (cooperativeId) {
      setId(cooperativeId);
    }
  }, []);

  // ✅ Fetch current cooperative details
  useEffect(() => {
    if (!id) return;
    const getCooperative = async () => {
      try {
        const res = await axios.get(`${COOPERATIVE_URL}/${id}`, 
          {headers: {Authorization: `Bearer ${token}`,withCredentials: true},
        });
        setName(res.data.name);
      } catch (err) {
        console.log(err?.response?.data?.error);
      }
    };
    getCooperative();
  }, [id]);

  // ✅ Edit cooperative and redirect after 2 seconds
  const EditCooperative = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${COOPERATIVE_URL}/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setSuccess(`"${name}" updated successfully.`);
        setErrMsg("");
        setTimeout(() => {
          window.location.href = ADMIN_COOPERATIVES;
        }, [2000])
      }
    } catch (err) {
      console.log(err);
      setErrMsg(err?.response?.data?.message || "Failed to update cooperative.");
      setSuccess("");
      setTimeout(() => {
        setErrMsg("");
        navigate("/admin/cooperative");
      }, 2000);
    }
  };

  return (
    <section className="mx-2 py-4 md:mx-16 lg:mx-32 xl:mx-48">
      <div className="text-center bg-amber-300 py-3 rounded-md shadow">
        <h1 className="text-xl font-semibold text-gray-800">
          Admin Edit Cooperative
        </h1>
      </div>

      <form className="py-6 px-4 bg-amber-100 mt-4 rounded-md shadow-md" onSubmit={EditCooperative}>
        {errMsg && (
          <div className="mb-4 text-center text-red-600 font-semibold">{errMsg}</div>
        )}
        {success && (
          <div className="mb-4 text-center text-green-600 font-semibold">{success}</div>
        )}

        <div className="flex flex-col md:flex-row md:items-center mb-6">
          <label className="mb-2 md:mb-0 md:mr-4 text-lg font-medium text-gray-800" htmlFor="name">
            Name:
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            className="flex-1 px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-40 py-2 text-lg font-semibold bg-amber-400 hover:bg-amber-500 text-white rounded-md shadow-md transition-transform duration-150 hover:-translate-y-0.5"
          >
            Confirm
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminEditCooperative;
