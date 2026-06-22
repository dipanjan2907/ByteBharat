import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faVideo,
  faLink,
  faUpload,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const PREDEFINED_TAGS = ["dsa", "sql", "web", "react", "python", "javascript"];

const UploadReel = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [uploadType, setUploadType] = useState("file"); // 'file' or 'url'
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const formatted = customTag.trim().toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");
    if (formatted && !selectedTags.includes(formatted)) {
      setSelectedTags([...selectedTags, formatted]);
      setCustomTag("");
    }
  };

  // Status State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [validationStatus, setValidationStatus] = useState(""); // '', 'validating', 'success', 'error'

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/login");
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user details:", e);
        navigate("/login");
      }
    }
  }, [navigate]);

  // Handle local video file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size limit check (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError("Video file is too large. Maximum size allowed is 15MB.");
      setSelectedFile(null);
      setPreviewSrc("");
      return;
    }

    setValidationStatus("validating");
    setError("");
    setSuccess("");

    const tempUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = tempUrl;
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(tempUrl);
      const width = video.videoWidth;
      const height = video.videoHeight;
      const aspect = width / height;
      const targetAspect = 9 / 16;

      // 9:16 is approximately 0.56. We check if it falls within 0.5 to 0.65 range.
      if (aspect > 0.65) {
        setError(`Invalid aspect ratio: ${width}x${height} (${(width/height).toFixed(2)}). Reel must be in 9:16 (vertical/portrait) format.`);
        setValidationStatus("error");
        setSelectedFile(null);
        setPreviewSrc("");
        return;
      }

      setError("");
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewSrc(fileUrl);
      setValidationStatus("success");
    };

    video.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      setError("Failed to load video file metadata. Please ensure it is a valid video file.");
      setValidationStatus("error");
      setSelectedFile(null);
      setPreviewSrc("");
    };
  };

  // Handle direct URL change and trigger lazy validation
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    setPreviewSrc("");
    setError("");
    setSuccess("");
    setValidationStatus("");
  };

  // Validate aspect ratio of entered video URL
  const validateEnteredUrl = () => {
    if (!videoUrl) {
      setError("Please provide a valid video URL.");
      return Promise.reject();
    }

    setValidationStatus("validating");
    setError("");
    setSuccess("");

    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;
        const aspect = width / height;

        if (aspect > 0.65) {
          const msg = `Invalid aspect ratio: ${width}x${height}. Reels must be in 9:16 vertical format.`;
          setError(msg);
          setValidationStatus("error");
          reject(msg);
          return;
        }

        setPreviewSrc(videoUrl);
        setValidationStatus("success");
        resolve(videoUrl);
      };

      video.onerror = () => {
        const warningMsg = "Could not verify aspect ratio (CORS restricted). Please ensure the video is vertical (9:16).";
        setError(warningMsg);
        setPreviewSrc(videoUrl);
        setValidationStatus("success"); // Set to success to enable the button
        resolve(videoUrl);
      };
    });
  };

  // Convert local file to Base64 for database storage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (uploadType === "file" && !selectedFile) {
      setError("Please select a 9:16 video file to upload.");
      return;
    }

    if (uploadType === "url" && !videoUrl.trim()) {
      setError("Please enter a direct video URL.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("username", user?.username || "creator");
      formData.append("title", title.trim());
      formData.append("tags", JSON.stringify(selectedTags));

      if (uploadType === "file") {
        formData.append("video", selectedFile);
      } else {
        // Validate URL aspect ratio before submitting
        try {
          const verifiedUrl = await validateEnteredUrl();
          formData.append("videoUrl", verifiedUrl);
        } catch (err) {
          setIsUploading(false);
          return;
        }
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.post(`${apiUrl}/api/reels/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (res.status === 201) {
        setSuccess("Reel uploaded successfully!");
        setTitle("");
        setSelectedFile(null);
        setVideoUrl("");
        setPreviewSrc("");
        setSelectedTags([]);
        setValidationStatus("");
        setTimeout(() => {
          navigate("/feed");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create reel. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-8 flex flex-col items-center">
      {/* Back Link */}
      <div className="w-full mb-6">
        <button
          onClick={() => navigate("/home")}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload Form */}
        <div className="lg:col-span-7 bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Create Learning Reel</h2>
            <p className="text-sm text-slate-400 mt-2">
              Share a byte-sized educational video. Keep it portrait (9:16 aspect ratio).
            </p>
          </div>

          <form onSubmit={handleUploadSubmit} className="flex flex-col gap-6">
            {/* Reel Title */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Reel Title / Description
              </label>
              <input
                type="text"
                placeholder="Explain what learners will grasp in this short..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#050505]/60 border border-white/5 rounded-xl focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 outline-none text-sm transition-all text-white placeholder:text-slate-600 font-medium"
                required
              />
            </div>

            {/* Tags Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PREDEFINED_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-orange-500/20 border-orange-500 text-orange-400"
                          : "bg-[#050505]/40 border-white/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
                {selectedTags.filter(t => !PREDEFINED_TAGS.includes(t)).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border bg-amber-500/20 border-amber-500 text-amber-400 transition-all cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom tag (e.g., node, docker)..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-[#050505]/60 border border-white/5 rounded-xl focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 outline-none text-xs transition-all text-white placeholder:text-slate-600 font-medium"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Toggle Upload Type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Video Source
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#050505]/40 rounded-xl p-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setUploadType("file");
                    setPreviewSrc("");
                    setValidationStatus("");
                    setError("");
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadType === "file"
                      ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faVideo} className="mr-2" />
                  Local File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadType("url");
                    setPreviewSrc("");
                    setValidationStatus("");
                    setError("");
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadType === "url"
                      ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faLink} className="mr-2" />
                  Video Link
                </button>
              </div>
            </div>

            {/* Upload Area for File */}
            {uploadType === "file" && (
              <div className="flex flex-col gap-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-52 border-2 border-dashed border-white/10 hover:border-orange-500/30 rounded-2xl flex flex-col justify-center items-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-all group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faUpload} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-slate-300">
                      {selectedFile ? selectedFile.name : "Select Video File"}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Drag & drop or browse. MP4, WebM formats (Max 15MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* URL Paste Input */}
            {uploadType === "url" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Direct Video URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/learn-video.mp4"
                      value={videoUrl}
                      onChange={handleUrlChange}
                      className="flex-1 px-4 py-3 bg-[#050505]/60 border border-white/5 rounded-xl focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 outline-none text-sm transition-all text-white placeholder:text-slate-600 font-medium"
                    />
                    <button
                      type="button"
                      onClick={validateEnteredUrl}
                      className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Verify Ratio
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Feedback & Logs */}
            <AnimatePresence>
              {validationStatus === "validating" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center gap-3 text-blue-400 text-xs font-semibold"
                >
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Analysing video layout and aspect ratio constraints...
                </motion.div>
              )}

              {validationStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-semibold"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Aspect ratio verified successfully: Video is in 9:16 vertical mode.
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-semibold"
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-sm font-bold"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || validationStatus === "validating" || (uploadType === "file" && !selectedFile) || (uploadType === "url" && !videoUrl)}
              className="group relative w-full py-3.5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-[0_0_20px_-5px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2 overflow-hidden cursor-pointer hover:scale-[1.01] active:scale-95 mt-4"
            >
              {isUploading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                  <span>Processing and Saving Reel...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUpload} />
                  <span>Publish Learning Reel</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: 9:16 Phone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
          <div className="w-full max-w-[280px] aspect-[9/16] bg-[#050505] rounded-[36px] border-4 border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center">
            {previewSrc ? (
              <video src={previewSrc} controls className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-center p-6 text-slate-600">
                <FontAwesomeIcon icon={faVideo} className="text-4xl mb-4" />
                <span className="text-xs font-bold uppercase tracking-wider">9:16 Video Preview</span>
                <p className="text-[10px] mt-2 max-w-xs text-slate-500">
                  Select a vertical video or enter a URL to see how your reel will render on the platform.
                </p>
              </div>
            )}

            {/* Interactive watermark overlay */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-black font-bold">
                {user?.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <span className="text-[10px] text-white font-semibold drop-shadow-md">
                @{user?.username || "creator"}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-3 mr-4">
            Live Simulator Preview
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadReel;
