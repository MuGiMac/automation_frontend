import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './CpuMemory.css';
import '../images/logo.png';
import { Link } from 'react-router-dom';
import { CPU_MEMORY_API, All_SERVERS_API, getAuthHeaders } from '../API/apiEndpoints';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Services/authServices';

const CpuMemory = ({ onLogout }) => {
  const [servers, setServers] = useState([]);
  const [integrationServers, setIntegrationServers] = useState([]);
  const [productionServers, setProductionServers] = useState([]);
  const [serverFilter, setServerFilter] = useState('both');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/');
  };

  const fetchServers = async () => {
    try {
      const res = await fetch(All_SERVERS_API.ALL_SERVERS, getAuthHeaders());
      const data = await res.json();

      console.log('Raw data fetched:', data);

      const transformed = data.map(server => ({
        name: server.serverName.toLowerCase().trim(),
        env: Number(server.environment)
      }));

      console.log('Transformed data:', transformed);

      const integration = transformed
        .filter(server => server.env === 2)
        .map(server => server.name);

      const production = transformed
        .filter(server => server.env === 1)
        .map(server => server.name);

      console.log('Integration servers:', integration);
      console.log('Production servers:', production);

      setIntegrationServers(integration);
      setProductionServers(production);
    } catch (error) {
      console.error('Error fetching servers list:', error);
    }
  };

  const fetchCpuMemoryData = () => {
    const fetchServer1 = fetch(CPU_MEMORY_API.CM_API_021A, getAuthHeaders()).then(res => res.json());
    const fetchServer2 = fetch(CPU_MEMORY_API.CM_API_025A, getAuthHeaders()).then(res => res.json());
    const fetchServer3 = fetch(CPU_MEMORY_API.CM_API_026A, getAuthHeaders()).then(res => res.json());

    Promise.all([fetchServer1, fetchServer2, fetchServer3])
      .then(([data1, data2, data3]) => {
        console.log('Raw API data from mchp021a:', data1);
        console.log('Raw API data from mchp026a:', data2);
        console.log('Raw API data from mchp025a:', data3);

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

  const exportToExcel = () => {
    const filteredExportData = servers.filter(server => {
      const serverNameLower = server.serverName.toLowerCase();
      if (serverFilter === 'integration') return integrationServers.includes(serverNameLower);
      if (serverFilter === 'production') return productionServers.includes(serverNameLower);
      return true;
    });

    const filteredData = filteredExportData.map(server => ({
      'Server Name': server.serverName.toUpperCase(),
      'CPU Usage (%)': server.cpuUsage,
      'Memory Usage (%)': server.memoryUsage,
    }));

    if (filteredData.length === 0) {
      alert('No data available to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const columnWidths = Object.keys(filteredData[0]).map(key => {
      const maxLength = Math.max(
        key.length,
        ...filteredData.map(row => String(row[key] || '').length)
      );
      return { wch: maxLength + 2 };
    });

    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Servers');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    let fileName = 'cpu_memory_usage';
    if (serverFilter === 'production') fileName += '_production';
    else if (serverFilter === 'integration') fileName += '_integration';
    fileName += '.xlsx';

    saveAs(data, fileName);
  };

  useEffect(() => {
    let intervalId;

    const initialize = async () => {
      await fetchServers();
      fetchCpuMemoryData();
      intervalId = setInterval(fetchCpuMemoryData, 10000);
    };

    initialize();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleFilterChange = (e) => {
    setServerFilter(e.target.value);
  };

  const filteredServers = servers.filter(server => {
    const serverNameLower = server.serverName.toLowerCase();
    if (serverFilter === 'integration') return integrationServers.includes(serverNameLower);
    if (serverFilter === 'production') return productionServers.includes(serverNameLower);
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
        <button className="logout-button-ServerDetails" onClick={handleLogout}>
          Logout
        </button>
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
        {/* Export button now triggers the exportToExcel function */}
        <button className="export-button-CpuMemory" onClick={exportToExcel}>
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
                const serverNameLower = server.serverName.toLowerCase();
                if (integrationServers.includes(serverNameLower)) {
                  rowClass = 'highlight-green-CpuMemory';
                } else if (productionServers.includes(serverNameLower)) {
                  rowClass = 'highlight-red-CpuMemory';
                }

                return (
                  <tr key={index} className={rowClass}>
                    <td>{server.serverName.toUpperCase()}</td>
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
