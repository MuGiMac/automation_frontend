import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import '../images/logo.png';
import { Link } from 'react-router-dom';

const MOCK_DATA = [
  { serverName: "MCHP021A", cpuUsage: 34.5, usedMemory: 2048, totalMemory: 4096 },
  { serverName: "MCHP026A", cpuUsage: 68.2, usedMemory: 3072, totalMemory: 4096 },
  { serverName: "MCHP025A", cpuUsage: 12.3, usedMemory: 1024, totalMemory: 2048 },
  { serverName: "MCHP029A", cpuUsage: 89.9, usedMemory: 6144, totalMemory: 8192 },
  { serverName: "MCHP028A", cpuUsage: 45.0, usedMemory: 2048, totalMemory: 8192 },
  { serverName: "MCHP028A", cpuUsage: 56.5, usedMemory: 4096, totalMemory: 8192 }
];

const Dashboard = () => {
  const [servers, setServers] = useState([]);

  useEffect(() => {
    setServers(MOCK_DATA.map(server => ({ ...server })));

    const interval = setInterval(() => {
      setServers(prevServers =>
        prevServers.map(server => ({
          ...server,
          cpuUsage: +(Math.random() * 100).toFixed(1),
          usedMemory: Math.floor(Math.random() * server.totalMemory),
        }))
      );
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
      </nav>

      <div className="header-row-Dashboard">
        <h1 className="Dashboard-title">⚠️ Failure OverView ⚠️</h1>
        <button onClick={() => {}} className="export-button-Dashboard">Export</button>
      </div>

      <main className="Dashboard-main">
        <div className="Dashboard-box-grid">
          <div className="Dashboard-topic-box">
            <h3 className="Dashboard-topic-title">CPU Memory Usage</h3>

            {(() => {
              const alertServers = servers.filter(s => {
                const memPercent = (s.usedMemory / s.totalMemory) * 100;
                return s.cpuUsage > 80 || memPercent > 80;
              });

              if (alertServers.length === 0) {
                return <div>All are Stable</div>;
              }

              return alertServers.map((s, idx) => {
                const memPercent = ((s.usedMemory / s.totalMemory) * 100).toFixed(1);
                const showCPU = s.cpuUsage > 80;
                const showMemory = memPercent > 80;

                return (
                  <div key={idx} style={{ marginBottom: '10px' }}>
                    <strong>{s.serverName}:</strong>
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
