
// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../pages/video.css";
// import data from "../pages/video.json";

// function Video({ currentUserId }) {
//   const [sections, setSections] = useState([]);
//   const [screenTime, setScreenTime] = useState(0);
//   const [videoTimes, setVideoTimes] = useState({});
//   const [popupVideo, setPopupVideo] = useState(null);
//   const [watchedTime, setWatchedTime] = useState(0);

//   const popupRef = useRef(null);
//   const startTimeRef = useRef(Date.now());
//   const navigate = useNavigate();

//   // Ensure user is logged in
//   useEffect(() => {
//     if (!currentUserId) {
//       navigate("/"); // redirect to login if not logged in
//     }
//   }, [currentUserId, navigate]);

//   // Load sections from JSON
//   useEffect(() => {
//     const sectionArray = Object.keys(data).map((key) => ({
//       title:
//         key === "trending"
//           ? "Trending Now"
//           : key === "continueWatching"
//           ? "Continue Watching"
//           : "Recommended for You",
//       items: data[key],
//     }));
//     setSections(sectionArray);
//   }, []);

//   // Track total screen time
//   useEffect(() => {
//     const id = setInterval(() => {
//       setScreenTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
//     }, 1000);
//     return () => clearInterval(id);
//   }, []);

//   const openPopup = (video) => {
//     setPopupVideo(video);
//     setWatchedTime(0);
//     setTimeout(() => {
//       if (popupRef.current) popupRef.current.play();
//     }, 300);
//   };

//   const closePopup = () => setPopupVideo(null);

//   const handlePausePopup = async () => {
//     const userId = currentUserId || localStorage.getItem("loggedInUserId");

//     if (!userId) {
//       console.warn("⚠️ Cannot save watch: user not logged in");
//       return;
//     }

//     if (popupRef.current && popupVideo) {
//       const seconds = popupRef.current.currentTime;
//       setWatchedTime(seconds);
//       setVideoTimes((prev) => ({
//         ...prev,
//         [popupVideo.id]: seconds,
//       }));

//       try {
//         const res = await fetch("http://localhost:5000/api/watch/add", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             user_id: userId,
//             video_title: popupVideo.title,
//             genre: popupVideo.genre || "Unknown",
//             duration_minutes: (seconds / 60).toFixed(2),
//           }),
//         });

//         const data = await res.json();
//         if (data.success) {
//           console.log("✅ Watch time saved to DB");
//         } else {
//           console.warn("⚠️ Save failed:", data.message);
//         }
//       } catch (error) {
//         console.error("❌ Error saving watch history:", error);
//       }
//     }
//   };

//   return (
//     <>
     

//       <div style={{ margin: "1rem", color: "#2563eb", fontWeight: "600" }}>
//         ⏱️ App Screen Time: {screenTime} seconds
//       </div>

//       <div className="app">
//         {sections.map((section, idx) => (
//           <div className="section" key={idx}>
//             <h2>{section.title}</h2>
//             <div className="movie-grid">
//               {section.items.map((video, index) => (
//                 <div className="movie-card" key={index}>
                 
//                   <img
//                     src={video.image}
//                     alt={video.title}
//                     style={{ cursor: "pointer" }}
//                     onClick={() => openPopup(video)}
//                   />
//                    <h3>{video.title}</h3>
//                   <p>{video.genre}</p>
//                   {videoTimes[video.id] && (
//                     <div className="progress-info">
//                       <p>Watched: {videoTimes[video.id].toFixed(2)} sec</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {popupVideo && (
//         <div className="video-popup-overlay">
//           <div className="video-popup-content">
//             <button className="close-popup" onClick={closePopup}>
//               ×
//             </button>
//             <h2>{popupVideo.title}</h2>

//             <video
//               ref={popupRef}
//               width="100%"
//               height="400"
//               controls
//               onPause={handlePausePopup}
//             >
//               <source src={popupVideo.video} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>

//             {watchedTime > 0 && (
//               <div className="popup-progress">
//                 Watched: {watchedTime.toFixed(2)} seconds
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import data from "../pages/video.json";
// import "../pages/video.css";

