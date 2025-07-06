import { useState, useRef, useEffect } from "react";
import axios from "../../api/axios";
import { EXPORTER_URL } from "../../routes/serverRoutes";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { ADMIN_EXPORTERS } from "../../routes/clientRoutes";
const AdminAddExporter = () => {
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [nameFocus, setNameFocus] = useState(false);
  const nameRef = useRef();
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChangeName = (e) => {
    setName(e.target.value);
    setErrMsg("");
    setSuccess("");
  };

  const addExporter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        EXPORTER_URL,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        }
      );
      if (response) {
        setSuccess(`"${name}" was added successfully.`);
        setName("");
        setErrMsg("");
        setTimeout(() => {
          window.location.href = ADMIN_EXPORTERS;
        }, [2000])
      }
    } catch (err) {
      console.log(err?.response?.data?.error);
      setErrMsg(err?.response?.data?.error || "Failed to add exporter.");
      setSuccess("");
    }
  };

  return (
    <section className="mt-24 px-4 py-10 max-w-2xl mx-auto bg-amber-50 rounded-lg shadow">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900">
          Add New Exporter
        </h1>
      </div>

      {errMsg && !nameFocus && (
        <div className="mb-4 text-center text-red-600 font-semibold animate-pulse">
          {errMsg}
        </div>
      )}
      {success && !nameFocus && (
        <div className="mb-4 text-center text-green-600 font-semibold animate-pulse">
          {success}
        </div>
      )}

      <form
        onSubmit={addExporter}
        className="space-y-6 px-4 md:px-0"
        autoComplete="off"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <label
            htmlFor="name"
            className="w-full md:w-32 font-medium text-amber-900"
          >
            Exporter Name:
          </label>
          <input
            ref={nameRef}
            id="name"
            type="text"
            value={name}
            onChange={handleChangeName}
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
            className="flex-1 w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900 bg-white"
            placeholder="Enter exporter name"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-amber-600 hover:bg-amber-700 rounded shadow transition-transform duration-200 hover:-translate-y-0.5"
          >
            Confirm
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminAddExporter;
