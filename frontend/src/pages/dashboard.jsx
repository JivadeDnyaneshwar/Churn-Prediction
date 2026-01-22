// import React, { useState, useEffect } from "react";
// import "../pages/dashboard.css";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// function Dashboard() {
//   const [watchHistory, setWatchHistory] = useState([]);
//   const [loadingWatch, setLoadingWatch] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [loadingChurn, setLoadingChurn] = useState(true);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   const HIGH_RISK_THRESHOLD = 0.2;
//   const COLORS = ["#e50914", "#22c55e"];

//   const fetchWatchHistory = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/watch/all");
//       const json = await res.json();
//       if (json.success) {
//         const safeData = json.data.map((item) => ({
//           ...item,
//           video_title: item.video_title || "-",
//           genre: item.genre || "-",
//           duration_minutes:
//             item.duration_minutes && !isNaN(item.duration_minutes)
//               ? Number(item.duration_minutes)
//               : 0,
//           watched_at: item.watched_at || null,
//           user_email: item.user_email || "-",
//         }));
//         setWatchHistory(safeData);
//       }
//       setLoadingWatch(false);
//     } catch (err) {
//       console.error("⚠️ Error fetching watch history:", err);
//       setLoadingWatch(false);
//     }
//   };

//   const fetchChurnData = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/admin/churn-data");
//       const json = await res.json();
//       setUsers(json.data || []);
//       setLastUpdated(new Date().toLocaleTimeString());
//       setLoadingChurn(false);
//     } catch (err) {
//       console.error("⚠️ Error fetching churn data:", err);
//       setLoadingChurn(false);
//     }
//   };

//   useEffect(() => {
//     fetchWatchHistory();
//     fetchChurnData();
//     const interval = setInterval(fetchChurnData, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   const usersWatchTime = watchHistory.reduce((acc, item) => {
//     const email = item.user_email;
//     if (!email) return acc;
//     if (!acc[email]) acc[email] = 0;
//     acc[email] += item.duration_minutes;
//     return acc;
//   }, {});

//   const totalUsers = Object.keys(usersWatchTime).length;

//   const highRiskUsers = Object.entries(usersWatchTime)
//     .filter(([_, time]) => time < HIGH_RISK_THRESHOLD)
//     .map(([email, time]) => ({ email, watchTime: Number(time.toFixed(2)) }));

//   const safeUsers = totalUsers - highRiskUsers.length;

//   const pieData = [
//     { name: `High Risk (<${HIGH_RISK_THRESHOLD} min)`, value: highRiskUsers.length },
//     { name: `Low Risk (≥${HIGH_RISK_THRESHOLD} min)`, value: safeUsers },
//   ];

//   const avgChurn =
//     totalUsers > 0 ? ((highRiskUsers.length / totalUsers) * 100).toFixed(2) : 0;

//   const monthNames = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

//   const lineData = watchHistory
//     .reduce((acc, item) => {
//       if (!item.watched_at) return acc;
//       const date = new Date(item.watched_at);
//       const month = monthNames[date.getMonth()];
//       const existing = acc.find((d) => d.name === month);
//       if (existing) {
//         existing.avgWatch += item.duration_minutes;
//         existing.count += 1;
//       } else {
//         acc.push({ name: month, avgWatch: item.duration_minutes, count: 1 });
//       }
//       return acc;
//     }, [])
//     .map((d) => ({
//       name: d.name,
//       avgWatch: Number((d.avgWatch / d.count).toFixed(2)),
//     }));

//   return (
//     <div className="dashboard">
//       {/* --- Metrics Cards --- */}
//       <section className="section">
//         <h2 className="section-title">Dashboard Metrics</h2>
//         <div className="metric-grid">
//           <div className="metric-card">
//             <h3>Total Users</h3>
//             <div className="metric-value">{totalUsers}</div>
//           </div>
//           <div className="metric-card">
//             <h3>Avg Churn Probability</h3>
//             <div className="metric-value">{avgChurn}%</div>
//           </div>
//           <div className="metric-card">
//             <h3>High Risk Users (&lt;{HIGH_RISK_THRESHOLD} min)</h3>
//             <div className="metric-value">{highRiskUsers.length}</div>
//           </div>
//         </div>
//       </section>

