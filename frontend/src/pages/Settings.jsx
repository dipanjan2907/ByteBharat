import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faVolumeUp,
  faVolumeMute,
  faTrash,
  faCheckCircle,
  faExclamationTriangle,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  
  // Profile state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Preferences state
  const [defaultMuted, setDefaultMuted] = useState(() => {
    return localStorage.getItem("defaultMuted") === "true";
  });

  // Feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setName(parsed.name || "");
      setUsername(parsed.username || "");
      setEmail(parsed.email || "");
    }
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const res = await axios.put(
        `${apiUrl}/api/auth/update-profile`,
        { name, username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update sessionStorage
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setSuccess("Profile details updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      await axios.put(
        `${apiUrl}/api/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreferenceChange = (muted) => {
    setDefaultMuted(muted);
    localStorage.setItem("defaultMuted", muted ? "true" : "false");
    setSuccess("Preferences updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteAccount = async () => {
    const confirmText = `Are you sure you want to permanently delete your account? All your uploaded reels will be permanently deleted. This action CANNOT be undone.`;
    if (!window.confirm(confirmText)) return;

    setError("");
    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      await axios.delete(`${apiUrl}/api/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear sessions
      sessionStorage.clear();
      localStorage.removeItem("defaultMuted");
      
      // Redirect to home/landing
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete account.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full py-8 flex-1">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Account Settings</h1>
          <p className="text-sm text-slate-400">Manage your profile, preferences, and security settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 border-b border-white/5 md:border-b-0">
          <button
            onClick={() => { setActiveTab("profile"); setError(""); setSuccess(""); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "profile" 
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <FontAwesomeIcon icon={faUser} className="w-4" />
            Edit Profile
          </button>
          <button
            onClick={() => { setActiveTab("password"); setError(""); setSuccess(""); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "password" 
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <FontAwesomeIcon icon={faLock} className="w-4" />
            Security
          </button>
          <button
            onClick={() => { setActiveTab("preferences"); setError(""); setSuccess(""); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "preferences" 
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <FontAwesomeIcon icon={faVolumeUp} className="w-4" />
            Preferences
          </button>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3">
          <div className="bg-[#111111]/85 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            {/* Feedback Alerts */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                <FontAwesomeIcon icon={faExclamationTriangle} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-6 px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-white mb-2">Profile Details</h2>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                    placeholder="Enter your username"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto self-start px-8 py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-extrabold shadow-lg shadow-orange-500/20 transition-all cursor-pointer uppercase tracking-wider text-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-white mb-2">Change Password</h2>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto self-start px-8 py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-extrabold shadow-lg shadow-orange-500/20 transition-all cursor-pointer uppercase tracking-wider text-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">App Preferences</h2>
                  <p className="text-sm text-slate-400">Configure how you interact with the ByteBharat platform</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                      <FontAwesomeIcon icon={defaultMuted ? faVolumeMute : faVolumeUp} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Default Video Muted</h3>
                      <p className="text-xs text-slate-500">Automatically mute reels when they start playing</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange(!defaultMuted)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                      defaultMuted ? "bg-orange-500" : "bg-slate-800"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        defaultMuted ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="border-t border-white/5 pt-8 mt-4">
                  <h3 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h3>
                  <p className="text-xs text-slate-500 mb-4">Permanently delete your account and all of your uploaded video reels.</p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
