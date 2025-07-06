import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { SALE_URL } from "../../routes/serverRoutes";
import TimeAgo from "react-timeago";
import { ADMIN_ADD_SALE, ADMIN_EDIT_SALE } from "../../routes/clientRoutes";

const AdminSale = () => {
  const [sales, setSales] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [searchId, setSearchId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchSales, setSearchSales] = useState(null);

  const token = useSelector(selectCurrentToken);


  useEffect(() => {
    const getSales = async () => {
      try {
        const res = await axios.get(SALE_URL, {
          headers: { Authorization: `Bearer ${token}`, withCredentials: true },
        });
        setSales(res.data);
        console.log(res?.data);
      } catch (err) {
        setErrMsg(err?.response?.data?.message);
      }
    };

    getSales();
  }, []);

  const searchSale = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.get(SALE_URL, {
        headers: { Authorization: `Bearer ${token}`, withCredentials: true },
      });
      const filtered = res.data.filter((el) =>
        el.exporterId.toString().includes(id)
      );
      setSearchSales(filtered);
    } catch (err) {
      setErrMsg(err?.response?.data?.message);
    }
  };

  const deleteSale = async (id) => {
    try {
      await axios.delete(`${SALE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}`, withCredentials: true },
      });
      setSales(sales.filter((sale) => sale.id !== id));
      setSuccessMsg("Sale deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      setErrMsg(err?.response?.data?.message);
    }
  };

  const displayedSales = searchSales ?? sales;

  return (
    <section className="p-4 md:ml-[19%] xl:ml-[10%] md:mt-16">
      <div className="text-center bg-amber-200 py-3 rounded-md shadow mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Admin Sales Dashboard</h1>
      </div>

      {errMsg && (
        <div className="text-red-600 font-semibold text-center mb-2">{errMsg}</div>
      )}
      {successMsg && (
        <div className="text-green-600 font-semibold text-center mb-2">{successMsg}</div>
      )}

      {searchSales && (
        <h2 className="text-center text-amber-700 bg-amber-100 py-2 mb-2 font-medium">
          Filtered Sales Results
        </h2>
      )}

      <div className="flex flex-wrap items-center mb-4 gap-2">
        <input
          onKeyDown={(e) => e.key === "Enter" && searchSale(e, searchId)}
          placeholder="Search by Exporter ID..."
          className="w-full md:w-96 p-2 text-lg bg-amber-100 border rounded-md text-gray-700"
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          onClick={(e) => searchSale(e, searchId)}
          className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-gray-800 font-medium rounded-md transition"
        >
          Search
        </button>
        <button
          onClick={() => setSearchSales(null)}
          className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-gray-700 font-medium rounded-md"
        >
          Reset
        </button>
        <Link
          to={`${ADMIN_ADD_SALE}`}
          className="ml-auto px-4 py-2 bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold rounded-md shadow"
        >
          Add Sale
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-amber-300 rounded-md text-left">
          <thead className="bg-amber-100 text-amber-800 font-medium">
            <tr>
              <th className="p-2">Exporter ID</th>
              <th className="p-2">Cooperative ID</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Price</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSales.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-600">
                  No sales found.
                </td>
              </tr>
            )}
            {displayedSales.map((sale) => (
              <tr key={sale.id} className="border-t border-amber-200">
                <td className="p-2">{sale.exporterId}</td>
                <td className="p-2">{sale.cooperativeId}</td>
                <td className="p-2">{sale.quantity}</td>
                <td className="p-2">{sale.price}</td>
                <td className="p-2 text-sm text-gray-600">
                  <TimeAgo date={sale.createdAt} />
                </td>
                <td className="p-2 flex flex-wrap gap-2">
                  <Link
                    to={`${ADMIN_EDIT_SALE}?saleId=${sale.id}`}
                    className="px-3 py-1 bg-green-200 hover:bg-green-400 text-green-800 rounded-md"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteSale(sale.id)}
                    className="px-3 py-1 bg-red-200 hover:bg-red-400 text-red-800 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminSale;
