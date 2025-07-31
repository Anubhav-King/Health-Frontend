import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("participant");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (role === "excom" && passcode !== "FI3@2025") {
      setError("Invalid passcode for Excom role.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        mobile,
        role: role === "participant" ? "Participant" : "Excom",
        passcode: role.toLowerCase() === "excom" ? passcode : "", // send empty string for Participant
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">Registered! Redirecting…</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        >
          <option value="participant">Participant</option>
          <option value="excom">Excom</option>
        </select>

        {role === "excom" && (
          <input
            type="password"
            placeholder="Excom Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
        )}

        <p className="text-sm text-gray-500 mb-2">
          Default password is <strong>Monday01</strong>
        </p>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
