import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faEye, faTrash, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ProfileSkeleton } from "../components/Skeletons";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user from session storage
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const token = sessionStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        // Fetch user's reels
        const res = await axios.get(`${apiUrl}/api/reels/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReels(res.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleDelete = async (reelId) => {
    if (!window.confirm("Are you sure you want to delete this reel?")) return;

    try {
      const token = sessionStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/reels/${reelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReels((prev) => prev.filter((reel) => reel._id !== reelId));
    } catch (error) {
      console.error("Error deleting reel:", error);
      alert("Failed to delete reel");
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-8">
      {/* Profile Header */}
      <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 mb-10 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)] shrink-0">
          {user?.name ? (
            <span className="text-slate-950 text-4xl sm:text-5xl font-black uppercase">
              {user.name.charAt(0)}
            </span>
          ) : (
            <FontAwesomeIcon icon={faUserCircle} className="text-white text-5xl sm:text-7xl" />
          )}
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{user?.name || "User"}</h1>
          <p className="text-orange-400 font-medium mb-1">@{user?.username || "username"}</p>
          <p className="text-slate-400 text-sm mb-6">{user?.email || "email@example.com"}</p>
          
          <div className="flex gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-2xl font-bold text-white">{reels.length}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Reels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reels Grid */}
      <h2 className="text-xl font-bold text-white mb-6 pl-2 border-l-4 border-orange-500">My Uploads</h2>
      
      {reels.length === 0 ? (
        <div className="bg-[#111111]/50 border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-4">You haven't uploaded any reels yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {reels.map((reel) => (
            <div key={reel._id} className="group relative bg-black rounded-2xl overflow-hidden aspect-[9/16] shadow-lg border border-white/10 transition-transform duration-300 hover:scale-[1.02]">
              <video 
                src={reel.videoUrl} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              
              {/* Top gradient & Delete button */}
              <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/80 to-transparent flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(reel._id)}
                  className="w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition-colors cursor-pointer"
                  title="Delete Reel"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              </div>

              {/* Bottom stats gradient */}
              <div className="absolute bottom-0 left-0 w-full p-4 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                <p className="text-white text-xs font-semibold line-clamp-1 mb-1">{reel.title}</p>
                {reel.tags && reel.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {reel.tags.map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] text-orange-400 font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-300 text-[10px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faEye} className="text-slate-400 text-sm" />
                    <span>{reel.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faHeart} className="text-red-400 text-sm" />
                    <span>{reel.likes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
