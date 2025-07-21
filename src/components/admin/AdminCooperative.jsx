import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { COOPERATIVE_URL } from "../routes/serverRoutes";
import { useSelector } from "react-redux";
import { ADMIN_ADD_COOPERATIVE, ADMIN_EDIT_COOPERATIVE } from "../routes/clientRoutes";

const AdminCooperative = () => {
  const [searchId, setSearchId] = useState("");
  const [cooperatives, setCooperatives] = useState([]);
  const [searchCooperatives, setSearchCooperatives] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const fetchCooperatives = async () => {
      try {
        const res = await axios.get(COOPERATIVE_URL, {
          headers: { Authorization: `Bearer ${token}`, withCredentials: true },
        });
        setCooperatives(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCooperatives();
  }, []);

  const handleSearch = async (e, name) => {
    e.preventDefault();
    try {
      const res = await axios.get(COOPERATIVE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
          "Content-Type": "application/json",
        },
      });
      const filtered = res.data.filter((el) =>
        el.name.toLowerCase().includes(name.toLowerCase())
      );
      setSearchCooperatives(filtered);
    } catch (err) {
      console.error(err?.response?.data?.message);
      setErrMsg(err?.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${COOPERATIVE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}`, withCredentials: true },
      });
      setCooperatives((prev) => prev.filter((co) => co.id !== id));
      if (searchCooperatives) {
        setSearchCooperatives((prev) => prev.filter((co) => co.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cooperativesToDisplay = searchCooperatives || cooperatives;

  return (
    <section className="w-[90vw] max-w-6xl mx-auto mt-24 px-2">
      <div className="bg-amber-100 p-4 rounded-lg shadow-md mb-4 text-center">
        <h1 className="text-2xl font-bold text-yellow-900">
          {searchCooperatives ? "Search result" : "Admin Cooperative Dashboard"}
        </h1>
        {searchCooperatives && (
          <button
            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            onClick={() => setSearchCooperatives(null)}
          >
            All Cooperatives
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e, searchId)}
            className="flex-1 p-2 border border-yellow-400 rounded-md focus:ring-2 focus:ring-yellow-600"
          />
          <button
            onClick={(e) => handleSearch(e, searchId)}
            className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
          >
            Search
          </button>
        </div>
        <Link
          to={`${ADMIN_ADD_COOPERATIVE}`}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 shadow"
        >
         Add a cooperative
        </Link>
      </div>

      <div className="text-center text-red-600 font-semibold mb-2">{errMsg}</div>

      {/* Mobile List */}
      <ul className="md:hidden space-y-4">
        {cooperativesToDisplay.map((cooperative) => (
          <li
            key={cooperative.id}
            className="p-4 bg-amber-50 rounded-lg shadow border border-yellow-300"
          >
            <p className="text-lg font-medium text-yellow-900">
              Name: <span className="text-brown-700">{cooperative.name}</span>
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                to={`${ADMIN_EDIT_COOPERATIVE}?cooperativeId=${cooperative.id}`}
                className="flex-1 text-center bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(cooperative.id)}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop Table */}
      <table className="hidden md:table w-full mt-6 bg-amber-50 border rounded-lg overflow-hidden">
        <thead className="bg-yellow-200 text-yellow-900">
          <tr>
            <th className="text-left py-3 px-4">Name</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cooperativesToDisplay.map((cooperative) => (
            <tr key={cooperative.id} className="border-t">
              <td className="py-3 px-4">{cooperative.name}</td>
              <td className="py-3 px-4 flex gap-2">
                <Link
                  to={`/admin/cooperative/edit?cooperativeId=${cooperative.id}`}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(cooperative.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminCooperative;