//       {/* --- 📊 Charts Section (Moved Up) --- */}
//       <section className="section">
//         <h2 className="section-title">📊 User Watch Stats</h2>
//         <div className="charts-wrapper">
//           <div className="chart-box">
//             <h3 className="chart-title">High Risk vs Low Risk Users</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="chart-box">
//             <h3 className="chart-title">Avg Watch Time per Month</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={lineData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="avgWatch"
//                   stroke="#e50914"
//                   strokeWidth={2}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </section>

//       {/* --- High Risk Users List --- */}
//       <section className="section">
//         <h2 className="section-title">High Risk Users</h2>
//         {highRiskUsers.length > 0 ? (
//           <ul>
//             {highRiskUsers.map((user, index) => (
//               <li key={index}>
//                 {user.email} - Watched {user.watchTime} min
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>All users watched enough content.</p>
//         )}
//       </section>

//       {/* --- Watch History Table --- */}
//       <section className="section">
//         <h2 className="section-title">🎥 Watch History</h2>
//         <div className="table-container">
//           {loadingWatch ? (
//             <p style={{ textAlign: "center", color: "#fff" }}>
//               Loading watch data...
//             </p>
//           ) : watchHistory.length === 0 ? (
//             <p style={{ textAlign: "center", color: "#ccc" }}>
//               No watch data found
//             </p>
//           ) : (
//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>User Email</th>
//                     <th>Video Title</th>
//                     <th>Genre</th>
//                     <th>Duration (min)</th>
//                     <th>Watched At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {watchHistory.map((row) => (
//                     <tr key={row.id}>
//                       <td>{row.id}</td>
//                       <td>{row.user_email}</td>
//                       <td>{row.video_title}</td>
//                       <td>{row.genre}</td>
//                       <td>{row.duration_minutes}</td>
//                       <td>
//                         {row.watched_at
//                           ? new Date(row.watched_at).toLocaleString()
//                           : "-"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import "../pages/dashboard.css";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// function Dashboard() {
//   const [watchHistory, setWatchHistory] = useState([]);
//   const [screenTimes, setScreenTimes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const HIGH_RISK_THRESHOLD = 0.2; // minutes
//   const COLORS = ["#e50914", "#22c55e"];