// function Video({ currentUserId }) {
//   const [sections, setSections] = useState([]);
//   const [screenTime, setScreenTime] = useState(0); // App screen time
//   const [popupVideo, setPopupVideo] = useState(null);
//   const [videoTime, setVideoTime] = useState(0); // current video time
//   const popupRef = useRef(null);
//   const navigate = useNavigate();

//   const userId = currentUserId || localStorage.getItem("loggedInUserId");

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!userId) navigate("/");
//   }, [userId, navigate]);

//   // Load video sections
//   useEffect(() => {
//     const sectionArray = Object.keys(data).map((key) => ({
//       title:
//         key === "trending"
//           ? "Trending Now"
//           : key === "continueWatching"
//           ? "Continue Watching"
//           : "Recommended for You",
//       items: data[key],
//     }));
//     setSections(sectionArray);
//   }, []);

//   // Track app screen time
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setScreenTime((prev) => prev + 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Auto-save app screen time every 10 sec
//   useEffect(() => {
//     if (!userId) return;

//     const saveAppTime = async () => {
//       console.log(`⏱ Trying to save app screen time: ${screenTime}s`);
//       try {
//         const res = await fetch("http://localhost:5000/api/watch/screen-time", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             user_id: userId,
//             screen_time_minutes: (screenTime / 60).toFixed(2),
//           }),
//         });

//         const data = await res.json();
//         console.log("✅ App screen time saved:", data);
//       } catch (err) {
//         console.error("❌ Failed to save app screen time:", err);
//       }
//     };

//     const interval = setInterval(saveAppTime, 10000);
//     return () => clearInterval(interval);
//   }, [userId, screenTime]);

//   // Open video popup
//   const openPopup = (video) => {
//     setPopupVideo(video);
//     setTimeout(() => popupRef.current?.play(), 300);
//   };

//   // Close popup
//   const closePopup = () => {
//     setPopupVideo(null);
//     setVideoTime(0);
//   };

//   // Save video watch on pause
//   const handlePausePopup = async () => {
//     if (!popupRef.current || !popupVideo || !userId) return;
//     const seconds = popupRef.current.currentTime;

//     try {
//       const res = await fetch("http://localhost:5000/api/watch/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: userId,
//           video_title: popupVideo.title,
//           genre: popupVideo.genre || "Unknown",
//           duration_minutes: (seconds / 60).toFixed(2),
//         }),
//       });
//       const data = await res.json();
//       console.log(`🎬 Saved watch: ${popupVideo.title}, duration: ${seconds.toFixed(2)}s`);
//       console.log("✅ Watch saved:", data);
//     } catch (err) {
//       console.error("❌ Failed to save watch history:", err);
//     }
//   };

//   return (
//     <>
//       <div style={{ margin: "1rem", color: "#2563eb", fontWeight: "600" }}>
//         ⏱ App Screen Time: {screenTime}s
//       </div>

//       <div className="app">
//         {sections.map((section, idx) => (
//           <div className="section" key={idx}>
//             <h2>{section.title}</h2>
//             <div className="movie-grid">
//               {section.items.map((video, index) => (
//                 <div className="movie-card" key={index}>
//                   <h3>{video.title}</h3>
//                   <p>{video.genre}</p>
//                   <img
//                     src={video.image}
//                     alt={video.title}
//                     style={{ cursor: "pointer" }}
//                     onClick={() => openPopup(video)}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {popupVideo && (
//         <div className="video-popup-overlay">
//           <div className="video-popup-content">
//             <button className="close-popup" onClick={closePopup}>
//               ×
//             </button>
//             <h2>{popupVideo.title}</h2>
//             <video
//               ref={popupRef}
//               width="100%"
//               height="400"
//               controls
//               onPause={handlePausePopup}
//             >
//               <source src={popupVideo.video} type="video/mp4" />
//             </video>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Video;

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
                  <h3>{video.title}</h3>
                  <p>{video.genre}</p>
                  <img
                    src={video.image}
                    alt={video.title}
                    style={{ cursor: "pointer" }}
                    onClick={() => openPopup(video)}
                  />
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
