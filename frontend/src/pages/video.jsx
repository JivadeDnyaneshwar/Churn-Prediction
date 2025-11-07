
// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
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

//   // Load video sections from JSON
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

//   // Track total app screen time
//   useEffect(() => {
//     const id = setInterval(() => {
//       setScreenTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
//     }, 1000);
//     return () => clearInterval(id);
//   }, []);

//   // Open video popup
//   const openPopup = (video) => {
//     setPopupVideo(video);
//     setWatchedTime(0);
//     setTimeout(() => {
//       if (popupRef.current) popupRef.current.play();
//     }, 300);
//   };

//   // Close video popup
//   const closePopup = () => {
//     setPopupVideo(null);
//     setWatchedTime(0);
//   };

//   // ✅ Save watch time to backend when paused
//   const handlePausePopup = async () => {
//     if (!currentUserId) {
//       console.warn("⚠️ Cannot save watch: user not logged in");
//       return;
//     }

//     if (popupRef.current && popupVideo) {
//       const seconds = popupRef.current.currentTime;
//       setWatchedTime(seconds);
//       setVideoTimes((prev) => ({ ...prev, [popupVideo.id]: seconds }));

//       try {
//         const res = await fetch("http://localhost:5000/api/watch/add", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             user_id: currentUserId,
//             video_title: popupVideo.title,
//             genre: popupVideo.genre || "Unknown",
//             duration_minutes: (seconds / 60).toFixed(2),
//           }),
//         });

//         const data = await res.json();
//         if (data.success) console.log("✅ Watch time saved to DB");
//         else console.warn("⚠️ Save failed:", data.message);
//       } catch (err) {
//         console.error("❌ Error saving watch history:", err);
//       }
//     }
//   };

//   return (
//     <>
//       <div className="admin-header">
//         <Link to="/dashboard">
//           <button className="admin-btn">Admin</button>
//         </Link>
//       </div>

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
//                   <h3>{video.title}</h3>
//                   <p>{video.genre}</p>

//                   <img
//                     src={video.image}
//                     alt={video.title}
//                     style={{ cursor: "pointer" }}
//                     onClick={() => openPopup(video)}
//                   />

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

// export default Video;
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/video.css";
import data from "../pages/video.json";

function Video({ currentUserId }) {
  const [sections, setSections] = useState([]);
  const [screenTime, setScreenTime] = useState(0);
  const [videoTimes, setVideoTimes] = useState({});
  const [popupVideo, setPopupVideo] = useState(null);
  const [watchedTime, setWatchedTime] = useState(0);

  const popupRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const navigate = useNavigate();

  // Ensure user is logged in
  useEffect(() => {
    if (!currentUserId) {
      navigate("/"); // redirect to login if not logged in
    }
  }, [currentUserId, navigate]);

  // Load sections from JSON
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

  // Track total screen time
  useEffect(() => {
    const id = setInterval(() => {
      setScreenTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const openPopup = (video) => {
    setPopupVideo(video);
    setWatchedTime(0);
    setTimeout(() => {
      if (popupRef.current) popupRef.current.play();
    }, 300);
  };

  const closePopup = () => setPopupVideo(null);

  const handlePausePopup = async () => {
    const userId = currentUserId || localStorage.getItem("loggedInUserId");

    if (!userId) {
      console.warn("⚠️ Cannot save watch: user not logged in");
      return;
    }

    if (popupRef.current && popupVideo) {
      const seconds = popupRef.current.currentTime;
      setWatchedTime(seconds);
      setVideoTimes((prev) => ({
        ...prev,
        [popupVideo.id]: seconds,
      }));

      try {
        const res = await fetch("http://localhost:5000/api/watch/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            video_title: popupVideo.title,
            genre: popupVideo.genre || "Unknown",
            duration_minutes: (seconds / 60).toFixed(2),
          }),
        });

        const data = await res.json();
        if (data.success) {
          console.log("✅ Watch time saved to DB");
        } else {
          console.warn("⚠️ Save failed:", data.message);
        }
      } catch (error) {
        console.error("❌ Error saving watch history:", error);
      }
    }
  };

  return (
    <>
     

      <div style={{ margin: "1rem", color: "#2563eb", fontWeight: "600" }}>
        ⏱️ App Screen Time: {screenTime} seconds
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
                  {videoTimes[video.id] && (
                    <div className="progress-info">
                      <p>Watched: {videoTimes[video.id].toFixed(2)} sec</p>
                    </div>
                  )}
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
              Your browser does not support the video tag.
            </video>

            {watchedTime > 0 && (
              <div className="popup-progress">
                Watched: {watchedTime.toFixed(2)} seconds
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Video;
