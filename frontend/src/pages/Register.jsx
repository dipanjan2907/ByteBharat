import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faArrowLeft,
  faAt,
} from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [signup, setSignUp] = useState("Sign Up");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setError("");
      setSignUp("Signing Up...");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const url = `${apiUrl.replace(/\/$/, "")}/api/auth/register`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      navigate("/login");
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      setSignUp("Sign Up");
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans selection:bg-orange-500/30">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group"
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Home
      </button>

      {/* Card Container */}
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
        {/* Logo Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-slate-950 font-black text-xl">B</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Create an Account
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Start your learning journey with ByteBharat
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 px-1">
              Full Name
            </label>
            <div className="relative flex items-center">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-4 text-slate-500 text-sm"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Hamza Ali Mazari"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 outline-none text-sm transition-all placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 px-1">
              Username
            </label>
            <div className="relative flex items-center">
              <FontAwesomeIcon
                icon={faAt}
                className="absolute left-4 text-slate-500 text-sm"
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 outline-none text-sm transition-all placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 px-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-4 text-slate-500 text-sm"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 outline-none text-sm transition-all placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 px-1">
              Password
            </label>
            <div className="relative flex items-center">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 text-slate-500 text-sm"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 outline-none text-sm transition-all placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 px-1">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 text-slate-500 text-sm"
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 outline-none text-sm transition-all placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group relative w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-[0_0_20px_-5px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_-5px_rgba(234,88,12,0.6)] flex items-center justify-center gap-2 overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-95 mt-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <span className="relative z-10">{signup}</span>
          </button>
        </form>

        {/* Login redirect */}
        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-orange-400 hover:text-orange-300 hover:underline cursor-pointer transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
