import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import axios from "../api/axios";
import { USERS_URL } from "../routes/serverRoutes";

/*
 * AdminUser – CRUD dashboard for managing users
 * ------------------------------------------------
 * – Brown‑toned (amber + stone) palette
 * – Mobile‑first, fully responsive
 * – Accessible colour contrast & focus rings
 */

const AdminUser = () => {
  // ────────────────────────────────── state
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filtered, setFiltered] = useState(null); // null → show all
  const [error, setError] = useState("");

  const token = useSelector(selectCurrentToken);

  // ────────────────────────────────── helpers
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(USERS_URL, headers);
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to retrieve users");
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ────────────────────────────────── actions
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchId.trim()) return setFiltered(null);

    try {
      const { data } = await axios.get(`${USERS_URL}/${searchId.trim()}`, headers);
      setFiltered(data.users);
      setError("");
    } catch (err) {
      setFiltered(null);
      setError(err?.response?.data?.message || "User not found");
    }
  };

  const deleteUser = async (code) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${USERS_URL}/${code}`, headers);
      setUsers((prev) => prev.filter((u) => u.code !== code));
      // also purge from filtered list if needed
      setFiltered((prev) => (Array.isArray(prev) ? prev.filter((u) => u.code !== code) : prev));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  // decide which collection to render
  const collection = filtered ?? users;

  // ────────────────────────────────── render
  return (
    <div className="container mx-auto px-4 pt-28 font-sans text-stone-800">
      {/* heading */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-800">User Management Dashboard</h1>

        <Link
          to="/admin/user/add"
          className="inline-block rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
        >
          Add User
        </Link>
      </header>

      {/* search */}
      <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search by code / phone / email / name"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full sm:w-96 rounded-md border border-stone-300 bg-stone-100 px-3 py-2 text-sm shadow-inner focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          type="submit"
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
        >
          Search
        </button>
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setFiltered(null);
              setSearchId("");
            }}
            className="rounded-md bg-stone-300 px-4 py-2 text-sm font-medium text-stone-800 shadow hover:bg-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
          >
            Clear
          </button>
        )}
      </form>

      {/* message bar */}
      {error && (
        <p className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 shadow">{error}</p>
      )}
      {filtered && (
        <p className="mb-4 rounded-md bg-amber-100 px-4 py-2 text-sm text-amber-800 shadow">User found – showing search result</p>
      )}

      {/* responsive list / table */}
      <div className="space-y-4 md:hidden">
        {collection.map((user) => (
          <article
            key={user.id}
            className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
          >
            <p className="font-medium">
              <span className="text-stone-500">Username:</span> {user.username}
            </p>
            <p className="truncate"><span className="text-stone-500">Email:</span> {user.email}</p>
            <p><span className="text-stone-500">Phone:</span> {user.phone}</p>
            <p><span className="text-stone-500">Code:</span> {user.code}</p>

            <div className="mt-3 flex gap-3">
              <Link
                to={`/admin/user/edit?userId=${user.code}`}
                className="flex-1 rounded-md bg-amber-500 px-3 py-2 text-center text-sm font-medium text-white shadow hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteUser(user.code)}
                className="flex-1 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* desktop table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-100 text-left text-sm font-medium uppercase tracking-wider text-stone-600">
              <tr>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-sm">
              {collection.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50">
                  <td className="whitespace-nowrap px-6 py-3">{user.username}</td>
                  <td className="whitespace-nowrap px-6 py-3">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-3">{user.phone}</td>
                  <td className="whitespace-nowrap px-6 py-3">{user.code}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <Link
                        to={`/admin/user/edit?userId=${user.code}`}
                        className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteUser(user.code)}
                        className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
