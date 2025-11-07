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
  const [loadingWatch, setLoadingWatch] = useState(true);
  const [users, setUsers] = useState([]);
  const [loadingChurn, setLoadingChurn] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const HIGH_RISK_THRESHOLD = 0.2;
  const COLORS = ["#e50914", "#22c55e"];

  const fetchWatchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/watch/all");
      const json = await res.json();
      if (json.success) {
        const safeData = json.data.map((item) => ({
          ...item,
          video_title: item.video_title || "-",
          genre: item.genre || "-",
          duration_minutes:
            item.duration_minutes && !isNaN(item.duration_minutes)
              ? Number(item.duration_minutes)
              : 0,
          watched_at: item.watched_at || null,
          user_email: item.user_email || "-",
        }));
        setWatchHistory(safeData);
      }
      setLoadingWatch(false);
    } catch (err) {
      console.error("⚠️ Error fetching watch history:", err);
      setLoadingWatch(false);
    }
  };

  const fetchChurnData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/churn-data");
      const json = await res.json();
      setUsers(json.data || []);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoadingChurn(false);
    } catch (err) {
      console.error("⚠️ Error fetching churn data:", err);
      setLoadingChurn(false);
    }
  };

  useEffect(() => {
    fetchWatchHistory();
    fetchChurnData();
    const interval = setInterval(fetchChurnData, 15000);
    return () => clearInterval(interval);
  }, []);

  const usersWatchTime = watchHistory.reduce((acc, item) => {
    const email = item.user_email;
    if (!email) return acc;
    if (!acc[email]) acc[email] = 0;
    acc[email] += item.duration_minutes;
    return acc;
  }, {});

  const totalUsers = Object.keys(usersWatchTime).length;

  const highRiskUsers = Object.entries(usersWatchTime)
    .filter(([_, time]) => time < HIGH_RISK_THRESHOLD)
    .map(([email, time]) => ({ email, watchTime: Number(time.toFixed(2)) }));

  const safeUsers = totalUsers - highRiskUsers.length;

  const pieData = [
    { name: `High Risk (<${HIGH_RISK_THRESHOLD} min)`, value: highRiskUsers.length },
    { name: `Low Risk (≥${HIGH_RISK_THRESHOLD} min)`, value: safeUsers },
  ];

  const avgChurn =
    totalUsers > 0 ? ((highRiskUsers.length / totalUsers) * 100).toFixed(2) : 0;

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const lineData = watchHistory
    .reduce((acc, item) => {
      if (!item.watched_at) return acc;
      const date = new Date(item.watched_at);
      const month = monthNames[date.getMonth()];
      const existing = acc.find((d) => d.name === month);
      if (existing) {
        existing.avgWatch += item.duration_minutes;
        existing.count += 1;
      } else {
        acc.push({ name: month, avgWatch: item.duration_minutes, count: 1 });
      }
      return acc;
    }, [])
    .map((d) => ({
      name: d.name,
      avgWatch: Number((d.avgWatch / d.count).toFixed(2)),
    }));

  return (
    <div className="dashboard">
      {/* --- Metrics Cards --- */}
      <section className="section">
        <h2 className="section-title">Dashboard Metrics</h2>
        <div className="metric-grid">
          <div className="metric-card">
            <h3>Total Users</h3>
            <div className="metric-value">{totalUsers}</div>
          </div>
          <div className="metric-card">
            <h3>Avg Churn Probability</h3>
            <div className="metric-value">{avgChurn}%</div>
          </div>
          <div className="metric-card">
            <h3>High Risk Users (&lt;{HIGH_RISK_THRESHOLD} min)</h3>
            <div className="metric-value">{highRiskUsers.length}</div>
          </div>
        </div>
      </section>

      {/* --- 📊 Charts Section (Moved Up) --- */}
      <section className="section">
        <h2 className="section-title">📊 User Watch Stats</h2>
        <div className="charts-wrapper">
          <div className="chart-box">
            <h3 className="chart-title">High Risk vs Low Risk Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Avg Watch Time per Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgWatch"
                  stroke="#e50914"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* --- High Risk Users List --- */}
      <section className="section">
        <h2 className="section-title">High Risk Users</h2>
        {highRiskUsers.length > 0 ? (
          <ul>
            {highRiskUsers.map((user, index) => (
              <li key={index}>
                {user.email} - Watched {user.watchTime} min
              </li>
            ))}
          </ul>
        ) : (
          <p>All users watched enough content.</p>
        )}
      </section>

      {/* --- Watch History Table --- */}
      <section className="section">
        <h2 className="section-title">🎥 Watch History</h2>
        <div className="table-container">
          {loadingWatch ? (
            <p style={{ textAlign: "center", color: "#fff" }}>
              Loading watch data...
            </p>
          ) : watchHistory.length === 0 ? (
            <p style={{ textAlign: "center", color: "#ccc" }}>
              No watch data found
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
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
                      <td>{row.user_email}</td>
                      <td>{row.video_title}</td>
                      <td>{row.genre}</td>
                      <td>{row.duration_minutes}</td>
                      <td>
                        {row.watched_at
                          ? new Date(row.watched_at).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
