import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faRocket,
  faBookOpen,
  faBolt,
  faCompass,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Video Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505] z-10"></div>
        <div className="absolute w-[120vw] h-[200vh] -top-[10vh] -left-[10vw] flex gap-6 opacity-20 blur-[6px] animate-slide">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-[280px] h-[500px] rounded-2xl overflow-hidden bg-orange-900/10 shrink-0 ${i % 2 === 0 ? "mt-20" : "-mt-20"}`}
            >
              <video
                src="http://localhost:5000/uploads/SQL1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          ))}
        </div>
        {/* Radial gradient overlay to keep the center dark and premium */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] z-10"></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg" : "bg-transparent py-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <FontAwesomeIcon
                icon={faPlay}
                className="text-white text-sm ml-0.5"
              />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
              ByteBharat
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a
              href="#features"
              className="hover:text-orange-400 transition-colors"
            >
              Features
            </a>
            <button
              onClick={() => navigate("/about")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              About
            </button>
            <a
              href="#community"
              className="hover:text-orange-400 transition-colors"
            >
              Community
            </a>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-bold backdrop-blur-md transition-all shadow-sm cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold mb-8 backdrop-blur-sm animate-fade-in-up">
            Personalized Learning Feed for Curious Minds
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 max-w-5xl animate-fade-in-up drop-shadow-lg"
            style={{ animationDelay: "100ms", opacity: 0 }}
          >
            One Byte. <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
              Infinite Learning.
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 animate-fade-in-up leading-relaxed drop-shadow-md font-medium"
            style={{ animationDelay: "200ms", opacity: 0 }}
          >
            Transform endless scrolling into endless learning with bite-sized
            educational videos from creators across technology, science,
            mathematics, and beyond.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up"
            style={{ animationDelay: "300ms", opacity: 0 }}
          >
            <button
              onClick={() => navigate("/register")}
              className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 rounded-full text-white font-bold text-lg transition-all duration-300 shadow-[0_0_40px_-10px_rgba(234,88,12,0.6)] hover:shadow-[0_0_60px_-10px_rgba(234,88,12,0.8)] flex items-center gap-3 overflow-hidden cursor-pointer hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <span className="relative z-10 flex items-center gap-3">
                <FontAwesomeIcon icon={faRocket} />
                Get Started
              </span>
            </button>

            <button
              onClick={() => navigate("/feed")}
              className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg backdrop-blur-md transition-all duration-300 flex items-center gap-3 shadow-lg cursor-pointer hover:scale-105 hover:border-white/20"
            >
              <FontAwesomeIcon icon={faPlay} className="text-sm" />
              Explore Feed
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full max-w-7xl mx-auto px-6 py-32 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white drop-shadow-md">
              Learn Faster. Stay Curious.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
              Everything you need to master new topics without the massive time
              commitment of traditional courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <FeatureCard
              icon={faBookOpen}
              title="Bite-sized Learning"
              description="Complex topics broken down into 60-second digestible chunks."
              delay="0ms"
            />
            <FeatureCard
              icon={faBolt}
              title="Learn in Minutes"
              description="Maximize your free time. Learn a new concept while waiting in line."
              delay="100ms"
            />
            <FeatureCard
              icon={faCompass}
              title="Personalized Feed"
              description="Our algorithm adapts to your learning style and interests instantly."
              delay="200ms"
            />
            <FeatureCard
              icon={faUsers}
              title="Community-driven"
              description="Learn directly from industry experts, educators, and passionate creators."
              delay="300ms"
            />
          </div>
        </section>

        {/* Footer Placeholder */}
        <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-xl py-10 mt-10 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/30">
                <FontAwesomeIcon
                  icon={faPlay}
                  className="text-white text-[10px] ml-0.5"
                />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                ByteBharat
              </span>
            </div>
            <p className="text-slate-500 font-medium text-sm">
              © 2026 ByteBharat. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <div
    className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)] transition-all duration-500 overflow-hidden backdrop-blur-md flex flex-col items-start text-left cursor-default"
    style={{ animationDelay: delay, animationFillMode: "both" }}
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-500/20 transition-colors duration-500"></div>
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500 relative z-10">
      <FontAwesomeIcon
        icon={icon}
        className="text-2xl text-orange-400 drop-shadow-md"
      />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-medium relative z-10">
      {description}
    </p>
  </div>
);

export default LandingPage;
