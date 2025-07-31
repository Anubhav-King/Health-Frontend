// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        mobile,
        password,
      });

      //console.log("Login response:", res.data);
      //console.log("API URL:", process.env.REACT_APP_API_URL);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Assuming user.role is a string like "Participant" or "ExCom"
      localStorage.setItem("activeRole", user.roles[0]);


      if (user.mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      //console.log("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
