import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { EXPORTER_URL } from "../../routes/serverRoutes";
import { ADMIN_ADD_EXPORTER, ADMIN_EDIT_EXPORTER } from "../../routes/clientRoutes";

const AdminExporter = () => {
  const [exporters, setExporters] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const fetchExporters = async () => {
      try {
        const res = await axios.get(EXPORTER_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        });
        setExporters(res?.data || []);
      } catch (err) {
        setErrMsg(err?.response?.data?.message || "Failed to load exporters.");
      }
    };
    fetchExporters();
  }, [token]);

  const searchExporter = async (e, name) => {
    e.preventDefault();
    try {
      const res = await axios.get(EXPORTER_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      const filtered = res.data.filter((el) =>
        el.name.toLowerCase().includes(name.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (err) {
      setErrMsg(err?.response?.data?.message || "Search failed.");
    }
  };

  const deleteExporter = async (exporterId) => {
    try {
      await axios.delete(`${EXPORTER_URL}/${exporterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      setExporters(exporters.filter((exp) => exp.id !== exporterId));
      setSearchResults(null);
    } catch (err) {
      setErrMsg(err?.response?.data?.message || "Failed to delete.");
    }
  };

  const displayedExporters = searchResults || exporters;

  return (
    <section className="w-[90vw] max-w-6xl mx-auto mt-28 px-4">
      <div className="mb-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-800">
          Exporter Management
        </h1>
        {errMsg && (
          <p className="mt-2 text-red-700 bg-red-100 p-2 rounded">{errMsg}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by exporter name..."
          className="flex-1 px-4 py-2 border rounded-md bg-amber-100 text-gray-900"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchExporter(e, searchId)}
        />
        <button
          onClick={(e) => searchExporter(e, searchId)}
          className="px-6 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          Search
        </button>
        {searchResults && (
          <button
            onClick={() => setSearchResults(null)}
            className="px-4 py-2 text-sm text-amber-700 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mb-6 text-center">
        <Link
          to={`${ADMIN_ADD_EXPORTER}`}
          className="inline-block px-6 py-2 bg-amber-700 text-white rounded hover:bg-amber-800"
        >
          Add Exporter
        </Link>
      </div>

      {/* Mobile View */}
      <ul className="md:hidden space-y-4">
        {displayedExporters.map((exp) => (
          <li
            key={exp.id}
            className="p-4 border rounded bg-amber-50 text-gray-800 shadow-sm"
          >
            <p className="font-semibold">Name: <span className="text-blue-900">{exp.name}</span></p>
            <div className="mt-3 space-x-2">
              <Link
                to={`${ADMIN_EDIT_EXPORTER}?exporterId=${exp.id}`}
                className="inline-block px-3 py-1 bg-green-300 rounded hover:bg-green-400"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteExporter(exp.id)}
                className="inline-block px-3 py-1 bg-red-300 rounded hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-amber-50 border-collapse shadow">
          <thead className="bg-amber-200 text-amber-900">
            <tr>
              <th className="px-4 py-3 text-left">Exporter Name</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedExporters.map((exp) => (
              <tr
                key={exp.id}
                className="border-t border-amber-300 hover:bg-amber-100"
              >
                <td className="px-4 py-3">{exp.name}</td>
                <td className="px-4 py-3 space-x-2">
                  <Link
                    to={`/admin/exporter/edit?exporterId=${exp.id}`}
                    className="px-3 py-1 bg-green-300 text-green-900 rounded hover:bg-green-400"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteExporter(exp.id)}
                    className="px-3 py-1 bg-red-300 text-red-800 rounded hover:bg-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {displayedExporters.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-600">
                  No exporters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminExporter;
