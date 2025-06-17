import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import '../images/logo.png';
import { Link } from 'react-router-dom';
import { CPU_MEMORY_API, getAuthHeaders } from '../API/apiEndpoints';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Services/authServices';

const Dashboard = ({ onLogout }) => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/');
  };

  const fetchCpuMemoryData = () => {
    const fetchServer1 = fetch(CPU_MEMORY_API.CM_API_021A, getAuthHeaders()).then(res => res.json());
    const fetchServer2 = fetch(CPU_MEMORY_API.CM_API_025A, getAuthHeaders()).then(res => res.json());
    const fetchServer3 = fetch(CPU_MEMORY_API.CM_API_026A, getAuthHeaders()).then(res => res.json());
    
    Promise.all([fetchServer1, fetchServer2, fetchServer3])
      .then(([data1, data2, data3]) => {
        console.log('Raw API data from mchp021a:', data1);
        console.log('Raw API data from mchp025a:', data2);
        console.log('Raw API data from mchp026a:', data3);

        const combined = [
          ...(Array.isArray(data1) ? data1 : [data1]),
          ...(Array.isArray(data2) ? data2 : [data2]),
          ...(Array.isArray(data3) ? data3 : [data3])
        ];

        console.log('Raw API combined data:', combined);
        setServers(combined);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching CPU/Memory data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCpuMemoryData();

    const interval = setInterval(() => {
      fetchCpuMemoryData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="Dashboard-container">
      <nav className="Dashboard-nav">
        <div className="Dashboard-logo">
          <Link to="/menu">
            <img src={require('../images/logo.png')} alt="Logo" className="Dashboard-logo-img" />
          </Link>
        </div>
        <div className="Dashboard-nav-spacer"></div>
        <button className="logout-button-Dashboard" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="header-row-Dashboard">
        <h1 className="Dashboard-title">⚠️ Failure OverView ⚠️</h1>
        <button onClick={() => {}} className="export-button-Dashboard">Export</button>
      </div>

      <main className="Dashboard-main">
        <div className="Dashboard-box-grid">
          <div className="Dashboard-topic-box">
            <h3 className="Dashboard-topic-title">CPU Memory Usage</h3>

            {loading ? (
              <div>Loading...</div>
            ) : (() => {
              const alertServers = servers.filter(s => {
                return s.cpuUsage > 80 || s.memoryUsage > 80;
              });

              if (alertServers.length === 0) {
                return <div>All are Stable</div>;
              }

              return alertServers.map((s, idx) => {
                const memPercent = s.memoryUsage.toFixed(1);
                const showCPU = s.cpuUsage > 80;
                const showMemory = memPercent > 80;

                return (
                  <div key={idx} className="Dashboard-status-block">
                    <strong>{s.serverName.toUpperCase()}:</strong>
                    <div>
                      {showCPU && (
                        <>
                          CPU:{" "}
                          <span className="warning">
                            {s.cpuUsage}% <span className="warning-icon">⚠️</span>
                          </span>
                        </>
                      )}
                      {showCPU && showMemory && <> &nbsp;&nbsp;</>}
                      {showMemory && (
                        <>
                          Memory:{" "}
                          <span className="warning">
                            {memPercent}% <span className="warning-icon">⚠️</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              });
            })()}

          </div>

          {[
            "LDAP Logs",
            "Disk Space",
            "Identity Processes",
            "Windows Services",
            "Windows Schedulers",
            "Identity Workflows",
            "Request Workflows",
            "Replication Sync"
          ].map((title, idx) => (
            <div key={idx} className="Dashboard-topic-box">
              <h3 className="Dashboard-topic-title">{title}</h3>
              <p>Coming Soon...</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="Dashboard-footer">
        © 2025 Mitel Networks Corporation
      </footer>
    </div>
  );
};

export default Dashboard;
