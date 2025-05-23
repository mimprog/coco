import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { useLocation } from "react-router-dom";
import { PLOT_URL } from "../../routes/serverRoutes";
console.log(PLOT_URL);

const AdminPlot = () => {
  const token = useSelector(selectCurrentToken);
  const [plots, setPlots] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [searchplots, setSearchplots] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const location = useLocation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const getPlots = async () => {
      try {
        const res = await axios.get(PLOT_URL, {
          headers: { Authorization: `Bearer ${token}`, withCredentials: true },
        });
        console.log(res?.data);
        if (Array.isArray(res.data)) {
          setPlots(res.data);
          setCurrentPage(1); // Reset page on new data load
        } else {
          setErrMsg("Plot data is not an array");
          setPlots([]);
        }
      } catch (err) {
        setErrMsg(err?.response?.data?.message || "Failed to fetch plots");
      }
    };

    getPlots();
  }, [token]);

  const searchPlot = async (e, name) => {
    e.preventDefault();
    try {
      const res = await axios.get(PLOT_URL, {
        headers: { Authorization: `Bearer ${token}`, withCredentials: true },
      });
      if (Array.isArray(res.data)) {
        const filtered = res.data.filter((el) =>
          el.name.toLowerCase().includes(name.toLowerCase())
        );
        setSearchplots(filtered);
        setCurrentPage(1); // Reset page when searching
      } else {
        setSearchplots([]);
      }
    } catch (err) {
      setErrMsg(err?.response?.data?.message || "Search failed");
    }
  };

  const deletePlot = async (id) => {
    try {
      await axios.delete(`${PLOT_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}`, withCredentials: true },
      });
      setPlots(plots.filter((pl) => pl.id !== id));
      setSuccessMsg("Plot has been deleted successfully");
    } catch (err) {
      setErrMsg(err?.response?.data?.message || "Failed to delete plot");
    }
  };

  const dataToShow = searchplots ?? plots;

  // Pagination calculations
  const totalItems = dataToShow.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = dataToShow.slice(startIdx, startIdx + itemsPerPage);

  return (
    <section className="md:absolute md:top-16 md:w-[90vw] mx-1 md:ml-[19%] xl:ml-[9%]">
      <h1 className="text-lg md:text-xl text-center bg-amber-200 font-semibold py-2 rounded">
        Admin Plot DashBoard
      </h1>

      {searchplots && (
        <h2 className="text-center font-bold py-3 text-amber-600 bg-amber-200 rounded">
          Plot trouvé
        </h2>
      )}

      <div className="flex items-center gap-3 mb-4">
        <button
          className="p-3 bg-amber-300 rounded-md hover:bg-amber-400 transition"
          onClick={() => {
            setSearchplots(null);
            setSearchId("");
          }}
        >
          All Plots
        </button>

        <input
          onKeyDown={(e) => e.key === "Enter" && searchPlot(e, searchId)}
          placeholder="Search by name..."
          className="w-64 md:w-96 text-lg p-2 h-11 bg-amber-200 text-gray-700 rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button
          onClick={(e) => searchPlot(e, searchId)}
          className="h-11 px-5 text-lg bg-amber-300 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition"
        >
          Search
        </button>

        <Link
          to="/admin/plot/add"
          className="ml-auto p-2 border shadow rounded-lg bg-blue-100 hover:bg-blue-300 hover:translate-y-1 transition"
        >
          Ajouter plot
        </Link>
      </div>

      {errMsg && (
        <p className="text-red-600 font-semibold mb-3">{errMsg}</p>
      )}
      {successMsg && (
        <p className="text-green-600 font-semibold mb-3">{successMsg}</p>
      )}

      <p className="mb-2 text-sm text-gray-600">
        Showing {currentItems.length} of {totalItems} plots
      </p>

      <div className="overflow-x-auto max-h-[60vh] border rounded shadow">
        <table className="min-w-full border-collapse table-auto text-left text-sm">
          <thead className="sticky top-0 bg-amber-300 text-gray-900 font-semibold">
            <tr>
              <th className="p-2 border-r whitespace-nowrap">Id</th>
              <th className="p-2 border-r whitespace-nowrap">Statut</th>
              <th className="p-2 border-r whitespace-nowrap">Operateur</th>
              <th className="p-2 border-r whitespace-nowrap">Subdivision</th>
              <th className="p-2 border-r whitespace-nowrap">Land Status</th>
              <th className="p-2 border-r whitespace-nowrap">Name</th>
              <th className="p-2 border-r whitespace-nowrap">Surname</th>
              <th className="p-2 border-r whitespace-nowrap">Matrimonia</th>
              <th className="p-2 border-r whitespace-nowrap">Residence</th>
              <th className="p-2 border-r whitespace-nowrap">Education</th>
              <th className="p-2 border-r whitespace-nowrap">Lieuedit</th>
              <th className="p-2 border-r whitespace-nowrap">Age Plantat</th>
              <th className="p-2 border-r whitespace-nowrap">Plant Number</th>
              <th className="p-2 border-r whitespace-nowrap">Output</th>
              <th className="p-2 border-r whitespace-nowrap">Fertilizer</th>
              <th className="p-2 border-r whitespace-nowrap">Nb Fertil</th>
              <th className="p-2 border-r whitespace-nowrap">Insecticid</th>
              <th className="p-2 border-r whitespace-nowrap">Nb Insect</th>
              <th className="p-2 border-r whitespace-nowrap">Problems</th>
              <th className="p-2 border-r whitespace-nowrap">Region</th>
              <th className="p-2 border-r whitespace-nowrap">Departement</th>
              <th className="p-2 border-r whitespace-nowrap">Village</th>
              <th className="p-2 border-r whitespace-nowrap">Surface</th>
              <th className="p-2 border-r whitespace-nowrap">Cooperative</th>
              <th className="p-2 border-r whitespace-nowrap">Sex</th>
              <th className="p-2 border-r whitespace-nowrap">Tel</th>
              <th className="p-2 border-r whitespace-nowrap">Photo</th>
              <th className="p-2 border-r whitespace-nowrap">X</th>
              <th className="p-2 border-r whitespace-nowrap">Y</th>
              <th className="p-2 border-r whitespace-nowrap">QR_URL</th>
              <th className="p-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((plot) => (
                <tr
                  key={plot.id}
                  className="hover:bg-amber-100 border-b border-amber-300"
                >
                  <td className="p-1 border-r">{plot.id}</td>
                  <td className="p-1 border-r">{plot.statut}</td>
                  <td className="p-1 border-r">{plot.operateur}</td>
                  <td className="p-1 border-r">{plot.subdivision}</td>
                  <td className="p-1 border-r">{plot.landstatus}</td>
                  <td className="p-1 border-r">{plot.name}</td>
                  <td className="p-1 border-r">{plot.surname}</td>
                  <td className="p-1 border-r">{plot.matrimonia}</td>
                  <td className="p-1 border-r">{plot.residence}</td>
                  <td className="p-1 border-r">{plot.education}</td>
                  <td className="p-1 border-r">{plot.lieuedit}</td>
                  <td className="p-1 border-r">{plot.ageplantat}</td>
                  <td className="p-1 border-r">{plot.plantnumber}</td>
                  <td className="p-1 border-r">{plot.output}</td>
                  <td className="p-1 border-r">{plot.fertilizer}</td>
                  <td className="p-1 border-r">{plot.nbfertil}</td>
                  <td className="p-1 border-r">{plot.insecticid}</td>
                  <td className="p-1 border-r">{plot.nbinsect}</td>
                  <td className="p-1 border-r">{plot.problems}</td>
                  <td className="p-1 border-r">{plot.region}</td>
                  <td className="p-1 border-r">{plot.departement}</td>
                  <td className="p-1 border-r">{plot.village}</td>
                  <td className="p-1 border-r">{plot.surface}</td>
                  <td className="p-1 border-r">{plot.cooperative}</td>
                  <td className="p-1 border-r">{plot.sex}</td>
                  <td className="p-1 border-r">{plot.tel}</td>
                  <td className="p-1 border-r">
                    {plot.photo ? (
                      <img
                        src={plot.photo}
                        alt="plot"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-1 border-r">{plot.x}</td>
                  <td className="p-1 border-r">{plot.y}</td>
                  <td className="p-1 border-r">
                    {plot.QR_URL ? (
                      <a
                        href={plot.QR_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        QR Link
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-1 whitespace-nowrap">
                    <Link
                      to={`/admin/plot/edit?searchId=${plot.id}`}
                      className="p-1 bg-green-200 rounded hover:bg-green-400 mr-2 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePlot(plot.id)}
                      className="p-1 bg-red-200 rounded hover:bg-red-400 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="31" className="text-center p-4 text-gray-500">
                  No plots found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2 items-center text-gray-700">
          <button
            className="px-3 py-1 rounded border hover:bg-amber-300 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded border hover:bg-amber-300 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default AdminPlot;