//   // --- Fetch watch history ---
//   const fetchWatchHistory = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/watch/all");
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const safeData = json.data.map((item) => ({
//           ...item,
//           duration_minutes:
//             !isNaN(Number(item.duration_minutes)) &&
//             Number(item.duration_minutes) >= 0
//               ? Number(item.duration_minutes)
//               : 0,
//           watched_at: item.watched_at || "",
//           user_email: item.user_email || "",
//         }));
//         setWatchHistory(safeData);
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching watch history:", err);
//     }
//   };

//   // --- Fetch screen times ---
//   const fetchScreenTimes = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/watch/screen-time/all");
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const safeScreen = json.data.map((item) => ({
//           ...item,
//           screen_time_minutes:
//             !isNaN(Number(item.screen_time_minutes)) &&
//             Number(item.screen_time_minutes) >= 0
//               ? Number(item.screen_time_minutes)
//               : 0,
//           recorded_at: item.recorded_at || "",
//           user_email: item.user_email || "",
//         }));
//         setScreenTimes(safeScreen);
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching screen times:", err);
//     }
//   };

//   useEffect(() => {
//     const loadAll = async () => {
//       await fetchWatchHistory();
//       await fetchScreenTimes();
//       setLoading(false);
//     };
//     loadAll();
//   }, []);

//   // --- Merge Screen Time with Watch History ---
//   const mergedData = watchHistory.map((watch) => {
//     const userScreen = screenTimes.find(
//       (s) => s.user_email === watch.user_email
//     );
//     return {
//       ...watch,
//       screen_time_minutes: userScreen ? userScreen.screen_time_minutes : 0,
//     };
//   });

//   // --- Metrics ---
//   const totalUsers = [
//     ...new Set([
//       ...watchHistory.map((w) => w.user_id),
//       ...screenTimes.map((s) => s.user_id),
//     ]),
//   ].length;

//   const usersWatchTime = watchHistory.reduce((acc, item) => {
//     const email = item.user_email || "Unknown";
//     if (!acc[email]) acc[email] = 0;
//     acc[email] += item.duration_minutes || 0;
//     return acc;
//   }, {});

//   const highRiskUsers = Object.entries(usersWatchTime)
//     .filter(([_, time]) => time < HIGH_RISK_THRESHOLD)
//     .map(([email, time]) => ({
//       email,
//       watchTime: Number(time.toFixed(2)),
//     }));

//   const safeUsers = Math.max(totalUsers - highRiskUsers.length, 0);

//   const pieData = [
//     {
//       name: `High Risk (<${HIGH_RISK_THRESHOLD} min)`,
//       value: highRiskUsers.length || 0,
//     },
//     {
//       name: `Low Risk (≥${HIGH_RISK_THRESHOLD} min)`,
//       value: safeUsers || 0,
//     },
//   ];

//   const avgChurn =
//     totalUsers > 0 && !isNaN(highRiskUsers.length / totalUsers)
//       ? ((highRiskUsers.length / totalUsers) * 100).toFixed(2)
//       : 0;

//   // --- Line chart (avg watch per month) ---
//   const monthNames = [
//     "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
//   ];

//   const lineData = watchHistory
//     .reduce((acc, item) => {
//       if (!item.watched_at) return acc;
//       const date = new Date(item.watched_at);
//       const month = monthNames[date.getMonth()];
//       const existing = acc.find((d) => d.name === month);
//       if (existing) {
//         existing.total += item.duration_minutes;
//         existing.count += 1;
//       } else acc.push({ name: month, total: item.duration_minutes, count: 1 });
//       return acc;
//     }, [])
//     .map((d) => ({
//       name: d.name,
//       avgWatch:
//         d.count > 0 && !isNaN(d.total / d.count)
//           ? Number((d.total / d.count).toFixed(2))
//           : 0,
//     }));

//   if (loading) return <p style={{ color: "#fff" }}>Loading...</p>;

//   return (
//     <div className="dashboard">
//       {/* --- Metrics --- */}
//       <section className="section">
//         <h2 className="section-title">Dashboard Metrics</h2>
//         <div className="metric-grid">
//           <div className="metric-card">
//             <h3>Total Users</h3>
//             <div className="metric-value">{totalUsers}</div>
//           </div>
//           <div className="metric-card">
//             <h3>Avg Churn Probability</h3>
//             <div className="metric-value">{avgChurn}%</div>
//           </div>
//           <div className="metric-card">
//             <h3>High Risk Users</h3>
//             <div className="metric-value">{highRiskUsers.length}</div>
//           </div>
//         </div>
//       </section>

//       {/* --- Charts --- */}
//       <section className="section">
//         <h2 className="section-title">Charts</h2>
//         <div className="charts-wrapper">
//           {/* Pie Chart */}
//           <div className="chart-box">
//             <h3>High Risk vs Low Risk Users</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Line Chart */}
//           <div className="chart-box">
//             <h3>Avg Video Watch Time per Month</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={lineData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="avgWatch"
//                   stroke="#e50914"
//                   strokeWidth={2}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </section>

//       {/* --- Watch History + Screen Time Table --- */}
//       <section className="section">
//         <h2 className="section-title">🎥 Watch History & App Screen Time</h2>
//         <div className="table-container">
//           {mergedData.length === 0 ? (
//             <p>No data found</p>
//           ) : (
//             <table className="styled-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>User Email</th>
//                   <th>Video Title</th>
//                   <th>Genre</th>
//                   <th>Watch Duration (min)</th>
//                   <th>Screen Time (min)</th>
//                   <th>Watched At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {mergedData.map((row, i) => (
//                   <tr key={i}>
//                     <td>{row.id || ""}</td>
//                     <td>{row.user_email || ""}</td>
//                     <td>{row.video_title || ""}</td>
//                     <td>{row.genre || ""}</td>
//                     <td>{row.duration_minutes || ""}</td>
//                     <td>{row.screen_time_minutes || ""}</td>
//                     <td>
//                       {row.watched_at
//                         ? new Date(row.watched_at).toLocaleString()
//                         : ""}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Dashboard;
// import React, { useState, useEffect } from "react";
// import "../pages/dashboard.css";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// function Dashboard() {
//   const [watchHistory, setWatchHistory] = useState([]);
//   const [screenTimes, setScreenTimes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const HIGH_RISK_THRESHOLD = 0.2;
//   const COLORS = ["#e50914", "#22c55e"];

//   // --- Fetch Watch History ---
//   const fetchWatchHistory = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/watch/all");
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const safeData = json.data.map((item) => ({
//           ...item,
//           duration_minutes: Number(item.duration_minutes) || 0,
//           watched_at: item.watched_at || null,
//           user_email: item.user_email || "-",
//         }));
//         setWatchHistory(safeData);
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching watch history:", err);
//     }
//   };

//   // --- Fetch Screen Times ---
//   const fetchScreenTimes = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/watch/screen-time/all");
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const safeScreen = json.data.map((item) => ({
//           ...item,
//           screen_time_minutes: Number(item.screen_time_minutes) || 0,
//           user_email: item.user_email || "-",
//         }));
//         setScreenTimes(safeScreen);
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching screen times:", err);
//     }
//   };

//   // --- Load data + stop tracking on tab change ---
//   useEffect(() => {
//     const loadAll = async () => {
//       await fetchWatchHistory();
//       await fetchScreenTimes();
//       setLoading(false);
//     };
//     loadAll();

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         console.log("🛑 Screen time tracking stopped (tab hidden)");
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   // --- Metrics ---
//   const totalUsers = [
//     ...new Set([
//       ...watchHistory.map((w) => w.user_id),
//       ...screenTimes.map((s) => s.user_id),
//     ]),
//   ].length;

//   const usersWatchTime = watchHistory.reduce((acc, item) => {
//     const email = item.user_email || "Unknown";
//     if (!acc[email]) acc[email] = 0;
//     acc[email] += item.duration_minutes || 0;
//     return acc;
//   }, {});

//   const highRiskUsers = Object.entries(usersWatchTime)
//     .filter(([_, time]) => time < HIGH_RISK_THRESHOLD)
//     .map(([email, time]) => ({
//       email,
//       watchTime: Number(time.toFixed(2)),
//     }));

//   const safeUsers = Math.max(totalUsers - highRiskUsers.length, 0);

//   const pieData = [
//     { name: `High Risk (<${HIGH_RISK_THRESHOLD} min)`, value: highRiskUsers.length || 0 },
//     { name: `Low Risk (≥${HIGH_RISK_THRESHOLD} min)`, value: safeUsers || 0 },
//   ];

//   const avgChurn =
//     totalUsers > 0 && !isNaN(highRiskUsers.length / totalUsers)
//       ? ((highRiskUsers.length / totalUsers) * 100).toFixed(2)
//       : 0;

//   // --- Avg Watch Time per Month Chart ---
//   const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   const lineData = watchHistory
//     .reduce((acc, item) => {
//       if (!item.watched_at) return acc;
//       const date = new Date(item.watched_at);
//       const month = monthNames[date.getMonth()];
//       const existing = acc.find((d) => d.name === month);
//       if (existing) {
//         existing.total += item.duration_minutes;
//         existing.count += 1;
//       } else acc.push({ name: month, total: item.duration_minutes, count: 1 });
//       return acc;
//     }, [])
//     .map((d) => ({
//       name: d.name,
//       avgWatch: d.count > 0 ? Number((d.total / d.count).toFixed(2)) : 0,
//     }));

//   if (loading) return <p style={{ color: "#fff" }}>Loading...</p>;

//   return (
//     <div className="dashboard">
//       {/* --- Metrics --- */}
//       <section className="section">
//         <h2 className="section-title">Dashboard Metrics</h2>
//         <div className="metric-grid">
//           <div className="metric-card"><h3>Total Users</h3><div className="metric-value">{totalUsers}</div></div>
//           <div className="metric-card"><h3>Avg Churn Probability</h3><div className="metric-value">{avgChurn}%</div></div>
//           <div className="metric-card"><h3>High Risk Users</h3><div className="metric-value">{highRiskUsers.length}</div></div>
//         </div>
//       </section>

//       {/* --- Charts --- */}
//       <section className="section">
//         <h2 className="section-title">Charts</h2>
//         <div className="charts-wrapper">
//           <div className="chart-box">
//             <h3>High Risk vs Low Risk Users</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
//                   {pieData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="chart-box">
//             <h3>Avg Video Watch Time per Month</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={lineData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="avgWatch" stroke="#e50914" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </section>

//       {/* --- Watch History Table (Scrollable) --- */}
//       <section className="section">
//         <h2 className="section-title">🎥 Watch History</h2>
//         <div className="table-container scrollable">
//           {watchHistory.length === 0 ? (
//             <p>No watch data found</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>User ID</th> {/* ✅ added */}
//                   <th>User Email</th>
//                   <th>Video Title</th>
//                   <th>Genre</th>
//                   <th>Duration (min)</th>
//                   <th>Watched At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {watchHistory.map((row) => (
//                   <tr key={row.id}>
//                     <td>{row.id}</td>
//                     <td>{row.user_id}</td> {/* ✅ display user_id */}
//                     <td>{row.user_email}</td>
//                     <td>{row.video_title}</td>
//                     <td>{row.genre}</td>
//                     <td>{row.duration_minutes}</td>
//                     <td>{row.watched_at ? new Date(row.watched_at).toLocaleString() : ""}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </section>

//       {/* --- App Screen Time (Total per User) --- */}
//       <section className="section">
//         <h2 className="section-title">📱 App Screen Time (Total per User)</h2>
//         <div className="table-container">
//           {screenTimes.length === 0 ? (
//             <p>No screen time data found</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>User Email</th>
//                   <th>Total Screen Time (min)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(
//                   screenTimes.reduce((acc, row) => {
//                     const email = row.user_email || "Unknown";
//                     if (!acc[email]) acc[email] = 0;
//                     acc[email] += Number(row.screen_time_minutes) || 0;
//                     return acc;
//                   }, {})
//                 ).map(([email, total], i) => (
//                   <tr key={i}>
//                     <td>{email}</td>
//                     <td>{total.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from "react";
import "../pages/dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Dashboard() {
  const [watchHistory, setWatchHistory] = useState([]);
  const [screenTimes, setScreenTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  const HIGH_RISK_THRESHOLD = 10; // minutes
  const COLORS = ["#e50914", "#22c55e"];

  // --- Fetch Watch History ---
  const fetchWatchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/watch/all");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const safeData = json.data.map((item) => ({
          ...item,
          duration_minutes: Number(item.duration_minutes) || 0,
          watched_at: item.watched_at || null,
          user_email: item.user_email || "-",
        }));
        setWatchHistory(safeData);
      } else {
        setWatchHistory([]);
      }
    } catch (err) {
      console.error("⚠️ Error fetching watch history:", err);
      setWatchHistory([]);
    }
  };

  // --- Fetch Screen Times ---
  const fetchScreenTimes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/watch/screen-time/all");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // backend returns { user_id, user_email, screen_time_minutes }
        const safeScreen = json.data.map((item) => ({
          ...item,
          screen_time_minutes: Number(item.screen_time_minutes) || 0,
          user_email: item.user_email || "-",
        }));
        setScreenTimes(safeScreen);
      } else {
        setScreenTimes([]);
      }
    } catch (err) {
      console.error("⚠️ Error fetching screen times:", err);
      setScreenTimes([]);
    }
  };

  // --- Load all data initially ---
  useEffect(() => {
    const loadAll = async () => {
      await fetchWatchHistory();
      await fetchScreenTimes();
      setLoading(false);
    };
    loadAll();
  }, []);

  // --- Track screen time briefly (optional UX; not used for totals here) ---
  useEffect(() => {
    let startTime = Date.now();
    let isTracking = true;

    const saveTime = async () => {
      const userId = localStorage.getItem("loggedInUserId");
      if (!userId) return;
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0.05) {
        // POST to save (optional; Dashboard also fetches totals separately)
        await fetch("http://localhost:5000/api/watch/screen-time", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            screen_time_minutes: Number(elapsedMinutes.toFixed(2)),
          }),
        });
        await fetchScreenTimes();
        // reset startTime so we don't re-send same segment repeatedly
        startTime = Date.now();
      }
    };

    const handleStop = async () => {
      if (isTracking) {
        await saveTime();
        isTracking = false;
      }
    };

    const handleStart = () => {
      if (!isTracking) {
        startTime = Date.now();
        isTracking = true;
      }
    };

    window.addEventListener("blur", handleStop);
    window.addEventListener("focus", handleStart);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) handleStop();
      else handleStart();
    });

    return () => {
      window.removeEventListener("blur", handleStop);
      window.removeEventListener("focus", handleStart);
      document.removeEventListener("visibilitychange", handleStop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Metrics ---
  const totalUsers = [
    ...new Set([
      ...watchHistory.map((w) => w.user_id),
      ...screenTimes.map((s) => s.user_id),
    ]),
  ].length;

  const usersWatchTime = watchHistory.reduce((acc, item) => {
    const email = item.user_email || "Unknown";
    if (!acc[email]) acc[email] = 0;
    acc[email] += item.duration_minutes || 0;
    return acc;
  }, {});

  const highRiskUsers = Object.entries(usersWatchTime)
    .filter(([_, time]) => time < HIGH_RISK_THRESHOLD)
    .map(([email, time]) => ({
      email,
      watchTime: Number(time.toFixed(2)),
    }));

  const safeUsers = Math.max(totalUsers - highRiskUsers.length, 0);

  const pieData = [
    { name: `High Risk (<${HIGH_RISK_THRESHOLD} min)`, value: highRiskUsers.length || 0 },
    { name: `Low Risk (≥${HIGH_RISK_THRESHOLD} min)`, value: safeUsers || 0 },
  ];

  const avgChurn =
    totalUsers > 0 && !isNaN(highRiskUsers.length / totalUsers)
      ? ((highRiskUsers.length / totalUsers) * 100).toFixed(2)
      : 0;

  // --- Avg Watch Time per Month ---
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const lineData = watchHistory
    .reduce((acc, item) => {
      if (!item.watched_at) return acc;
      const date = new Date(item.watched_at);
      const month = monthNames[date.getMonth()];
      const existing = acc.find((d) => d.name === month);
      if (existing) {
        existing.total += item.duration_minutes;
        existing.count += 1;
      } else acc.push({ name: month, total: item.duration_minutes, count: 1 });
      return acc;
    }, [])
    .map((d) => ({
      name: d.name,
      avgWatch: d.count > 0 ? Number((d.total / d.count).toFixed(2)) : 0,
    }));

  if (loading) return <p style={{ color: "#fff" }}>Loading...</p>;

  return (
    <div className="dashboard">
      {/* --- Metrics --- */}
      <section className="section">
        <h2 className="section-title">Dashboard Metrics</h2>
        <div className="metric-grid">
          <div className="metric-card"><h3>Total Users</h3><div className="metric-value">{totalUsers}</div></div>
          <div className="metric-card"><h3>Avg Churn Probability</h3><div className="metric-value">{avgChurn}%</div></div>
          <div className="metric-card"><h3>High Risk Users</h3><div className="metric-value">{highRiskUsers.length}</div></div>
        </div>

        {/* --- High Risk Emails --- */}
        <div className="table-container scrollable" style={{marginTop: "20px"}}>
          <h3>📧 High Risk Users Email List</h3>
          {highRiskUsers.length === 0 ? (
            <p>No high risk users found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Watch Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {highRiskUsers.map((user, i) => (
                  <tr key={i}>
                    <td>{user.email}</td>
                    <td>{user.watchTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* --- Charts --- */}
      <section className="section">
        <h2 className="section-title">Charts</h2>
        <div className="charts-wrapper">
          <div className="chart-box">
            <h3>High Risk vs Low Risk Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>Avg Video Watch Time per Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgWatch" stroke="#e50914" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* --- Watch History --- */}
      <section className="section">
        <h2 className="section-title">🎥 Watch History</h2>
        <div className="table-container scrollable">
          {watchHistory.length === 0 ? (
            <p>No watch data found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>User Email</th>
                  <th>Video Title</th>
                  <th>Genre</th>
                  <th>Duration (min)</th>
                  <th>Watched At</th>
                </tr>
              </thead>
              <tbody>
                {watchHistory.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.user_id}</td>
                    <td>{row.user_email}</td>
                    <td>{row.video_title}</td>
                    <td>{row.genre}</td>
                    <td>{row.duration_minutes}</td>
                    <td>{row.watched_at ? new Date(row.watched_at).toLocaleString() : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* --- Screen Time --- */}
      <section className="section">
        <h2 className="section-title">📱 App Screen Time (Total per User)</h2>
        <div className="table-container scrollable">
          {screenTimes.length === 0 ? (
            <p>No screen time data found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Total Screen Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  screenTimes.reduce((acc, row) => {
                    const email = row.user_email || "Unknown";
                    if (!acc[email]) acc[email] = 0;
                    acc[email] += Number(row.screen_time_minutes) || 0;
                    return acc;
                  }, {})
                ).map(([email, total], i) => (
                  <tr key={i}>
                    <td>{email}</td>
                    <td>{total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
