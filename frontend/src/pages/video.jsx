
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import data from "../pages/video.json";
import "../pages/video.css";

function Video({ currentUserId }) {
  const [sections, setSections] = useState([]);
  const [screenTime, setScreenTime] = useState(0); // seconds
  const [popupVideo, setPopupVideo] = useState(null);

  const popupRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const userId = currentUserId || localStorage.getItem("loggedInUserId");

  useEffect(() => {
    if (!userId) navigate("/");
  }, [userId, navigate]);

  useEffect(() => {
    const sectionArray = Object.keys(data).map((key) => ({
      title:
        key === "trending"
          ? "Trending Now"
          : key === "continueWatching"
          ? "Continue Watching"
          : "Recommended for You",
      items: data[key],
    }));
    setSections(sectionArray);
  }, []);

  /* Screen time timer */
  useEffect(() => {
    const startTimer = () => {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setScreenTime((prev) => prev + 1);
        }, 1000);
      }
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    startTimer();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("🛑 Screen time paused (tab hidden)");
        stopTimer();
      } else {
        console.log("▶️ Screen time resumed (tab active)");
        startTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /* Auto-save screen time every 10s (send minutes to backend) */
  useEffect(() => {
    if (!userId) return;

    const saveAppTime = async () => {
      // convert seconds -> minutes (float)
      const minutes = Number((screenTime / 60).toFixed(2));
      console.log(`⏱ Saving screen time: ${screenTime}s -> ${minutes}min`);

      try {
        const res = await fetch("http://localhost:5000/api/watch/screen-time", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            screen_time_minutes: minutes,
          }),
        });

        const data = await res.json();
        console.log("✅ Screen time saved:", data);
      } catch (err) {
        console.error("❌ Failed to save app screen time:", err);
      }
    };

    const interval = setInterval(saveAppTime, 10000);
    return () => clearInterval(interval);
  }, [userId, screenTime]);

  const openPopup = (video) => {
    setPopupVideo(video);
    setTimeout(() => popupRef.current?.play(), 250);
  };

  const closePopup = () => {
    setPopupVideo(null);
  };

  /* Save watch history when user pauses the popup video */
  const handlePausePopup = async () => {
    if (!popupRef.current || !popupVideo || !userId) return;
    const seconds = popupRef.current.currentTime;
    const minutes = Number((seconds / 60).toFixed(2));

    try {
      const res = await fetch("http://localhost:5000/api/watch/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          video_title: popupVideo.title,
          genre: popupVideo.genre || "Unknown",
          duration_minutes: minutes,
        }),
      });

      const data = await res.json();
      console.log(`🎬 Saved: ${popupVideo.title}, ${seconds.toFixed(2)}s -> ${minutes}min`);
      console.log("✅ Watch saved:", data);
    } catch (err) {
      console.error("❌ Failed to save watch:", err);
    }
  };

  return (
    <>
      <div style={{ margin: "1rem", color: "#2563eb", fontWeight: 600 }}>
        ⏱ App Screen Time: {screenTime}s
      </div>

      <div className="app">
        {sections.map((section, idx) => (
          <div className="section" key={idx}>
            <h2>{section.title}</h2>
            <div className="movie-grid">
              {section.items.map((video, index) => (
                <div className="movie-card" key={index}>
                  <img
                    src={video.image}
                    alt={video.title}
                    style={{ cursor: "pointer" }}
                    onClick={() => openPopup(video)}
                  />
                  <p>{video.genre}</p>
                   <h3>{video.title}</h3>
                 
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {popupVideo && (
        <div className="video-popup-overlay">
          <div className="video-popup-content">
            <button className="close-popup" onClick={closePopup}>
              ×
            </button>
            <h2>{popupVideo.title}</h2>
            <video
              ref={popupRef}
              width="100%"
              height="400"
              controls
              onPause={handlePausePopup}
            >
              <source src={popupVideo.video} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}

export default Video;
