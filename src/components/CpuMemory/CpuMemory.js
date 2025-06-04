import { useEffect, useState } from 'react';
import './CpuMemory.css';
import '../images/logo.png';
import { Link } from 'react-router-dom';

//const INTEGRATION_SERVERS = ['MCHP021A', 'MCHP026A', 'MCHP025A'];
const INTEGRATION_SERVERS = ['mchp021a', 'mchp026a', 'mchp025a'];
const PRODUCTION_SERVERS = ['MCHP029A', 'MCHP028A', 'MCHP027A'];

const CpuMemory = () => {
  const [servers, setServers] = useState([]);
  const [serverFilter, setServerFilter] = useState('both');
  const [loading, setLoading] = useState(true);

  const fetchCpuMemoryData = () => {
   fetch('/AutomationAPI/AutomationAPI/getAllServersUsage')
    .then(response => response.json())
    .then(data => {
      console.log('Raw API data:', data);

      const transformed = Object.values(data).map(item => ({
        serverName: item.serverName,
        cpuUsage: item.cpuUsage,
        memoryUsage: item.memoryUsage,
       })); 

      console.log('Transformed data:', transformed);

      setServers(transformed);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching CPU/Memory data:', error);
      setLoading(false);
    });
};


  useEffect(() => {
    fetchCpuMemoryData();
    const interval = setInterval(fetchCpuMemoryData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (e) => {
    setServerFilter(e.target.value);
  };

  const filteredServers = servers.filter(server => {
    if (serverFilter === 'integration') return INTEGRATION_SERVERS.includes(server.serverName);
    if (serverFilter === 'production') return PRODUCTION_SERVERS.includes(server.serverName);
    return true;
  });

  return (
    <div className="CpuMemory-container">
      <nav className="CpuMemory-nav">
        <div className="CpuMemory-logo">
          <Link to="/menu">
            <img src={require('../images/logo.png')} alt="Logo" className="CpuMemory-logo-img" />
          </Link>
        </div>
        <div className="CpuMemory-nav-spacer"></div>
      </nav>

      <div className="header-row-CpuMemory">
        <label htmlFor="serverFilter" className="serverFilter-label-CpuMemory">Filter By Server Type :</label>
        <select
          id="serverFilter"
          value={serverFilter}
          onChange={handleFilterChange}
          className="serverFilter-CpuMemory"
        >
          <option value="both">Both</option>
          <option value="integration">Integration</option>
          <option value="production">Production</option>
        </select>

        <h1 className="CpuMemory-title">🖥️ Server CPU & Memory Dashboard</h1>
        <button className="export-button-CpuMemory" onClick={() => alert('Export functionality coming soon!')}>
          Export
        </button>
      </div>

      <main className="CpuMemory-main">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <table className="CpuMemory-table">
            <thead>
              <tr>
                <th>Server Name</th>
                <th>CPU Usage (%)</th>
                <th>Memory Usage (%)</th>
              </tr>
            </thead>
            <tbody>
              {filteredServers.map((server, index) => {
                let rowClass = '';
                if (INTEGRATION_SERVERS.includes(server.serverName)) {
                  rowClass = 'highlight-green-CpuMemory';
                } else if (PRODUCTION_SERVERS.includes(server.serverName)) {
                  rowClass = 'highlight-red-CpuMemory';
                }

                return (
                  <tr key={index} className={rowClass}>
                    <td>{server.serverName}</td>
                    <td className={server.cpuUsage > 80 ? 'alert-CpuMemory' : 'normal-CpuMemory'}>
                      {server.cpuUsage.toFixed(1)}% {server.cpuUsage > 80 && '⚠️'}
                    </td>
                    <td className={server.memoryUsage > 80 ? 'alert-CpuMemory' : 'normal-CpuMemory'}>
                      {server.memoryUsage.toFixed(1)}% {server.memoryUsage > 80 && '⚠️'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>

      <footer className="CpuMemory-footer">
        © 2025 Mitel Networks Corporation
      </footer>
    </div>
  );
};

export default CpuMemory;
