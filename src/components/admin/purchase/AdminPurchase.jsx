import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { PURCHASE_URL } from "../../routes/serverRoutes";
import TimeAgo from "react-timeago";
import { translations, t } from "../../../constants/translation"; 
import { ADMIN_EDIT_PURCHASE, ADMIN_ADD_PURCHASE } from "../../routes/clientRoutes";
const AdminPurchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(PURCHASE_URL, {
          headers: { Authorization: `Bearer ${token}`, withCredentials: true },
        });
        setPurchases(res.data);
      } catch (err) {
        setErrMsg(err?.response?.data?.message || "Failed to fetch purchases.");
      }
    };

    fetchPurchases();
  }, [token]);

  const handleSearch = async (e, name) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await axios.get(PURCHASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });

      const filtered = res.data.filter((purchase) =>
        purchase.userCode.toLowerCase().includes(name.toLowerCase())
      );
      setFilteredPurchases(filtered);
    } catch (err) {
      setErrMsg(err?.response?.data?.message || "Search failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${PURCHASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}`, withCredentials: true },
      });
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      setFilteredPurchases((prev) => prev?.filter((p) => p.id !== id) || null);
      setSuccessMsg("Purchase deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrMsg(err?.response?.data?.message || "Failed to delete purchase.");
      setTimeout(() => setErrMsg(""), 3000);
    }
  };

  const displayList = filteredPurchases || purchases;

  return (
    <section className="px-4 py-8 mt-24 max-w-7xl mx-auto">
      <div className="mb-4 text-center md:text-left">
        <h1 className="text-3xl font-bold text-amber-900">Purchase Management</h1>
        {successMsg && (
          <p className="mt-2 text-green-700 bg-green-100 p-2 rounded">{successMsg}</p>
        )}
        {errMsg && (
          <p className="mt-2 text-red-700 bg-red-100 p-2 rounded">{errMsg}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by user code..."
          className="flex-1 px-4 py-2 border rounded-md bg-amber-100 text-gray-900"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e, searchId)}
        />
        <button
          onClick={(e) => handleSearch(e, searchId)}
          className="px-6 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          Search
        </button>
        {filteredPurchases && (
          <button
            onClick={() => {
              setFilteredPurchases(null);
              setSearchId("");
            }}
            className="px-4 py-2 text-sm text-amber-700 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mb-6 text-center">
        <Link
          to={`${ADMIN_ADD_PURCHASE}`}
          className="inline-block px-6 py-2 bg-amber-700 text-white rounded hover:bg-amber-800"
        >
          Add Purchase
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-amber-50">
          <thead className="bg-amber-200 text-amber-900 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">User Code</th>
              <th className="px-4 py-3">Cooperative ID</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayList.length > 0 ? (
              displayList.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="border-t border-amber-300 text-gray-800 hover:bg-amber-100"
                >
                  <td className="px-4 py-3">{purchase.userCode}</td>
                  <td className="px-4 py-3">{purchase.cooperativeId}</td>
                  <td className="px-4 py-3">{purchase.quantity}</td>
                  <td className="px-4 py-3">{purchase.price}</td>
<td className="p-2 text-sm text-gray-600">
  <TimeAgo date={purchase.createdAt} />
</td>

                  <td className="px-4 py-3 space-x-2">
                    <Link
                      to={`${ADMIN_EDIT_PURCHASE}?purchaseId=${purchase.id}`}
                      className="inline-block px-3 py-1 bg-green-200 text-green-900 rounded hover:bg-green-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(purchase.id)}
                      className="inline-block px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-600">
                  No purchases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminPurchase;
